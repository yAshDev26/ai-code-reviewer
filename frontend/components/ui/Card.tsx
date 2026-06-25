"use client";

import { useTheme } from "@/context/ThemeContext";
import { ReactNode, CSSProperties } from "react";

interface Props {
  children: ReactNode;
  padding?: string;
  style?: CSSProperties;
  hoverable?: boolean;
  onClick?: () => void;
}

export default function Card({
  children,
  padding = "20px",
  style,
  hoverable = false,
  onClick,
}: Props) {
  const { t } = useTheme();

  return (
    <div
      onClick={onClick}
      onMouseEnter={(e) => {
        if (hoverable)
          (e.currentTarget as HTMLDivElement).style.borderColor = t.accent;
      }}
      onMouseLeave={(e) => {
        if (hoverable)
          (e.currentTarget as HTMLDivElement).style.borderColor = t.border;
      }}
      style={{
        backgroundColor: t.surface,
        border: `1px solid ${t.border}`,
        borderRadius: "14px",
        padding,
        transition: "border-color 0.15s ease",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}