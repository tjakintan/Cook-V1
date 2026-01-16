const {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} = require("@aws-sdk/client-cognito-identity-provider");
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");
const { Client } = require("pg");
const { GET_USER_BY_SUB } = require("./sql.js");

const cognito = new CognitoIdentityProviderClient({ region: "us-east-2" });
const { COGNITO_CLIENT_ID, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT, COGNITO_USER_POOL_ID, AWS_REGION } = process.env;

const FRONTEND_ORIGIN = "https://dev.gomeal.org";
const BASE_CORS_HEADERS = {
  "Access-Control-Allow-Origin": FRONTEND_ORIGIN,
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
};

const ISSUER = `https://cognito-idp.${AWS_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}`;
const jwks = jwksClient({ jwksUri: `${ISSUER}/.well-known/jwks.json`, cache: true, rateLimit: true });

function getKey(header, callback) {
  jwks.getSigningKey(header.kid, (err, key) => (err ? callback(err) : callback(null, key.getPublicKey())));
}

function parseCookies(headers) {
  const raw = headers?.cookie || headers?.Cookie || "";
  return Object.fromEntries(raw.split(";").map(c => {
    const [k, ...v] = c.trim().split("=");
    return [k, v.join("=")];
  }));
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
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: BASE_CORS_HEADERS, body: "" };
  }

  try {
    const cookies = parseCookies(event.headers);
    const refreshToken = cookies.refreshToken;

    if (!refreshToken) {
      return { statusCode: 401, headers: BASE_CORS_HEADERS, body: JSON.stringify({ status: "error", message: "No refresh token" }) };
    }

    // Refresh tokens with Cognito
    const authResult = await cognito.send(new InitiateAuthCommand({
      AuthFlow: "REFRESH_TOKEN_AUTH",
      ClientId: COGNITO_CLIENT_ID,
      AuthParameters: { REFRESH_TOKEN: refreshToken },
    }));

    const newTokens = {
      idToken: authResult.AuthenticationResult.IdToken,
      accessToken: authResult.AuthenticationResult.AccessToken,
    };

    // Decode ID token to get user sub
    const decoded = jwt.decode(newTokens.idToken);
    const dbUser = await fetchUserFromDB(decoded.sub);

    const ONE_DAY = 60 * 60 * 24;
    const authCookie = `authTokens=${encodeURIComponent(JSON.stringify(newTokens))}; Path=/; Domain=.gomeal.org; Secure; SameSite=None; HttpOnly; Max-Age=${ONE_DAY}`;

    return {
      statusCode: 200,
      headers: BASE_CORS_HEADERS,
      multiValueHeaders: { "Set-Cookie": [authCookie] },
      body: JSON.stringify({
        status: "refreshed",
        user: dbUser,
      }),
    };
  } catch (err) {
    console.error("Refresh error:", err);
    return { statusCode: 401, headers: BASE_CORS_HEADERS, body: JSON.stringify({ status: "error", message: "Refresh failed" }) };
  }
};
