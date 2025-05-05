import { Badge } from "@/components/ui/badge"

export default function StatusBadge({ status }) {
  if (!status) return null

  const statusMap = {
    found: { variant: "default", label: "Found" },
    lost: { variant: "destructive", label: "Lost" },
    retrieved: { variant: "retrieved", label: "Retrieved" },
    pending: { variant: "pending", label: "Pending" }
  }

  const { variant, label } = statusMap[status.toLowerCase()] || { variant: "default", label: status }
  
  return <Badge variant={variant}>{label}</Badge>
}