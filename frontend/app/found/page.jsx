"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import Link from "next/link"
import { Filter, MapPin, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import ItemCard from "@/components/item-card"
import Navbar from "@/components/navbar"

export default function FoundItemsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data - would come from your API
  const foundItems = [
    {
      id: 4,
      title: "Gold Necklace",
      category: "Jewelry",
      location: "Beach Boardwalk",
      date: "2023-04-15",
      image: "/placeholder.svg?height=200&width=200",
      description: "Found a gold necklace with a heart pendant.",
      user: {
        name: "Sarah Williams",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      contactInfo: {
        email: "sarah.williams@example.com",
        phone: "+1 (555) 234-5678",
      },
    },
    {
      id: 5,
      title: "Prescription Glasses",
      category: "Eyewear",
      location: "Library, 2nd Floor",
      date: "2023-04-14",
      image: "/placeholder.svg?height=200&width=200",
      description: "Found black prescription glasses in a blue case.",
      user: {
        name: "David Brown",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      contactInfo: {
        email: "david.brown@example.com",
        phone: "+1 (555) 876-5432",
      },
    },
    {
      id: 6,
      title: "Backpack with Textbooks",
      category: "Bags",
      location: "University Campus",
      date: "2023-04-13",
      image: "/placeholder.svg?height=200&width=200",
      description: "Found a black backpack containing textbooks and notes.",
      user: {
        name: "Emily Davis",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      contactInfo: {
        email: "emily.davis@example.com",
        phone: "+1 (555) 345-6789",
      },
    },
    {
      id: 7,
      title: "Car Keys",
      category: "Keys",
      location: "Coffee Shop",
      date: "2023-04-12",
      image: "/placeholder.svg?height=200&width=200",
      description: "Found car keys with a Honda logo and a small keychain.",
      user: {
        name: "Michael Wilson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      contactInfo: {
        email: "michael.wilson@example.com",
        phone: "+1 (555) 567-8901",
      },
    },
    {
      id: 8,
      title: "Umbrella",
      category: "Accessories",
      location: "Bus Stop",
      date: "2023-04-11",
      image: "/placeholder.svg?height=200&width=200",
      description: "Found a black umbrella with a wooden handle.",
      user: {
        name: "Jessica Taylor",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      contactInfo: {
        email: "jessica.taylor@example.com",
        phone: "+1 (555) 678-9012",
      },
    },
    {
      id: 9,
      title: "Wireless Earbuds",
      category: "Electronics",
      location: "Gym",
      date: "2023-04-10",
      image: "/placeholder.svg?height=200&width=200",
      description: "Found wireless earbuds in a charging case.",
      user: {
        name: "Robert Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      contactInfo: {
        email: "robert.johnson@example.com",
        phone: "+1 (555) 789-0123",
      },
    },
  ]

  const filteredItems = foundItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <>
      <Navbar />
      <div className="container py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Found Items</h1>
            <p className="text-muted-foreground">Browse items that have been found and reported</p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/post?type=found">Report Found Item</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/lost">View Lost Items</Link>
            </Button>
          </div>
        </div>

        <div className="mb-8 flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by item name, description, or location..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="jewelry">Jewelry</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
                <SelectItem value="documents">Documents</SelectItem>
                <SelectItem value="keys">Keys</SelectItem>
                <SelectItem value="bags">Bags</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="nearby">Nearest Location</SelectItem>
              </SelectContent>
            </Select>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Options</SheetTitle>
                  <SheetDescription>Refine your search with additional filters</SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Date Range</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="date-from">From</Label>
                        <Input id="date-from" type="date" />
                      </div>
                      <div>
                        <Label htmlFor="date-to">To</Label>
                        <Input id="date-to" type="date" />
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Location</h3>
                    <div className="flex items-center gap-2">
                      <Input placeholder="Enter location" />
                      <Button variant="outline" size="icon">
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium">Distance</h4>
                      <Slider defaultValue={[5]} max={50} step={1} />
                      <div className="flex justify-between">
                        <span className="text-xs">0 mi</span>
                        <span className="text-xs">50 mi</span>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Additional Filters</h3>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="has-images">Has Images</Label>
                      <Switch id="has-images" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="verified">Verified Reports</Label>
                      <Switch id="verified" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="claimed">Not Yet Claimed</Label>
                      <Switch id="claimed" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Reset</Button>
                    <Button>Apply Filters</Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => <ItemCard key={item.id} item={item} type="found" />)
          ) : (
            <div className="col-span-full py-12 text-center">
              <h3 className="text-lg font-medium">No items found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          )}
        </div>

        {filteredItems.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Button variant="outline">Load More</Button>
          </div>
        )}
      </div>
    </>
  )
}
