"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
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
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    setLoading(true)
    fetch(`http://localhost:5000/api/user/items/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setPosts(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(err => {
        setPosts([])
        setLoading(false)
      })
  }, [user])

  // Use user directly for profile info
  const userData = user || {}

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
            <img 
              src={userData.coverImage || "/grass.jpg"} 
              alt="Cover" 
              className="absolute h-full w-full object-cover"
              onError={(e) => {
                console.error('Image failed to load', e.target.src);
                e.target.src = '/grass.jpg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
          {/* Profile Info */}
          <div className="container max-w-4xl px-4">
            <div className="relative -mt-20 mb-6 flex flex-col items-center sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col items-center sm:flex-row sm:items-end">
                <Avatar className="h-32 w-32 border-4 border-background">
                  <AvatarFallback>{(userData.name || userData.fullName) ? (userData.name || userData.fullName).charAt(0) : "😀"}</AvatarFallback>
                </Avatar>
                <div className="mt-4 text-center sm:ml-4 sm:text-left">
                  <h1 className="text-2xl font-bold">{userData.name || userData.fullName || "User"}</h1>
                  <p className="text-muted-foreground">{userData.username && `@${userData.username}`}</p>
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
                <div className="text-2xl font-bold">{posts.length}</div>
                <div className="text-sm text-muted-foreground">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">-</div>
                <div className="text-sm text-muted-foreground">Items Found</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">-</div>
                <div className="text-sm text-muted-foreground">Items Claimed</div>
              </div>
            </div>

            <div className="mb-6">
              <p className="mb-4">{userData.bio || ""}</p>
              <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Joined {userData.joinDate ? new Date(userData.joinDate).toLocaleDateString() : "-"}
                </div>
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  {userData.email || "-"}
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
                {/* You can add more tabs for activity, etc. */}
              </TabsList>

              <TabsContent value="posts" className="mt-6 space-y-6">
                {loading ? (
                  <div>Loading your posts...</div>
                ) : posts.length === 0 ? (
                  <div>No posts yet.</div>
                ) : (
                  posts.map((post) => (
                    <FeedItemCard key={post.ItemID || post.id} item={post} />
                  ))
                )}
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
