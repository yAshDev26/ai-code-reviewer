"use client";

import { useTheme } from "@/context/ThemeContext";
import { colors } from "@/context/ThemeContext";
import { CSSProperties, ReactNode } from "react";

type Variant = "primary" | "danger" | "success" | "neutral" | "warning" | "outline";
type Size = "sm" | "md" | "lg";

interface Props {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  title?: string;
  type?: "button" | "submit";
  loading?: boolean;
}

const sizeStyles: Record<Size, CSSProperties> = {
  sm: { fontSize: "11px", padding: "4px 12px", borderRadius: "6px" },
  md: { fontSize: "13px", padding: "8px 18px", borderRadius: "8px" },
  lg: { fontSize: "14px", padding: "10px 22px", borderRadius: "8px" },
};

export default function Button({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  size = "md",
  fullWidth = false,
  title,
  type = "button",
  loading = false,
}: Props) {
  const { t } = useTheme();

  const variantStyles: Record<Variant, CSSProperties> = {
    primary: {
      backgroundColor: disabled ? t.border : t.accent,
      color: disabled ? t.subtext : "white",
      border: "none",
    },
     outline: {                          
      backgroundColor: "transparent",
      color: disabled ? t.subtext : t.accent,
      border: `1.5px solid ${disabled ? t.border : t.accent}`,
    },
    danger: {
      backgroundColor: colors.danger.bg,
      color: colors.danger.text,
      border: `1px solid ${colors.danger.border}`,
    },
    success: {
      backgroundColor: colors.success.bg,
      color: colors.success.text,
      border: `1.5px solid ${colors.success.border}`,
    },
    neutral: {
      backgroundColor: colors.neutral.bg,
      color: t.text,
      border: `1px solid ${t.border}`,
    },
    warning: {
      backgroundColor: "rgba(245,158,11,0.15)",
      color: "#f59e0b",
      border: "1.5px solid #f59e0b",
    },
  };

  const hoverBg: Record<Variant, string> = {
    primary: t.accentHover,
    outline: `${t.accent}15`, 
    danger: colors.danger.hoverBg,
    success: "rgba(34,197,94,0.20)",
    neutral: colors.neutral.hoverBg,
    warning: "rgba(245,158,11,0.25)",
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      e.currentTarget.style.backgroundColor = hoverBg[variant];
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      e.currentTarget.style.backgroundColor =
        variantStyles[variant].backgroundColor as string;
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      title={title}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        ...sizeStyles[size],
        ...variantStyles[variant],
        width: fullWidth ? "100%" : "auto",
        fontWeight: 600,
        cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled && !loading ? 0.6 : 1,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        transition: "background-color 0.15s ease, opacity 0.15s ease",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {loading && (
        <span style={{
          width: "12px", height: "12px",
          border: "2px solid currentColor",
          borderTopColor: "transparent",
          borderRadius: "50%",
          display: "inline-block",
          animation: "spin 0.7s linear infinite",
        }} />
      )}
      {children}
    </button>
  );
}