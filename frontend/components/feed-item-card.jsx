"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { MoreHorizontal, ThumbsUp, ThumbsDown, Send, MessageCircle, Mail, Phone, Share2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
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
// Import the StatusBadge component
import StatusBadge from "@/components/status-badge"
// Add useAuth import at the top of the file
import { useAuth } from "@/context/auth-context"

// Add user from useAuth in the component
export default function FeedItemCard({ item }) {
  const { toast } = useToast()
  const { user } = useAuth() // Add this line to get the current user
  const [claimText, setClaimText] = useState("")
  const [claims, setClaims] = useState(item.claims || [])
  const [showClaims, setShowClaims] = useState(false)
  const [showContactDialog, setShowContactDialog] = useState(false)
  const [showMessageDialog, setShowMessageDialog] = useState(false)
  const [message, setMessage] = useState("")
  const [itemStatus, setItemStatus] = useState(item.status || "active")
  const [showShareDialog, setShowShareDialog] = useState(false)
  // const user = { email: "admin@example.com" }; // fix: declare user variable

  // Helper function to safely parse dates
  const parseDate = (dateString) => {
    if (!dateString) return new Date()
    try {
      // Try parsing as ISO string
      const date = new Date(dateString)
      if (!isNaN(date.getTime())) return date
      
      // Try parsing as SQL Server datetime string
      const sqlDate = new Date(dateString.replace(' ', 'T'))
      if (!isNaN(sqlDate.getTime())) return sqlDate
      
      return new Date()
    } catch (error) {
      console.error('Error parsing date:', error)
      return new Date()
    }
  }

  // Format date for display
  const formatDate = (date) => {
    try {
      const parsedDate = parseDate(date)
      return formatDistanceToNow(parsedDate, { addSuffix: true })
    } catch (error) {
      console.error('Error formatting date:', error)
      return 'Just now'
    }
  }

  // Transform backend data to match frontend expectations
  const transformedItem = {
    id: item.ItemID,
    type: item.ItemStatus?.toLowerCase() || 'lost',
    title: item.Title,
    category: item.CategoryName,
    location: item.ItemLocation,
    date: item.PostDate,
    images: item.ImageURL ? [`http://localhost:5000/uploads/${item.ImageURL}`] : [],
    description: item.ItemDescription,
    user: {
      name: item.PostedBy || 'Anonymous',
      avatar: item.UserAvatar || "/placeholder.svg",
    },
    likes: item.Likes || 0,
    comments: item.Comments || 0,
    shares: item.Shares || 0,
    isLiked: false,
    isSaved: false,
    contactInfo: {
      email: item.ContactEmail,
      phone: item.ContactPhone,
    },
    verifyCount: item.VerifyCount || 0,
    flagCount: item.FlagCount || 0,
  }

  // Function to handle adding a new claim
  const handleAddClaim = () => {
    if (!claimText.trim()) return

    const newClaim = {
      id: Date.now(),
      text: claimText,
      user: {
        name: "You", // In a real app, this would be the current user
        avatar: "/placeholder.svg?height=30&width=30",
      },
      timestamp: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      userVote: null, // null, 'up', or 'down'
      status: "pending", // Add default status as pending
    }

    setClaims([...claims, newClaim])
    setClaimText("")
    setShowClaims(true)

    toast({
      title: "Claim Submitted",
      description: "Your claim for this item has been submitted and is pending approval",
    })
  }

  // Add a function to handle claim status changes (for admin use)
  const handleClaimStatusChange = (claimId, newStatus) => {
    setClaims(
      claims.map((claim) => {
        if (claim.id === claimId) {
          return {
            ...claim,
            status: newStatus,
          }
        }
        return claim
      }),
    )

    toast({
      title: `Claim ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
      description: `The claim has been ${newStatus}`,
    })
  }

  // Function to handle voting on claims
  const handleClaimVote = (claimId, voteType) => {
    setClaims(
      claims.map((claim) => {
        if (claim.id === claimId) {
          // If user is changing their vote
          if (claim.userVote === voteType) {
            // Remove vote
            return {
              ...claim,
              upvotes: voteType === "up" ? claim.upvotes - 1 : claim.upvotes,
              downvotes: voteType === "down" ? claim.downvotes - 1 : claim.downvotes,
              userVote: null,
            }
          } else if (claim.userVote === null) {
            // New vote
            return {
              ...claim,
              upvotes: voteType === "up" ? claim.upvotes + 1 : claim.upvotes,
              downvotes: voteType === "down" ? claim.downvotes + 1 : claim.downvotes,
              userVote: voteType,
            }
          } else {
            // Changing vote from up to down or vice versa
            return {
              ...claim,
              upvotes: voteType === "up" ? claim.upvotes + 1 : claim.upvotes - 1,
              downvotes: voteType === "down" ? claim.downvotes + 1 : claim.downvotes - 1,
              userVote: voteType,
            }
          }
        }
        return claim
      }),
    )
  }

  const handleSendMessage = () => {
    if (!message.trim()) return

    toast({
      title: "Message Sent",
      description: `Your message has been sent to ${transformedItem.user.name}`,
    })

    setMessage("")
    setShowMessageDialog(false)
  }

  const handleMarkAsFound = () => {
    setItemStatus("found")
    toast({
      title: "Item Status Updated",
      description: "This item has been marked as found",
    })
  }

  const handleMarkAsLost = () => {
    setItemStatus("lost")
    toast({
      title: "Item Status Updated",
      description: "This item has been marked as lost",
    })
  }

  const handleShare = () => {
    setShowShareDialog(true)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Link Copied",
          description: "The link has been copied to your clipboard",
        })
        setShowShareDialog(false)
      },
      (err) => {
        toast({
          title: "Failed to Copy",
          description: "Could not copy the link to clipboard",
          variant: "destructive",
        })
        console.error("Could not copy text: ", err)
      },
    )
  }

  // Generate a shareable URL for the item
  const getShareableUrl = () => {
    // In a real app, this would be a proper URL with the item ID
    return `https://lostandfound.example.com/item/${transformedItem.id || "123"}`
  }

  return (
    <Card>
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={transformedItem.user.avatar || "/placeholder.svg"} alt={transformedItem.user.name} />
              <AvatarFallback>{transformedItem.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{transformedItem.user.name}</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{formatDate(transformedItem.date)}</span>
                <span>•</span>
                <Badge variant={transformedItem.type === "lost" ? "destructive" : "default"} className="text-[10px]">
                  {transformedItem.type === "lost" ? "Lost" : "Found"}
                </Badge>
                <StatusBadge status={itemStatus} />
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <Dialog>
          <DialogTrigger asChild>
            <h3 className="mb-1 text-lg font-semibold hover:text-primary cursor-pointer">{transformedItem.title}</h3>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{transformedItem.title}</DialogTitle>
              <DialogDescription>
                Posted by {transformedItem.user.name} • {formatDate(transformedItem.date)}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="overflow-hidden rounded-md">
                <img src={transformedItem.images[0] || "/placeholder.svg"} alt={transformedItem.title} className="h-auto w-full" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Description</h4>
                <p className="text-sm text-muted-foreground">{transformedItem.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Category</h4>
                  <p className="text-sm text-muted-foreground">{transformedItem.category}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Location</h4>
                  <p className="text-sm text-muted-foreground">{transformedItem.location}</p>
                </div>
              </div>
              <div className="flex justify-between">
                <Button onClick={() => setShowContactDialog(true)}>
                  Contact {transformedItem.type === "lost" ? "Owner" : "Finder"}
                </Button>
                <Button variant="outline" onClick={() => setShowMessageDialog(true)}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </div>
              <div className="mt-4 border-t pt-4">
                <h4 className="text-sm font-medium mb-2">Item Status</h4>
                <div className="flex gap-2">
                  <Badge variant={itemStatus === "found" ? "default" : "outline"} className="px-3 py-1">
                    {itemStatus === "found" ? "Found ✓" : "Found"}
                  </Badge>
                  <Badge variant={itemStatus === "lost" ? "destructive" : "outline"} className="px-3 py-1">
                    {itemStatus === "lost" ? "Lost ✓" : "Lost"}
                  </Badge>
                  <Badge variant={itemStatus === "claimed" ? "success" : "outline"} className="px-3 py-1">
                    {itemStatus === "claimed" ? "Claimed ✓" : "Claimed"}
                  </Badge>
                </div>
                <div className="flex gap-2 mt-2">
                  {itemStatus !== "found" && (
                    <Button size="sm" variant="outline" onClick={handleMarkAsFound}>
                      Mark as Found
                    </Button>
                  )}
                  {itemStatus !== "lost" && (
                    <Button size="sm" variant="outline" onClick={handleMarkAsLost}>
                      Mark as Lost
                    </Button>
                  )}
                  {itemStatus !== "claimed" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setItemStatus("claimed")
                        toast({
                          title: "Item Status Updated",
                          description: "This item has been marked as claimed",
                        })
                      }}
                    >
                      Mark as Claimed
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <p className="mb-2 text-sm text-muted-foreground">{transformedItem.description}</p>
        <div className="mb-2 text-xs text-muted-foreground">
          <span className="font-medium">Location:</span> {transformedItem.location}
        </div>
        <div className="mb-2 text-xs text-muted-foreground">
          <span className="font-medium">Category:</span> {transformedItem.category}
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <div className="overflow-hidden rounded-md cursor-pointer">
              <img
                src={transformedItem.images[0] || "/placeholder.svg"}
                alt={transformedItem.title}
                className="h-auto w-full transition-transform duration-300 hover:scale-105"
              />
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{transformedItem.title}</DialogTitle>
              <DialogDescription>
                Posted by {transformedItem.user.name} • {formatDate(transformedItem.date)}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="overflow-hidden rounded-md">
                <img src={transformedItem.images[0] || "/placeholder.svg"} alt={transformedItem.title} className="h-auto w-full" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Description</h4>
                <p className="text-sm text-muted-foreground">{transformedItem.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Category</h4>
                  <p className="text-sm text-muted-foreground">{transformedItem.category}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Location</h4>
                  <p className="text-sm text-muted-foreground">{transformedItem.location}</p>
                </div>
              </div>
              <div className="flex justify-between">
                <Button onClick={() => setShowContactDialog(true)}>
                  Contact {transformedItem.type === "lost" ? "Owner" : "Finder"}
                </Button>
                <Button variant="outline" onClick={() => setShowMessageDialog(true)}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </div>
              <div className="mt-4 border-t pt-4">
                <h4 className="text-sm font-medium mb-2">Item Status</h4>
                <div className="flex gap-2">
                  <Badge variant={itemStatus === "found" ? "default" : "outline"} className="px-3 py-1">
                    {itemStatus === "found" ? "Found ✓" : "Found"}
                  </Badge>
                  <Badge variant={itemStatus === "lost" ? "destructive" : "outline"} className="px-3 py-1">
                    {itemStatus === "lost" ? "Lost ✓" : "Lost"}
                  </Badge>
                  <Badge variant={itemStatus === "claimed" ? "success" : "outline"} className="px-3 py-1">
                    {itemStatus === "claimed" ? "Claimed ✓" : "Claimed"}
                  </Badge>
                </div>
                <div className="flex gap-2 mt-2">
                  {itemStatus !== "found" && (
                    <Button size="sm" variant="outline" onClick={handleMarkAsFound}>
                      Mark as Found
                    </Button>
                  )}
                  {itemStatus !== "lost" && (
                    <Button size="sm" variant="outline" onClick={handleMarkAsLost}>
                      Mark as Lost
                    </Button>
                  )}
                  {itemStatus !== "claimed" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setItemStatus("claimed")
                        toast({
                          title: "Item Status Updated",
                          description: "This item has been marked as claimed",
                        })
                      }}
                    >
                      Mark as Claimed
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
      <CardFooter className="flex flex-col p-0">
        {/* Updated footer with Claims | Message | Share buttons */}
        <div className="flex items-center justify-between border-t p-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={() => {
              setShowClaims(true)
              document.getElementById("claim-input")?.scrollIntoView({ behavior: "smooth" })
            }}
          >
            <MessageCircle className="mr-1 h-4 w-4" />
            Claims
          </Button>
          <Button variant="ghost" size="sm" className="flex-1" onClick={() => setShowMessageDialog(true)}>
            <Mail className="mr-1 h-4 w-4" />
            Message
          </Button>
          <Button variant="ghost" size="sm" className="flex-1" onClick={handleShare}>
            <Share2 className="mr-1 h-4 w-4" />
            Share
          </Button>
        </div>

        {/* Claim input section */}
        <div className="border-t p-3">
          <div className="flex gap-2 mb-2">
            <Input
              id="claim-input"
              placeholder="Submit a claim for this item..."
              value={claimText}
              onChange={(e) => setClaimText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleAddClaim()
                }
              }}
            />
            <Button size="sm" onClick={handleAddClaim} disabled={!claimText.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Claims ({claims.length})</h4>
              {claims.length > 0 && (
                <Button variant="ghost" size="sm" className="text-xs" onClick={() => setShowClaims(!showClaims)}>
                  {showClaims ? "Hide" : "Show"}
                </Button>
              )}
            </div>

            {showClaims && claims.length > 0 && (
              <div className="space-y-3 mt-2 max-h-60 overflow-y-auto">
                {claims.map((claim) => (
                  <div key={claim.id} className="flex gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={claim.user.avatar || "/placeholder.svg"} alt={claim.user.name} />
                      <AvatarFallback>{claim.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg px-3 py-2 text-sm flex-1">
                      <div className="font-medium text-xs flex justify-between">
                        <span>{claim.user.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              claim.status === "approved"
                                ? "success"
                                : claim.status === "rejected"
                                  ? "destructive"
                                  : "outline"
                            }
                            className="text-[10px]"
                          >
                            {claim.status}
                          </Badge>
                          <span className="text-muted-foreground">
                            {formatDistanceToNow(new Date(claim.timestamp), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      <div>{claim.text}</div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-xs text-muted-foreground">Is this claim valid?</div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-6 px-2 ${claim.userVote === "up" ? "bg-green-100 dark:bg-green-900" : ""}`}
                            onClick={() => handleClaimVote(claim.id, "up")}
                          >
                            <ThumbsUp
                              className={`h-3 w-3 mr-1 ${claim.userVote === "up" ? "text-green-600 fill-green-600" : ""}`}
                            />
                            <span className="text-xs">{claim.upvotes}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-6 px-2 ${claim.userVote === "down" ? "bg-red-100 dark:bg-red-900" : ""}`}
                            onClick={() => handleClaimVote(claim.id, "down")}
                          >
                            <ThumbsDown
                              className={`h-3 w-3 mr-1 ${claim.userVote === "down" ? "text-red-600 fill-red-600" : ""}`}
                            />
                            <span className="text-xs">{claim.downvotes}</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardFooter>

      {/* Contact Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Information</DialogTitle>
            <DialogDescription>Contact the {transformedItem.type === "lost" ? "owner" : "finder"} of this item</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={transformedItem.user.avatar || "/placeholder.svg"} alt={transformedItem.user.name} />
                <AvatarFallback>{transformedItem.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{transformedItem.user.name}</div>
                <div className="text-sm text-muted-foreground">
                  {transformedItem.type === "lost" ? "Item Owner" : "Item Finder"}
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Email:</span>
                <a
                  href={`mailto:${transformedItem.contactInfo?.email || "user@example.com"}`}
                  className="text-sm text-primary hover:underline"
                >
                  {transformedItem.contactInfo?.email || "user@example.com"}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Phone:</span>
                <a
                  href={`tel:${transformedItem.contactInfo?.phone || "+1234567890"}`}
                  className="text-sm text-primary hover:underline"
                >
                  {transformedItem.contactInfo?.phone || "+1234567890"}
                </a>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Please be respectful and only contact for legitimate purposes related to this {transformedItem.type} item.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message</DialogTitle>
            <DialogDescription>
              Send a message to {transformedItem.user.name} about this {transformedItem.type} item
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={transformedItem.user.avatar || "/placeholder.svg"} alt={transformedItem.user.name} />
                <AvatarFallback>{transformedItem.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{transformedItem.user.name}</div>
                <div className="text-sm text-muted-foreground">
                  {transformedItem.type === "lost" ? "Item Owner" : "Item Finder"}
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-3">
              <h4 className="text-sm font-medium mb-2">Item: {transformedItem.title}</h4>
              <textarea
                className="w-full min-h-[100px] p-2 border rounded-md"
                placeholder={`Hi ${transformedItem.user.name}, I'm interested in your ${transformedItem.type} item...`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMessageDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage} disabled={!message.trim()}>
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Claims Dialog */}
      <Dialog open={showClaims} onOpenChange={setShowClaims}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Claims</DialogTitle>
            <DialogDescription>Claims submitted for this item</DialogDescription>
          </DialogHeader>
          <div className="mt-4 border-t pt-4">
            <h4 className="text-sm font-medium mb-2">Claims</h4>
            {claims.length === 0 ? (
              <p className="text-sm text-muted-foreground">No claims have been submitted for this item yet.</p>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {claims.map((claim) => (
                  <div key={claim.id} className="flex gap-2 border rounded-lg p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={claim.user.avatar || "/placeholder.svg"} alt={claim.user.name} />
                      <AvatarFallback>{claim.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div className="font-medium">{claim.user.name}</div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              claim.status === "approved"
                                ? "success"
                                : claim.status === "rejected"
                                  ? "destructive"
                                  : "outline"
                            }
                          >
                            {claim.status}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(claim.timestamp), { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm mt-1">{claim.text}</p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-xs text-muted-foreground">
                          Community validation: {claim.upvotes - claim.downvotes} points
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-6 px-2 ${claim.userVote === "up" ? "bg-green-100 dark:bg-green-900" : ""}`}
                            onClick={() => handleClaimVote(claim.id, "up")}
                          >
                            <ThumbsUp
                              className={`h-3 w-3 mr-1 ${claim.userVote === "up" ? "text-green-600 fill-green-600" : ""}`}
                            />
                            <span className="text-xs">{claim.upvotes}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-6 px-2 ${claim.userVote === "down" ? "bg-red-100 dark:bg-red-900" : ""}`}
                            onClick={() => handleClaimVote(claim.id, "down")}
                          >
                            <ThumbsDown
                              className={`h-3 w-3 mr-1 ${claim.userVote === "down" ? "text-red-600 fill-red-600" : ""}`}
                            />
                            <span className="text-xs">{claim.downvotes}</span>
                          </Button>
                        </div>
                      </div>

                      {/* Admin controls for claim approval/rejection */}
                      {user?.email === "admin@example.com" && (
                        <div className="mt-2 pt-2 border-t flex justify-end gap-2">
                          {claim.status !== "approved" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 border-green-600 hover:bg-green-50"
                              onClick={() => handleClaimStatusChange(claim.id, "approved")}
                            >
                              Approve
                            </Button>
                          )}
                          {claim.status !== "rejected" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-600 hover:bg-red-50"
                              onClick={() => handleClaimStatusChange(claim.id, "rejected")}
                            >
                              Reject
                            </Button>
                          )}
                          {claim.status !== "pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleClaimStatusChange(claim.id, "pending")}
                            >
                              Reset to Pending
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4">
              <Input
                placeholder="Submit a claim for this item..."
                value={claimText}
                onChange={(e) => setClaimText(e.target.value)}
                className="mb-2"
              />
              <Button onClick={handleAddClaim} disabled={!claimText.trim()}>
                Submit Claim
              </Button>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Share This Item</DialogTitle>
            <DialogDescription>Share this {transformedItem.type} item with others who might be able to help</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="rounded-lg border p-3">
              <h4 className="text-sm font-medium mb-2">Item: {transformedItem.title}</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Copy the link below to share this item on social media or messaging apps
              </p>
              <div className="flex gap-2">
                <Input readOnly value={getShareableUrl()} className="bg-muted" onClick={(e) => e.target.select()} />
                <Button size="sm" onClick={() => copyToClipboard(getShareableUrl())}>
                  Copy
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-16 p-2"
                onClick={() => {
                  window.open(
                    `https://wa.me/?text=${encodeURIComponent(`${transformedItem.title} - ${getShareableUrl()}`)}`,
                    "_blank",
                  )
                }}
              >
                <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center mb-1">
                  <span className="text-white text-xs">W</span>
                </div>
                <span className="text-xs">WhatsApp</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-16 p-2"
                onClick={() => {
                  window.open(
                    `https://t.me/share/url?url=${encodeURIComponent(getShareableUrl())}&text=${encodeURIComponent(transformedItem.title)}`,
                    "_blank",
                  )
                }}
              >
                <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center mb-1">
                  <span className="text-white text-xs">T</span>
                </div>
                <span className="text-xs">Telegram</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-16 p-2"
                onClick={() => {
                  window.open(
                    `mailto:?subject=${encodeURIComponent(`Lost and Found: ${transformedItem.title}`)}&body=${encodeURIComponent(`Check out this ${transformedItem.type} item: ${getShareableUrl()}`)}`,
                    "_blank",
                  )
                }}
              >
                <div className="h-6 w-6 rounded-full bg-gray-500 flex items-center justify-center mb-1">
                  <span className="text-white text-xs">E</span>
                </div>
                <span className="text-xs">Email</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-16 p-2"
                onClick={() => {
                  window.open(`sms:?body=${encodeURIComponent(`${transformedItem.title} - ${getShareableUrl()}`)}`, "_blank")
                }}
              >
                <div className="h-6 w-6 rounded-full bg-green-600 flex items-center justify-center mb-1">
                  <span className="text-white text-xs">S</span>
                </div>
                <span className="text-xs">SMS</span>
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowShareDialog(false)}>
              Close
            </Button>
            <Button onClick={() => copyToClipboard(getShareableUrl())}>Copy Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
