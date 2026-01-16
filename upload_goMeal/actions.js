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
  CHECK_CONVO_BETWEEN_USERS,
  GET_CONVO_MESSAGES,
  GET_OR_CREATE_CONVERSATION
} = require("./sql.js");

exports.handler = async (event) => {
  const { action, post_id, user_sub, unlike, message, reply_to_id, conversation_id  } = JSON.parse(event.body || "{}");

  const requiresPost = ["like_post"];

  const requiresUserSub = [
    "like_post",
    "update_user_account",
    "delete_user_account",
    "get_user_posts",
    "get_user_liked_post",
    "get_inbox"
  ];  

  if (!action || (requiresUserSub.includes(action) && !user_sub) || (requiresPost.includes(action) && !post_id)) {
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

      case "send_message": {
        try {
          const { user_a, user_b, message } = JSON.parse(event.body || "{}");
      
          if (!user_a || !user_b || !message || !message.trim()) {
            return {
              statusCode: 400,
              body: JSON.stringify({ error: "Missing required fields or empty message", action }),
            };
          }
      
          // 1. Check if conversation exists between user_a and user_b
          const convRes = await client.query(
            `SELECT c.id AS conversation_id
FROM conversations c
WHERE c.id IN (
    SELECT conversation_id
    FROM conversation_participants
    WHERE user_sub = $1
) 
AND c.id IN (
    SELECT conversation_id
    FROM conversation_participants
    WHERE user_sub = $2
)
LIMIT 1;
`,
            [user_a, user_b]
          );
      
          let conversationId;
      
          if (convRes.rows.length === 0) {
            // 2. Create a new conversation
            const newConv = await client.query(`INSERT INTO conversations DEFAULT VALUES RETURNING id`);
            conversationId = newConv.rows[0].id;
      
            // 3. Add both users as participants
            await client.query(
              `INSERT INTO conversation_participants (conversation_id, user_sub) VALUES ($1, $2), ($1, $3)`,
              [conversationId, user_a, user_b]
            );
          } else {
            conversationId = convRes.rows[0].conversation_id;
          }
      
          // 4. Insert the message
          const msgInsert = await client.query(
            `INSERT INTO messages (conversation_id, sender_sub, content, sent_at, is_read)
             VALUES ($1, $2, $3, NOW(), false) RETURNING id;`,
            [conversationId, user_a, message.trim()]
          );
      
          const messageId = msgInsert.rows[0].id;
      
          // 5. Update sender last_read
          await client.query(
            `UPDATE conversation_participants
             SET last_read_message_id = $1
             WHERE conversation_id = $2 AND user_sub = $3;`,
            [messageId, conversationId, user_a]
          );
      
          // 6. Optional: create notification for user_b
          await client.query(
            `INSERT INTO notifications (receiver_sub, actor_sub, action_type, conversation_id)
             VALUES ($1, $2, 'send_message', $3)`,
            [user_b, user_a, conversationId]
          );
      
          return {
            statusCode: 200,
            body: JSON.stringify({
              status: "success",
              action,
              conversation_id: conversationId,
              message_id: messageId,
              message: "Message sent successfully",
            }),
          };
      
        } catch (err) {
          console.error("send_message error:", err);
          return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to send message", details: err.message }),
          };
        }
      }
    
      case "update_user_account": {

        const { first_name, last_name, profile_name, profile_img_base64 } = JSON.parse(event.body || "{}");
    
        try {
            let profile_img_url = null;
    
            if (profile_img_base64) {
                const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
    
                const s3 = new S3Client({ region: "us-east-2" });
                const buffer = Buffer.from(profile_img_base64, "base64");
                const key = `profile_images/${user_sub}_${Date.now()}.jpg`;
    
                await s3.send(
                    new PutObjectCommand({
                        Bucket: process.env.S3_BUCKET_NAME, 
                        Key: key,
                        Body: buffer,
                        ContentType: "image/jpeg",
                    })
                );
    
                profile_img_url = `https://${process.env.S3_BUCKET_NAME}.s3.us-east-2.amazonaws.com/${key}`;
            }
  
            const fields = [];
            const values = [];
            let idx = 1;
    
            if (first_name) { fields.push(`first_name=$${idx++}`); values.push(first_name); }
            if (last_name) { fields.push(`last_name=$${idx++}`); values.push(last_name); }
            if (profile_name) { fields.push(`profile_name=$${idx++}`); values.push(profile_name); }
            if (profile_img_url) { fields.push(`profile_img_url=$${idx++}`); values.push(profile_img_url); }
    
            if (fields.length === 0) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ error: "No valid fields to update", action }),
                };
            }
    
            values.push(user_sub);
    
            const updateQuery = `
                UPDATE users
                SET ${fields.join(", ")}
                WHERE sub=$${idx}
                RETURNING *
            `;
    
            const client = new Client({
              host: DB_HOST,
              user: DB_USER,
              password: DB_PASSWORD,
              database: DB_NAME,
              port: DB_PORT || 5432,
              ssl: { rejectUnauthorized: false }
            });
    
            await client.connect();
            const updateRes = await client.query(updateQuery, values);
            await client.end();
    
            if (updateRes.rowCount === 0) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({ error: "User not found", action }),
                };
            }

            const cognitoAttrs = [];
            if (first_name) cognitoAttrs.push({ Name: "given_name", Value: first_name });
            if (last_name) cognitoAttrs.push({ Name: "family_name", Value: last_name });
            if (profile_name) cognitoAttrs.push({ Name: "nickname", Value: profile_name });
    
            if (cognitoAttrs.length > 0) {
                const cognitoClient = new CognitoIdentityProviderClient({ region: "us-east-2" });
                await cognitoClient.send(
                    new AdminUpdateUserAttributesCommand({
                        UserPoolId: process.env.COGNITO_USER_POOL_ID,
                        Username: user_sub,
                        UserAttributes: cognitoAttrs,
                    })
                );
            }
    
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
          posts: rows.rows, 
        }),
      };
    }

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

    case "get_convo_between_two_users": {
      try {
        const { conversation_id } = JSON.parse(event.body || "{}");
    
        if (!conversation_id) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: "conversation_id is required", action }),
          };
        }
    
        const result = await client.query(GET_CONVO_MESSAGES, [conversation_id]);
    
        return {
          statusCode: 200,
          body: JSON.stringify({
            success: true,
            action,
            conversation_id,
            messages: result.rows
          }),
        };
      } catch (err) {
        return {
          statusCode: 500,
          body: JSON.stringify({
            success: false,
            error: "Failed to load conversation",
            action
          }),
        };
      }
    }

    case "get_or_create_conversation": {
      try {
        const { user_a, user_b } = JSON.parse(event.body || "{}");
    
        if (!user_a || !user_b) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: "user_a and user_b are required", action }),
          };
        }
    
        // 1. Check if conversation exists between these two users
        const convoResult = await client.query( GET_OR_CREATE_CONVERSATION,
          [user_a, user_b]
        );
    
        let conversation_id;
        if (convoResult.rows.length > 0) {
          conversation_id = convoResult.rows[0].conversation_id;
        } else {
          // 2. Create new conversation
          const newConvo = await client.query(
            `INSERT INTO conversations DEFAULT VALUES RETURNING id`
          );
          conversation_id = newConvo.rows[0].id;
    
          // 3. Add participants
          await client.query(
            `INSERT INTO conversation_participants (conversation_id, user_sub) VALUES ($1, $2), ($1, $3)`,
            [conversation_id, user_a, user_b]
          );
        }
    
        // 4. Fetch messages (could be empty)
        const messagesResult = await client.query(GET_CONVO_MESSAGES, [conversation_id]);
    
        return {
          statusCode: 200,
          body: JSON.stringify({
            success: true,
            action,
            conversation_id,
            messages: messagesResult.rows
          }),
        };
      } catch (err) {
        return {
          statusCode: 500,
          body: JSON.stringify({ success: false, error: "Failed to get or create conversation", action }),
        };
      }
    }
    
    case "get_inbox": {
      const { rows } = await client.query(GET_INBOX, [user_sub]);
    
      const inbox = rows.reduce((acc, row) => {
        acc[row.conversation_id] = {
          conversation_id: row.conversation_id,
          last_message: row.last_message,
          last_message_at: row.last_message_at,
          other_user: {
            sub: row.other_sub,
            name: row.other_name,
            img: row.other_img,
          },
          post: {
            id: row.post_id,
            title: row.post_title,
            img: row.post_img,
          }
        };
        return acc;
      }, {});
    
      return {
        statusCode: 200,
        body: JSON.stringify({
          status: "success",
          action,
          inbox
        })
      };
    }

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
