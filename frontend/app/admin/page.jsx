"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, Search, UserX, FileX, Shield, Users, FileText, MessageCircle, X, Eye } from "lucide-react"
import SidebarNav from "@/components/sidebar-nav"
import MobileNav from "@/components/mobile-nav"
import { formatDistanceToNow } from "date-fns"
import AdminAccess from "./access"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

const ADMIN_CREDENTIALS = [
  { username: "adminAhsan", password: "admin1", name: "Ahsan" },
  { username: "adminAaiza", password: "admin2", name: "Aaiza" },
  { username: "adminZoha", password: "admin3", name: "Zoha" },
]

export default function AdminDashboardPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()
  const { setUser } = useAuth()

  // Mock data for users
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      role: "User",
      status: "Active",
      joinDate: "2022-01-15",
      avatar: "/placeholder.svg?height=40&width=40",
      postsCount: 12,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "User",
      status: "Active",
      joinDate: "2022-02-20",
      avatar: "/placeholder.svg?height=40&width=40",
      postsCount: 8,
    },
    {
      id: 3,
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      role: "Moderator",
      status: "Active",
      joinDate: "2022-03-10",
      avatar: "/placeholder.svg?height=40&width=40",
      postsCount: 5,
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.davis@example.com",
      role: "User",
      status: "Inactive",
      joinDate: "2022-04-05",
      avatar: "/placeholder.svg?height=40&width=40",
      postsCount: 3,
    },
    {
      id: 5,
      name: "Michael Wilson",
      email: "michael.wilson@example.com",
      role: "Admin",
      status: "Active",
      joinDate: "2022-05-15",
      avatar: "/placeholder.svg?height=40&width=40",
      postsCount: 20,
    },
  ])

  // Mock data for posts
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "iPhone 13 Pro",
      type: "lost",
      category: "Electronics",
      location: "Central Park, New York",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
      status: "Active",
      user: {
        id: 1,
        name: "John Doe",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      reportCount: 0,
    },
    {
      id: 2,
      title: "Gold Necklace",
      type: "found",
      category: "Jewelry",
      location: "Bryant Park, New York",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
      status: "Active",
      user: {
        id: 2,
        name: "Jane Smith",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      reportCount: 2,
    },
    {
      id: 3,
      title: "Black Wallet",
      type: "lost",
      category: "Personal Items",
      location: "Times Square, New York",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
      status: "Resolved",
      user: {
        id: 3,
        name: "Robert Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      reportCount: 0,
    },
    {
      id: 4,
      title: "Laptop Bag",
      type: "found",
      category: "Electronics",
      location: "Grand Central Station, New York",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
      status: "Active",
      user: {
        id: 4,
        name: "Emily Davis",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      reportCount: 5,
    },
    {
      id: 5,
      title: "Car Keys",
      type: "lost",
      category: "Keys",
      location: "Madison Square Garden, New York",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(), // 12 days ago
      status: "Active",
      user: {
        id: 5,
        name: "Michael Wilson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      reportCount: 1,
    },
  ])

  // Mock data for reports
  const [reports, setReports] = useState([
    {
      id: 1,
      type: "Post",
      reason: "Inappropriate content",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
      status: "Pending",
      reporter: {
        id: 2,
        name: "Jane Smith",
      },
      reported: {
        id: 1,
        type: "Post",
        title: "iPhone 13 Pro",
        user: {
          id: 1,
          name: "John Doe",
        },
      },
    },
    {
      id: 2,
      type: "User",
      reason: "Spam",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
      status: "Resolved",
      reporter: {
        id: 3,
        name: "Robert Johnson",
      },
      reported: {
        id: 4,
        type: "User",
        name: "Emily Davis",
      },
    },
    {
      id: 3,
      type: "Post",
      reason: "Fake item",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), // 4 days ago
      status: "Pending",
      reporter: {
        id: 5,
        name: "Michael Wilson",
      },
      reported: {
        id: 2,
        type: "Post",
        title: "Gold Necklace",
        user: {
          id: 2,
          name: "Jane Smith",
        },
      },
    },
  ])

  // Mock data for claims
  const [claims, setClaims] = useState([
    {
      id: 1,
      text: "This is my iPhone. I can prove it by providing the serial number and unlock code.",
      item: {
        id: 1,
        title: "iPhone 13 Pro",
        type: "found",
      },
      user: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      status: "pending",
      upvotes: 5,
      downvotes: 1,
    },
    {
      id: 2,
      text: "I lost this necklace at the beach yesterday. It has my initials engraved on the back.",
      item: {
        id: 2,
        title: "Gold Necklace",
        type: "found",
      },
      user: {
        name: "Sarah Williams",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      status: "approved",
      upvotes: 8,
      downvotes: 0,
    },
    {
      id: 3,
      text: "These are my car keys. I can describe the keychain and what other keys are on it.",
      item: {
        id: 5,
        title: "Car Keys with Red Keychain",
        type: "found",
      },
      user: {
        name: "Mike Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      status: "rejected",
      upvotes: 2,
      downvotes: 7,
    },
  ])

  // Stats for dashboard
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter((user) => user.status === "Active").length,
    totalPosts: posts.length,
    activePosts: posts.filter((post) => post.status === "Active").length,
    resolvedPosts: posts.filter((post) => post.status === "Resolved").length,
    pendingReports: reports.filter((report) => report.status === "Pending").length,
    pendingClaims: claims.filter((claim) => claim.status === "pending").length,
  }

  const handleDeleteUser = (userId) => {
    setUsers(users.filter((user) => user.id !== userId))
    toast({
      title: "User Deleted",
      description: "The user has been deleted successfully.",
    })
  }

  const handleDeletePost = (postId) => {
    setPosts(posts.filter((post) => post.id !== postId))
    toast({
      title: "Post Deleted",
      description: "The post has been deleted successfully.",
    })
  }

  const handleResolveReport = (reportId) => {
    setReports(reports.map((report) => (report.id === reportId ? { ...report, status: "Resolved" } : report)))
    toast({
      title: "Report Resolved",
      description: "The report has been marked as resolved.",
    })
  }

  const handleClaimAction = (claimId, action) => {
    setClaims(
      claims.map((claim) => {
        if (claim.id === claimId) {
          return {
            ...claim,
            status: action,
          }
        }
        return claim
      }),
    )

    const actionMessages = {
      approved: "Claim has been approved",
      rejected: "Claim has been rejected",
      pending: "Claim has been reset to pending",
    }

    toast({
      title: `Claim ${action.charAt(0).toUpperCase() + action.slice(1)}`,
      description: actionMessages[action],
    })
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.user.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredClaims = claims.filter(
    (claim) =>
      claim.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.user.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleLogin = (e) => {
    e.preventDefault()
    const found = ADMIN_CREDENTIALS.find(
      (admin) => admin.username === form.username && admin.password === form.password
    )
    if (found) {
      setUser({
        name: found.name,
        username: found.username,
        role: "admin",
        email: `${found.username}@admin.com`,
      })
      toast({ title: "Success", description: "Logged in as admin." })
      router.push("/admin/dashboard")
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid admin credentials.",
        variant: "destructive",
      })
    }
  }

  return (
    <AdminAccess>
      <div className="flex min-h-screen">
        {/* Left Sidebar - Hidden on mobile */}
        <SidebarNav className="hidden lg:block" />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="container py-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage users, posts, and reports</p>
            </div>

            <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4 grid w-full grid-cols-4">
                <TabsTrigger value="dashboard">
                  <Shield className="mr-2 h-4 w-4" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="users">
                  <Users className="mr-2 h-4 w-4" />
                  Users
                </TabsTrigger>
                <TabsTrigger value="posts">
                  <FileText className="mr-2 h-4 w-4" />
                  Posts
                </TabsTrigger>
                <TabsTrigger value="claims">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Claims
                </TabsTrigger>
              </TabsList>

              {/* Dashboard Tab */}
              <TabsContent value="dashboard">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalUsers}</div>
                      <p className="text-xs text-muted-foreground">{stats.activeUsers} active users</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalPosts}</div>
                      <p className="text-xs text-muted-foreground">
                        {stats.activePosts} active, {stats.resolvedPosts} resolved
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.pendingReports}</div>
                      <p className="text-xs text-muted-foreground">Requires attention</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Pending Claims</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.pendingClaims}</div>
                      <p className="text-xs text-muted-foreground">Awaiting verification</p>
                    </CardContent>
                  </Card>
                </div>

                <h2 className="mt-8 mb-4 text-xl font-semibold">Recent Reports</h2>
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Reason</TableHead>
                          <TableHead>Reported</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reports.map((report) => (
                          <TableRow key={report.id}>
                            <TableCell>
                              <Badge variant="outline">{report.type}</Badge>
                            </TableCell>
                            <TableCell>{report.reason}</TableCell>
                            <TableCell>
                              {report.reported.type === "Post" ? report.reported.title : report.reported.name}
                            </TableCell>
                            <TableCell>{formatDistanceToNow(new Date(report.date), { addSuffix: true })}</TableCell>
                            <TableCell>
                              <Badge variant={report.status === "Pending" ? "destructive" : "default"}>
                                {report.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {report.status === "Pending" && (
                                <Button variant="ghost" size="sm" onClick={() => handleResolveReport(report.id)}>
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <h2 className="mt-8 mb-4 text-xl font-semibold">Recent Claims</h2>
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Votes</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {claims
                          .sort((a, b) => new Date(b.date) - new Date(a.date))
                          .slice(0, 3)
                          .map((claim) => (
                            <TableRow key={claim.id}>
                              <TableCell>
                                <Badge variant={claim.item.type === "lost" ? "destructive" : "default"}>
                                  {claim.item.type}
                                </Badge>
                                <span className="ml-2">{claim.item.title}</span>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={claim.user.avatar || "/placeholder.svg"} alt={claim.user.name} />
                                    <AvatarFallback>{claim.user.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs">{claim.user.name}</span>
                                </div>
                              </TableCell>
                              <TableCell>{formatDistanceToNow(new Date(claim.date), { addSuffix: true })}</TableCell>
                              <TableCell>
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
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <span className="text-green-600 text-xs">+{claim.upvotes}</span>
                                  <span className="text-red-600 text-xs">-{claim.downvotes}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setActiveTab("claims")}
                                  className="text-xs"
                                >
                                  View All
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Users Tab */}
              <TabsContent value="users">
                <div className="mb-4 flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Posts</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>{user.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant={user.role === "Admin" ? "default" : "outline"}>{user.role}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.status === "Active" ? "success" : "secondary"}>{user.status}</Badge>
                            </TableCell>
                            <TableCell>{user.postsCount}</TableCell>
                            <TableCell>{formatDistanceToNow(new Date(user.joinDate), { addSuffix: true })}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteUser(user.id)}
                                disabled={user.role === "Admin"}
                              >
                                <UserX className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Posts Tab */}
              <TabsContent value="posts">
                <div className="mb-4 flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search posts..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Reports</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPosts.map((post) => (
                          <TableRow key={post.id}>
                            <TableCell>{post.title}</TableCell>
                            <TableCell>
                              <Badge variant={post.type === "lost" ? "destructive" : "default"}>
                                {post.type === "lost" ? "Lost" : "Found"}
                              </Badge>
                            </TableCell>
                            <TableCell>{post.category}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={post.user.avatar || "/placeholder.svg"} alt={post.user.name} />
                                  <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-xs">{post.user.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-[150px] truncate">{post.location}</TableCell>
                            <TableCell>{formatDistanceToNow(new Date(post.date), { addSuffix: true })}</TableCell>
                            <TableCell>
                              <Badge variant={post.status === "Active" ? "outline" : "secondary"}>{post.status}</Badge>
                            </TableCell>
                            <TableCell>
                              {post.reportCount > 0 ? (
                                <Badge variant="destructive">{post.reportCount}</Badge>
                              ) : (
                                <span>0</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" onClick={() => handleDeletePost(post.id)}>
                                <FileX className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="claims">
                <div className="mb-4 flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search claims..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Claim</TableHead>
                          <TableHead>Item</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Votes</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredClaims.map((claim) => (
                          <TableRow key={claim.id}>
                            <TableCell className="max-w-[200px] truncate">{claim.text}</TableCell>
                            <TableCell>
                              <Badge variant={claim.item.type === "lost" ? "destructive" : "default"}>
                                {claim.item.type}
                              </Badge>
                              <span className="ml-2">{claim.item.title}</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={claim.user.avatar || "/placeholder.svg"} alt={claim.user.name} />
                                  <AvatarFallback>{claim.user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-xs">{claim.user.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>{formatDistanceToNow(new Date(claim.date), { addSuffix: true })}</TableCell>
                            <TableCell>
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
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="text-green-600 text-xs">+{claim.upvotes}</span>
                                <span className="text-red-600 text-xs">-{claim.downvotes}</span>
                                <span className="text-xs">({claim.upvotes - claim.downvotes})</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {claim.status !== "approved" && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-green-600"
                                    onClick={() => handleClaimAction(claim.id, "approved")}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                )}
                                {claim.status !== "rejected" && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-600"
                                    onClick={() => handleClaimAction(claim.id, "rejected")}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                                {claim.status !== "pending" && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleClaimAction(claim.id, "pending")}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Mobile Navigation */}
        <MobileNav />
      </div>
    </AdminAccess>
  )
}
