"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useInView } from "react-intersection-observer"
import { Filter, Plus } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
  const [feedItems, setFeedItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [allPosts, setAllPosts] = useState([]) // Store all posts separately

  // Available categories
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/categories/all')
        if (!response.ok) {
          throw new Error('Failed to fetch categories')
        }
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
        toast({
          title: "Error",
          description: "Failed to load categories. Please try again later.",
          variant: "destructive",
        })
      }
    }

    fetchCategories()
  }, [toast])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated()) {
        router.replace("/login");
      }
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch posts based on active tab
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      try {
        const response = await fetch('http://localhost:5000/api/post/all')
        if (!response.ok) {
          throw new Error('Failed to fetch posts')
        }
        const data = await response.json()
        setAllPosts(data) // Store all posts
        setFeedItems(data) // Initial feed items
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
  }, [toast])

  // Handle search and filter
  useEffect(() => {
    let filtered = [...allPosts]
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.ItemDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.ItemLocation?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(post => selectedCategories.includes(post.CategoryName))
    }
    
    setFeedItems(filtered)
  }, [searchTerm, selectedCategories, allPosts])

  const toggleCategory = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category)
      } else {
        return [...prev, category]
      }
    })
  }

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Loading...</h1>
          <p className="text-muted-foreground">Please wait while we check your authentication status.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar */}
      <SidebarNav className="hidden lg:block" />

      {/* Main Content */}
      <main className="flex-1 border-x">
        <Navbar onSearch={setSearchTerm} />
        <div className="container max-w-3xl px-4 py-6">
          {/* Create Post Card */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>{user?.name ? user.name.charAt(0).toUpperCase() : "U"}</AvatarFallback>
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
          <div className="mb-6 flex items-center justify-between">
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
                    key={category.CategoryName}
                    checked={selectedCategories.includes(category.CategoryName)}
                    onCheckedChange={() => toggleCategory(category.CategoryName)}
                  >
                    {category.CategoryName}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
