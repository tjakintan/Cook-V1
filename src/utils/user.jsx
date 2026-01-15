import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasAttemptedAuth, setHasAttemptedAuth] = useState(false);

  const refreshUser = async () => {
    if (!hasAttemptedAuth) setLoading(true);
    console.log("[UserProvider] refreshUser called");

    try {
      // 1️⃣ Try to fetch current user
      console.log("[UserProvider] Fetching /user...");
      const res = await fetch(
        "https://api.gomeal.org/auth/user",
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await res.json();
      console.log("[UserProvider] /user response:", res.status, data);

      // 2️⃣ If user is authenticated
      if (res.ok && data.authenticated) {
        console.log("[UserProvider] User authenticated, setting state:", data.user);
        setUser(data.user);
        return data.user;
      }

      // 3️⃣ If token expired, call refresh endpoint
      if (res.status === 401 && data.reason === "expired" && data.shouldRefresh) {
        console.log("[UserProvider] Token expired, calling /refresh...");
        const refreshRes = await fetch(
          "https://api.gomeal.org/auth/refresh",
          {
            method: "POST",
            credentials: "include",
          }
        );

        const refreshData = await refreshRes.json();
        console.log("[UserProvider] /refresh response:", refreshRes.status, refreshData);

        if (refreshData.user) {
          console.log("[UserProvider] Setting user from refresh:", refreshData.user);
          setUser(refreshData.user);
          return refreshData.user;
        }

        console.log("[UserProvider] Refresh failed, setting user to null");
        setUser(null);
        return null;
      }

      // 4️⃣ Any other unauthorized case
      console.log("[UserProvider] Unauthorized or other error, setting user to null");
      setUser(null);
      return null;
    } catch (err) {
      console.error("[UserProvider] Error fetching user:", err);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
      setHasAttemptedAuth(true);
      console.log("[UserProvider] refreshUser finished, loading=false, hasAttemptedAuth=true");
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
