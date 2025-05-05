"use client"

import { useState, useEffect } from "react"
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
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"

export default function NotificationsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated()) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    fetch(`http://localhost:5000/api/notification/${user.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch notifications");
        return res.json();
      })
      .then((data) => {
        setNotifications(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Could not load notifications");
        setNotifications([]);
        setLoading(false);
      });
  }, [user]);

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

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Bell className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-medium">Loading notifications...</h3>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Bell className="h-10 w-10 text-destructive" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-destructive">{error}</h3>
          </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-1">
              {notifications.map((notification) => (
                <div key={notification.id || notification.NotificationID}>
                  <div
                    className={`flex w-full items-start gap-4 rounded-lg p-4 text-left hover:bg-muted`}
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
                            </div>
                          )}
                          <p className="text-sm">{notification.content || notification.Message || notification.messageText}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.time || notification.CreatedAt), { addSuffix: true })}
                          </p>
                        </div>
                        {notification.user && (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{notification.user.name ? notification.user.name.charAt(0) : "😀"}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  </div>
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
              <p className="text-muted-foreground">You don't have any notifications yet</p>
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
