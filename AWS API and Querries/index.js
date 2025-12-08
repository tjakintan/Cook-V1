const feed = require("./feed.js");
const upload = require("./upload.js");
const signup = require("./signUp.js");
const signin = require("./signIn.js");
const user = require("./user.js");
const actions = require("./actions.js");

exports.handler = async (event) => {
    console.log("EVENT:", JSON.stringify(event, null, 2));

    // Safe access for path and method
    const path = event.rawPath || event.path || event.resource || "/unknown";
    const method = event.requestContext?.http?.method || event.httpMethod || "UNKNOWN";

    // Handle OPTIONS preflight requests
    if (method === "OPTIONS") {
        return {
            statusCode: 204,
            body: null,
        };
    }

    if (path.endsWith("/feed")) {
        if (method === "GET" || method === "POST") {
            const response = await feed.handler(event);
            return response;
        }
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Method Not Allowed" }),
        };
    }

    if (path.endsWith("/upload")) {
        if (method === "GET" || method === "POST") {
            const response = await upload.handler(event);
            return response;
        }
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Method Not Allowed" }),
        };
    }

    if (path.endsWith("/signup")) {
        if (method === "GET" || method === "POST") {
            const response = await signup.handler(event);
            return response;
        }
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Method Not Allowed" }),
        };
    }

    if (path.endsWith("/signin")) {
        if (method === "GET" || method === "POST") {
            const response = await signin.handler(event);
            return response;
        }
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Method Not Allowed" }),
        };
    }

    if (path.endsWith("/user")) {
        if (method === "GET" || method === "POST") {
            const response = await user.handler(event);
            return response;
        }
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Method Not Allowed" }),
        };
    }

    if (path.endsWith("/actions")) {
        if (method === "GET" || method === "POST") {
            const response = await actions.handler(event);
            return response;
        }
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Method Not Allowed" }),
        };
    }

    return {
        statusCode: 404,
        body: JSON.stringify({ message: "Endpoint not found" }),
    };
};
