const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");
const { Client } = require("pg");
const { GET_USER_BY_SUB } = require("./sql.js");

const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT,
  COGNITO_USER_POOL_ID,
  AWS_REGION,
} = process.env;

const FRONTEND_ORIGIN = "https://dev.gomeal.org"; 

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": FRONTEND_ORIGIN,
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
};

const ISSUER = `https://cognito-idp.${AWS_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}`;

const jwks = jwksClient({
  jwksUri: `${ISSUER}/.well-known/jwks.json`,
  cache: true,
  rateLimit: true,
});

function getKey(header, callback) {
  jwks.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    callback(null, key.getPublicKey());
  });
}

function parseCookies(event) {
  const raw =
    event.headers?.cookie ||
    event.headers?.Cookie ||
    (event.cookies || []).join("; ");
  if (!raw) return {};
  return Object.fromEntries(
    raw.split(";").map((c) => {
      const [k, ...v] = c.trim().split("=");
      return [k, v.join("=")];
    })
  );
}

async function fetchUserFromDB(sub) {
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
  return res.rows[0] || null;
}

exports.handler = async (event) => {
  try {

    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: "",
      };
    }

    const cookies = parseCookies(event);

    if (!cookies.authTokens) {
      return {
        statusCode: 401,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          authenticated: false,
          reason: "missing_token",
        }),
      };
    }

    let tokens;
    try {
      tokens = JSON.parse(decodeURIComponent(cookies.authTokens));
    } catch {
      return {
        statusCode: 401,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          authenticated: false,
          reason: "invalid_token",
        }),
      };
    }

    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(tokens.idToken, getKey, { issuer: ISSUER }, (err, d) =>
        err ? reject(err) : resolve(d)
      );
    });

    if (decoded.token_use !== "id") {
      throw new Error("wrong_token");
    }

    const dbUser = await fetchUserFromDB(decoded.sub);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        authenticated: true,
        user: dbUser,
      }),
    };
  } catch (err) {
    console.error(err);

    if (err.name === "TokenExpiredError") {
      return {
        statusCode: 401,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          authenticated: false,
          reason: "expired",
          shouldRefresh: true,
        }),
      };
    }

    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        authenticated: false,
        reason: "internal_error",
        message: err.message,
      }),
    };
  }
};
