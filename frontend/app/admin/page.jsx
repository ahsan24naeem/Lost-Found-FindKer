"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, XCircle, Search, UserX, FileX, Shield, Users, FileText, MessageCircle, Flag } from "lucide-react"
import SidebarNav from "@/components/sidebar-nav"
import MobileNav from "@/components/mobile-nav"
import { formatDistanceToNow } from "date-fns"
import AdminAccess from "./access"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export default function AdminDashboardPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()
  const { setUser } = useAuth()

  // Add new state for pending items
  const [pendingItems, setPendingItems] = useState([])

  // Fetch pending items from backend API
  useEffect(() => {
    const fetchPendingItems = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/post/pending-items")
        if (!res.ok) throw new Error("Failed to fetch pending items")
        const data = await res.json()
        setPendingItems(
          Array.isArray(data)
            ? data.map(item => ({
                id: item.ItemID,
                title: item.Title || "",
                description: item.ItemDescription || "",
                location: item.ItemLocation || "",
                category: item.CategoryName || "",
                status: item.ItemStatus || "Pending",
                date: item.DateReported || new Date().toISOString(),
                image: item.ImageURL || "/placeholder.svg",
                postedBy: {
                  id: item.PosterID,
                  name: item.PostedBy || "",
                },
                claimedBy: item.ClaimedBy ? {
                  id: item.ClaimantID,
                  name: item.ClaimedBy,
                } : null,
                CID: item.ClaimID,
              }))
            : []
        )
      } catch (err) {
        setPendingItems([])
        toast({
          title: "Error",
          description: err.message || "Failed to load pending items.",
          variant: "destructive",
        })
      }
    }
    fetchPendingItems()
  }, [toast])

  // Fetch users from backend API
  const [users, setUsers] = useState([])
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/user/all")
        if (!res.ok) throw new Error("Failed to fetch users")
        const data = await res.json()
        setUsers(
          Array.isArray(data)
            ? data.map(user => ({
                id: user.UserID,
                name: user.FullName,
                email: user.Email,
                role: user.UserRole || "User",
                status: user.Status || "Active", // or whatever your backend provides
                joinDate: user.CreatedAt || new Date().toISOString(),
                avatar: user.ProfilePic || "/placeholder.svg",
                postsCount: user.PostsCount || 0, // if you have this info
              }))
            : []
        )
      } catch (err) {
        setUsers([])
        toast({
          title: "Error",
          description: err.message || "Failed to load users.",
          variant: "destructive",
        })
      }
    }
    fetchUsers()
  }, [toast])

  // Fetch posts from backend API
  const [posts, setPosts] = useState([])
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/post/all")
        if (!res.ok) throw new Error("Failed to fetch posts")
        const data = await res.json()
        setPosts(
          Array.isArray(data)
            ? data.map(post => ({
                id: post.ItemID,
                title: post.Title || "",
                location: post.ItemLocation || "",
                user: {
                  name: post.UserName || "",
                  avatar: post.UserAvatar || "/placeholder.svg",
                },
                status: post.ItemStatus || "Active",
                category: post.CategoryName || "",
                date: post.CreatedAt || new Date().toISOString(),
                reportCount: post.ReportCount || 0,
              }))
            : []
        )
      } catch (err) {
        setPosts([])
        toast({
          title: "Error",
          description: err.message || "Failed to load posts.",
          variant: "destructive",
        })
      }
    }
    fetchPosts()
  }, [toast])

  const [reports, setReports] = useState([]);
  const [claims, setClaims] = useState([]);

  // Dashboard stats from backend
  const [dashboardCounts, setDashboardCounts] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalReports: 0,
  })

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [userRes, postRes, reportRes] = await Promise.all([
          fetch("http://localhost:5000/api/user/userCount"),
          fetch("http://localhost:5000/api/post/postCount"),
          fetch("http://localhost:5000/api/flags/reports"),
        ])
        if (!userRes.ok || !postRes.ok || !reportRes.ok) throw new Error("Failed to fetch dashboard counts")
        const userData = await userRes.json()
        const postData = await postRes.json()
        const reportData = await reportRes.json()
        setDashboardCounts({
          totalUsers: userData.TotalUsers || 0,
          totalPosts: postData.TotalPosts || 0,
          totalReports: reportData.TotalReports || 0,
        })
      } catch (err) {
        setDashboardCounts({ totalUsers: 0, totalPosts: 0, totalReports: 0 })
        toast({
          title: "Error",
          description: err.message || "Failed to load dashboard stats.",
          variant: "destructive",
        })
      }
    }
    fetchCounts()
  }, [toast])

  // Stats for dashboard
  const stats = {
    totalUsers: dashboardCounts.totalUsers,
    activeUsers: users.filter((user) => user.status === "Active").length,
    totalPosts: dashboardCounts.totalPosts,
    activePosts: posts.filter((post) => post.status === "Active").length,
    resolvedPosts: posts.filter((post) => post.status === "Resolved").length,
    pendingReports: dashboardCounts.totalReports,
    pendingClaims: claims.filter((claim) => claim.status === "pending").length,
  }

  const handleDeleteUser = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/user/delete/${userId}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete user")
      setUsers(users.filter((user) => user.id !== userId))
      toast({
        title: "User Deleted",
        description: "The user has been deleted successfully.",
      })
    } catch (err) {
      toast({
        title: "Delete Failed",
        description: err.message || "Could not delete user.",
        variant: "destructive",
      })
    }
  }

  const handleDeletePost = async (postId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/post/delete/${postId}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete post")
      setPosts(posts.filter((post) => post.id !== postId))
      toast({
        title: "Post Deleted",
        description: "The post has been deleted successfully.",
      })
    } catch (err) {
      toast({
        title: "Delete Failed",
        description: err.message || "Could not delete post.",
        variant: "destructive",
      })
    }
  }

  const handleResolveReport = (reportId) => {
    setReports(reports.map((report) => (report.id === reportId ? { ...report, status: "Resolved" } : report)))
    toast({
      title: "Report Resolved",
      description: "The report has been marked as resolved.",
    })
  }

  const handleClaimAction = async (claimId, action) => {
    try {
      const res = await fetch('http://localhost:5000/api/claim/admin/process-claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          claimID: claimId,
          status: action === 'approved' ? 'Approved' : 'Rejected'
        }),
      });

      if (!res.ok) throw new Error(`Failed to ${action} claim`);

      // Update the pending items list
      setPendingItems(prevItems => prevItems.filter(item => item.id !== claimId));

      toast({
        title: "Success",
        description: `Claim ${action}ed successfully`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || `Failed to ${action} claim`,
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredPosts = posts.filter(
    (post) =>
      (post.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.location || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      ((post.user?.name || "").toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const filteredClaims = claims.filter(
    (claim) =>
      claim.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.user.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Fetch pending reports
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/flags/pending", {
          credentials: 'include'
        });
        if (!res.ok) throw new Error("Failed to fetch reports");
        const data = await res.json();
        setReports(data.map(report => ({
          id: report.FlagID,
          itemId: report.ItemID,
          itemTitle: report.ItemTitle,
          reason: report.Reason,
          reportedBy: report.ReportedByName,
          reportedByID: report.ReportedBy,
          date: report.DateReported,
          status: report.FlagStatus
        })));
      } catch (err) {
        toast({
          title: "Error",
          description: err.message || "Failed to load reports",
          variant: "destructive"
        });
      }
    };
    fetchReports();
  }, [toast]);

  const handleProcessReport = async (reportId, action) => {
    try {
      const res = await fetch(`http://localhost:5000/api/flags/process/${reportId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          review: action
        }),
        credentials: 'include'
      });

      if (!res.ok) throw new Error(`Failed to ${action} report`);

      // Update the reports list
      setReports(prevReports => prevReports.filter(report => report.id !== reportId));

      toast({
        title: "Success",
        description: `Report ${action}ed successfully`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || `Failed to ${action} report`,
        variant: "destructive"
      });
    }
  };

  const filteredReports = reports.filter(
    (report) =>
      report.itemTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <TabsList className="mb-4 grid w-full grid-cols-5">
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
                <TabsTrigger value="reports">
                  <Flag className="mr-2 h-4 w-4" />
                  Reports
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
                      <p className="text-xs text-muted-foreground">Active users</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalPosts}</div>
                      <p className="text-xs text-muted-foreground">
                        Active posts
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
                                  <AvatarFallback>{user.name ? user.name.charAt(0) : "😀"}</AvatarFallback>
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
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>{post.user.name ? post.user.name.charAt(0) : "😀"}</AvatarFallback>
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
                          <TableHead>Item</TableHead>
                          <TableHead>Posted By</TableHead>
                          <TableHead>Claimed By</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="h-8 w-8 rounded-md object-cover"
                                />
                                <span className="font-medium">{item.title}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>{item.postedBy.name ? item.postedBy.name.charAt(0).toUpperCase() : "U"}</AvatarFallback>
                                </Avatar>
                                <span>{item.postedBy.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {item.claimedBy ? (
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback>{item.claimedBy.name ? item.claimedBy.name.charAt(0).toUpperCase() : "U"}</AvatarFallback>
                                  </Avatar>
                                  <span>{item.claimedBy.name}</span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">Not claimed</span>
                              )}
                            </TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>{item.location}</TableCell>
                            <TableCell>{formatDistanceToNow(new Date(item.date), { addSuffix: true })}</TableCell>
                            <TableCell>
                              <Badge variant="pending">{item.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-green-600"
                                  onClick={() => handleClaimAction(item.CID, "approved")}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-600"
                                  onClick={() => handleClaimAction(item.CID, "rejected")}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="reports">
                <div className="mb-4 flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search reports..."
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
                          <TableHead>Item</TableHead>
                          <TableHead>Reason</TableHead>
                          <TableHead>Reported By</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredReports.map((report) => (
                          <TableRow key={report.id}>
                            <TableCell>
                              <div className="font-medium">{report.itemTitle}</div>
                            </TableCell>
                            <TableCell>{report.reason}</TableCell>
                            <TableCell>{report.reportedBy}</TableCell>
                            <TableCell>{formatDistanceToNow(new Date(report.date), { addSuffix: true })}</TableCell>
                            <TableCell>
                              <Badge variant="pending">{report.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-green-600"
                                  onClick={() => handleProcessReport(report.id, "Reviewed")}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-600"
                                  onClick={() => handleProcessReport(report.id, "Dismissed")}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
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
