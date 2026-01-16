const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { Client } = require("pg");
const { insert_User_Query } = require("./sql.js");

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
  try {
    const {
      first_name,
      last_name,
      email,
      profile_name,
      dob,
      passcode,
      profile_img_base64,
      sub  
    } = JSON.parse(event.body);

    if (!first_name || !last_name || !email || !profile_name || !dob || !passcode || !sub) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing required fields" }) };
    }

    let profile_img_url = null;

    if (profile_img_base64) {
      const buffer = Buffer.from(profile_img_base64, "base64");
      const s3Key = `${Date.now()}.jpeg`;

      await s3.send(new PutObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: s3Key,
        Body: buffer,
        ContentType: "image/jpeg"
      }));

      profile_img_url = `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${s3Key}`;
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

    const values = [
      sub,
      profile_img_base64 || null,
      profile_img_url,
      first_name,
      last_name,
      dob,
      email,
      profile_name
    ];

    const dbRes = await client.query(insert_User_Query, values);
    await client.end();

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "User created successfully", user: dbRes.rows[0] })
    };

  } catch (err) {
    console.error(err);

    if (err.code === '23505') {
      return { statusCode: 409, body: JSON.stringify({ error: "Email already in use" }) };
    }

    return { statusCode: 500, body: JSON.stringify({ error: "Server error", details: err.message }) };
  }
};
