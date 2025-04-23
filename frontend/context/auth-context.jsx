"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check if user is logged in on initial load
  useEffect(() => {
    // Use try-catch to handle localStorage not being available during SSR
    try {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Login function
  const login = async (userData) => {
    try {
      const response = await fetch('http://localhost:5000/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
        }),
      });

      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server is not responding properly. Please check if the backend server is running.');
      }

      const data = await response.json();

      if (!response.ok) {
        // Use the error message from the backend if available
        throw new Error(data.error || 'Login failed');
      }
      
      // Store user data and token
      const user = {
        id: data.userId,
        name: data.name || data.email,
        email: data.email,
        isAdmin: data.role === 'admin',
        token: data.token,
      };

      setUser(user);
      try {
        localStorage.setItem('user', JSON.stringify(user));
        // Set a cookie for the middleware to check
        document.cookie = `user=${JSON.stringify(user)}; path=/`;
      } catch (error) {
        console.error('Error setting auth data:', error);
      }
      router.push('/home');
    } catch (error) {
      console.error('Login error:', error);
      // Provide more specific error messages
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to the server. Please check if the backend server is running.');
      }
      throw error;
    }
  };

  // Signup function
  const signup = (userData) => {
    // In a real app, you would send this data to your backend
    const user = {
      id: 1,
      name: userData.name || "New User",
      username: `@${userData.name?.toLowerCase().replace(/\s/g, "") || "newuser"}`,
      email: userData.email,
      isAdmin: userData.email === "admin@example.com",
      avatar: "/placeholder.svg?height=200&width=200",
      phone: userData.phone || "+1 (555) 123-4567",
      website: "example.com",
      bio: "New user on the platform.",
      location: "New York, NY",
      joinDate: new Date().toISOString().split("T")[0],
    }

    setUser(user)
    try {
      localStorage.setItem("user", JSON.stringify(user))
    } catch (error) {
      console.error("Error setting localStorage:", error)
    }
    router.push("/home")
  }

  // Logout function
  const logout = () => {
    setUser(null)
    try {
      localStorage.removeItem("user")
    } catch (error) {
      console.error("Error removing from localStorage:", error)
    }
    router.push("/")
  }

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user
  }

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

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    // Return a default object with empty functions to prevent destructuring errors
    return {
      user: null,
      loading: false,
      login: () => {},
      signup: () => {},
      logout: () => {},
      isAuthenticated: () => false,
    }
  }
  return context
}
