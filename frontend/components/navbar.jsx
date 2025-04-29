"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, Search, X, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import NotificationsDropdown from "@/components/notifications-dropdown"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/home" className="text-2xl font-bold text-primary">
            FindKer
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4 flex-1 justify-center max-w-xl">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search items..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" variant="ghost" size="sm" className="absolute right-0 top-0 h-full">
                Search
              </Button>
            </div>
          </form>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <NotificationsDropdown>
                <DropdownMenuItem asChild>
                  <Link href="/admin">
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Admin Panel</span>
                  </Link>
                </DropdownMenuItem>
              </NotificationsDropdown>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => router.push("/login")}>
                Log in
              </Button>
              <Button onClick={() => router.push("/register")}>Sign up</Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="container md:hidden py-4 border-t">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search items..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
          <nav className="flex flex-col gap-4">
            <Link href="/home" className="text-sm font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link href="/post" className="text-sm font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              Post Item
            </Link>
            <Link
              href="/profile"
              className="text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
            {!user && (
              <div className="flex flex-col gap-2 mt-4">
                <Button variant="outline" onClick={() => router.push("/login")}>
                  Log in
                </Button>
                <Button onClick={() => router.push("/register")}>Sign up</Button>
              </div>
            )}
            {user && (
              <Button variant="outline" className="mt-4" onClick={handleLogout}>
                Log out
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
