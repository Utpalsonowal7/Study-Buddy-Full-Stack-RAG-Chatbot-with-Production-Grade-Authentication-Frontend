import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const getSystemTheme = (): Theme => {
     return window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
};

export function useTheme() {
     const [theme, setThemeState] = useState<Theme>(() => {
          const savedTheme = localStorage.getItem("theme");

          return savedTheme === "light" || savedTheme === "dark"
               ? savedTheme
               : getSystemTheme();
     });

     useEffect(() => {
          document.documentElement.classList.toggle("dark", theme === "dark");
          localStorage.setItem("theme", theme);
     }, [theme]);

     const setTheme = (newTheme: Theme) => {
          setThemeState(newTheme);
     };

     return {
          theme,
          setTheme,
     };
}
