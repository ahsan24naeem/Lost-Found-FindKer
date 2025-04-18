"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useInView } from "react-intersection-observer"
import { Filter, Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import FeedItemCard from "@/components/feed-item-card"
import SidebarNav from "@/components/sidebar-nav"
import RightSidebar from "@/components/right-sidebar"
import Navbar from "@/components/navbar"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"

export default function Home() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
  const [feedItems, setFeedItems] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const { ref, inView } = useInView()

  // Ensure isAuthenticated has a stable reference
  const checkAuthentication = useCallback(() => {
    return isAuthenticated()
  }, [isAuthenticated])

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      console.log("No token found, redirecting to login")
      router.replace("/")
      return
    }

    if (!checkAuthentication()) {
      console.log("Not authenticated, redirecting to login")
      router.replace("/")
      return
    }

    setLoading(false)
  }, [checkAuthentication, router])

  // Load feed items if authenticated
  useEffect(() => {
    if (checkAuthentication() && !loading) {
      loadFeedItems()
    }
  }, [checkAuthentication, loading])

  // Mock data for feed items
  const mockFeedItems = [
    {
      id: 1,
      type: "lost",
      title: "iPhone 13 Pro",
      category: "Electronics",
      location: "Central Park, New York",
      date: "2024-04-16T10:00:00.000Z", // Fixed timestamp
      images: ["/placeholder.svg?height=400&width=600"],
      description: "Lost my iPhone 13 Pro with a blue case near the fountain. Please help!",
      user: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      likes: 24,
      comments: 8,
      shares: 3,
      isLiked: false,
      isSaved: false,
      contactInfo: {
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
      },
    },
    {
      id: 2,
      type: "found",
      title: "Gold Necklace",
      category: "Jewelry",
      location: "Beach Boardwalk",
      date: "2024-04-16T07:00:00.000Z", // Fixed timestamp
      images: ["/placeholder.svg?height=400&width=600"],
      description: "Found this beautiful gold necklace with a heart pendant at the beach. Looking for the owner.",
      user: {
        name: "Sarah Williams",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      likes: 32,
      comments: 12,
      shares: 5,
      isLiked: true,
      isSaved: false,
      contactInfo: {
        email: "sarah.williams@example.com",
        phone: "+1 (555) 987-6543",
      },
    },
    {
      id: 3,
      type: "lost",
      title: "Black Leather Wallet",
      category: "Personal Items",
      location: "Starbucks, Main Street",
      date: "2024-04-16T04:00:00.000Z", // Fixed timestamp
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
      contactInfo: {
        email: "jane.smith@example.com",
        phone: "+1 (555) 456-7890",
      },
    },
    {
      id: 4,
      type: "found",
      title: "Prescription Glasses",
      category: "Eyewear",
      location: "Library, 2nd Floor",
      date: "2024-04-16T00:00:00.000Z", // Fixed timestamp
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
      isSaved: false,
      contactInfo: {
        email: "david.brown@example.com",
        phone: "+1 (555) 234-5678",
      },
    },
    {
      id: 5,
      type: "lost",
      title: "Car Keys with Red Keychain",
      category: "Keys",
      location: "Shopping Mall Parking",
      date: "2024-04-15T12:00:00.000Z", // Fixed timestamp
      images: ["/placeholder.svg?height=400&width=600"],
      description: "Lost my car keys with a distinctive red keychain. Last seen in the mall parking lot.",
      user: {
        name: "Mike Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      likes: 27,
      comments: 9,
      shares: 4,
      isLiked: true,
      isSaved: false,
      contactInfo: {
        email: "mike.johnson@example.com",
        phone: "+1 (555) 876-5432",
      },
    },
    {
      id: 6,
      type: "found",
      title: "Backpack with Textbooks",
      category: "Bags",
      location: "University Campus",
      date: "2024-04-15T00:00:00.000Z", // Fixed timestamp
      images: ["/placeholder.svg?height=400&width=600"],
      description: "Found a black backpack containing textbooks and notes at the university campus.",
      user: {
        name: "Emily Davis",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      likes: 21,
      comments: 7,
      shares: 2,
      isLiked: false,
      isSaved: true,
      contactInfo: {
        email: "emily.davis@example.com",
        phone: "+1 (555) 345-6789",
      },
    },
  ]
  // Function to load more items
  const loadFeedItems = () => {
    setLoading(true)
    setTimeout(() => {
      const newItems = mockFeedItems.map((item) => ({
        ...item,
        id: item.id + page * mockFeedItems.length,
        title: `${item.title} ${page + 1}`,
      }))
      setFeedItems((prevItems) => [...prevItems, ...newItems])
      setPage((prevPage) => prevPage + 1)
      setLoading(false)
      if (page >= 3) setHasMore(false)
    }, 1500)
  }

  // Initial load
  useEffect(() => {
    setFeedItems(mockFeedItems)
  }, [])

  // Load more when scrolled to bottom
  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadFeedItems()
    }
  }, [inView, hasMore, loading])

  // Filter items based on active tab
  const filteredItems = feedItems.filter((item) => {
    if (activeTab === "all") return true
    if (activeTab === "lost") return item.type === "lost"
    if (activeTab === "found") return item.type === "found"
    return true
  })

  // Toggle like
  const handleLike = (id) => {
    setFeedItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          return { ...item, isLiked: !item.isLiked, likes: item.isLiked ? item.likes - 1 : item.likes + 1 }
        }
        return item
      })
    )
  }

  // Toggle save
  const handleSave = (id) => {
    setFeedItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          return { ...item, isSaved: !item.isSaved }
        }
        return item
      })
    )
  }

  if (!checkAuthentication() && !user) {
    return null // Don't render anything while redirecting
  }

  return (
    <div className="flex min-h-screen">
      <SidebarNav className="hidden lg:block" />
      <main className="flex-1 border-x">
        <Navbar />
        <div className="container max-w-3xl px-4 py-6">
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                  <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="relative flex-1">
                  <Link href="/post" className="block w-full">
                    <Input
                      placeholder="Share something you lost or found..."
                      className="pr-10"
                      readOnly
                      onClick={(e) => e.preventDefault()}
                    />
                  </Link>
                  <Link
                    href="/post"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <Plus className="h-5 w-5" />
                  </Link>
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/post?type=lost">
                    <Badge variant="destructive" className="mr-2">Lost</Badge>
                    Report Lost Item
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/post?type=found">
                    <Badge className="mr-2">Found</Badge>
                    Report Found Item
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          <div className="mb-6">
            <Tabs defaultValue="all" onValueChange={setActiveTab}>
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="lost">Lost</TabsTrigger>
                  <TabsTrigger value="found">Found</TabsTrigger>
                </TabsList>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </Tabs>
          </div>
          <div className="space-y-6">
            {filteredItems.map((item) => (
              <FeedItemCard key={item.id} item={item} onLike={handleLike} onSave={handleSave} />
            ))}
            {loading && (
              <div className="space-y-6">
                <Card>
                  <CardHeader className="p-4">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[150px]" />
                        <Skeleton className="h-4 w-[100px]" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="mt-2 h-4 w-3/4" />
                  </CardContent>
                  <Skeleton className="h-[200px] w-full" />
                  <CardFooter className="p-4">
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              </div>
            )}
            {!hasMore && !loading && (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">You've reached the end of the feed</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  Back to top
                </Button>
              </div>
            )}
            {hasMore && <div ref={ref} className="h-10" />}
          </div>
        </div>
      </main>
      <RightSidebar className="hidden xl:block" />
    </div>
  )
}