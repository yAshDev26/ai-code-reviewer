type BadgeVariant = "critical" | "warning" | "suggestion" | "neutral";

interface Props {
  variant: BadgeVariant;
  label?: string;
}

const config = {
  critical:   { label: "🔴 Critical",   color: "#f87171", bg: "rgba(239,68,68,0.10)",  border: "#ef4444" },
  warning:    { label: "🟡 Warning",    color: "#f59e0b", bg: "rgba(245,158,11,0.10)", border: "#f59e0b" },
  suggestion: { label: "🟢 Suggestion", color: "#22c55e", bg: "rgba(34,197,94,0.10)",  border: "#22c55e" },
  neutral:    { label: "⚪ Info",        color: "#8b949e", bg: "rgba(139,148,158,0.10)", border: "#8b949e" },
};

export default function Badge({ variant, label }: Props) {
  const { color, bg, border, label: defaultLabel } = config[variant];
  return (
    <span style={{
      fontSize: "12px",
      fontWeight: 600,
      padding: "4px 12px",
      borderRadius: "9999px",
      color,
      backgroundColor: bg,
      border: `1.5px solid ${border}`,
      display: "inline-flex",
      alignItems: "center",
      gap: "4px",
      whiteSpace: "nowrap",
    }}>
      {label ?? defaultLabel}
    </span>
  );
}