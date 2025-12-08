const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { Client } = require("pg");
const { INSERT_POST } = require("./sql.js");

const {
  S3_BUCKET_NAME,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT
} = process.env;

const s3 = new S3Client({ region: "us-east-2" });

exports.handler = async (event) => {
  let client;

  try {
    const body = JSON.parse(event.body);

    const {
      dishName,
      description,
      difficulty,
      fileBase64,
      fileName,
      user_sub   // 🔥 YOU MUST RECEIVE THIS
    } = body;

    // Validate
    if (!dishName || !description || !difficulty || !fileBase64 || !fileName || !user_sub) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" })
      };
    }

    // Decode Base64
    const buffer = Buffer.from(fileBase64, "base64");

    // Upload to S3
    const s3Key = `${Date.now()}-${fileName}`;
    await s3.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: s3Key,
        Body: buffer,
        ContentType: "image/jpeg" // you can detect this if needed
      })
    );

    const fileUrl = `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${s3Key}`;

    // DB
    client = new Client({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: DB_PORT || 5432,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();

    // SQL: dishName, description, difficulty, fileUrl, user_sub
    const result = await client.query(INSERT_POST, [
      dishName,
      description,
      difficulty,
      fileUrl,
      user_sub
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: "success",
        post: result.rows[0]
      })
    };

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", details: err.message })
    };
  } finally {
    if (client) await client.end();
  }
};
