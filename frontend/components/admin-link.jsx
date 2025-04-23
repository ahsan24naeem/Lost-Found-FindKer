"use client"

import Link from "next/link"
import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"

export default function AdminLink() {
  const { user } = useAuth()

  // Only show admin link if user is an admin (in a real app, this would check user roles)
  // For demo purposes, we'll assume all logged-in users can access admin
  if (!user) return null

  return (
    <Button variant="ghost" size="sm" asChild className="w-full justify-start">
      <Link href="/admin">
        <Shield className="mr-2 h-4 w-4" />
        Admin Panel
      </Link>
    </Button>
  )
}
