import { useUser } from "../utils/user.jsx";

export function getUserSub(user) {
  return user?.sub || null;
}

export function useSignOut() {
  const { setUser } = useUser(); 

  const signout = async () => {
    try {
      await fetch(
        "https://api.gomeal.org/auth/signout",
        {
          method: "POST",
          credentials: "include",
        }
      );
      setUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  return signout;
}
