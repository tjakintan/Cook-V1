import { useUser } from "../utils/user.jsx";

export function getUserSub(user) {
  return user?.sub || null;
}

export function logout() {
  
  const { setUser } = useUser();

  fetch("https://ihme27ex7d.execute-api.us-east-2.amazonaws.com/signout", {
    method: "POST",
    credentials: "include"  
  }).finally(() => {
    setUser(null);
    window.location.href = "/auth";
  });
}