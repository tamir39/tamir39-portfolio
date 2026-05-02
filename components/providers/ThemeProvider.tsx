"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type Theme = "dark" | "light";

type Ctx = {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
};

const KEY = "tamir.theme";
const ThemeCtx = createContext<Ctx>({
  theme: "dark",
  toggle: () => {},
  setTheme: () => {},
});

export const useTheme = (): Ctx => useContext(ThemeCtx);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Read what the pre-paint script already wrote to <html data-theme="..."> so
  // the very first client render returns the user's chosen theme — keeps the
  // theme-aware backdrop from rendering the wrong image and swapping later.
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof document === "undefined") return "dark";
    const t = document.documentElement.dataset.theme as Theme | undefined;
    return t === "light" || t === "dark" ? t : "dark";
  });

  useEffect(() => {
    if (typeof document === "undefined") return;
    const current = document.documentElement.dataset.theme as Theme | undefined;
    if ((current === "light" || current === "dark") && current !== theme) {
      setThemeState(current);
    }
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    if (typeof document !== "undefined") {
      document.documentElement.dataset.theme = t;
    }
    try {
      localStorage.setItem(KEY, t);
    } catch {
      /* storage blocked */
    }
  }, []);

  const toggle = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return (
    <ThemeCtx.Provider value={{ theme, toggle, setTheme }}>
      {children}
    </ThemeCtx.Provider>
  );
}
