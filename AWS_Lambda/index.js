import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import pkg from "pg";
const { Client } = pkg;

// Environment variables (set these in Lambda console)
const {
  S3_BUCKET_NAME,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT
} = process.env;

const s3 = new S3Client({ region: "us-east-1" });

export const handler = async (event) => {
  try {
    const { dishName, description, difficulty, fileBase64, fileName } = JSON.parse(event.body);

    if (!dishName || !description || !difficulty || !fileBase64 || !fileName) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing fields" }) };
    }

    // Decode base64 file
    const buffer = Buffer.from(fileBase64, "base64");

    // Upload to S3
    const s3Key = `${Date.now()}-${fileName}`;
    const putCommand = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: s3Key,
      Body: buffer,
      ContentType: "image/jpeg",
      ACL: "public-read"
    });
    await s3.send(putCommand);

    const fileUrl = `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${s3Key}`;

    // Connect to PostgreSQL
    const client = new Client({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: DB_PORT || 5432
    });

    await client.connect();

    const query = `
      INSERT INTO dishes (dish_name, description, difficulty, image_url, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *;
    `;
    const values = [dishName, description, difficulty, fileUrl];

    const res = await client.query(query, values);

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Upload successful", dish: res.rows[0] })
    };

  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "Server error", details: err.message }) };
  }
};
