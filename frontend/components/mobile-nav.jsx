"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Bell, MessageSquare, User, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/auth-context"

export default function MobileNav() {
  const { user } = useAuth();
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const routes = [
    {
      href: "/",
      label: "Home",
      icon: Home,
      active: pathname === "/",
    },
    {
      href: "/search",
      label: "Search",
      icon: Search,
      active: pathname === "/search",
    },
    {
      href: "/post",
      label: "Post",
      icon: Plus,
      active: pathname === "/post",
      isMain: true,
    },
    {
      href: "/notifications",
      label: "Notifications",
      icon: Bell,
      active: pathname === "/notifications",
      badge: 3,
    },
    {
      href: "/profile",
      label: "Profile",
      icon: User,
      active: pathname === "/profile",
    },
  ]

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background lg:hidden">
        <div className="flex items-center justify-around">
          {routes.map((route) =>
            route.isMain ? (
              <Button key={route.href} asChild size="icon" className="relative -mt-6 h-14 w-14 rounded-full shadow-lg">
                <Link href={route.href}>
                  <route.icon className="h-6 w-6" />
                </Link>
              </Button>
            ) : (
              <Button
                key={route.href}
                asChild
                variant="ghost"
                className={`relative flex h-16 w-16 flex-col items-center justify-center rounded-none ${
                  route.active ? "text-primary" : ""
                }`}
              >
                <Link href={route.href}>
                  <>
                    <route.icon className="h-6 w-6" />
                    {route.badge && (
                      <Badge className="absolute right-2 top-2 h-5 w-5 p-0 flex items-center justify-center">
                        {route.badge}
                      </Badge>
                    )}
                    <span className="mt-1 text-[10px]">{route.label}</span>
                  </>
                </Link>
              </Button>
            ),
          )}
        </div>
      </div>

      {/* Mobile Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">FindIt</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/messages">
                <MessageSquare className="h-5 w-5" />
              </Link>
            </Button>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{user?.name ? user.name.charAt(0).toUpperCase() : "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="mt-6 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>{user?.name ? user.name.charAt(0).toUpperCase() : "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">John Doe</div>
                      <div className="text-sm text-muted-foreground">@johndoe</div>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <div className="text-center">
                      <div className="font-medium">245</div>
                      <div className="text-muted-foreground">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">123</div>
                      <div className="text-muted-foreground">Following</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">24</div>
                      <div className="text-muted-foreground">Posts</div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/profile" onClick={() => setOpen(false)}>
                        <User className="mr-2 h-5 w-5" />
                        My Profile
                      </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/saved" onClick={() => setOpen(false)}>
                        <MessageSquare className="mr-2 h-5 w-5" />
                        Saved Items
                      </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/settings" onClick={() => setOpen(false)}>
                        <MessageSquare className="mr-2 h-5 w-5" />
                        Settings
                      </Link>
                    </Button>
                  </div>

                  <Button className="mt-4">Log Out</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  )
}
