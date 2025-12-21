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
