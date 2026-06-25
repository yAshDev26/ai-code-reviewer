import { useTheme } from "@/context/ThemeContext";

interface Props {
  size?:  number;
  color?: string;
}

export default function Spinner({ size = 48, color }: Props) {
  const { t } = useTheme();

  const borderWidth = Math.max(2, Math.round(size * 0.06));

  return (
    <div style={{
      width:           size,
      height:          size,
      border:          `${borderWidth}px solid ${color ?? t.accent}`,
      borderTopColor:  "transparent",
      borderRadius:    "50%",
      animation:       "spin 0.7s linear infinite",
      flexShrink:      0,
    }} />
  );
}