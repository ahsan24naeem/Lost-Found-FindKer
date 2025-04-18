"use client"

import { useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import {
  BookmarkPlus,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  QrCode,
  Share2,
  ThumbsDown,
  ThumbsUp,
  Mail,
  Phone,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useToast } from "@/hooks/use-toast"
import Navbar from "@/components/navbar"

export default function ItemPage({ params }) {
  const { toast } = useToast()
  const [showClaimForm, setShowClaimForm] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [claimData, setClaimData] = useState({
    identifyingFeatures: "",
    serialNumber: "",
    additionalInfo: "",
  })

  // Mock data - would come from your API
  const item = {
    id: params.id,
    title: "iPhone 13 Pro",
    category: "Electronics",
    location: "Central Park, New York",
    date: "2023-04-15",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    description:
      "Lost my iPhone 13 Pro with a blue case near the fountain in Central Park. It has a cracked screen protector but the screen itself is fine. The lock screen wallpaper is a picture of a mountain. Last seen around 3 PM on Saturday. If found, please contact me as soon as possible.",
    user: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40",
      joinDate: "2022-01-15",
      followers: 245,
      following: 123,
      contactInfo: {
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
      },
    },
    type: "lost",
    status: "active",
    verifications: 5,
    views: 120,
    likes: 24,
    shares: 8,
    comments: [
      {
        id: 1,
        user: {
          name: "Jane Smith",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content: "I think I saw something similar at the coffee shop yesterday. Was it near the window?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        likes: 3,
      },
      {
        id: 2,
        user: {
          name: "Mike Johnson",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content: "I'll keep an eye out for it. Have you checked with the lost and found office at the park?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
        likes: 5,
      },
    ],
  }

  const itemDate = new Date(item.date)
  const timeAgo = formatDistanceToNow(itemDate, { addSuffix: true })

  const handleClaimSubmit = () => {
    // In a real app, this would send the claim to the backend
    toast({
      title: "Claim Submitted",
      description: "Your claim has been submitted and is pending review by the finder.",
    })
    setShowClaimForm(false)
  }

  const handleContactOwner = () => {
    toast({
      title: "Contact Information",
      description: "Contact information is now visible. Please be respectful when reaching out.",
    })
  }

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % item.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + item.images.length) % item.images.length)
  }

  const handleClaimChange = (e) => {
    const { name, value } = e.target
    setClaimData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <>
      <Navbar />
      <div className="container py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/home">
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Back to Feed
                </Link>
              </Button>
              <Badge variant={item.type === "lost" ? "destructive" : "default"}>
                {item.type === "lost" ? "Lost" : "Found"}
              </Badge>
              <Badge variant="outline">{item.category}</Badge>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">{item.title}</h1>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={isLiked ? "text-primary" : ""}
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? "fill-primary" : ""}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={isSaved ? "text-primary" : ""}
                    onClick={() => setIsSaved(!isSaved)}
                  >
                    <BookmarkPlus className={`h-5 w-5 ${isSaved ? "fill-primary" : ""}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      toast({
                        title: "Shared",
                        description: "Link copied to clipboard",
                      })
                    }}
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4" />
                  {item.location}
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  {timeAgo}
                </div>
                <div>
                  Status: <span className="font-medium capitalize text-foreground">{item.status}</span>
                </div>
              </div>
            </div>

            <div className="mb-8 overflow-hidden rounded-lg">
              <div className="relative">
                <img
                  src={item.images[currentImageIndex] || "/placeholder.svg"}
                  alt={`${item.title} ${currentImageIndex + 1}`}
                  className="w-full object-cover"
                />
                {item.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-background/80 shadow-md"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-background/80 shadow-md"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
                      {item.images.map((_, index) => (
                        <div
                          key={index}
                          className={`h-2 w-2 rounded-full ${
                            index === currentImageIndex ? "bg-primary" : "bg-background/80"
                          }`}
                        ></div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="mb-8 grid grid-cols-3 gap-2">
              {item.images.map((image, index) => (
                <div
                  key={index}
                  className={`overflow-hidden rounded-lg border-2 ${
                    index === currentImageIndex ? "border-primary" : "border-transparent"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${item.title} ${index + 1}`}
                    className="aspect-video w-full cursor-pointer object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-5 w-5 fill-primary text-primary" />
                  <span>{item.likes} likes</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>{item.comments.length} comments</span>
                </div>
                <div className="flex items-center gap-1">
                  <Share2 className="h-5 w-5" />
                  <span>{item.shares} shares</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground">{item.views} views</span>
              </div>
            </div>

            <Separator className="mb-6" />

            <Tabs defaultValue="details" className="mb-8">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="comments">Comments ({item.comments.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Item Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{item.description}</p>

                    <Accordion type="single" collapsible className="mt-4">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>Additional Details</AccordionTrigger>
                        <AccordionContent>
                          <div className="grid gap-2">
                            <div className="flex justify-between">
                              <span className="font-medium">Brand:</span>
                              <span>Apple</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Color:</span>
                              <span>Graphite</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Serial Number:</span>
                              <span>XXXX (Last 4 digits)</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Identifying Features:</span>
                              <span>Blue case, cracked screen protector</span>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="comments" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Comments</CardTitle>
                    <CardDescription>Join the conversation about this item</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {item.comments.map((comment) => (
                        <div key={comment.id} className="space-y-4">
                          <div className="flex gap-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.name} />
                              <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="font-medium">{comment.user.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                                </div>
                              </div>
                              <p className="text-sm">{comment.content}</p>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => {
                                      toast({
                                        title: "Liked",
                                        description: "Comment liked",
                                      })
                                    }}
                                  >
                                    <ThumbsUp className="h-4 w-4" />
                                  </Button>
                                  <span className="text-xs">{comment.likes}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card className="mb-6 sticky top-20">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {item.type === "found" ? (
                  <Button className="w-full" onClick={() => setShowClaimForm(true)}>
                    Claim This Item
                  </Button>
                ) : (
                  <Button className="w-full" asChild>
                    <Link href={`/found?match=${item.id}`}>I Found This</Link>
                  </Button>
                )}

                <Button variant="outline" className="w-full" onClick={handleContactOwner}>
                  <Phone className="mr-2 h-4 w-4" />
                  Contact {item.type === "lost" ? "Owner" : "Finder"}
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: "QR Code Generated",
                      description: "QR code has been generated and can be shared",
                    })
                  }}
                >
                  <QrCode className="mr-2 h-4 w-4" />
                  Generate QR Code
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      toast({
                        title: "Verified",
                        description: "You've verified this item report",
                      })
                    }}
                  >
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    Verify
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      toast({
                        title: "Flagged",
                        description: "This item has been flagged for review",
                      })
                    }}
                  >
                    <ThumbsDown className="mr-2 h-4 w-4" />
                    Flag
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Posted By</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={item.user.avatar || "/placeholder.svg"} alt={item.user.name} />
                    <AvatarFallback>{item.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{item.user.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Member since {new Date(item.user.joinDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                  <div>
                    <div className="font-medium text-foreground">{item.user.followers}</div>
                    <div>Followers</div>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{item.user.following}</div>
                    <div>Following</div>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">24</div>
                    <div>Posts</div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Contact Information</h3>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${item.user.contactInfo.email}`} className="text-sm text-primary hover:underline">
                      {item.user.contactInfo.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${item.user.contactInfo.phone}`} className="text-sm text-primary hover:underline">
                      {item.user.contactInfo.phone}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={showClaimForm} onOpenChange={setShowClaimForm}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Claim This Item</DialogTitle>
              <DialogDescription>
                To verify you are the owner, please provide specific details about this item that only the owner would
                know.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="identifying-features" className="text-sm font-medium">
                  Identifying Features
                </label>
                <Input
                  id="identifying-features"
                  name="identifyingFeatures"
                  value={claimData.identifyingFeatures}
                  onChange={handleClaimChange}
                  placeholder="Describe unique features of the item"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="serial-number" className="text-sm font-medium">
                  Serial Number (if applicable)
                </label>
                <Input
                  id="serial-number"
                  name="serialNumber"
                  value={claimData.serialNumber}
                  onChange={handleClaimChange}
                  placeholder="Enter the serial number"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="additional-info" className="text-sm font-medium">
                  Additional Information
                </label>
                <Input
                  id="additional-info"
                  name="additionalInfo"
                  value={claimData.additionalInfo}
                  onChange={handleClaimChange}
                  placeholder="Provide any other details that would verify your ownership"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowClaimForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleClaimSubmit}>Submit Claim</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
