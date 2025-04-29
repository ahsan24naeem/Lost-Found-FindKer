"use client"

import { useState, useRef, useEffect } from "react"
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
import AuthCheck from "@/components/AuthCheck"

export default function PostItemPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const defaultType = searchParams.get("type") || "lost"

  const [itemType, setItemType] = useState(defaultType)
  const [image, setImage] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null)
  const [categories, setCategories] = useState([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    location: "",
    contactEmail: user?.email || "",
    contactPhone: "",
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/categories/all')
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.details || 'Failed to fetch categories')
        }
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
        toast({
          title: "Error",
          description: error.message || "Failed to load categories. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [toast])

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
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImage(file)

      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setPreviewImage(previewUrl)
    }
  }

  const removeImage = () => {
    setImage(null)
    if (previewImage) {
      URL.revokeObjectURL(previewImage) // Clean up URL
    }
    setPreviewImage(null)
  }

  // Function to generate QR code URL
  const generateQRCode = (postId) => {
    const postUrl = `${window.location.origin}/post/${postId}`
    const encodedUrl = encodeURIComponent(postUrl)
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedUrl}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("Form submitted!")
    setIsSubmitting(true)

    // Check if user is authenticated
    if (!user) {
      console.log("No user found, redirecting to login")
      toast({
        title: "Error",
        description: "Please log in to create a post",
        variant: "destructive",
      })
      setIsSubmitting(false)
      router.push("/login")
      return
    }

    console.log("User object:", user)
    console.log("User ID:", user.id)

    // Validate form
    if (!formData.title || !formData.description || !formData.category || !formData.date || !formData.location) {
      console.log("Missing required fields:", formData)
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      let uploadedImageURL = null
   
      // 1. First upload the image if one was selected
      if (image) {
        console.log("Image selected, preparing to upload")
        const formData = new FormData()
        formData.append('image', image)
   
        console.log('Uploading image:', image.name)
        try {
          // First test if the upload endpoint is accessible
          console.log("Testing upload endpoint...")
          const testResponse = await fetch('http://localhost:5000/api/upload-image/test')
          console.log("Test response status:", testResponse.status)
          
          if (!testResponse.ok) {
            throw new Error(`Test endpoint failed: ${testResponse.status} ${testResponse.statusText}`)
          }
          const testData = await testResponse.json()
          console.log('Test endpoint response:', testData)

          // Now try the actual upload
          console.log("Sending image to upload endpoint...")
          const response = await fetch('http://localhost:5000/api/upload-image', {
            method: 'POST',
            credentials: 'include',
            body: formData,
          })
   
          console.log('Upload response status:', response.status)
          const responseText = await response.text()
          console.log('Raw response:', responseText)
          
          if (!response.ok) {
            let errorData
            try {
              errorData = JSON.parse(responseText)
            } catch (e) {
              throw new Error(`Server returned non-JSON response: ${responseText}`)
            }
            throw new Error(errorData.error || `Failed to upload image: ${response.status} ${response.statusText}`)
          }
   
          let data
          try {
            data = JSON.parse(responseText)
          } catch (e) {
            throw new Error(`Invalid JSON response: ${responseText}`)
          }

          if (!data.imageUrl) {
            throw new Error('No image URL returned from server')
          }
          console.log('Successfully uploaded image:', data.imageUrl)
          uploadedImageURL = data.imageUrl
        } catch (error) {
          console.error('Upload error:', error)
          throw error
        }
      } else {
        console.log("No image selected for upload")
      }
   
      // 2. Fetch category ID
      console.log("Fetching categories...")
      const categoryResponse = await fetch('http://localhost:5000/api/categories/all')
      console.log("Category response status:", categoryResponse.status)
      
      if (!categoryResponse.ok) {
        throw new Error('Failed to fetch categories')
      }
      const categories = await categoryResponse.json()
      console.log("Categories fetched:", categories)
      
      const category = categories.find(c => c.CategoryName === formData.category)
      if (!category) {
        throw new Error('Invalid category selected')
      }
      console.log("Selected category:", category)
   
      // 3. Prepare post data
      const postData = {
        userID: user.id,
        title: formData.title,
        itemDescription: formData.description,
        categoryID: category.CategoryID,
        itemStatus: itemType,
        itemLocation: formData.location,
        imageURL: uploadedImageURL,
      }
      
      console.log('Prepared post data:', postData)
         
      // 4. Send post data
      try {
        console.log('Sending post data to backend...');
        
        const response = await fetch('http://localhost:5000/api/post/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(postData),
        });
        
        console.log('Response status:', response.status);
        
        // Get the response text first
        const responseText = await response.text();
        console.log('Raw response text:', responseText);
        
        // Try to parse it as JSON
        let responseData;
        try {
          responseData = JSON.parse(responseText);
          console.log('Parsed response data:', responseData);
        } catch (e) {
          console.error('Failed to parse response as JSON:', e);
          throw new Error('Server returned invalid JSON response');
        }
        
        // Check if the response was successful
        if (!response.ok) {
          throw new Error(responseData.error || 'Failed to create post');
        }
        
        // Success!
        toast({
          title: "Success",
          description: `Your ${itemType} item has been posted successfully!`,
        });
        
        router.push("/home");
      } catch (error) {
        console.error('Error creating post:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to create post. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error creating post:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to create post. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false);
    }
  }
  
  return (
    <>
      <AuthCheck />
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
                      <SelectValue placeholder={isLoadingCategories ? "Loading categories..." : "Select category"} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.CategoryID} value={category.CategoryName}>
                          {category.CategoryName}
                        </SelectItem>
                      ))}
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
                  <Label>Upload Image</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs text-primary"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon className="mr-1 h-4 w-4" />
                    Add Photo
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {previewImage ? (
                    <div className="relative aspect-square rounded-md border bg-muted">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="h-full w-full rounded-md object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute right-1 top-1 h-6 w-6"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
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
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload a clear photo to help with identification.
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => router.push("/home")}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  onClick={(e) => {
                    console.log("Submit button clicked");
                    // Prevent default to handle manually
                    e.preventDefault();
                    // Call handleSubmit directly
                    handleSubmit(e);
                  }}
                >
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
