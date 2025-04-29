"use client"

import Link from "next/link"
import { useState } from "react"
import { Settings, MapPin, Calendar, Mail, Phone, Globe, MessageCircle, User, Package } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import MobileNav from "@/components/mobile-nav"
import SidebarNav from "@/components/sidebar-nav"
import FeedItemCard from "@/components/feed-item-card"
import Navbar from "@/components/navbar"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/hooks/use-toast"
import AuthCheck from "@/components/AuthCheck"

export default function ProfilePage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("posts")

  // Mock user data
  const userData = user || {
    id: 1,
    name: "John Doe",
    username: "@johndoe",
    avatar: "/placeholder.svg?height=200&width=200",
    coverImage: "/placeholder.svg?height=400&width=1200",
    bio: "Lost and found enthusiast. Helping people reconnect with their belongings since 2020.",
    location: "New York, NY",
    joinDate: "2020-01-15",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    website: "johndoe.com",
    followers: 245,
    following: 123,
    posts: 24,
    isFollowing: false,
  }

  // Mock posts data
  const posts = [
    {
      id: 1,
      type: "lost",
      title: "iPhone 13 Pro",
      category: "Electronics",
      location: "Central Park, New York",
      date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      images: ["/placeholder.svg?height=400&width=600"],
      description: "Lost my iPhone 13 Pro with a blue case near the fountain. Please help!",
      user: {
        name: userData.name,
        avatar: userData.avatar,
      },
      likes: 24,
      comments: 8,
      shares: 3,
      isLiked: false,
      isSaved: false,
      contactInfo: {
        email: userData.email,
        phone: userData.phone,
      },
      verifyCount: 7,
      flagCount: 0,
    },
    {
      id: 2,
      type: "found",
      title: "Gold Necklace",
      category: "Jewelry",
      location: "Beach Boardwalk",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
      images: ["/placeholder.svg?height=400&width=600"],
      description: "Found this beautiful gold necklace with a heart pendant at the beach. Looking for the owner.",
      user: {
        name: userData.name,
        avatar: userData.avatar,
      },
      likes: 32,
      comments: 12,
      shares: 5,
      isLiked: true,
      isSaved: false,
      contactInfo: {
        email: userData.email,
        phone: userData.phone,
      },
      verifyCount: 15,
      flagCount: 1,
    },
    {
      id: 3,
      type: "lost",
      title: "Car Keys with Red Keychain",
      category: "Keys",
      location: "Shopping Mall Parking",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
      images: ["/placeholder.svg?height=400&width=600"],
      description: "Lost my car keys with a distinctive red keychain. Last seen in the mall parking lot.",
      user: {
        name: userData.name,
        avatar: userData.avatar,
      },
      likes: 27,
      comments: 9,
      shares: 4,
      isLiked: true,
      isSaved: false,
      contactInfo: {
        email: userData.email,
        phone: userData.phone,
      },
      verifyCount: 5,
      flagCount: 0,
    },
  ]

  // Activity data
  const activity = [
    {
      id: 1,
      type: "comment",
      content: "Commented on Sarah's post: 'I think I saw something similar at the park yesterday'",
      date: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    },
    {
      id: 2,
      type: "post",
      content: "Posted a new lost item: 'iPhone 13 Pro'",
      date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
    {
      id: 3,
      type: "claim",
      content: "Successfully claimed a found item: 'Blue Backpack'",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    },
  ]

  return (
    <>
      <AuthCheck />
      <div className="flex min-h-screen">
        {/* Left Sidebar - Hidden on mobile */}
        <SidebarNav className="hidden lg:block" />

        {/* Main Content */}
        <main className="flex-1 border-x pb-20 lg:pb-0">
          <Navbar />
          {/* Cover Image */}
          <div className="relative h-48 w-full overflow-hidden sm:h-64 md:h-80">
            <img src={userData.coverImage || "/placeholder.svg"} alt="Cover" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>

          {/* Profile Info */}
          <div className="container max-w-4xl px-4">
            <div className="relative -mt-20 mb-6 flex flex-col items-center sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col items-center sm:flex-row sm:items-end">
                <Avatar className="h-32 w-32 border-4 border-background">
                  <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                  <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="mt-4 text-center sm:ml-4 sm:text-left">
                  <h1 className="text-2xl font-bold">{userData.name}</h1>
                  <p className="text-muted-foreground">{userData.username}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2 sm:mt-0">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/settings">
                    <Settings className="mr-1 h-4 w-4" />
                    Edit Profile
                  </Link>
                </Button>
              </div>
            </div>

            <div className="mb-6 grid gap-6 sm:grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-bold">{userData.posts}</div>
                <div className="text-sm text-muted-foreground">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">12</div>
                <div className="text-sm text-muted-foreground">Items Found</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">8</div>
                <div className="text-sm text-muted-foreground">Items Claimed</div>
              </div>
            </div>

            <div className="mb-6">
              <p className="mb-4">{userData.bio}</p>
              <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  {userData.location}
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Joined {new Date(userData.joinDate).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  {userData.email}
                </div>
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4" />
                  {userData.phone}
                </div>
                <div className="flex items-center sm:col-span-2">
                  <Globe className="mr-2 h-4 w-4" />
                  <a
                    href={`https://${userData.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary"
                  >
                    {userData.website}
                  </a>
                </div>
              </div>
            </div>

            <Separator className="mb-6" />

            <Tabs defaultValue="posts" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="posts">
                  <User className="mr-2 h-4 w-4" />
                  My Posted Items
                </TabsTrigger>
                <TabsTrigger value="activity">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Activity
                </TabsTrigger>
              </TabsList>

              <TabsContent value="posts" className="mt-6 space-y-6">
                {posts.map((post) => (
                  <FeedItemCard key={post.id} item={post} />
                ))}
              </TabsContent>

              <TabsContent value="activity" className="mt-6">
                <div className="space-y-4">
                  {activity.map((item) => (
                    <div key={item.id} className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        {item.type === "comment" && <MessageCircle className="h-5 w-5" />}
                        {item.type === "post" && <Package className="h-5 w-5" />}
                        {item.type === "claim" && <Package className="h-5 w-5" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{item.content}</p>
                        <p className="text-xs text-muted-foreground">{new Date(item.date).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>

        {/* Mobile Navigation */}
        <MobileNav />
      </div>
    </>
  )
}
