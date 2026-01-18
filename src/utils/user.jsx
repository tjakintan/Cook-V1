import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasAttemptedAuth, setHasAttemptedAuth] = useState(false);

  // Only call this after sign-in
  const refreshUser = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://api.gomeal.org/auth/user", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok && data.authenticated) {
        setUser(data.user);
        return data.user;
      }

      // Token expired → refresh
      if (res.status === 401 && data.shouldRefresh) {
        const refreshRes = await fetch("https://api.gomeal.org/auth/refresh", {
          method: "POST",
          credentials: "include",
        });
        const refreshData = await refreshRes.json();
        if (refreshData.user) {
          setUser(refreshData.user);
          return refreshData.user;
        }
      }

      setUser(null);
      return null;
    } catch (err) {
      console.error("[UserProvider] refreshUser error:", err);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasAttemptedAuth) refreshUser();
  }, [hasAttemptedAuth]);

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser, loading, setHasAttemptedAuth }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
