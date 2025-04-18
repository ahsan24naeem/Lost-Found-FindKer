"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Cookies from 'js-cookie'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check if user is logged in on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token") || Cookies.get('token')
      if (token) {
        try {
          // You might want to validate the token with the backend here
          // For now, we'll just set a basic user state
          setUser({
            isAuthenticated: true,
            token: token
          })
        } catch (error) {
          console.error("Error initializing auth:", error)
          localStorage.removeItem("token")
          Cookies.remove('token')
        }
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  // Login function
  const login = (userData) => {
    const userState = {
      ...userData,
      isAuthenticated: true,
      token: userData.token
    }
    setUser(userState)
    localStorage.setItem("token", userData.token)
    Cookies.set('token', userData.token, { expires: 7 }) // Expires in 7 days
    router.push("/home")
  }

  // Signup function
  const signup = (userData) => {
    const userState = {
      ...userData,
      isAuthenticated: true,
      token: userData.token
    }
    setUser(userState)
    localStorage.setItem("token", userData.token)
    Cookies.set('token', userData.token, { expires: 7 }) // Expires in 7 days
    router.push("/home")
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem("token")
    Cookies.remove('token')
    setUser(null)
    router.push("/")
  }

  // Check if user is authenticated
  const isAuthenticated = () => {
    if (typeof window === "undefined") {
      return false; // Return false if running on the server
    }
  
    const token = localStorage.getItem("token") || Cookies.get("token");
    return !!user?.isAuthenticated && !!token;
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
