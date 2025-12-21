import { jwtDecode } from "jwt-decode";

export function getUserSub() {
  const raw = localStorage.getItem("accessToken");
  if (!raw) return null;

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    localStorage.removeItem("accessToken");
    return null;
  }

  if (!parsed.value) return null;

  try {
    const decoded = jwtDecode(parsed.value);
    return decoded.sub || null;
  } catch (err) {
    console.error("Failed to decode accessToken", err);
    return null;
  }
}

export function getValidAccessToken() {
  const raw = localStorage.getItem("accessToken");
  if (!raw) return null;

  let parsed;

  try {
    parsed = JSON.parse(raw);
  } catch {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("idToken");
    return null;
  }

  if (!parsed.value || !parsed.expiry) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("idToken");
    return null;
  }

  if (Date.now() > parsed.expiry) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("idToken");
    return null;
  }

  return parsed.value;
}

export function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("idToken");
}
