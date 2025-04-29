"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export default function AdminAccess({ children }) {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    // Check if user has admin privileges
    if (!isAuthenticated()) {
      router.push("/admin")
      return
    }

    // For demo purposes, we'll check if email is admin@example.com
    if (user?.role === "Admin") {
      setHasAccess(true)
    } else {
      router.push("/admin")
    }

    setLoading(false)
  }, [user, router, isAuthenticated])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Loading...</h1>
          <p className="text-muted-foreground">Please wait while we check your access.</p>
        </div>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Admin Access Required</h1>
          <p className="text-muted-foreground">You need administrator privileges to access this page.</p>
        </div>
      </div>
    )
  }

  return children
}
