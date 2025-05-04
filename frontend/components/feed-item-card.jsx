"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { MoreHorizontal, ThumbsUp, ThumbsDown, Send, MessageCircle, Mail, Phone, Share2, Check, Flag } from "lucide-react"
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
import StatusBadge from "@/components/status-badge"
import { useAuth } from "@/context/auth-context"
import { QRCodeModal } from "@/components/QRCodeModal"
import ReportDialog from "@/components/report-dialog"

// API helpers
const fetchClaims = async (itemID) => {
  try {
    const res = await fetch(`http://localhost:5000/api/claim/getClaimsOnItem/${itemID}`)
    if (!res.ok) {
      console.error('fetchClaims error:', res.status, await res.text())
      throw new Error("Failed to fetch claims")
    }
    const data = await res.json()
    return Array.isArray(data) ? data : data.claims || []
  } catch (err) {
    console.error('fetchClaims exception:', err)
    throw err
  }
}

const createClaim = async (itemID, userID, claimDetails) => {
  try {
    const res = await fetch("http://localhost:5000/api/claim/create-Claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemID, userID, claimDetails })
    })
    if (!res.ok) {
      console.error('createClaim error:', res.status, await res.text())
      throw new Error("Failed to create claim")
    }
    return await res.json()
  } catch (err) {
    console.error('createClaim exception:', err)
    throw err
  }
}

const voteClaim = async (claimID, userID, voteType) => {
  try {
    const res = await fetch("http://localhost:5000/api/claim/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ claimID, userID, voteType })
    })
    if (!res.ok) {
      console.error('voteClaim error:', res.status, await res.text())
      throw new Error("Failed to vote on claim")
    }
    return await res.json()
  } catch (err) {
    console.error('voteClaim exception:', err)
    throw err
  }
}

const deleteClaim = async (claimID, userID) => {
  try {
    const res = await fetch("http://localhost:5000/api/claim/deleteClaim", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ claimID, userID })
    })
    if (!res.ok) {
      console.error('deleteClaim error:', res.status, await res.text())
      throw new Error("Failed to delete claim")
    }
    return await res.json()
  } catch (err) {
    console.error('deleteClaim exception:', err)
    throw err
  }
}



