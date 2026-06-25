"use client";

import { useTheme, Theme } from "@/context/ThemeContext";

export default function ThemeSwitcher() {
  const { theme, setTheme, t } = useTheme();

  const isDark = theme === "dark";

  const toggle = () => setTheme(isDark ? "light" : "dark");

  return (
    <button
      onClick={toggle}
      title={isDark ? "Switch to Light mode" : "Switch to Dark mode"}
      aria-label={isDark ? "Switch to Light mode" : "Switch to Dark mode"}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        backgroundColor: "transparent",
        border: `1.5px solid ${t.border}`,
        borderRadius: "20px",
        padding: "4px 10px 4px 6px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = t.accent;
        e.currentTarget.style.backgroundColor = `${t.accent}10`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = t.border;
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      {/* Track with sliding thumb */}
      <div style={{
        position: "relative",
        width: "36px",
        height: "20px",
        backgroundColor: isDark ? "#1e1b4b" : "#fde68a",
        borderRadius: "10px",
        border: `1.5px solid ${isDark ? "#4f46e5" : "#f59e0b"}`,
        transition: "all 0.3s ease",
        flexShrink: 0,
      }}>
        {/* Stars (dark mode) */}
        {isDark && (
          <>
            <span style={{
              position: "absolute", top: "2px", right: "5px",
              fontSize: "5px", color: "#a5b4fc", lineHeight: 1,
              transition: "opacity 0.3s ease",
            }}>★</span>
            <span style={{
              position: "absolute", top: "8px", right: "9px",
              fontSize: "4px", color: "#c7d2fe", lineHeight: 1,
              transition: "opacity 0.3s ease",
            }}>★</span>
          </>
        )}

        {/* Sun rays (light mode) */}
        {!isDark && (
          <span style={{
            position: "absolute", top: "1px", left: "5px",
            fontSize: "5px", color: "#f59e0b", lineHeight: 1,
            transition: "opacity 0.3s ease",
          }}>✦</span>
        )}

        {/* Sliding thumb */}
        <div style={{
          position: "absolute",
          top: "1px",
          left: isDark ? "1px" : "17px",
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          backgroundColor: isDark ? "#818cf8" : "#f59e0b",
          boxShadow: isDark
            ? "0 0 6px rgba(129,140,248,0.6)"
            : "0 0 8px rgba(245,158,11,0.7)",
          transition: "left 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "9px",
        }}>
          {isDark ? "🌙" : "☀️"}
        </div>
      </div>

      {/* Label */}
      <span style={{
        fontSize: "12px",
        fontWeight: 600,
        color: t.subtext,
        userSelect: "none",
        transition: "color 0.2s ease",
        minWidth: "30px",
      }}>
        {isDark ? "Dark" : "Light"}
      </span>
    </button>
  );
}