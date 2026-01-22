import { useEffect, useState } from "react";

export default function useDarkMode() {
  // Initialize based on localStorage or system preference
  const [isDark, setIsDark] = useState(() => {
    if (localStorage.theme === "dark") return true;
    if (localStorage.theme === "light") return false;
    // Fallback to system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }
  }, [isDark]);

  return [isDark, setIsDark];
}
