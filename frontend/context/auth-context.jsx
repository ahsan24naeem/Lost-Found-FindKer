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
    const checkAuth = async () => {
      try {
        // Check localStorage first
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setLoading(false);
          return;
        }

        // If no stored user, verify with backend
        const res = await fetch('http://localhost:5000/api/user/verify', {
          method: 'GET',
          credentials: 'include',
        });
        
        if (!res.ok) {
          setUser(null);
          localStorage.removeItem('user');
          setLoading(false);
          return;
        }

        const data = await res.json();
        const userData = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (err) {
        setUser(null);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      // Set user state and store in localStorage
      const user = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        avatar: data.user.avatar,
        creationDate: data.user.creationDate,
        gender: data.user.gender,
        phoneNumber: data.user.phoneNumber
      };
      
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Redirect based on role
      if (data.user.role === "Admin") {
        router.push("/admin");
      } else {
        router.push("/home");
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Signup function
  const signup = async (userData) => {
    try {
      const response = await fetch('http://localhost:5000/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: userData.name,
          email: userData.email,
          password: userData.password,
          phoneNumber: userData.phoneNumber,
          gender: userData.gender,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Store user data
      const user = {
        id: data.userId,
        name: userData.name,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        gender: userData.gender,
        isAdmin: false,
        avatar: "/placeholder.svg?height=200&width=200",
        joinDate: userData.creationDate,
      };

      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      router.push("/home");
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await fetch('http://localhost:5000/api/user/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    if (loading) return false;
    return !!user;
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

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
