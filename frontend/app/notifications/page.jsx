"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Bell, MessageCircle, ThumbsUp, UserPlus, Package, MapPin, Filter, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import MobileNav from "@/components/mobile-nav"
import SidebarNav from "@/components/sidebar-nav"
import RightSidebar from "@/components/right-sidebar"

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "like",
      read: false,
      user: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "liked your post about a lost iPhone",
      time: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
      link: "/items/1",
    },
    {
      id: 2,
      type: "comment",
      read: false,
      user: {
        name: "Jane Smith",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "commented on your post: 'I think I saw something similar at the park yesterday'",
      time: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      link: "/items/1#comments",
    },
    {
      id: 3,
      type: "follow",
      read: true,
      user: {
        name: "Mike Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "started following you",
      time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      link: "/profile/mike",
    },
    {
      id: 4,
      type: "match",
      read: true,
      user: {
        name: "Sarah Williams",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "reported finding an item that matches your lost wallet",
      time: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
      link: "/items/5",
    },
    {
      id: 5,
      type: "nearby",
      read: true,
      content: "New lost item reported near your location",
      time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      link: "/items/6",
    },
    {
      id: 6,
      type: "like",
      read: true,
      user: {
        name: "Emily Davis",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "and 5 others liked your comment",
      time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
      link: "/items/3#comments",
    },
    {
      id: 7,
      type: "comment",
      read: true,
      user: {
        name: "David Brown",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "replied to your comment: 'Thank you for the information!'",
      time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
      link: "/items/2#comments",
    },
    {
      id: 8,
      type: "match",
      read: true,
      user: {
        name: "Robert Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "claimed your found item: 'Gold Necklace'",
      time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), // 4 days ago
      link: "/items/4",
    },
  ])

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.read
    if (activeTab === "mentions") return notification.type === "comment" && notification.content.includes("replied")
    return notification.type === activeTab
  })

  // Mark a notification as read
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) => {
        if (notification.id === id) {
          return { ...notification, read: true }
        }
        return notification
      }),
    )
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      })),
    )
  }

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <ThumbsUp className="h-5 w-5 text-blue-500" />
      case "comment":
        return <MessageCircle className="h-5 w-5 text-green-500" />
      case "follow":
        return <UserPlus className="h-5 w-5 text-purple-500" />
      case "match":
        return <Package className="h-5 w-5 text-amber-500" />
      case "nearby":
        return <MapPin className="h-5 w-5 text-red-500" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar - Hidden on mobile */}
      <SidebarNav className="hidden lg:block" />

      {/* Main Content */}
      <main className="flex-1 border-x pb-20 lg:pb-0">
        <div className="container max-w-4xl px-4 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">Stay updated on your activity</p>
          </div>

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Tabs defaultValue="all" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
                <TabsTrigger value="mentions">Mentions</TabsTrigger>
                <TabsTrigger value="match">Matches</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <Check className="mr-2 h-4 w-4" />
                Mark all as read
              </Button>
              <Button variant="outline" size="sm" className="px-2">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {filteredNotifications.length > 0 ? (
            <div className="space-y-1">
              {filteredNotifications.map((notification) => (
                <div key={notification.id}>
                  <button
                    className={`flex w-full items-start gap-4 rounded-lg p-4 text-left hover:bg-muted ${
                      !notification.read ? "bg-muted/50" : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          {notification.user && (
                            <div className="flex items-center gap-1 font-medium">
                              {notification.user.name}
                              {!notification.read && <Badge className="ml-2">New</Badge>}
                            </div>
                          )}
                          <p className="text-sm">{notification.content}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.time), { addSuffix: true })}
                          </p>
                        </div>
                        {notification.user && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={notification.user.avatar || "/placeholder.svg"}
                              alt={notification.user.name}
                            />
                            <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  </button>
                  <Separator />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Bell className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-medium">No notifications</h3>
              <p className="text-muted-foreground">
                {activeTab === "all"
                  ? "You don't have any notifications yet"
                  : `You don't have any ${activeTab} notifications`}
              </p>
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
