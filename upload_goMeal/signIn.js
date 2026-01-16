const {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  ListUsersCommand
} = require("@aws-sdk/client-cognito-identity-provider");
const { Client } = require("pg");
const { GET_USER_BY_SUB } = require("./sql.js");

const cognito = new CognitoIdentityProviderClient({ region: "us-east-2" });

const { COGNITO_CLIENT_ID, COGNITO_USER_POOL_ID, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;

const FRONTEND_ORIGIN = "https://dev.gomeal.org"; 
const FRONTEND_DOMAIN = "gomeal.org";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": FRONTEND_ORIGIN,
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "GET,OPTIONS,POST",
};

// Helper to fetch user from DB
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
      return { statusCode: 200, headers: CORS_HEADERS, body: "" };
    }

    const body = event.body ? JSON.parse(event.body) : {};
    const { email, incomingPasscode } = body;

    if (!email || !incomingPasscode) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ status: "error", message: "Missing email or passcode" }),
      };
    }

    const lowerEmail = email.toLowerCase();

    // Check if user exists in Cognito
    const userCheck = await cognito.send(
      new ListUsersCommand({
        UserPoolId: COGNITO_USER_POOL_ID,
        Filter: `email = "${lowerEmail}"`,
        Limit: 1,
      })
    );

    if (!userCheck.Users?.length) {
      return {
        statusCode: 404,
        headers: CORS_HEADERS,
        body: JSON.stringify({ status: "not_found" }),
      };
    }

    // Authenticate user
    const authResult = await cognito.send(
      new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: COGNITO_CLIENT_ID,
        AuthParameters: {
          USERNAME: lowerEmail,
          PASSWORD: incomingPasscode,
        },
      })
    );

    const tokens = {
      idToken: authResult.AuthenticationResult.IdToken,
      accessToken: authResult.AuthenticationResult.AccessToken,
    };
    const refreshToken = authResult.AuthenticationResult.RefreshToken;

    const ONE_DAY = 60 * 60 * 24;

    const authCookie =
    `authTokens=${encodeURIComponent(JSON.stringify(tokens))}; ` +
    `Path=/; Domain=gomeal.org; Secure; SameSite=None; HttpOnly; Max-Age=${ONE_DAY}`;
  
    const refreshCookie =
    `refreshToken=${refreshToken}; ` +
    `Path=/refresh; Domain=gomeal.org; Secure; SameSite=None; HttpOnly; Max-Age=${ONE_DAY}`;

    // Fetch user info from DB
    const sub = userCheck.Users[0].Attributes.find(attr => attr.Name === "sub").Value;
    const dbUser = await fetchUserFromDB(sub);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      multiValueHeaders: {
        "Set-Cookie": [authCookie, refreshCookie],
      },
      body: JSON.stringify({
        status: "success",
        user: dbUser, // <- return user info
      }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ status: "error", message: "Internal server error" }),
    };
  }
};
