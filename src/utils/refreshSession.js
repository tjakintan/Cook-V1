import { CognitoUserPool } from "amazon-cognito-identity-js";
import { createContext, useContext, useEffect, useState } from "react";


const poolData = {
  UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
};
console.log("UserPoolId:", import.meta.env.VITE_COGNITO_USER_POOL_ID);
console.log("ClientId:", import.meta.env.VITE_COGNITO_CLIENT_ID);

const userPool = new CognitoUserPool(poolData);

export function refreshSession() {
useEffect(() => {
  const loadUser = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://ihme27ex7d.execute-api.us-east-2.amazonaws.com/user", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setUser(data.authenticated ? data.user : null);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  loadUser();
}, []);

}
