"use client"

import Link from "next/link"
import { Home, Search, Bell, Bookmark, User, Settings, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/auth-context"

export default function SidebarNav({ className }) {
  const { user } = useAuth()

  return (
    <aside className={`w-64 border-r p-4 ${className}`}>
      <div className="flex h-full flex-col">
        <div className="mb-6 flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">FindIt</span>
        </div>

        <nav className="space-y-1">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/home">
              <Home className="mr-2 h-5 w-5" />
              Home
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/search">
              <Search className="mr-2 h-5 w-5" />
              Search
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/notifications">
              <div className="relative">
                <Bell className="mr-2 h-5 w-5" />
                <Badge className="absolute -right-1 -top-1 h-4 w-4 p-0 text-[10px]">3</Badge>
              </div>
              Notifications
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/saved">
              <Bookmark className="mr-2 h-5 w-5" />
              Saved Items
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/profile">
              <User className="mr-2 h-5 w-5" />
              Profile
            </Link>
          </Button>
        </nav>

        <div className="mt-4 space-y-1">
          <h3 className="px-3 text-xs font-medium text-muted-foreground">Categories</h3>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/category/electronics">Electronics</Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/category/jewelry">Jewelry</Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/category/keys">Keys</Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/category/bags">Bags</Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/category/documents">Documents</Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-primary" asChild>
            <Link href="/categories">View All</Link>
          </Button>
        </div>

        <div className="mt-auto space-y-1">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/settings">
              <Settings className="mr-2 h-5 w-5" />
              Settings
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/help">
              <HelpCircle className="mr-2 h-5 w-5" />
              Help & Support
            </Link>
          </Button>
        </div>

        {user && (
          <div className="mt-4 flex items-center gap-3 rounded-lg p-3 hover:bg-muted">
        <Avatar>
          <AvatarImage src="/placeholder.svg?height=40&width=40" alt={user?.name || "User"} />
          <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{user?.name || "Guest"}</div>
              <div className="text-xs text-muted-foreground">{user.email}</div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
