"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, User, Bell, Lock, Globe, Palette, HelpCircle, LogOut } from "lucide-react"
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

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account")

  // Mock user data
  const user = {
    name: "John Doe",
    username: "johndoe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    avatar: "/placeholder.svg?height=200&width=200",
    bio: "Lost and found enthusiast. Helping people reconnect with their belongings since 2020.",
  }

  return (
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
                    value="notifications"
                    className="justify-start rounded-none border-l-2 border-transparent px-3 py-2 text-left data-[state=active]:border-primary"
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger
                    value="privacy"
                    className="justify-start rounded-none border-l-2 border-transparent px-3 py-2 text-left data-[state=active]:border-primary"
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Privacy & Security
                  </TabsTrigger>
                  <TabsTrigger
                    value="appearance"
                    className="justify-start rounded-none border-l-2 border-transparent px-3 py-2 text-left data-[state=active]:border-primary"
                  >
                    <Palette className="mr-2 h-4 w-4" />
                    Appearance
                  </TabsTrigger>
                  <TabsTrigger
                    value="language"
                    className="justify-start rounded-none border-l-2 border-transparent px-3 py-2 text-left data-[state=active]:border-primary"
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    Language & Region
                  </TabsTrigger>
                  <TabsTrigger
                    value="help"
                    className="justify-start rounded-none border-l-2 border-transparent px-3 py-2 text-left data-[state=active]:border-primary"
                  >
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Help & Support
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
                    <SelectItem value="notifications">Notifications</SelectItem>
                    <SelectItem value="privacy">Privacy & Security</SelectItem>
                    <SelectItem value="appearance">Appearance</SelectItem>
                    <SelectItem value="language">Language & Region</SelectItem>
                    <SelectItem value="help">Help & Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-auto hidden md:block">
                <Button variant="destructive" className="w-full">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </Button>
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
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm">
                          Change Avatar
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          Remove Avatar
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue={user.name} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" defaultValue={user.username} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={user.email} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" defaultValue={user.phone} />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Input id="bio" defaultValue={user.bio} />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Changes</Button>
                  </CardFooter>
                </Card>
              )}

              {activeTab === "notifications" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Manage how you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Email Notifications</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-matches">Item Matches</Label>
                          <Switch id="email-matches" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-comments">Comments on Your Posts</Label>
                          <Switch id="email-comments" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-messages">Direct Messages</Label>
                          <Switch id="email-messages" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-followers">New Followers</Label>
                          <Switch id="email-followers" />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Push Notifications</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="push-matches">Item Matches</Label>
                          <Switch id="push-matches" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="push-comments">Comments on Your Posts</Label>
                          <Switch id="push-comments" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="push-messages">Direct Messages</Label>
                          <Switch id="push-messages" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="push-followers">New Followers</Label>
                          <Switch id="push-followers" defaultChecked />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">SMS Notifications</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="sms-matches">Item Matches</Label>
                          <Switch id="sms-matches" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="sms-messages">Direct Messages</Label>
                          <Switch id="sms-messages" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="sms-claims">Item Claims</Label>
                          <Switch id="sms-claims" defaultChecked />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Changes</Button>
                  </CardFooter>
                </Card>
              )}

              {activeTab === "privacy" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy & Security</CardTitle>
                    <CardDescription>Manage your privacy settings and account security</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Privacy Settings</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="private-profile">Private Profile</Label>
                          <Switch id="private-profile" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="show-location">Show My Location</Label>
                          <Switch id="show-location" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="show-activity">Show My Activity Status</Label>
                          <Switch id="show-activity" defaultChecked />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Account Security</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                          <Switch id="two-factor" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input id="current-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input id="new-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input id="confirm-password" type="password" />
                        </div>
                        <Button className="mt-2" variant="outline">
                          Change Password
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Data & Privacy</h3>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          Download Your Data
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          Delete Search History
                        </Button>
                        <Button variant="destructive" className="w-full justify-start">
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </CardContent>
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

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Display</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="reduce-motion">Reduce Motion</Label>
                          <Switch id="reduce-motion" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="high-contrast">High Contrast</Label>
                          <Switch id="high-contrast" />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Feed Preferences</h3>
                      <div className="space-y-2">
                        <div className="space-y-2">
                          <Label htmlFor="default-view">Default View</Label>
                          <Select defaultValue="grid">
                            <SelectTrigger id="default-view">
                              <SelectValue placeholder="Select view" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="grid">Grid View</SelectItem>
                              <SelectItem value="list">List View</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="default-tab">Default Tab</Label>
                          <Select defaultValue="all">
                            <SelectTrigger id="default-tab">
                              <SelectValue placeholder="Select tab" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Items</SelectItem>
                              <SelectItem value="lost">Lost Items</SelectItem>
                              <SelectItem value="found">Found Items</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline">Reset to Default</Button>
                    <Button>Save Changes</Button>
                  </CardFooter>
                </Card>
              )}

              {activeTab === "language" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Language & Region</CardTitle>
                    <CardDescription>Manage your language and regional preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Language</h3>
                      <div className="space-y-2">
                        <Label htmlFor="language">Display Language</Label>
                        <Select defaultValue="en">
                          <SelectTrigger id="language">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="de">Deutsch</SelectItem>
                            <SelectItem value="zh">中文</SelectItem>
                            <SelectItem value="ja">日本語</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Region</h3>
                      <div className="space-y-2">
                        <Label htmlFor="region">Region</Label>
                        <Select defaultValue="us">
                          <SelectTrigger id="region">
                            <SelectValue placeholder="Select region" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="ca">Canada</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="au">Australia</SelectItem>
                            <SelectItem value="eu">European Union</SelectItem>
                            <SelectItem value="as">Asia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Format</h3>
                      <div className="space-y-2">
                        <div className="space-y-2">
                          <Label htmlFor="date-format">Date Format</Label>
                          <Select defaultValue="mdy">
                            <SelectTrigger id="date-format">
                              <SelectValue placeholder="Select date format" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                              <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                              <SelectItem value="ymd">YYYY/MM/DD</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="time-format">Time Format</Label>
                          <Select defaultValue="12h">
                            <SelectTrigger id="time-format">
                              <SelectValue placeholder="Select time format" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                              <SelectItem value="24h">24-hour</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Changes</Button>
                  </CardFooter>
                </Card>
              )}

              {activeTab === "help" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Help & Support</CardTitle>
                    <CardDescription>Get help and support for using FindIt</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Frequently Asked Questions</h3>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          How do I report a lost item?
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          How do I claim a found item?
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          How does the verification process work?
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          What should I do if I can't find my item?
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Contact Support</h3>
                      <div className="space-y-2">
                        <Label htmlFor="support-subject">Subject</Label>
                        <Input id="support-subject" placeholder="Enter subject" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="support-message">Message</Label>
                        <Input id="support-message" placeholder="Describe your issue" />
                      </div>
                      <Button>Submit Support Request</Button>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Legal</h3>
                      <div className="space-y-2">
                        <Button variant="link" className="h-auto p-0">
                          Terms of Service
                        </Button>
                        <Button variant="link" className="h-auto p-0">
                          Privacy Policy
                        </Button>
                        <Button variant="link" className="h-auto p-0">
                          Cookie Policy
                        </Button>
                        <Button variant="link" className="h-auto p-0">
                          Community Guidelines
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Mobile Logout Button */}
          <div className="mt-8 md:hidden">
            <Button variant="destructive" className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </div>
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  )
}
