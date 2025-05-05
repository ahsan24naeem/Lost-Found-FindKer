"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export default function AuthCheck() {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated()) {
        console.log("User not authenticated, redirecting to login")
        router.replace("/login")
      }
    }
  }, [isAuthenticated, loading, router])

  // This component doesn't render anything
  return null
} 