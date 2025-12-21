import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getValidAccessToken } from "./auth.js"

const UserContext = createContext();

export function UserProvider({ children }) {
    
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getValidAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }

    const { sub } = jwtDecode(token);

    fetch("https://ihme27ex7d.execute-api.us-east-2.amazonaws.com/user", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sub }),
    })
      .then(res => res.json())
      .then(data => setUser(data.user))
      .finally(() => setLoading(false));
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
