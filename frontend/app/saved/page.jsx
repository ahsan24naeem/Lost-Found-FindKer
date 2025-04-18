"use client"

import { useState } from "react"
import Link from "next/link"
import { Bookmark, Grid, List, Filter, Search, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import ItemCard from "@/components/item-card"
import FeedItemCard from "@/components/feed-item-card"
import MobileNav from "@/components/mobile-nav"
import SidebarNav from "@/components/sidebar-nav"
import RightSidebar from "@/components/right-sidebar"

export default function SavedItemsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState("grid")
  const [activeTab, setActiveTab] = useState("all")

  // Mock data - would come from your API
  const savedItems = [
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
        name: "John Doe",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      likes: 24,
      comments: 8,
      shares: 3,
      isLiked: false,
      isSaved: true,
    },
    {
      id: 2,
      type: "found",
      title: "Gold Necklace",
      category: "Jewelry",
      location: "Beach Boardwalk",
      date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
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
      isSaved: true,
    },
    {
      id: 3,
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
  ]

  // Filter items based on active tab and search query
  const filteredItems = savedItems.filter((item) => {
    const matchesTab = activeTab === "all" || item.type === activeTab
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesTab && matchesSearch
  })

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
        <div className="container max-w-4xl px-4 py-6">
          <div className="mb-4 flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back to Feed
              </Link>
            </Button>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold">Saved Items</h1>
            <p className="text-muted-foreground">Items you've bookmarked for later</p>
          </div>

          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search your saved items..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Tabs defaultValue="all" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="lost">Lost</TabsTrigger>
                <TabsTrigger value="found">Found</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
              <Select defaultValue="recent">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="nearby">Nearest Location</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center rounded-md border">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  className="rounded-none rounded-l-md"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  className="rounded-none rounded-r-md"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {filteredItems.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                {filteredItems.map((item) => (
                  <ItemCard key={item.id} item={item} type={item.type} />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredItems.map((item) => (
                  <FeedItemCard
                    key={item.id}
                    item={item}
                    onLike={handleLike}
                    onSave={handleSave}
                    onComment={() => {}}
                    onShare={() => {}}
                  />
                ))}
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Bookmark className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-medium">No saved items</h3>
              <p className="text-muted-foreground">
                {searchQuery ? "No saved items match your search" : "Items you save will appear here for easy access"}
              </p>
              <Button className="mt-4" asChild>
                <Link href="/">Browse Items</Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Right Sidebar - Hidden on mobile */}
      <RightSidebar className="hidden xl:block" />

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  )
}
