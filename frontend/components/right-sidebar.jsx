import Link from "next/link"
import { Search, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function RightSidebar({ className }) {
  // Mock data for nearby items
  const nearbyItems = [
    {
      id: 1,
      title: "iPhone 13 Pro",
      type: "lost",
      location: "Central Park",
      distance: "0.5 miles away",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 2,
      title: "Gold Necklace",
      type: "found",
      location: "Beach Boardwalk",
      distance: "1.2 miles away",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 3,
      title: "Car Keys",
      type: "lost",
      location: "Shopping Mall",
      distance: "0.8 miles away",
      image: "/placeholder.svg?height=60&width=60",
    },
  ]

  // Mock data for recent activity
  const recentActivity = [
    {
      id: 1,
      user: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      action: "found a wallet",
      time: "2 hours ago",
    },
    {
      id: 2,
      user: {
        name: "Jane Smith",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      action: "reported a lost phone",
      time: "5 hours ago",
    },
    {
      id: 3,
      user: {
        name: "Mike Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      action: "commented on a post",
      time: "1 day ago",
    },
  ]

  return (
    <aside className={`w-80 border-l p-4 ${className}`}>
      <div className="space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search..." className="pl-8" />
        </div>

        {/* Nearby Items */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-medium">Nearby Items</h3>
            <Button variant="ghost" size="sm" className="text-xs text-primary">
              See All
            </Button>
          </div>
          <div className="space-y-3">
            {nearbyItems.map((item) => (
              <Link key={item.id} href={`/items/${item.id}`}>
                <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="h-12 w-12 rounded-md object-cover"
                  />
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium">{item.title}</span>
                      <Badge variant={item.type === "lost" ? "destructive" : "default"} className="text-[10px]">
                        {item.type === "lost" ? "Lost" : "Found"}
                      </Badge>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="mr-1 h-3 w-3" />
                      {item.location} • {item.distance}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-medium">Recent Activity</h3>
            <Button variant="ghost" size="sm" className="text-xs text-primary">
              See All
            </Button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <img
                  src={activity.user.avatar || "/placeholder.svg"}
                  alt={activity.user.name}
                  className="h-8 w-8 rounded-full"
                />
                <div>
                  <div className="text-sm">
                    <span className="font-medium">{activity.user.name}</span> {activity.action}
                  </div>
                  <div className="text-xs text-muted-foreground">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-muted-foreground">
          <div className="flex flex-wrap gap-2">
            <Link href="/about" className="hover:underline">
              About
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <Link href="/cookies" className="hover:underline">
              Cookies
            </Link>
            <Link href="/help" className="hover:underline">
              Help
            </Link>
          </div>
          <div className="mt-2">© {new Date().getFullYear()} FindIt. All rights reserved.</div>
        </div>
      </div>
    </aside>
  )
}
