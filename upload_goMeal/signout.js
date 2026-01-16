const { CognitoIdentityProviderClient, GlobalSignOutCommand } = require("@aws-sdk/client-cognito-identity-provider");

const cognito = new CognitoIdentityProviderClient({ region: "us-east-2" });

const { COGNITO_USER_POOL_ID } = process.env;

const FRONTEND_ORIGIN = "https://dev.gomeal.org";
const FRONTEND_DOMAIN = "gomeal.org";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": FRONTEND_ORIGIN,
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
};

function clearCookies() {
  return [
    `authTokens=; Path=/; Domain=${FRONTEND_DOMAIN}; Secure; SameSite=None; HttpOnly; Max-Age=0`,
    `refreshToken=; Path=/refresh; Domain=${FRONTEND_DOMAIN}; Secure; SameSite=None; HttpOnly; Max-Age=0`
  ];
}

exports.handler = async (event) => {
  try {

    const body = event.body ? JSON.parse(event.body) : {};
    const { accessToken } = body;

    if (!accessToken) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ status: "error", message: "Missing accessToken" })
      };
    }

    await cognito.send(new GlobalSignOutCommand({ AccessToken: accessToken }));

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      multiValueHeaders: {
        "Set-Cookie": clearCookies()
      },
      body: JSON.stringify({ status: "success", message: "Signed out" })
    };

  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ status: "error", message: "Internal server error" })
    };
  }
};
