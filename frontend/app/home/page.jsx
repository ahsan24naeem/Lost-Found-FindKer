"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useInView } from "react-intersection-observer"
import { Filter, Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import FeedItemCard from "@/components/feed-item-card"
import SidebarNav from "@/components/sidebar-nav"
import RightSidebar from "@/components/right-sidebar"
import Navbar from "@/components/navbar"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
  const [feedItems, setFeedItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [showFilterMenu, setShowFilterMenu] = useState(false)

  // Available categories
  const categories = ["Electronics", "Jewelry", "Keys", "Bags", "Documents", "Clothing", "Pets", "Other"]

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated() && !user) {
      router.push("/")
    }
  }, [isAuthenticated, user, router])

  // Fetch posts based on active tab
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      try {
        let endpoint = 'http://localhost:5000/api/post/all'
        if (activeTab === 'recent') {
          endpoint = 'http://localhost:5000/api/post/recent'
        } else if (activeTab === 'category' && selectedCategories.length > 0) {
          endpoint = `http://localhost:5000/api/post/category/${selectedCategories[0]}`
        }

        const response = await fetch(endpoint)
        if (!response.ok) {
          throw new Error('Failed to fetch posts')
        }

        const data = await response.json()
        setFeedItems(data)
      } catch (error) {
        console.error('Error fetching posts:', error)
        toast({
          title: "Error",
          description: "Failed to load posts. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [activeTab, selectedCategories, toast])

  const handleSave = async (id) => {
    try {
      // Implement save functionality if needed
      toast({
        title: "Success",
        description: "Item saved successfully",
      })
    } catch (error) {
      console.error('Error saving item:', error)
      toast({
        title: "Error",
        description: "Failed to save item",
        variant: "destructive",
      })
    }
  }

  const toggleCategory = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category)
      } else {
        return [...prev, category]
      }
    })
  }

  if (!isAuthenticated() && !user) {
    return null // Don't render anything while redirecting
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar */}
      <SidebarNav className="hidden lg:block" />

      {/* Main Content */}
      <main className="flex-1 border-x">
        <Navbar />
        <div className="container max-w-3xl px-4 py-6">
          {/* Create Post */}
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
                    <Badge variant="destructive" className="mr-2">
                      Lost
                    </Badge>
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

          {/* Feed Tabs */}
          <div className="mb-6">
            <Tabs defaultValue="all" onValueChange={setActiveTab}>
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="lost">Lost</TabsTrigger>
                  <TabsTrigger value="found">Found</TabsTrigger>
                </TabsList>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter {selectedCategories.length > 0 && `(${selectedCategories.length})`}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {categories.map((category) => (
                      <DropdownMenuCheckboxItem
                        key={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      >
                        {category}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Tabs>
          </div>

          {/* Feed Items */}
          <div className="space-y-6">
            {feedItems.map((item, index) => (
              <FeedItemCard 
                key={`${item.ItemID || item.id || index}`} 
                item={item} 
              />
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4 mb-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[150px]" />
                        <Skeleton className="h-4 w-[100px]" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <Skeleton className="h-[200px] w-full rounded-md" />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Empty state */}
            {feedItems.length === 0 && !loading && (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No items found matching your filters</p>
                {selectedCategories.length > 0 && (
                  <Button variant="outline" className="mt-4" onClick={() => setSelectedCategories([])}>
                    Clear filters
                  </Button>
                )}
              </div>
            )}

            {/* End of feed indicator */}
            {feedItems.length > 0 && !loading && (
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
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <RightSidebar className="hidden xl:block" />
    </div>
  )
}
