"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Bell, MessageCircle, ThumbsUp, UserPlus, Package, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function NotificationsDropdown() {
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
  ])

  const unreadCount = notifications.filter((notification) => !notification.read).length

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

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      })),
    )
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <ThumbsUp className="h-4 w-4 text-blue-500" />
      case "comment":
        return <MessageCircle className="h-4 w-4 text-green-500" />
      case "follow":
        return <UserPlus className="h-4 w-4 text-purple-500" />
      case "match":
        return <Package className="h-4 w-4 text-amber-500" />
      case "nearby":
        return <MapPin className="h-4 w-4 text-red-500" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -right-1 -top-1 h-5 w-5 p-0 flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-auto text-xs" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex items-start gap-3 p-3 ${notification.read ? "" : "bg-muted/50"}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  {notification.user && (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={notification.user.avatar || "/placeholder.svg"}
                          alt={notification.user.name}
                        />
                        <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{notification.user.name}</span>
                    </div>
                  )}
                  <p className="text-sm">{notification.content}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.time), { addSuffix: true })}
                  </p>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">No notifications yet</div>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center" asChild>
          <a href="/notifications" className="w-full text-center text-sm font-medium text-primary">
            View all notifications
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
