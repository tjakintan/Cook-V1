import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasAttemptedAuth, setHasAttemptedAuth] = useState(false);

  const fetchUser = async (retry = true) => {

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
          return refreshRes(false); 
        } 
      } 
      setUser(null);
      return null;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
      setHasAttemptedAuth(true);
    }
  };

  useEffect(() => {
    fetchUser();
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
