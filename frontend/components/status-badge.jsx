import { Badge } from "@/components/ui/badge"

export default function StatusBadge({ status }) {
  if (!status) return null

  const statusMap = {
    active: { variant: "outline", label: "Active" },
    found: { variant: "default", label: "Found" },
    lost: { variant: "destructive", label: "Lost" },
    claimed: { variant: "success", label: "Claimed" },
    resolved: { variant: "secondary", label: "Resolved" },
  }

  const { variant, label } = statusMap[status.toLowerCase()] || statusMap.active

  return <Badge variant={variant}>{label}</Badge>
}
