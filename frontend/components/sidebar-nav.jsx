"use client"

import Link from "next/link"
import { Home, Search, Settings, HelpCircle, Plus, LogOut, MessageSquare, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"

export default function SidebarNav({ className }) {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleProfileClick = () => {
    router.push("/profile")
  }

  const AdminLink = () => {
    if (user && user.email === "admin@example.com") {
      return (
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link href="/admin/dashboard">
            <Shield className="mr-2 h-5 w-5" />
            Admin Panel
          </Link>
        </Button>
      )
    }
    return null
  }

  return (
    <aside className={`w-64 border-r p-4 flex flex-col h-screen ${className}`}>
      <div className="mb-6 flex items-center gap-2">
        <span className="text-2xl font-bold text-primary">FindKer</span>
      </div>

      {user && (
        <div className="mb-6">
          <div
            className="flex items-center gap-3 rounded-lg p-3 bg-muted/50 cursor-pointer hover:bg-muted"
            onClick={handleProfileClick}
          >
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-xs text-muted-foreground">{user.email}</div>
            </div>
          </div>
        </div>
      )}

      <nav className="space-y-1 flex-grow overflow-y-auto">
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link href="/home">
            <Home className="mr-2 h-5 w-5" />
            Home
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link href="/lost">
            <Search className="mr-2 h-5 w-5" />
            Lost Items
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link href="/found">
            <Search className="mr-2 h-5 w-5" />
            Found Items
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link href="/post">
            <Plus className="mr-2 h-5 w-5" />
            Post Item
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link href="/messages">
            <MessageSquare className="mr-2 h-5 w-5" />
            Messages
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link href="/about">
            <HelpCircle className="mr-2 h-5 w-5" />
            About
          </Link>
        </Button>
        <AdminLink />
      </nav>

      <div className="mt-auto pt-4 border-t space-y-1">
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
        {user && (
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        )}
      </div>
    </aside>
  )
}
