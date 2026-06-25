"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Theme = "dark" | "light";

export const themes = {
  dark: {
    name: "Dark",
    bg: "#0d1117",
    surface: "#161b22",
    border: "#30363d",
    text: "#ffffff",
    subtext: "#8b949e",
    accent: "#7c3aed",
    accentHover: "#6d28d9",
    editorTheme: "vs-dark",
    codeBg: "#0d1117",
  },
  light: {
    name: "Light",
    bg: "#f6f8fa",
    surface: "#ffffff",
    border: "#d0d7de",
    text: "#1f2328",
    subtext: "#57606a",
    accent: "#7c3aed",
    accentHover: "#6d28d9",
    editorTheme: "vs-light",
    codeBg: "#f6f8fa",
  },
};

// ── Global semantic color tokens (theme-independent) ─────────────────────────
export const colors = {
  critical: {
    text:   "#f87171",
    bg:     "rgba(239,68,68,0.10)",
    border: "#ef4444",
    solid:  "#dc2626",
  },
  warning: {
    text:   "#f59e0b",
    bg:     "rgba(245,158,11,0.10)",
    border: "#f59e0b",
    solid:  "#d97706",
  },
  suggestion: {
    text:   "#22c55e",
    bg:     "rgba(34,197,94,0.10)",
    border: "#22c55e",
    solid:  "#16a34a",
  },
  danger: {
    text:    "#f87171",
    bg:      "rgba(239,68,68,0.10)",
    border:  "#ef4444",
    hoverBg: "rgba(239,68,68,0.20)",
  },
  success: {
    text:   "#22c55e",
    bg:     "rgba(34,197,94,0.10)",
    border: "#22c55e",
  },
  neutral: {
    text:    "#8b949e",
    bg:      "rgba(139,148,158,0.10)",
    border:  "#30363d",
    hoverBg: "rgba(139,148,158,0.20)",
  },
};

interface ThemeContextType {
  theme: Theme;
  t: typeof themes.dark;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  t: themes.dark,
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("theme-dark", "theme-light");
    if (theme !== "dark") {
      html.classList.add(`theme-${theme}`);
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, t: themes[theme], setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);