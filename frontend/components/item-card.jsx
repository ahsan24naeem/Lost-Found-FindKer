"use client"

import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader } from "@/components/ui/card"
import { useState } from "react"

export default function ItemCard({ item, type }) {
  const [showContactInfo, setShowContactInfo] = useState(false)
  const itemDate = new Date(item.date)
  const timeAgo = formatDistanceToNow(itemDate, { addSuffix: true })

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={item.image || "/placeholder.svg"}
          alt={item.title}
          className="h-full w-full object-cover transition-all hover:scale-105"
        />
      </div>
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div>\
            <Badge variant={type === "lost\" ? \"destructive\" : \"default\"}>{type === \"lost\" ? \"Lost
