"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, User, Lock, Globe, Palette, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThemeToggle } from "@/components/theme-toggle"
import MobileNav from "@/components/mobile-nav"
import SidebarNav from "@/components/sidebar-nav"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import Navbar from "@/components/navbar"
import AuthCheck from "@/components/AuthCheck"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account")
  const { toast } = useToast()
  const { user, setUser, logout } = useAuth()

  // State for editable user fields
  const [form, setForm] = useState({
    name: user?.name || user?.fullName || "",
    username: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || user?.phoneNumber || "",
    avatar: user?.avatar || user?.profilePic || "/placeholder.svg?height=200&width=200",
    bio: user?.bio || "",
    password: ""
  })

  // Update form state when user changes
  useEffect(() => {
    setForm({
      name: user?.name || user?.fullName || "",
      username: user?.username || "",
      email: user?.email || "",
      phone: user?.phone || user?.phoneNumber || "",
      avatar: user?.avatar || user?.profilePic || "/placeholder.svg?height=200&width=200",
      password: ""
    })
  }, [user])

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setForm((prev) => ({ ...prev, [id]: value }))
  }

  const handleSaveChanges = async () => {
    if (!user?.id) return
    try {
      const updateData = {
        fullName: form.name,
        email: form.email,
        phoneNumber: form.phone,
        profilePic: form.avatar
      };

      // Only include password in update if it's not empty
      if (form.password) {
        updateData.password = form.password;
      }

      const res = await fetch(`http://localhost:5000/api/user/update/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData)
      });

      if (!res.ok) throw new Error("Failed to update user");
      
      toast({
        title: "Changes Saved",
        description: "Your settings have been updated successfully."
      });

      // Update user in context
      setUser && setUser({ 
        ...user, 
        name: form.name, 
        fullName: form.name,
        email: form.email, 
        phone: form.phone, 
        phoneNumber: form.phone,
        avatar: form.avatar,
        profilePic: form.avatar,
        bio: form.bio 
      });

      // Clear password field after successful update
      setForm(prev => ({ ...prev, password: "" }));
    } catch (err) {
      toast({
        title: "Update Failed",
        description: err.message || "Could not update your settings.",
        variant: "destructive"
      });
    }
  }

  const handleDeleteAccount = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`http://localhost:5000/api/user/delete/${user.id}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed to delete account");
      toast({
        title: "Account Deleted",
        description: "Your account has been deleted successfully."
      });
      await logout();
    } catch (err) {
      toast({
        title: "Delete Failed",
        description: err.message || "Could not delete your account.",
        variant: "destructive"
      });
    }
  }

  return (
    <>
      <AuthCheck />
      <Navbar />
      <div className="flex min-h-screen">
        {/* Left Sidebar - Hidden on mobile */}
        <SidebarNav className="hidden lg:block" />

        {/* Main Content */}
        <main className="flex-1 border-x pb-20 lg:pb-0">
          <div className="container max-w-4xl px-4 py-8">
            <div className="mb-6 flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/">
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>

            <div className="mb-6">
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground">Manage your account settings and preferences</p>
            </div>

            <div className="flex flex-col gap-8 md:flex-row">
              {/* Settings Navigation */}
              <div className="md:w-64">
                <Tabs
                  defaultValue="account"
                  orientation="vertical"
                  onValueChange={setActiveTab}
                  className="hidden md:block"
                >
                  <TabsList className="flex h-auto w-full flex-col items-start justify-start bg-transparent p-0">
                    <TabsTrigger
                      value="account"
                      className="justify-start rounded-none border-l-2 border-transparent px-3 py-2 text-left data-[state=active]:border-primary"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Account
                    </TabsTrigger>
                    <TabsTrigger
                      value="appearance"
                      className="justify-start rounded-none border-l-2 border-transparent px-3 py-2 text-left data-[state=active]:border-primary"
                    >
                      <Palette className="mr-2 h-4 w-4" />
                      Appearance
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                {/* Mobile Tabs */}
                <div className="mb-6 md:hidden">
                  <Select value={activeTab} onValueChange={setActiveTab}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select setting" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="account">Account</SelectItem>
                      <SelectItem value="appearance">Appearance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="mt-auto hidden md:block">
                  {/* Removing logout button */}
                </div>
              </div>

              {/* Settings Content */}
              <div className="flex-1">
                {activeTab === "account" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Information</CardTitle>
                      <CardDescription>Update your account details and profile information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex flex-col items-center gap-4 sm:flex-row">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={form.avatar || "/placeholder.svg"} alt={form.name} />
                          <AvatarFallback>{form.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-2">
                          <Button variant="outline" size="sm" disabled>
                            Change Avatar
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive" disabled>
                            Remove Avatar
                          </Button>
                        </div>
                      </div>

                      <Separator />

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" value={form.name} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" value={form.email} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input id="phone" value={form.phone} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">New Password</Label>
                          <Input id="password" type="password" value={form.password} onChange={handleInputChange} placeholder="Leave blank to keep current password" />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2 items-end">
                      <div className="flex gap-2 w-full justify-end">
                        <Button variant="outline">Cancel</Button>
                        <Button onClick={handleSaveChanges}>Save Changes</Button>
                      </div>
                      <Button variant="destructive" className="w-full mt-4" onClick={handleDeleteAccount}>Delete Account</Button>
                    </CardFooter>
                  </Card>
                )}

                {activeTab === "appearance" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Appearance</CardTitle>
                      <CardDescription>Customize how FindIt looks for you</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium">Theme</h3>
                        <div className="flex items-center justify-between">
                          <Label>Dark Mode</Label>
                          <ThemeToggle />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Mobile Logout Button - Removing this section */}
            <div className="mt-8 md:hidden">
              {/* Removing logout button */}
            </div>
          </div>
        </main>

        {/* Mobile Navigation */}
        <MobileNav />
      </div>
    </>
  )
}
