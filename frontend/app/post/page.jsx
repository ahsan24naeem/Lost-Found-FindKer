"use client"

import { useState, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Camera, ChevronLeft, MapPin, Upload, X, ImageIcon, Paperclip, Tag, Calendar } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/hooks/use-toast"
import Navbar from "@/components/navbar"

export default function PostItemPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const defaultType = searchParams.get("type") || "lost"

  const [itemType, setItemType] = useState(defaultType)
  const [images, setImages] = useState([])
  const [previewImages, setPreviewImages] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    location: "",
    contactEmail: user?.email || "",
    contactPhone: "",
    identifyingFeatures: "",
    contactPreference: "platform",
    visibility: "public",
    offerReward: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setImages([...images, ...filesArray])

      // Create preview URLs
      const newPreviewImages = filesArray.map((file) => URL.createObjectURL(file))
      setPreviewImages([...previewImages, ...newPreviewImages])
    }
  }

  const removeImage = (index) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)

    const newPreviewImages = [...previewImages]
    URL.revokeObjectURL(newPreviewImages[index]) // Clean up URL
    newPreviewImages.splice(index, 1)
    setPreviewImages(newPreviewImages)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    if (!formData.title || !formData.description || !formData.category || !formData.date || !formData.location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Simulate API call with setTimeout
    setTimeout(() => {
      setIsSubmitting(false)

      toast({
        title: "Success",
        description: `Your ${itemType} item has been posted successfully!`,
      })

      // Redirect to home page after successful submission
      router.push("/home")
    }, 2000)
  }

  return (
    <>
      <Navbar />
      <div className="container max-w-4xl py-8">
        <div className="mb-6 flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/home">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Feed
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt={user?.name || "User"} />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>Create a Post</CardTitle>
                <CardDescription>Share details about a lost or found item</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={itemType} onValueChange={setItemType} className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="lost">
                  <Badge variant="destructive" className="mr-2">
                    Lost
                  </Badge>
                  Lost Item
                </TabsTrigger>
                <TabsTrigger value="found">
                  <Badge className="mr-2">Found</Badge>
                  Found Item
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Item Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Black Leather Wallet, iPhone 13 Pro"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide a detailed description of the item..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange("category", value)}
                    required
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="jewelry">Jewelry</SelectItem>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                      <SelectItem value="documents">Documents</SelectItem>
                      <SelectItem value="keys">Keys</SelectItem>
                      <SelectItem value="bags">Bags</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">{itemType === "lost" ? "Date Lost" : "Date Found"}</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      type="date"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">{itemType === "lost" ? "Last Seen Location" : "Found Location"}</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Enter location"
                      className="pl-10"
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "Location",
                        description: "Using current location would request geolocation access in a real app.",
                      })
                    }}
                  >
                    Use Current
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Upload Images</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs text-primary"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon className="mr-1 h-4 w-4" />
                    Add Photos
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {previewImages.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-md border bg-muted">
                      <img
                        src={url || "/placeholder.svg"}
                        alt={`Preview ${index}`}
                        className="h-full w-full rounded-md object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute right-1 top-1 h-6 w-6"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {previewImages.length < 5 && (
                    <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border border-dashed bg-muted/50 hover:bg-muted">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <Camera className="h-8 w-8 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Add Photo</span>
                      </div>
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        multiple
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload up to 5 images. Clear photos help with identification.
                </p>
              </div>

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-primary"
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                >
                  {showAdvancedOptions ? "Hide Advanced Options" : "Show Advanced Options"}
                </Button>

                <div className="flex items-center gap-2">
                  <Paperclip className="h-4 w-4 text-muted-foreground" />
                  <Tag className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              {showAdvancedOptions && (
                <>
                  <Separator />

                  {itemType === "found" && (
                    <div className="space-y-2">
                      <Label>Identifying Features (Private)</Label>
                      <p className="text-xs text-muted-foreground mb-2">
                        Add details that only the owner would know. These will be kept private and used to verify
                        ownership.
                      </p>
                      <Textarea
                        name="identifyingFeatures"
                        value={formData.identifyingFeatures}
                        onChange={handleChange}
                        placeholder="e.g., Serial number, distinctive marks, contents if it's a bag..."
                        rows={3}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Contact Information</Label>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="contactEmail">Email</Label>
                        <Input
                          id="contactEmail"
                          name="contactEmail"
                          type="email"
                          value={formData.contactEmail}
                          onChange={handleChange}
                          placeholder="your@email.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactPhone">Phone Number</Label>
                        <Input
                          id="contactPhone"
                          name="contactPhone"
                          value={formData.contactPhone}
                          onChange={handleChange}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Contact Preferences</Label>
                    <RadioGroup
                      defaultValue="platform"
                      value={formData.contactPreference}
                      onValueChange={(value) => handleSelectChange("contactPreference", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem id="platform" value="platform" />
                        <Label htmlFor="platform">Platform notifications only</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem id="email" value="email" />
                        <Label htmlFor="email">Email notifications</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem id="phone" value="phone" />
                        <Label htmlFor="phone">Phone notifications</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Post Visibility</Label>
                    <Select
                      defaultValue="public"
                      value={formData.visibility}
                      onValueChange={(value) => handleSelectChange("visibility", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public - Anyone can see</SelectItem>
                        <SelectItem value="friends">Friends Only</SelectItem>
                        <SelectItem value="private">Private - Only through direct link</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col space-y-1">
                      <Label htmlFor="reward">Offer Reward</Label>
                      <span className="text-xs text-muted-foreground">Only for lost items</span>
                    </div>
                    <Switch
                      id="reward"
                      name="offerReward"
                      checked={formData.offerReward}
                      onCheckedChange={(checked) => handleSelectChange("offerReward", checked)}
                      disabled={itemType !== "lost"}
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => router.push("/home")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                      Posting...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Post {itemType === "lost" ? "Lost" : "Found"} Item
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
