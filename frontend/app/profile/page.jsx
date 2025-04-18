"use client"

import { useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import {
  Settings,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Globe,
  Edit,
  Grid3X3,
  Bookmark,
  MessageSquare,
  Heart,
  User,
  Package,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import MobileNav from "@/components/mobile-nav"
import SidebarNav from "@/components/sidebar-nav"
import RightSidebar from "@/components/right-sidebar"
import FeedItemCard from "@/components/feed-item-card"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("posts")

  // Mock user data
  const user = {
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
        name: user.name,
        avatar: user.avatar,
      },
      likes: 24,
      comments: 8,
      shares: 3,
      isLiked: false,
      isSaved: false,
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
        name: user.name,
        avatar: user.avatar,
      },
      likes: 32,
      comments: 12,
      shares: 5,
      isLiked: true,
      isSaved: false,
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
        name: user.name,
        avatar: user.avatar,
      },
      likes: 27,
      comments: 9,
      shares: 4,
      isLiked: true,
      isSaved: false,
    },
  ]

  // Mock saved items
  const savedItems = [
    {
      id: 4,
      type: "found",
      title: "Prescription Glasses",
      category: "Eyewear",
      location: "Library, 2nd Floor",
      date: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
      images: ["/placeholder.svg?height=400&width=600"],
      description: "Found black prescription glasses in a blue case at the library. Contact me if they're yours!",
      user: {
        name: "David Brown",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      likes: 15,
      comments: 4,
      shares: 1,
      isLiked: false,
      isSaved: true,
    },
    {
      id: 5,
      type: "lost",
      title: "Black Leather Wallet",
      category: "Personal Items",
      location: "Starbucks, Main Street",
      date: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
      images: ["/placeholder.svg?height=400&width=600"],
      description: "Lost my wallet containing ID and credit cards. Last seen at Starbucks on Main Street.",
      user: {
        name: "Jane Smith",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      likes: 18,
      comments: 6,
      shares: 2,
      isLiked: false,
      isSaved: true,
    },
  ]

  // Mock activity data
  const activity = [
    {
      id: 1,
      type: "comment",
      content: "Commented on Sarah's post: 'I think I saw something similar at the park yesterday'",
      date: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    },
    {
      id: 2,
      type: "like",
      content: "Liked David's post about a found wallet",
      date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
    {
      id: 3,
      type: "post",
      content: "Posted a new lost item: 'iPhone 13 Pro'",
      date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
    {
      id: 4,
      type: "follow",
      content: "Started following Emily Davis",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
    {
      id: 5,
      type: "claim",
      content: "Successfully claimed a found item: 'Blue Backpack'",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    },
  ]

  // Toggle follow
  const toggleFollow = () => {
    // This would be handled by your state management
    console.log("Follow toggled")
  }

  // Toggle like
  const handleLike = (id) => {
    // This would be handled by your state management
    console.log("Like toggled for item:", id)
  }

  // Toggle save
  const handleSave = (id) => {
    // This would be handled by your state management
    console.log("Save toggled for item:", id)
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar - Hidden on mobile */}
      <SidebarNav className="hidden lg:block" />

      {/* Main Content */}
      <main className="flex-1 border-x pb-20 lg:pb-0">
        {/* Cover Image */}
        <div className="relative h-48 w-full overflow-hidden sm:h-64 md:h-80">
          <img src={user.coverImage || "/placeholder.svg"} alt="Cover" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>

        {/* Profile Info */}
        <div className="container max-w-4xl px-4">
          <div className="relative -mt-20 mb-6 flex flex-col items-center sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col items-center sm:flex-row sm:items-end">
              <Avatar className="h-32 w-32 border-4 border-background">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="mt-4 text-center sm:ml-4 sm:text-left">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground">{user.username}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2 sm:mt-0">
              <Button variant="outline" size="sm" asChild>
                <Link href="/settings">
                  <Settings className="mr-1 h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
              <Button size="sm" onClick={toggleFollow}>
                {user.isFollowing ? "Following" : "Follow"}
              </Button>
            </div>
          </div>

          <div className="mb-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold">{user.posts}</div>
              <div className="text-sm text-muted-foreground">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{user.followers}</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{user.following}</div>
              <div className="text-sm text-muted-foreground">Following</div>
            </div>
          </div>

          <div className="mb-6">
            <p className="mb-4">{user.bio}</p>
            <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                {user.location}
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                Joined {formatDistanceToNow(new Date(user.joinDate), { addSuffix: true })}
              </div>
              <div className="flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                {user.email}
              </div>
              <div className="flex items-center">
                <Phone className="mr-2 h-4 w-4" />
                {user.phone}
              </div>
              <div className="flex items-center sm:col-span-2">
                <Globe className="mr-2 h-4 w-4" />
                <a href={`https://${user.website}`} target="_blank" rel="noopener noreferrer" className="text-primary">
                  {user.website}
                </a>
              </div>
            </div>
          </div>

          <Separator className="mb-6" />

          <Tabs defaultValue="posts" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="posts">
                <Grid3X3 className="mr-2 h-4 w-4" />
                Posts
              </TabsTrigger>
              <TabsTrigger value="saved">
                <Bookmark className="mr-2 h-4 w-4" />
                Saved
              </TabsTrigger>
              <TabsTrigger value="activity">
                <Heart className="mr-2 h-4 w-4" />
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="mt-6 space-y-6">
              {posts.map((post) => (
                <FeedItemCard
                  key={post.id}
                  item={post}
                  onLike={handleLike}
                  onSave={handleSave}
                  onComment={() => {}}
                  onShare={() => {}}
                />
              ))}
            </TabsContent>

            <TabsContent value="saved" className="mt-6 space-y-6">
              {savedItems.map((item) => (
                <FeedItemCard
                  key={item.id}
                  item={item}
                  onLike={handleLike}
                  onSave={handleSave}
                  onComment={() => {}}
                  onShare={() => {}}
                />
              ))}
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <div className="space-y-4">
                {activity.map((item) => (
                  <div key={item.id} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      {item.type === "comment" && <MessageSquare className="h-5 w-5" />}
                      {item.type === "like" && <Heart className="h-5 w-5" />}
                      {item.type === "post" && <Edit className="h-5 w-5" />}
                      {item.type === "follow" && <User className="h-5 w-5" />}
                      {item.type === "claim" && <Package className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{item.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Right Sidebar - Hidden on mobile */}
      <RightSidebar className="hidden xl:block" />

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  )
}
