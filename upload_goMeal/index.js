const feed = require("./feed.js");
const upload = require("./upload.js");
const signup = require("./signUp.js");
const signin = require("./signIn.js");
const user = require("./user.js");
const actions = require("./actions.js");
const social = require("./social-login.js");
const signout = require("./signout.js");
const refresh = require("./refresh.js");

const FRONTEND_ORIGIN = "https://dev.gomeal.org";

const BASE_CORS_HEADERS = {
    "Access-Control-Allow-Origin": FRONTEND_ORIGIN,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Credentials": "true",
};

exports.handler = async (event) => {
    console.log("EVENT:", JSON.stringify(event, null, 2));

    const path = event.rawPath || event.path || event.resource || "/unknown";
    const method = event.httpMethod || event.requestContext?.http?.method || "UNKNOWN";

    if (method === "OPTIONS") {
        return {
            statusCode: 200,
            headers: BASE_CORS_HEADERS,
            body: "",
        };
    }

    if (path.endsWith("/feed") && (method === "GET" || method === "POST")) {
        return await feed.handler(event);
    }
    if (path.endsWith("/upload") && method === "POST") {
        return await upload.handler(event);
    }
    if (path.endsWith("/signup") && method === "POST") {
        return await signup.handler(event);
    }
    if (path.endsWith("/actions") && (method === "GET" || method === "POST")) {
        return await actions.handler(event);
    }

    // --- Auth APIs (with credentials) ---
    if (path.endsWith("/signin") && method === "POST") {
        return await signin.handler(event);
    }
    if (path.endsWith("/user") && method === "GET") {
        return await user.handler(event);
    }
    if (path.endsWith("/refresh") && method === "POST") {
        return await refresh.handler(event);
    }
    if (path.endsWith("/signout") && method === "POST") {
        return await signout.handler(event);
    }

    if (path.endsWith("/social-login") && method === "POST") {
        return await social.handler(event);
    }

    return {
        statusCode: 405,
        headers: BASE_CORS_HEADERS,
        body: JSON.stringify({ message: "Method Not Allowed or Endpoint not found" }),
    };
};