export default function FeedItemCard({ item }) {
  const { toast } = useToast()
  const { user } = useAuth()
  const [claimText, setClaimText] = useState("")
  const [claims, setClaims] = useState([])
  const [showClaims, setShowClaims] = useState(false)
  const [showContactDialog, setShowContactDialog] = useState(false)
  const [showMessageDialog, setShowMessageDialog] = useState(false)
  const [message, setMessage] = useState("")
  const [itemStatus, setItemStatus] = useState(item.status || "active")
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)

  useEffect(() => {
    setItemStatus(item.itemStatus || "active")
  }, [item.itemStatus])

  // Fetch claims on mount and when item changes
  useEffect(() => {
    if (!item.ItemID) return
    const loadClaims = async () => {
      try {
        const data = await fetchClaims(item.ItemID)
        setClaims(data)
        if (data.length > 0) setShowClaims(true)
      } catch (error) {
        console.error("Failed to load claims:", error)
        toast({
          title: "Error",
          description: "Could not load claims",
          variant: "destructive"
        })
        setClaims([])
      }
    }
    
    loadClaims()
  }, [item.ItemID, toast])

  const parseDate = (dateString) => {
    if (!dateString) return new Date()
    try {
      const date = new Date(dateString)
      if (!isNaN(date.getTime())) return date
      
      const sqlDate = new Date(dateString.replace(' ', 'T'))
      if (!isNaN(sqlDate.getTime())) return sqlDate
      
      return new Date()
    } catch (error) {
      console.error('Error parsing date:', error)
      return new Date()
    }
  }

  const formatDate = (date) => {
    try {
      const parsedDate = parseDate(date)
      return formatDistanceToNow(parsedDate, { addSuffix: true })
    } catch (error) {
      console.error('Error formatting date:', error)
      return 'Just now'
    }
  }

  const transformedItem = {
    id: item.ItemID,
    type: item.ItemStatus?.toLowerCase() || 'lost',
    title: item.Title,
    category: item.CategoryName,
    location: item.ItemLocation,
    date: (item.DateReported || item.PostDate || item.CreatedAt || new Date()).toString(),
    images: item.ImageURL ? [`${item.ImageURL}`] : [],
    description: item.ItemDescription,
    user: {
      id: typeof item.UserID === "number" ? item.UserID : null,
      name: item.PostedBy || 'Anonymous',
      avatar: item.UserAvatar || "/placeholder.svg",
    },
    verifyCount: item.VerifyCount || 0,
    flagCount: item.FlagCount || 0,
  }

  const acknowledgeClaim = async (claimID, userID) => {
    try {
      const res = await fetch("http://localhost:5000/api/claim/acknowledge-claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          claimID, 
          userID,
          itemID: transformedItem.id 
        })
      })
      if (!res.ok) {
        console.error('acknowledgeClaim error:', res.status, await res.text())
        throw new Error("Failed to acknowledge claim")
      }
      return await res.json()
    } catch (err) {
      console.error('acknowledgeClaim exception:', err)
      throw err
    }
  }

  const handleAddClaim = async () => {
    if (!claimText.trim() || !user?.id) return
    try {
      await createClaim(transformedItem.id, user.id, claimText)
      setClaimText("")
      toast({ title: "Claim Submitted", description: "Your claim for this item has been submitted." })
      
      // Refresh claims
      const updated = await fetchClaims(transformedItem.id)
      setClaims(updated)
      setShowClaims(true)
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    }
  }

  const handleClaimVote = async (claimId, voteType) => {
    if (!user?.id) return
    try {
      await voteClaim(claimId, user.id, voteType)
      // Refresh claims
      const updated = await fetchClaims(transformedItem.id)
      setClaims(updated)
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    }
  }

  const handleDeleteClaim = async (claimId) => {
    if (!user?.id) return
    try {
      await deleteClaim(claimId, user.id)
      toast({ title: "Claim Deleted" })
      // Refresh claims
      const updated = await fetchClaims(transformedItem.id)
      setClaims(updated)
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    }
  }

  const handleSendMessage = async () => {
    if (!message.trim()) return

    try {
      await fetch("http://localhost:5000/api/message/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderID: user.id,
          receiverID: transformedItem.user.id,
          postID: transformedItem.id,
          messageText: message,
        }),
      })

      toast({
        title: "Message Sent",
        description: `Your message has been sent to ${transformedItem.user.name}`,
      })

      setMessage("")
      setShowMessageDialog(false)
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      })
    }
  }

  const handleShare = () => {
    setShowShareDialog(true)
  }

  const handleQRCodeShare = () => {
    setShowQRCode(true)
    setShowShareDialog(false)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copied!",
          description: "Link copied to clipboard",
        })
      },
      (err) => {
        console.error("Could not copy text: ", err)
        toast({
          title: "Error",
          description: "Failed to copy link",
          variant: "destructive",
        })
      }
    )
  }

  const getShareableUrl = () => {
    return `${window.location.origin}/post/${transformedItem.id || "123"}`
  }

  const canUpdateStatus = user && (user.id === transformedItem.user.id || user.isAdmin)

  const canMarkAsClaimed = (
    itemStatus !== "Retrieved" &&
    (
      (transformedItem.type === "lost" && user && user.id === transformedItem.user.id) ||
      (transformedItem.type === "found" && user && (user.role === "admin" || user.id === transformedItem.user.id))
    )
  )

  const handleMarkAsClaimed = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/post/mark-as-claimed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemID: transformedItem.id,
          userID: user.id,
          claimedBy: user.id
        })
      })
      if (!res.ok) throw new Error("Failed to mark as claimed")
      setItemStatus("Retrieved")
      toast({
        title: "Item Status Updated",
        description: "This item has been marked as claimed",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Could not mark as claimed",
        variant: "destructive"
      })
    }
  }

  const isRetrieved = transformedItem.type === "retrieved"

  // Normalize claim data structure
  const normalizeClaim = (claim) => ({
    id: claim.ClaimID || claim.id,
    text: claim.ClaimDetails || claim.text,
    user: {
      id: claim.UserID || claim.userID,
      name: claim.ClaimerName || claim.ClaimedBy || claim.user?.name || "Anonymous",
      avatar: claim.avatar || claim.user?.avatar || "/placeholder.svg"
    },
    timestamp: claim.CreatedAt || claim.timestamp,
    upvotes: claim.Upvotes || claim.upvotes || 0,
    downvotes: claim.Downvotes || claim.downvotes || 0,
    status: claim.Status || claim.status || "pending"
  })

  const handleAcknowledgeClaim = async (claimId) => {
    if (!user?.id) return
    try {
      await acknowledgeClaim(claimId, user.id)
      // Refresh claims
      const updated = await fetchClaims(transformedItem.id)
      setClaims(updated)
      toast({ title: "Claim Acknowledged", description: "You acknowledged this claim." })
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    }
  }

  const handleReport = async (itemId, reason) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "Please log in to report items",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/flags/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          itemID: itemId,
          reason: reason,
          userID: user.id
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to report item');
      }

      const data = await response.json();
      toast({
        title: "Success",
        description: "Item reported successfully",
      });
      return data;
    } catch (error) {
      console.error('Error reporting item:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to report item",
        variant: "destructive"
      });
      throw error;
    }
  };

  return (
    <>
      <Card className="w-full mb-4">
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>{transformedItem.user.name ? transformedItem.user.name.charAt(0).toUpperCase() : "U"}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{transformedItem.user.name}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatDate(transformedItem.date)}</span>
                  <span>•</span>
                  <Badge 
                    variant={
                      transformedItem.type === "lost" ? "destructive" : 
                      transformedItem.type === "found" ? "default" : 
                      transformedItem.type === "retrieved" ? "retrieved" :
                      itemStatus === "pending" ? "pending" : "default"
                    }
                    className="text-[10px]"
                  >
                    {transformedItem.type === "lost"
                      ? "Lost"
                      : transformedItem.type === "found"
                        ? "Found"
                        : transformedItem.type === "retrieved"
                          ? "Retrieved"
                          : itemStatus === "pending"
                            ? "Pending"
                            : ""}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ReportDialog itemId={transformedItem.id} onReport={handleReport} />
              {user && user.id === transformedItem.user.id && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={async () => {
                        try {
                          const res = await fetch(`http://localhost:5000/api/post/delete/${transformedItem.id}`, {
                            method: "DELETE",
                          });
                          if (!res.ok) throw new Error("Failed to delete post");
                          toast({ title: "Post Deleted", description: "Your post has been deleted." });
                          window.location.reload();
                        } catch (err) {
                          toast({ title: "Delete Failed", description: err.message || "Could not delete post.", variant: "destructive" });
                        }
                      }}
                      className="text-destructive"
                    >
                      Delete post
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          <h3 className="mb-1 text-lg font-semibold">{transformedItem.title}</h3>
          <p className="mb-2 text-sm text-muted-foreground">{transformedItem.description}</p>
          <div className="mb-2 text-xs text-muted-foreground">
            <span className="font-medium">Location:</span> {transformedItem.location}
          </div>
          <div className="mb-2 text-xs text-muted-foreground">
            <span className="font-medium">Category:</span> {transformedItem.category}
          </div>
          <div className="overflow-hidden rounded-md">
            <img
              src={transformedItem.images[0] || "/placeholder.svg"}
              alt={transformedItem.title}
              className="h-auto w-full"
            />
          </div>
          
          {isRetrieved ? (
            <div className="mt-6 flex flex-col items-center gap-2">
              <Badge variant="retrieved" className="text-base px-4 py-2 rounded-md shadow-sm">RETRIEVED</Badge>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 text-sm px-3 py-1 rounded-md mt-2"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          ) : itemStatus === "pending" ? (
            <div className="mt-6 flex flex-col items-center gap-2">
              <Badge variant="pending" className="text-base px-4 py-2 rounded-md shadow-sm">PENDING</Badge>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 text-sm px-3 py-1 rounded-md mt-2"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          ) : canMarkAsClaimed && transformedItem.type === "lost" ? (
            <div className="mt-4">
              <Button
                size="sm"
                variant="outline"
                onClick={handleMarkAsClaimed}
              >
                Mark as Retrieved
              </Button>
            </div>
          ) : null}
        </CardContent>
        
        {!isRetrieved && itemStatus !== "pending" && (
          <CardFooter className="flex flex-col p-0">
            <div className="flex items-center justify-between border-t p-2">
              {transformedItem.type === "found" && (
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
              )}
              {(transformedItem.type === "lost" || transformedItem.type === "found") && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex-1" 
                onClick={() => setShowMessageDialog(true)}
                disabled={!user}
              >
                <Mail className="mr-1 h-4 w-4" />
                Message
              </Button>
              )}
              <Button variant="ghost" size="sm" className="flex-1" onClick={handleShare}>
                <Share2 className="mr-1 h-4 w-4" />
                Share
              </Button>
            </div>

            {transformedItem.type === "found" && (
              <>
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
                  disabled={!user}
                />
                <Button 
                  size="sm" 
                  onClick={handleAddClaim} 
                  disabled={!claimText.trim() || !user}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
                </div>

                {showClaims && claims.length > 0 && (
                  <div className="space-y-3 mt-2 max-h-60 overflow-y-auto">
                    {claims.map((claim) => {
                      const normalizedClaim = normalizeClaim(claim)
                      return (
                        <div
                          key={normalizedClaim.id}
                          className="flex items-start gap-3 rounded-lg bg-white dark:bg-muted/60 shadow-sm border border-muted p-3 hover:shadow-md transition-shadow"
                        >
                          <Avatar className="h-8 w-8 mt-1">
                            <AvatarFallback>{normalizedClaim.user.name ? normalizedClaim.user.name.charAt(0).toUpperCase() : "U"}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-sm">{normalizedClaim.user.name}</span>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={
                                    normalizedClaim.status === "approved"
                                      ? "success"
                                      : normalizedClaim.status === "rejected"
                                        ? "destructive"
                                        : "outline"
                                  }
                                  className="text-[10px] px-2 py-0.5"
                                >
                                  {normalizedClaim.status}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(normalizedClaim.timestamp)}
                                </span>
                                {user?.id === normalizedClaim.user.id && (
                                  <Button 
                                    size="xs" 
                                    variant="ghost" 
                                    className="text-xs px-2 py-0.5"
                                    onClick={() => handleDeleteClaim(normalizedClaim.id)}
                                  >
                                    Delete
                                  </Button>
                                )}
                              </div>
                            </div>
                            <div className="mb-2 text-sm text-muted-foreground break-words">
                              {normalizedClaim.text}
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <div className="text-xs text-muted-foreground">Is this claim valid?</div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 rounded-full border border-green-200 hover:bg-green-50 dark:hover:bg-green-900/30"
                                  onClick={() => handleClaimVote(normalizedClaim.id, "Upvote")}
                                  disabled={!user}
                                >
                                  <ThumbsUp className="h-3 w-3 mr-1 text-green-600" />
                                  <span className="text-xs">{normalizedClaim.upvotes}</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 rounded-full border border-red-200 hover:bg-red-50 dark:hover:bg-red-900/30"
                                  onClick={() => handleClaimVote(normalizedClaim.id, "Downvote")}
                                  disabled={!user}
                                >
                                  <ThumbsDown className="h-3 w-3 mr-1 text-red-600" />
                                  <span className="text-xs">{normalizedClaim.downvotes}</span>
                                </Button>
                                {user?.id === transformedItem.user.id && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-6 px-2 rounded-full"
                                  onClick={() => handleAcknowledgeClaim(normalizedClaim.id)}
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  Ack Claim
                                </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </>
            )}
          </CardFooter>
        )}
      </Card>

      {/* Dialogs remain the same */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Information</DialogTitle>
            <DialogDescription>Contact the {transformedItem.type === "lost" ? "owner" : "finder"} of this item</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>{transformedItem.user.name ? transformedItem.user.name.charAt(0).toUpperCase() : "U"}</AvatarFallback>
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
                <AvatarFallback>{transformedItem.user.name ? transformedItem.user.name.charAt(0).toUpperCase() : "U"}</AvatarFallback>
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
                className="w-full min-h-[100px] p-2 border rounded-md text-black"
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

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Post</DialogTitle>
            <DialogDescription>
              Share this post with others
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input value={getShareableUrl()} readOnly />
              <Button onClick={() => copyToClipboard(getShareableUrl())}>
                Copy
              </Button>
            </div>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={handleQRCodeShare}>
                <Share2 className="mr-2 h-4 w-4" />
                QR Code
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <QRCodeModal
        isOpen={showQRCode}
        onClose={() => {
          setShowQRCode(false)
        }}
        postId={transformedItem.id}
        postTitle={transformedItem.title}
      />
    </>
  )
}