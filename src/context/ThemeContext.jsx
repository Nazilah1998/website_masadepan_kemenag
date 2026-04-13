"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

const ThemeContext = createContext(null);

const STORAGE_KEY = "site-theme";
const DEFAULT_THEME = "light";

const themeListeners = new Set();

function emitThemeChange() {
  themeListeners.forEach((listener) => listener());
}

function getThemeSnapshot() {
  if (typeof window === "undefined") {
    return DEFAULT_THEME;
  }

  const savedTheme = window.localStorage.getItem(STORAGE_KEY);

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getThemeServerSnapshot() {
  return DEFAULT_THEME;
}

function subscribeTheme(listener) {
  themeListeners.add(listener);

  if (typeof window === "undefined") {
    return () => {
      themeListeners.delete(listener);
    };
  }

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const onStorage = (event) => {
    if (event.key === STORAGE_KEY) {
      listener();
    }
  };

  const onMediaChange = () => {
    const savedTheme = window.localStorage.getItem(STORAGE_KEY);

    if (!savedTheme) {
      listener();
    }
  };

  window.addEventListener("storage", onStorage);
  mediaQuery.addEventListener("change", onMediaChange);

  return () => {
    themeListeners.delete(listener);
    window.removeEventListener("storage", onStorage);
    mediaQuery.removeEventListener("change", onMediaChange);
  };
}

export function ThemeProvider({ children }) {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getThemeServerSnapshot,
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
  }, [theme]);

  const setTheme = (nextTheme) => {
    if (typeof window === "undefined") return;
    if (nextTheme !== "light" && nextTheme !== "dark") return;

    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    emitThemeChange();
  };

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === "dark",
      setTheme,
      toggleTheme: () =>
        setTheme(theme === "dark" ? "light" : "dark"),
    }),
    [theme],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme harus dipakai di dalam ThemeProvider");
  }

  return context;
}