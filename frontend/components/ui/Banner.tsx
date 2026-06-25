"use client";

import { ReactNode } from "react";
import Button from "./Button";

type BannerVariant = "warning" | "danger" | "success" | "info";

interface BannerAction {
  label: string;
  onClick: () => void;
}

interface Props {
  variant: BannerVariant;
  title: string;
  description?: ReactNode;
  icon?: string;
  action?: BannerAction;
}

const variantConfig = {
  warning: {
    bg: "rgba(245,158,11,0.10)",
    border: "#f59e0b",
    titleColor: "#f59e0b",
    descColor: "#d97706",
    iconBg: "rgba(245,158,11,0.15)",
    iconBorder: "#f59e0b",
  },
  danger: {
    bg: "rgba(239,68,68,0.10)",
    border: "#ef4444",
    titleColor: "#f87171",
    descColor: "#fca5a5",
    iconBg: "rgba(239,68,68,0.15)",
    iconBorder: "#ef4444",
  },
  success: {
    bg: "rgba(34,197,94,0.10)",
    border: "#22c55e",
    titleColor: "#22c55e",
    descColor: "#16a34a",
    iconBg: "rgba(34,197,94,0.15)",
    iconBorder: "#22c55e",
  },
  info: {
    bg: "rgba(124,58,237,0.10)",
    border: "#7c3aed",
    titleColor: "#a78bfa",
    descColor: "#7c3aed",
    iconBg: "rgba(124,58,237,0.15)",
    iconBorder: "#7c3aed",
  },
};

export default function Banner({ variant, title, description, icon, action }: Props) {
  const config = variantConfig[variant];

  return (
    <div style={{
      backgroundColor: config.bg,
      border: `1.5px solid ${config.border}`,
      borderRadius: "12px",
      padding: "12px 16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "12px",
      animation: "slideDown 0.2s ease-out",
    }}>
      {/* Left */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {icon && (
          <div style={{
            width: "32px", height: "32px",
            backgroundColor: config.iconBg,
            border: `1px solid ${config.iconBorder}`,
            borderRadius: "8px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "16px", flexShrink: 0,
          }}>
            {icon}
          </div>
        )}
        <div>
          <p style={{ margin: 0, fontSize: "12px", fontWeight: 700, color: config.titleColor }}>
            {title}
          </p>
          {description && (
            <p style={{ margin: "3px 0 0 0", fontSize: "11px", color: config.descColor, lineHeight: 1.5 }}>
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Action */}
      {action && (
        <Button variant={variant === "danger" ? "danger" : variant === "success" ? "success" : "warning"} size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}