import { useTheme, colors } from "@/context/ThemeContext";

interface Props {
  score: number;
  size?: number;
}

function getScoreToken(score: number) {
  if (score >= 8) return colors.suggestion;
  if (score >= 5) return colors.warning;
  return colors.critical;
}

export default function ScoreDial({ score, size = 72 }: Props) {
  const { t } = useTheme();
  const token = getScoreToken(score);

  const fontSize      = Math.round(size * 0.30);
  const subFontSize   = Math.round(size * 0.14);
  const borderWidth   = Math.round(size * 0.04);

  return (
    <div style={{
      width:           size,
      height:          size,
      borderRadius:    "50%",
      border:          `${borderWidth}px solid ${token.border}`,
      backgroundColor: token.bg,
      display:         "flex",
      flexDirection:   "column",
      alignItems:      "center",
      justifyContent:  "center",
      flexShrink:      0,
      transition:      "border-color 0.3s ease, background-color 0.3s ease",
    }}>
      <span style={{
        fontSize,
        fontWeight: 700,
        color:      token.text,
        lineHeight: 1,
      }}>
        {score}
      </span>
      <span style={{
        fontSize:   subFontSize,
        color:      t.subtext,
        marginTop:  2,
      }}>
        /10
      </span>
    </div>
  );
}