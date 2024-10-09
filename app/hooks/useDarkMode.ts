import { useEffect, useState } from "react";

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(prefersDarkMode.matches);

    const handleDarkModeChange = (event: MediaQueryListEvent) => {
      setIsDarkMode(event.matches);
    };
    prefersDarkMode.addEventListener("change", handleDarkModeChange);
    return () => {
      prefersDarkMode.removeEventListener("change", handleDarkModeChange);
    };
  }, []);

  return isDarkMode;
};
