const {
    CognitoIdentityProviderClient,
    InitiateAuthCommand,
    ListUsersCommand
  } = require("@aws-sdk/client-cognito-identity-provider");
  const { Client } = require("pg");
  const jwt = require("jsonwebtoken");
  const { GET_USER_BY_SUB } = require("./sql.js");
  
  const {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    DB_PORT,
    COGNITO_CLIENT_ID,
    COGNITO_USER_POOL_ID
  } = process.env;
  
  exports.handler = async (event) => {
    try {
  
      const { sub } = JSON.parse(event.body);
      if (!sub) null;
  
      const client = new Client({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
        port: DB_PORT || 5432,
        ssl: { rejectUnauthorized: false }
      });
  
      await client.connect();
      const res = await client.query(GET_USER_BY_SUB, [sub]);
      await client.end();
  
      if (!res.rows[0]) {
        return {
          statusCode: 404,
          body: JSON.stringify({ status: "fail", message: "User not found" }),
        };
      }
  
      return {
        statusCode: 200,
        body: JSON.stringify({
          status: "success",
          user: res.rows[0]
        }),
      };
    } catch (err) {
      console.error("Error in Lambda handler:", err);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: err.message }),
      };
    }
  };
  