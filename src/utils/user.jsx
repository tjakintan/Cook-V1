import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasAttemptedAuth, setHasAttemptedAuth] = useState(false);

  // Rename fetchUser to refreshUser for clarity
  const refreshUser = async (retry = true) => {
    if (!hasAttemptedAuth) {
      setLoading(true);
    }

    try {
      const res = await fetch(
        "https://tp3dtgesne.execute-api.us-east-2.amazonaws.com/prod/user",
        {
          method: "GET",
          credentials: "include",
          headers: { "content-type": "application/json" },
        }
      );

      const data = await res.json();

      if (res.ok && data.authenticated) {
        setUser(data.user);
        return data.user;
      }

      // If token expired, try refreshing
      if (
        res.status === 401 &&
        data.reason === "expired" &&
        retry &&
        data.shouldRefresh
      ) {
        const refreshRes = await fetch(
          "https://tp3dtgesne.execute-api.us-east-2.amazonaws.com/prod/refresh",
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (refreshRes.ok) {
          // Retry fetching the user after refresh
          return refreshUser(false);
        }
      }

      // If unauthorized or refresh fails
      setUser(null);
      return null;
    } catch (err) {
      console.error("Error fetching user:", err);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
      setHasAttemptedAuth(true);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        refreshUser, 
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
