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
import ItemCard from "@/components/item-card"
import Navbar from "@/components/navbar"
import { Checkbox } from "@/components/ui/checkbox"

export default function LostItemsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data - would come from your API
  const lostItems = [
    {
      id: 1,
      title: "iPhone 13 Pro",
      category: "Electronics",
      location: "Central Park, New York",
      date: "2023-04-15",
      image: "/placeholder.svg?height=200&width=200",
      description: "Lost my iPhone 13 Pro with a blue case near the fountain.",
      user: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      contactInfo: {
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
      },
    },
    {
      id: 2,
      title: "Black Leather Wallet",
      category: "Personal Items",
      location: "Starbucks, Main Street",
      date: "2023-04-14",
      image: "/placeholder.svg?height=200&width=200",
      description: "Lost my wallet containing ID and credit cards.",
      user: {
        name: "Jane Smith",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      contactInfo: {
        email: "jane.smith@example.com",
        phone: "+1 (555) 987-6543",
      },
    },
    {
      id: 3,
      title: "Car Keys with Red Keychain",
      category: "Keys",
      location: "Shopping Mall Parking",
      date: "2023-04-13",
      image: "/placeholder.svg?height=200&width=200",
      description: "Lost my car keys with a distinctive red keychain.",
      user: {
        name: "Mike Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      contactInfo: {
        email: "mike.johnson@example.com",
        phone: "+1 (555) 456-7890",
      },
    },
    {
      id: 4,
      title: "Prescription Glasses",
      category: "Eyewear",
      location: "Library, 2nd Floor",
      date: "2023-04-12",
      image: "/placeholder.svg?height=200&width=200",
      description: "Lost my black prescription glasses in a blue case.",
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
      title: "Blue Backpack",
      category: "Bags",
      location: "Bus Stop on 5th Avenue",
      date: "2023-04-11",
      image: "/placeholder.svg?height=200&width=200",
      description: "Lost my blue backpack containing textbooks and a laptop.",
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
      title: "Gold Necklace",
      category: "Jewelry",
      location: "Beach Boardwalk",
      date: "2023-04-10",
      image: "/placeholder.svg?height=200&width=200",
      description: "Lost my gold necklace with a heart pendant.",
      user: {
        name: "Emily Davis",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      contactInfo: {
        email: "emily.davis@example.com",
        phone: "+1 (555) 345-6789",
      },
    },
  ]

  const filteredItems = lostItems.filter(
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
            <h1 className="text-3xl font-bold">Lost Items</h1>
            <p className="text-muted-foreground">Browse items that have been reported as lost</p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/post?type=lost">Report Lost Item</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/found">View Found Items</Link>
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
                    <h3 className="text-sm font-medium">Categories</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {["Electronics", "Jewelry", "Clothing", "Accessories", "Documents", "Keys", "Bags", "Other"].map(
                        (category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox id={`category-${category.toLowerCase()}`} />
                            <Label htmlFor={`category-${category.toLowerCase()}`}>{category}</Label>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                  <Separator />
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
            filteredItems.map((item) => <ItemCard key={item.id} item={item} type="lost" />)
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
