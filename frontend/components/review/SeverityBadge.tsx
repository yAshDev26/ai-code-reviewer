import Badge from "@/components/ui/Badge";

interface Props {
  severity: "critical" | "warning" | "suggestion";
}

export default function SeverityBadge({ severity }: Props) {
  return <Badge variant={severity} />;
}