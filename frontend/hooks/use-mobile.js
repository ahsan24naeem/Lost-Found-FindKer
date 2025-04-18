"use client"

import { useState, useEffect } from "react"

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if window is defined (browser environment)
    if (typeof window !== "undefined") {
      const checkIsMobile = () => {
        setIsMobile(window.innerWidth < 1024) // Consider screens smaller than 1024px as mobile
      }

      // Initial check
      checkIsMobile()

      // Add event listener for window resize
      window.addEventListener("resize", checkIsMobile)

      // Clean up event listener
      return () => window.removeEventListener("resize", checkIsMobile)
    }
  }, [])

  return isMobile
}
