"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export default function AuthCheck() {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    const checkAuth = async () => {
      if (!loading) {
        const auth = isAuthenticated()
        if (!auth) {
          console.log("User not authenticated, redirecting to login")
          router.replace("/login")
          return
        }
      }
    }

    // Check auth immediately
    checkAuth()

    // Set up an interval to check auth every minute
    const interval = setInterval(checkAuth, 60000)

    // Cleanup interval on unmount
    return () => clearInterval(interval)
  }, [isAuthenticated, loading, router])

  // This component doesn't render anything
  return null
} 