"use client"

import { useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { BookmarkPlus, Mail, Phone, MoreHorizontal, Share2, ThumbsUp } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

export default function FeedItemCard({ item, onLike, onSave }) {
  const { toast } = useToast()
  const [showContactInfo, setShowContactInfo] = useState(false)

  const handleShare = () => {
    // In a real app, this would use the Web Share API or copy to clipboard
    toast({
      title: "Link Copied",
      description: "Item link has been copied to clipboard",
    })
  }

  return (
    <Card>
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={item.user.avatar || "/placeholder.svg"} alt={item.user.name} />
              <AvatarFallback>{item.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{item.user.name}</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{formatDistanceToNow(new Date(item.date), { addSuffix: true })}</span>
                <span>•</span>
                <Badge variant={item.type === "lost" ? "destructive" : "default"} className="text-[10px]">
                  {item.type === "lost" ? "Lost" : "Found"}
                </Badge>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => toast({ title: "Report", description: "Item has been reported" })}>
                Report post
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast({ title: "Hidden", description: "Post has been hidden" })}>
                Hide post
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toast({ title: "Following", description: "You are now following this user" })}
              >
                Follow {item.user.name}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <Link href={`/items/${item.id}`}>
          <h3 className="mb-1 text-lg font-semibold hover:text-primary">{item.title}</h3>
        </Link>
        <p className="mb-2 text-sm text-muted-foreground">{item.description}</p>
        <div className="mb-2 text-xs text-muted-foreground">
          <span className="font-medium">Location:</span> {item.location}
        </div>
        <Link href={`/items/${item.id}`}>
          <div className="overflow-hidden rounded-md">
            <img
              src={item.images[0] || "/placeholder.svg"}
              alt={item.title}
              className="h-auto w-full transition-transform duration-300 hover:scale-105"
            />
          </div>
        </Link>
      </CardContent>
      <CardFooter className="flex flex-col p-0">
        <div className="flex items-center justify-between border-t border-b p-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <ThumbsUp className="h-3 w-3 fill-primary text-primary" />
            <span>{item.likes} likes</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{item.comments} comments</span>
            <span>{item.shares} shares</span>
          </div>
        </div>
        <div className="flex items-center justify-between p-1">
          <Button
            variant="ghost"
            size="sm"
            className={`flex-1 ${item.isLiked ? "text-primary" : ""}`}
            onClick={() => onLike(item.id)}
          >
            <ThumbsUp className={`mr-1 h-4 w-4 ${item.isLiked ? "fill-primary" : ""}`} />
            Like
          </Button>

          <Dialog open={showContactInfo} onOpenChange={setShowContactInfo}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="flex-1">
                <Phone className="mr-1 h-4 w-4" />
                Contact
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Contact Information</DialogTitle>
                <DialogDescription>
                  Contact the {item.type === "lost" ? "owner" : "finder"} of this item
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={item.user.avatar || "/placeholder.svg"} alt={item.user.name} />
                    <AvatarFallback>{item.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{item.user.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.type === "lost" ? "Item Owner" : "Item Finder"}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Email:</span>
                    <a href={`mailto:${item.contactInfo.email}`} className="text-sm text-primary hover:underline">
                      {item.contactInfo.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Phone:</span>
                    <a href={`tel:${item.contactInfo.phone}`} className="text-sm text-primary hover:underline">
                      {item.contactInfo.phone}
                    </a>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  Please be respectful and only contact for legitimate purposes related to this {item.type} item.
                </p>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button>Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="ghost" size="sm" className="flex-1" onClick={handleShare}>
            <Share2 className="mr-1 h-4 w-4" />
            Share
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`flex-1 ${item.isSaved ? "text-primary" : ""}`}
            onClick={() => onSave(item.id)}
          >
            <BookmarkPlus className={`mr-1 h-4 w-4 ${item.isSaved ? "fill-primary" : ""}`} />
            Save
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
