import { useTheme } from "@/context/ThemeContext";
import { ReactNode } from "react";

interface Props {
  icon:         string;
  title:        string;
  description?: ReactNode;
  children?:    ReactNode; // optional action slot
}

export default function EmptyState({ icon, title, description, children }: Props) {
  const { t } = useTheme();

  return (
    <div style={{
      height:         "100%",
      minHeight:      "300px",
      display:        "flex",
      flexDirection:  "column",
      alignItems:     "center",
      justifyContent: "center",
      gap:            "12px",
      textAlign:      "center",
      padding:        "32px",
      color:          t.subtext,
    }}>
      <span style={{ fontSize: "40px", lineHeight: 1 }}>{icon}</span>
      <p style={{
        margin:     0,
        fontWeight: 600,
        fontSize:   "14px",
        color:      t.text,
      }}>
        {title}
      </p>
      {description && (
        <p style={{
          margin:     0,
          fontSize:   "13px",
          color:      t.subtext,
          lineHeight: 1.6,
          maxWidth:   "320px",
        }}>
          {description}
        </p>
      )}
      {children && (
        <div style={{ marginTop: "4px" }}>
          {children}
        </div>
      )}
    </div>
  );
}