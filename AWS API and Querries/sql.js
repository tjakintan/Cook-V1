// sql.js

const CREATE_POST_TABLE = `
  CREATE TABLE IF NOT EXISTS POST (
    id SERIAL PRIMARY KEY,
    dish_name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );
`;

const INSERT_POST = `
  INSERT INTO post (dish_name, description, difficulty, image_url, user_sub, created_at)
  VALUES ($1, $2, $3, $4, $5, NOW())
  RETURNING *;
`;

const DELETE_USER = `
  UPDATE users
  SET status = 'deleted',
      status_created_on = CURRENT_TIMESTAMP
  WHERE sub = $1
  RETURNING sub, email, first_name, last_name
`;

const GET_ALL_POSTS = `
      SELECT
        p.id,
        p.dish_name,
        p.description,
        p.difficulty,
        p.image_url,
        p.created_at,
        u.profile_name,
        u.profile_img_url,
        u.created_at AS user_created_at,
        COALESCE(likes_count.count, 0) AS likes_count,
        COALESCE(array_agg(l.user_sub) FILTER (WHERE l.user_sub IS NOT NULL), '{}') AS likes
      FROM post p
      LEFT JOIN users u ON p.user_sub = u.sub
      LEFT JOIN post_likes l ON l.post_id = p.id
      LEFT JOIN (
        SELECT post_id, COUNT(*) AS count
        FROM post_likes
        GROUP BY post_id
      ) likes_count ON likes_count.post_id = p.id
      GROUP BY p.id, u.profile_name, u.profile_img_url, u.created_at, likes_count.count
      ORDER BY p.created_at DESC;
`;

const insert_User_Query = `
INSERT INTO users (
  sub,
  profile_img_base64,
  profile_img_url,
  first_name,
  last_name,
  dob,
  email,
  profile_name
)
VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
RETURNING *;
`;

const GET_USER_BY_SUB = `
  SELECT
    profile_img_url,
    first_name,
    last_name,
    dob,
    email,
    profile_name
  FROM users
  WHERE sub = $1;
`;

const UPDATE_USER_ACCOUNT = `
  UPDATE users
  SET first_name = $1,
      last_name = $2,
      profile_name = $3,
      profile_img_url = COALESCE($4, profile_img_url),
      dob = $5,
      updated_at = CURRENT_TIMESTAMP
  WHERE sub = $6
  RETURNING sub, email, first_name, last_name, profile_name, profile_img_url, dob;
`;


const INSERT_LIKE = `
  INSERT INTO post_likes (post_id, user_sub)
  VALUES ($1, $2)
  ON CONFLICT (post_id, user_sub) DO NOTHING
  RETURNING *;
`;

DELETE_LIKE = `
  DELETE FROM post_likes
  WHERE post_id = $1 AND user_sub = $2
  RETURNING *;
`;

CHECK_LIKE = `
  SELECT * FROM post_likes
  WHERE post_id = $1 AND user_sub = $2;
`;

const INSERT_LIKE_NOTIFICATION = `
INSERT INTO notifications (
    receiver_sub, 
    actor_sub, 
    action_type, 
    post_id, 
    created_at, 
    is_read
)
VALUES ($1, $2, 'like', $3, NOW(), FALSE);
`;

const INSERT_MESSAGE = `
  INSERT INTO messages (conversation_id, sender_sub, content)
  VALUES ($1, $2, $3)
  RETURNING id, conversation_id, sender_sub, content, sent_at, is_read, status;
`;

const INSERT_MESSAGE_NOTIFICATION = `
  INSERT INTO notifications (receiver_sub, actor_sub, action_type, conversation_id)
  VALUES ($1, $2, $3, $4);
`;


const GET_USER_POSTS = `
    SELECT
        p.id,
        p.dish_name,
        p.description,
        p.difficulty,
        p.image_url,
        p.created_at,
        u.created_at AS user_created_at,
        COALESCE(likes_count.count, 0) AS likes_count,
        COALESCE(array_agg(l.user_sub) FILTER (WHERE l.user_sub IS NOT NULL), '{}') AS likes
    FROM post p
    LEFT JOIN users u ON p.user_sub = u.sub
    LEFT JOIN post_likes l ON l.post_id = p.id
    LEFT JOIN (
        SELECT post_id, COUNT(*) AS count
        FROM post_likes
        GROUP BY post_id
    ) likes_count ON likes_count.post_id = p.id
    WHERE p.user_sub = $1
    GROUP BY p.id, u.profile_name, u.profile_img_url, u.created_at, likes_count.count
    ORDER BY p.created_at DESC;
`;

const GET_USER_LIKED_POSTS = `
    SELECT
        p.id,
        p.dish_name,
        p.description,
        p.difficulty,
        p.image_url,
        p.created_at,
        u.profile_name,
        u.profile_img_url,
        u.created_at AS user_created_at,
        COALESCE(likes_count.count, 0) AS likes_count,
        COALESCE(array_agg(l2.user_sub) FILTER (WHERE l2.user_sub IS NOT NULL), '{}') AS likes
    FROM post_likes pl
    INNER JOIN post p ON p.id = pl.post_id
    LEFT JOIN users u ON p.user_sub = u.sub
    LEFT JOIN post_likes l2 ON l2.post_id = p.id
    LEFT JOIN (
        SELECT post_id, COUNT(*) AS count
        FROM post_likes
        GROUP BY post_id
    ) likes_count ON likes_count.post_id = p.id
    WHERE pl.user_sub = $1
    GROUP BY p.id, u.profile_name, u.profile_img_url, u.created_at, likes_count.count
    ORDER BY p.created_at DESC;
`;

const GET_INBOX = `
  SELECT
      m.id AS message_id,
      m.conversation_id,
      m.sender_sub,
      m.content,
      m.sent_at,
      m.is_read,
      u.profile_name AS sender_name,
      u.profile_img_url AS sender_img,
      c.post_id,
      p.dish_name AS post_title,
      p.description AS post_description,
      p.image_url AS post_img
  FROM messages m
  INNER JOIN users u ON u.sub = m.sender_sub
  LEFT JOIN conversations c ON c.id = m.conversation_id
  LEFT JOIN post p ON p.id = c.post_id
  WHERE m.sender_sub = $1
    OR m.conversation_id IN (
      SELECT conversation_id
      FROM conversation_participants
      WHERE user_sub = $1
    )
  ORDER BY m.sent_at ASC;
`;

const GET_CONVERSATION = `
  SELECT c.id AS conversation_id
  FROM conversations c
  JOIN conversation_participants cp
    ON cp.conversation_id = c.id
  WHERE c.post_id = $1 AND cp.user_sub = $2
  LIMIT 1;
`;

const CREATE_CONVERSATION = `
  INSERT INTO conversations (post_id, type)
  VALUES ($1, 'direct')
  RETURNING id;
`;

const ADD_CONVERSATION_PARTICIPANT = `
  INSERT INTO conversation_participants (conversation_id, user_sub)
  VALUES ($1, $2)
  ON CONFLICT (conversation_id, user_sub) DO NOTHING;
`;

const UPDATE_LAST_READ_MESSAGE = `
  UPDATE conversation_participants
  SET last_read_message_id = $1
  WHERE conversation_id = $2 AND user_sub = $3;
`;

module.exports = {
  CREATE_POST_TABLE,
  INSERT_POST,
  GET_ALL_POSTS,
  insert_User_Query,
  GET_USER_BY_SUB,
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
};
