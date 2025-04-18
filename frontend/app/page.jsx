"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export default function AuthPage() {
  const { login, signup } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("login")
  const [showPassword, setShowPassword] = useState(false)

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  // Signup form state
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleLoginChange = (e) => {
    const { name, value } = e.target
    setLoginData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSignupChange = (e) => {
    const { name, value } = e.target
    setSignupData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!loginData.email || !loginData.password) {
        toast({
            title: "Error",
            description: "Please fill in all fields",
            variant: "destructive",
        });
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: loginData.email,
                password: loginData.password,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }

        // Store the token in localStorage
        localStorage.setItem('token', data.token);

        // Update auth context with user data
        login({
            id: data.userId,
            email: loginData.email,
            role: data.role,
            token: data.token,
        });

        toast({
            title: "Success",
            description: "You have been logged in successfully",
        });

        // Redirect to the home page
        router.push('/home');
    } catch (error) {
        console.error('Login error:', error);
        toast({
            title: "Error",
            description: error.message || "Failed to connect to server. Please try again later.",
            variant: "destructive",
        });
    }
};

  const handleSignupSubmit = async (e) => {
    e.preventDefault()

    // Basic validation
    if (!signupData.name || !signupData.email || !signupData.password || !signupData.confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch('http://localhost:5000/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: signupData.name,
          email: signupData.email,
          password: signupData.password,
          phoneNumber: "",
          gender: "",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      toast({
        title: "Success",
        description: "Your account has been created successfully",
      });

      // Switch to login tab after successful registration
      setActiveTab("login");
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to connect to server. Please try again later.",
        variant: "destructive",
      });
    }
  }

  const handleGuestLogin = () => {
    login({
      id: 999,
      name: "Guest User",
      email: "guest@example.com",
    })

    toast({
      title: "Guest Access",
      description: "You are now browsing as a guest",
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/20 to-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary">FindIt</h1>
          <p className="text-muted-foreground mt-2">Lost something? Find it here.</p>
        </div>

        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <form onSubmit={handleLoginSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password">Password</Label>
                      <Button
                        variant="link"
                        className="p-0 h-auto text-xs"
                        onClick={() =>
                          toast({
                            title: "Password Reset",
                            description: "This feature would send a password reset email in a real application.",
                          })
                        }
                      >
                        Forgot password?
                      </Button>
                    </div>
                    <div className="relative">
                      <Input
                        id="login-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={loginData.password}
                        onChange={handleLoginChange}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">Toggle password visibility</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                  <Button type="button" variant="outline" className="w-full" onClick={handleGuestLogin}>
                    Continue as Guest
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>Enter your information to create an account</CardDescription>
              </CardHeader>
              <form onSubmit={handleSignupSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      name="name"
                      placeholder="John Doe"
                      value={signupData.name}
                      onChange={handleSignupChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      value={signupData.email}
                      onChange={handleSignupChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={signupData.password}
                        onChange={handleSignupChange}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">Toggle password visibility</span>
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                    <Input
                      id="signup-confirm-password"
                      name="confirmPassword"
                      type="password"
                      value={signupData.confirmPassword}
                      onChange={handleSignupChange}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  <Button type="submit" className="w-full">
                    Sign Up
                  </Button>
                  <Button type="button" variant="outline" className="w-full" onClick={handleGuestLogin}>
                    Continue as Guest
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
