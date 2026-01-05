import { useUser } from "../utils/user.jsx";

export function getUserSub(user) {
  return user?.sub || null;
}

export function useSignOut() {
  const { setUser } = useUser(); 

  const signout = async () => {
    try {
      await fetch(
        "https://ihme27ex7d.execute-api.us-east-2.amazonaws.com/signout",
        {
          method: "POST",
          credentials: "include",
        }
      );
      setUser(null);
      // window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return signout;
}
