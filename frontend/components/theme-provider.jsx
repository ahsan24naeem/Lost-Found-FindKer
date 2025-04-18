"use client"

import { createContext, useContext, useEffect, useState } from "react"

const ThemeProviderContext = createContext({
  theme: "light",
  setTheme: (theme) => {},
})

export function ThemeProvider({ children, defaultTheme = "light", storageKey = "theme", ...props }) {
  const [theme, setTheme] = useState(defaultTheme)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
  }, [theme])

  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey)
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      // Check for system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setTheme(prefersDark ? "dark" : "light")
    }
  }, [storageKey])

  const value = {
    theme,
    setTheme: (newTheme) => {
      localStorage.setItem(storageKey, newTheme)
      setTheme(newTheme)
    },
  }

  return (
    <ThemeProviderContext.Provider value={value} {...props}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
