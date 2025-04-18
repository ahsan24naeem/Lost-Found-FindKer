"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, Menu, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(true) // We're using our auth context instead

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/home" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">FindIt</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/home" className="text-sm font-medium hover:text-primary">
            Home
          </Link>
          <Link href="/lost" className="text-sm font-medium hover:text-primary">
            Lost Items
          </Link>
          <Link href="/found" className="text-sm font-medium hover:text-primary">
            Found Items
          </Link>
          <Link href="/post" className="text-sm font-medium hover:text-primary">
            Post Item
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary">
            About
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search items..." className="w-[200px] pl-8 md:w-[200px] lg:w-[300px]" />
          </div>

          {user ? (
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  3
                </span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt={user?.name || "User"} />
                    <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/profile" className="w-full">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/my-items" className="w-full">
                      My Items
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/settings" className="w-full">
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => router.push("/")}>
                Log in
              </Button>
              <Button onClick={() => router.push("/")}>Sign up</Button>
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
          <nav className="flex flex-col gap-4">
            <Link href="/home" className="text-sm font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link href="/lost" className="text-sm font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              Lost Items
            </Link>
            <Link href="/found" className="text-sm font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              Found Items
            </Link>
            <Link href="/post" className="text-sm font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              Post Item
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search items..." className="w-full pl-8" />
            </div>
            {!user && (
              <div className="flex flex-col gap-2 mt-4">
                <Button variant="outline" onClick={() => router.push("/")}>
                  Log in
                </Button>
                <Button onClick={() => router.push("/")}>Sign up</Button>
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
