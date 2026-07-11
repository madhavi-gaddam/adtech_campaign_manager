import { useEffect, useState } from "react";

const storageKey = "adtech-theme";

function getStoredTheme() {
  try {
    const theme = localStorage.getItem(storageKey);
    return ["light", "dark", "system"].includes(theme) ? theme : "system";
  } catch {
    return "system";
  }
}

export function useTheme() {
  const [theme, setTheme] = useState(getStoredTheme);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      const isDark = theme === "dark" || (theme === "system" && media.matches);
      document.documentElement.classList.toggle("dark", isDark);
      document.documentElement.style.colorScheme = isDark ? "dark" : "light";
      setIsDark(isDark);
    };

    applyTheme();
    media.addEventListener("change", applyTheme);
    try {
      localStorage.setItem(storageKey, theme);
    } catch {
      // The selected theme still applies for this session.
    }
    return () => media.removeEventListener("change", applyTheme);
  }, [theme]);

  return { theme, setTheme, isDark };
}
