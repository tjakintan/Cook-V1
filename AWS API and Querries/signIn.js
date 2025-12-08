const {
    CognitoIdentityProviderClient,
    InitiateAuthCommand,
    ListUsersCommand
  } = require("@aws-sdk/client-cognito-identity-provider");
  const { Client } = require("pg");
  const jwt = require("jsonwebtoken");
  
  const {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    DB_PORT,
    COGNITO_CLIENT_ID,
    COGNITO_USER_POOL_ID
  } = process.env;
  
  const cognito = new CognitoIdentityProviderClient({ region: "us-east-2" });
  
  exports.handler = async (event) => {
    try {
      const { email, incomingPasscode } = JSON.parse(event.body);
  
      if (!email) {
        return {
          statusCode: 400,
          body: JSON.stringify({ status: "error", message: "No email" }),
        };
      }
      const passcode = incomingPasscode && incomingPasscode.length === 6 ? incomingPasscode : "000000";

      const lowerEmail = email;

      const userCheck = await cognito.send(
        new ListUsersCommand({
          UserPoolId: COGNITO_USER_POOL_ID,
          Filter: `email = "${lowerEmail}"`,
          Limit: 1
        })
      );
      if (!userCheck.Users || userCheck.Users.length === 0) {
        return {
          statusCode: 404,
          body: JSON.stringify({
            status: "not_found",
            message: "email not registered"
          }),
        };
      }
      const authParams = {
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: COGNITO_CLIENT_ID,
        AuthParameters: {
          USERNAME: lowerEmail,
          PASSWORD: passcode,
        },
      };
  
      let authResult;
      try {
        const command = new InitiateAuthCommand(authParams);
        authResult = await cognito.send(command);
      } 
      catch (err) {
        
        if (err.name === "UserNotConfirmedException") {
          return {
            statusCode: 403,
            body: JSON.stringify({ status: "unconfirmed", message: "User email not confirmed" }),
          };
        } 

        if (err.name === "NotAuthorizedException") {
          return {
            statusCode: 400,
            body: JSON.stringify({
              status: "unauthorized",
              message: "Incorrect password"
            }),
          };
        }

        else {
          console.error("Cognito error:", err);
          return {
            statusCode: 500,
            body: JSON.stringify({ status: "error", message: err.message }),
          };
        }
      }
      const decoded = jwt.decode(authResult.AuthenticationResult.IdToken);
      const sub = decoded.sub;
      const client = new Client({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
        port: DB_PORT || 5432,
        ssl: { rejectUnauthorized: false }
      });
  
      return {
        statusCode: 200,
        body: JSON.stringify({
          status: "success",
          tokens: authResult.AuthenticationResult,
        }),
      };
  
    } catch (err) {
      console.error("Lambda error:", err);
      return {
        statusCode: 500,
        body: JSON.stringify({ status: "error", message: "Internal server error" }),
      };
    }
  };
  