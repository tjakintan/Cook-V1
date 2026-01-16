const { Client } = require("pg");
const { GET_ALL_POSTS } = require("./sql.js");
const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT
} = process.env;

exports.handler = async (event) => {
  let client;

  try {
    client = new Client({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: DB_PORT || 5432,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();
    console.log("Connected to DB:", DB_HOST);

    // Query all posts (with optional user profile info)
    const res = await client.query(GET_ALL_POSTS);
    console.log("Query result rows:", res.rows);

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: "success",
        posts: res.rows
      })
    };

  } catch (err) {
    console.error("FEED ERROR:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", details: err.message })
    };
  } finally {
    if (client) await client.end();
  }
};
