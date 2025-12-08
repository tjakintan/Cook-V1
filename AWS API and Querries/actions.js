const {
  CognitoIdentityProviderClient, AdminDisableUserCommand, AdminUpdateUserAttributesCommand
} = require("@aws-sdk/client-cognito-identity-provider");
const { Client } = require("pg");
const { S3_BUCKET_NAME, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT, COGNITO_CLIENT_ID, COGNITO_USER_POOL_ID,  } = process.env;

const {
  INSERT_LIKE,
  DELETE_LIKE,
  CHECK_LIKE,
  INSERT_MESSAGE,
  INSERT_LIKE_NOTIFICATION,
  INSERT_MESSAGE_NOTIFICATION,
  GET_USER_POSTS,
  GET_USER_LIKED_POSTS,
  GET_INBOX,
  DELETE_USER, 
  UPDATE_USER_ACCOUNT,
  GET_CONVERSATION,
  CREATE_CONVERSATION,
  ADD_CONVERSATION_PARTICIPANT,
  UPDATE_LAST_READ_MESSAGE,
} = require("./sql.js");

exports.handler = async (event) => {
  const { action, post_id, user_sub, unlike, message, reply_to_id  } = JSON.parse(event.body || "{}");

  // For new actions we don't require post_id
  const requiresPost = ["like_post", "send_message"];

  if (!action || !user_sub || (requiresPost.includes(action) && !post_id)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing required fields", action: action || null }),
    };
  }

  const client = new Client({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT || 5432,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    let result;

    switch (action) {

      /* ---------------------------------------------------------
       * LIKE POST
       * --------------------------------------------------------- */
      case "like_post": {
        const checkRes = await client.query(CHECK_LIKE, [post_id, user_sub]);
        const alreadyLiked = checkRes.rows.length > 0;

        if (unlike && alreadyLiked) {
          result = await client.query(DELETE_LIKE, [post_id, user_sub]);
        } else if (!unlike && !alreadyLiked) {
          result = await client.query(INSERT_LIKE, [post_id, user_sub]);

          const postRes = await client.query(
            `SELECT user_sub AS receiver_sub FROM post WHERE id = $1`,
            [post_id]
          );
          const receiver_sub = postRes.rows[0].receiver_sub;

          await client.query(INSERT_LIKE_NOTIFICATION, [receiver_sub, post_id, user_sub]);
        }

        return {
          statusCode: 200,
          body: JSON.stringify({
            status: "success",
            action: action,
            result: unlike ? "unliked" : "liked",
            alreadyLiked,
          }),
        };
      }

      /* ---------------------------------------------------------
       * SEND MESSAGE
       * --------------------------------------------------------- */
   

      case "send_message": {

        let body;
        try {
            body = JSON.parse(event.body);
        } catch (err) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Invalid JSON body" }),
            };
        }
        const { post_id, user_sub, message } = body;
    
        if (!message || !message.trim()) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Message cannot be empty", action }),
            };
        }
    
        const client = new Client({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME,
            port: DB_PORT || 5432,
            ssl: { rejectUnauthorized: false }
        });
    
        await client.connect();
    
        try {
            await client.query("BEGIN");
    
            // 1. Check if a conversation already exists for this post + user
            const convRes = await client.query(GET_CONVERSATION, [post_id, user_sub]);
    
            let conversationId;
            let postOwner = null;
    
            if (convRes.rows.length === 0) {
                // 2. Create a new conversation
                const newConv = await client.query(CREATE_CONVERSATION, [post_id]);
                conversationId = newConv.rows[0].id;
    
                // 3. Add sender as participant
                await client.query(ADD_CONVERSATION_PARTICIPANT, [conversationId, user_sub]);
    
                // 4. Add post owner as participant
                const postOwnerRes = await client.query(
                    `SELECT user_sub FROM post WHERE id = $1;`,
                    [post_id]
                );
    
                if (postOwnerRes.rows.length > 0) {
                    postOwner = postOwnerRes.rows[0].user_sub; // assign to outer variable
    
                    if (postOwner !== user_sub) {
                        await client.query(
                            `INSERT INTO conversation_participants (conversation_id, user_sub)
                             VALUES ($1, $2)
                             ON CONFLICT DO NOTHING;`,
                            [conversationId, postOwner]
                        );
                    }
                }
            } else {
                // Existing conversation
                conversationId = convRes.rows[0].conversation_id;
    
                // Make sure postOwner is set
                const postOwnerRes = await client.query(
                    `SELECT user_sub FROM post WHERE id = $1;`,
                    [post_id]
                );
                if (postOwnerRes.rows.length > 0) {
                    postOwner = postOwnerRes.rows[0].user_sub;
                }
            }
    
            // 5. Insert the message
            const msgInsert = await client.query(INSERT_MESSAGE, [
                conversationId,
                user_sub,
                message.trim()
            ]);
            const messageId = msgInsert.rows[0].id;
    
            // 6. Update sender last_read
            await client.query(UPDATE_LAST_READ_MESSAGE, [
                messageId,
                conversationId,
                user_sub
            ]);
    
            // 7. Create a notification for the post owner if they exist and are not the sender
            if (postOwner && postOwner !== user_sub) {
                await client.query(
                    `INSERT INTO notifications (receiver_sub, actor_sub, action_type, conversation_id)
                     VALUES ($1, $2, $3, $4)`,
                    [postOwner, user_sub, "send_message", conversationId]
                );
            }
    
            await client.query("COMMIT");

            return {
                statusCode: 200,
                body: JSON.stringify({
                    status: "success",              // <-- Add this
                    action,
                    conversation_id: conversationId,
                    message_id: messageId,
                    message: "Message sent successfully",
                }),
            };
            
    
        } catch (err) {
            await client.query("ROLLBACK");
            console.error("send_message error:", err);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Failed to send message", details: err.message }),
            };
        } finally {
            await client.end();
        }
    }
    
      case "update_user_account": {
        const { first_name, last_name, profile_name, profile_img_base64, dob } =
            JSON.parse(event.body || "{}");
    
        if (!first_name || !last_name || !profile_name || !dob) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing required fields", action }),
            };
        }
    
        try {
            let profile_img_url = null;
    
            // Load env
            const { S3_BUCKET_NAME } = process.env;
    
            // ================================
            // 1 Upload base64 to S3 (SDK v3)
            // ================================
            if (profile_img_base64) {
                const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
    
                const s3 = new S3Client({ region: "us-east-2" });
    
                const buffer = Buffer.from(profile_img_base64, "base64");
                const key = `profile_images/${user_sub}_${Date.now()}.jpg`;
    
                await s3.send(
                    new PutObjectCommand({
                        Bucket: S3_BUCKET_NAME,     // use env variable
                        Key: key,
                        Body: buffer,
                        ContentType: "image/jpeg",
                    })
                );
    
                profile_img_url = `https://${S3_BUCKET_NAME}.s3.us-east-2.amazonaws.com/${key}`;
            }
    
            // ================================
            // 2 Update DB with S3 URL
            // ================================
            const updateRes = await client.query(UPDATE_USER_ACCOUNT, [
                first_name,
                last_name,
                profile_name,
                profile_img_url, // only URL saved
                dob,
                user_sub,
            ]);
    
            if (updateRes.rowCount === 0) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({ error: "User not found", action }),
                };
            }
    
            // ================================
            // 3 Update Cognito Attributes
            // ================================
            const {
                CognitoIdentityProviderClient,
                AdminUpdateUserAttributesCommand,
            } = require("@aws-sdk/client-cognito-identity-provider");
    
            const cognitoClient = new CognitoIdentityProviderClient({
                region: "us-east-2",
            });
    
            await cognitoClient.send(
                new AdminUpdateUserAttributesCommand({
                    UserPoolId: "us-east-2_GAJZHEELF",
                    Username: user_sub,
                    UserAttributes: [
                        { Name: "given_name", Value: first_name },
                        { Name: "family_name", Value: last_name },
                        { Name: "nickname", Value: profile_name }
                    ]
                })
            );
    
            // ================================
            // 4 Success
            // ================================
            return {
                statusCode: 200,
                body: JSON.stringify({
                    status: "success",
                    action,
                    updated_user: updateRes.rows[0],
                }),
            };
    
        } catch (err) {
            console.error("Update user error:", err);
            return {
                statusCode: 500,
                body: JSON.stringify({
                    error: "Failed to update user",
                    details: err.message,
                    action,
                }),
            };
        }
    }
    
    
    case "delete_user_account": {
      try {
        // 1. Soft delete in Postgres
        const updateRes = await client.query(DELETE_USER, [user_sub]);
    
        if (updateRes.rowCount === 0) {
          return {
            statusCode: 404,
            body: JSON.stringify({ error: "User not found", action }),
          };
        }
    
        // 2. Disable user in Cognito
        const cognitoClient = new CognitoIdentityProviderClient({});
        const disableCmd = new AdminDisableUserCommand({
          UserPoolId: COGNITO_USER_POOL_ID,
          Username: user_sub,
        });
    
        await cognitoClient.send(disableCmd);
    
        return {
          statusCode: 200,
          body: JSON.stringify({
            status: "success",
            action,
            result: "user_deleted",
            user: updateRes.rows[0],
          }),
        };
      } catch (err) {
        console.error("Delete user error:", err);
        return {
          statusCode: 500,
          body: JSON.stringify({
            error: "Failed to delete user",
            details: err.message,
            action,
          }),
        };
      }
    }
    
    case "get_user_posts": {
      const rows = await client.query(GET_USER_POSTS, [user_sub]);
      return {
        statusCode: 200,
        body: JSON.stringify({
          status: rows.rowCount > 0 ? "success" : "empty",
          action,
          posts: rows.rows,    // always an array
        }),
      };
    }

    /* ---------------------------------------------------------
    * GET USER LIKED POSTS
    * --------------------------------------------------------- */
    case "get_user_liked_post": {
      const rows = await client.query(GET_USER_LIKED_POSTS, [user_sub]);
      return {
        statusCode: 200,
        body: JSON.stringify({
          status: rows.rowCount > 0 ? "success" : "empty",
          action,
          liked_posts: rows.rows,
        }),
      };
    }

    /* ---------------------------------------------------------
    * GET INBOX
    * --------------------------------------------------------- */
    case "get_inbox": {
      const rows = await client.query(GET_INBOX, [user_sub]);
      return {
        statusCode: 200,
        body: JSON.stringify({
          status: rows.rowCount > 0 ? "success" : "empty",
          action,
          inbox: rows.rows,
        }),
      };
    }

      /* ---------------------------------------------------------
       * INVALID ACTION
       * --------------------------------------------------------- */
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Invalid action", action }),
        };
    }

  } catch (err) {
    console.error("ERROR:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Server error",
        details: err.message,
        action: action || null
      }),
    };
  } finally {
    await client.end();
  }
};
