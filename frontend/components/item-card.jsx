"use client"

import { DialogTrigger } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { Eye } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { useState } from "react"
import ReportDialog from "./report-dialog"
import { formatDistanceToNow } from "date-fns"

export default function ItemCard({ item, type }) {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [showContactInfo, setShowContactInfo] = useState(false)
  const itemDate = new Date(item.date)
  const timeAgo = formatDistanceToNow(itemDate, { addSuffix: true })

  const handleReport = async (itemId, reason) => {
    try {
      const response = await fetch('http://localhost:5000/api/flags/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          itemID: itemId,
          reason: reason
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to report item');
      }

      return response.json();
    } catch (error) {
      console.error('Error reporting item:', error);
      throw error;
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={item.image || "/placeholder.svg"}
          alt={item.title}
          className="h-full w-full object-cover transition-all hover:scale-105"
        />
      </div>
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant={type === "lost" ? "destructive" : "default"}>{type === "lost" ? "Lost" : "Found"}</Badge>
            <Badge variant="outline" className="ml-2">
              {item.category}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">{timeAgo}</div>
        </div>
        <CardTitle className="mt-2 line-clamp-1">{item.title}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-1 h-3 w-3" />
          {item.location}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <div className="flex items-center space-x-4">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{item.user.name ? item.user.name.charAt(0).toUpperCase() : "U"}</AvatarFallback>
          </Avatar>
          <div className="text-sm font-medium">{item.user.name}</div>
        </div>

        <Dialog open={showContactInfo} onOpenChange={setShowContactInfo}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Phone className="mr-2 h-4 w-4" />
              Contact
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Contact Information</DialogTitle>
              <DialogDescription>Contact the {type === "lost" ? "owner" : "finder"} of this item</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{item.user.name ? item.user.name.charAt(0).toUpperCase() : "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{item.user.name}</div>
                  <div className="text-sm text-muted-foreground">{type === "lost" ? "Item Owner" : "Item Finder"}</div>
                </div>
              </div>

              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Email:</span>
                  <a href={`mailto:${item.contactInfo?.email || item.user?.email || ''}`} className="text-sm text-primary hover:underline">
                    {item.contactInfo?.email || item.user?.email || 'Email not available'}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Phone:</span>
                  <a href={`tel:${item.contactInfo?.phone || item.user?.phone || ''}`} className="text-sm text-primary hover:underline">
                    {item.contactInfo?.phone || item.user?.phone || 'Phone not available'}
                  </a>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                {(item.contactInfo?.email || item.user?.email || item.contactInfo?.phone || item.user?.phone) 
                  ? "Please be respectful and only contact for legitimate purposes related to this " + type + " item."
                  : "Contact information is not available for this user."}
              </p>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button>Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
      <div className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/items/${item.id}`}>View Details</Link>
        </Button>
      </div>
    </Card>
  )
}
