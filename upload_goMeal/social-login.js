const { Client } = require("pg");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { GET_USER_BY_SUB } = require("./sql.js");

const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT,
  JWT_SECRET,
  COGNITO_CLIENT_ID,
  COGNITO_CLIENT_SECRET,
  COGNITO_DOMAIN, // e.g. us-east-2gajzheelf.auth.us-east-2.amazoncognito.com
} = process.env;

// Decode/verify JWT (Cognito ID token)
const verifyCognitoToken = (token) => {
  try {
    return jwt.decode(token, { complete: true }); // optionally verify signature
  } catch (err) {
    throw new Error("Invalid Cognito token");
  }
};

exports.handler = async (event) => {
  try {
    const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    const { code, redirect_uri } = body || {};

    if (!code || !redirect_uri) {
      return { statusCode: 400, body: JSON.stringify({ authenticated: false, error: "Missing code or redirect_uri" }) };
    }

    console.log("🔑 Received code from frontend:", code);

    // 1️⃣ Exchange code for tokens from Cognito
    const tokenUrl = `https://${COGNITO_DOMAIN}/oauth2/token`;
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: COGNITO_CLIENT_ID,
      code,
      redirect_uri,
    });

    // Include client secret if set
    if (COGNITO_CLIENT_SECRET) {
      params.append("client_secret", COGNITO_CLIENT_SECRET);
    }

    const tokenResponse = await axios.post(tokenUrl, params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const idToken = tokenResponse.data.id_token;
    if (!idToken) {
      return { statusCode: 401, body: JSON.stringify({ authenticated: false, error: "No ID token returned" }) };
    }

    console.log("✅ Received ID token from Cognito");

    // 2️⃣ Decode/verify ID token
    const decoded = verifyCognitoToken(idToken);
    const sub = decoded?.payload?.sub;
    if (!sub) {
      return { statusCode: 401, body: JSON.stringify({ authenticated: false, error: "Invalid token payload" }) };
    }

    // 3️⃣ Connect to DB and fetch user by Cognito sub
    const client = new Client({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: DB_PORT || 5432,
      ssl: { rejectUnauthorized: false },
    });
    await client.connect();

    const res = await client.query(GET_USER_BY_SUB, [sub]);
    await client.end();

    if (!res.rows.length) {
      return { statusCode: 404, body: JSON.stringify({ authenticated: false, error: "User not found" }) };
    }

    // 4️⃣ Return user and optionally set session cookies
    return {
      statusCode: 200,
      body: JSON.stringify({ authenticated: true, user: res.rows[0] }),
      headers: {
        "Set-Cookie": `idToken=${idToken}; HttpOnly; Path=/; Max-Age=3600; Secure; SameSite=Lax`,
      },
    };
  } catch (err) {
    console.error("❌ /social-login error:", err.message);
    return { statusCode: 500, body: JSON.stringify({ authenticated: false, error: "Internal server error" }) };
  }
};
