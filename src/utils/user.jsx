import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasAttemptedAuth, setHasAttemptedAuth] = useState(false);

  // 🔑 Fetch user with optional retry for token refresh
  const fetchUser = async (retry = true) => {
    setLoading(true);

    try {
      const res = await fetch(
        "https://ihme27ex7d.execute-api.us-east-2.amazonaws.com/user",
        {
          method: "GET",
          credentials: "include",
          headers: { "content-type": "application/json" },
        }
      );

      const data = await res.json();

      // ✅ User authenticated
      if (res.ok && data.authenticated) {
        setUser(data.user);
        return;
      }

      // 🔁 Token expired → try refresh ONCE
      if (
        res.status === 401 &&
        data.reason === "expired" &&
        retry &&
        data.shouldRefresh
      ) {
        console.warn("🔁 Token expired. Attempting refresh...");

        const refreshRes = await fetch(
          "https://ihme27ex7d.execute-api.us-east-2.amazonaws.com/refresh",
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (refreshRes.ok) {
          console.log("✅ Token refreshed. Retrying user fetch...");
          return fetchUser(false); // retry once
        } else {
          console.warn("❌ Refresh failed. Logging out...");
          setUser(null);
        }
      } else {
        // ❌ Auth failed for other reasons
        setUser(null);
      }
    } catch (err) {
      console.error("❌ Failed to fetch user:", err);
      setUser(null);
    } finally {
      setLoading(false);
      setHasAttemptedAuth(true);
    }
  };

  // ✅ Fetch user on app load
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        refreshUser: fetchUser,
        hasAttemptedAuth,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
