"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { Search, Edit, Phone, Video, Info, Send, ImageIcon, Paperclip, Smile } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import MobileNav from "@/components/mobile-nav"
import SidebarNav from "@/components/sidebar-nav"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function MessagesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [selectedChat, setSelectedChat] = useState(null)
  const [messageText, setMessageText] = useState("")
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (user === null || user === undefined) {
      router.push("/login")
    }
  }, [user, router])

  // Fetch all conversations for the current user
  useEffect(() => {
    if (!user?.userid) return
    
    setLoading(true)
    const userId = Number(user.id)
    
    if (isNaN(userId)) {
      console.error("Invalid user ID:", user.id)
      toast.error("Invalid user ID. Please log in again.")
      setLoading(false)
      return
    }
    
    console.log("Fetching conversations for user ID:", userId)
    
    fetch(`http://localhost:5000/api/message/contacts/${userId}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then(data => {
        console.log("Conversations data:", data)
        // Ensure data is an array
        const conversationsData = Array.isArray(data) ? data : []
        setConversations(conversationsData)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error fetching conversations:", err)
        toast.error("Failed to load conversations")
        setLoading(false)
        setConversations([])
      })
  }, [user])

  // Fetch messages for the selected conversation
  useEffect(() => {
    if (!user?.id || !selectedChat) return
    
    setLoadingMessages(true)
    const userId = Number(user.id)
    const chatId = Number(selectedChat)
    
    if (isNaN(userId) || isNaN(chatId)) {
      console.error("Invalid user ID or chat ID:", { userId, chatId })
      toast.error("Invalid user or chat ID")
      setLoadingMessages(false)
      return
    }
    
    console.log("Fetching messages for users:", { userId, chatId })
    
    fetch(`http://localhost:5000/api/message/messagesBetweenUsers/${userId}/${chatId}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then(data => {
        console.log("Messages data:", data)
        // Transform the data to match the expected structure
        const transformedMessages = Array.isArray(data) ? data.map(msg => ({
          id: msg.MessageID,
          // Determine if the current user is the sender or receiver
          senderID: msg.Sender === user.name ? user.id : chatId,
          receiverID: msg.Receiver === user.name ? chatId : user.id,
          messageText: msg.MessageText,
          timestamp: msg.CreatedAt,
          // Add these fields to help with display
          isCurrentUser: msg.Sender === user.name
        })) : []
        console.log("Transformed messages:", transformedMessages)
        setMessages(transformedMessages)
        setLoadingMessages(false)
      })
      .catch(err => {
        console.error("Error fetching messages:", err)
        toast.error("Failed to load messages")
        setMessages([])
        setLoadingMessages(false)
      })
  }, [user, selectedChat])

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedChat || !user?.id) return
    
    const userId = Number(user.id)
    const chatId = Number(selectedChat)
    
    if (isNaN(userId) || isNaN(chatId)) {
      console.error("Invalid user ID or chat ID:", { userId, chatId })
      toast.error("Invalid user or chat ID")
      return
    }
    
    try {
      const response = await fetch("http://localhost:5000/api/message/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderID: userId,
          receiverID: chatId,
          postID: null,
          messageText,
        }),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      setMessageText("")
      toast.success("Message sent")
      
      // Refresh messages
      const messagesResponse = await fetch(`http://localhost:5000/api/message/messagesBetweenUsers/${userId}/${chatId}`)
      if (!messagesResponse.ok) {
        throw new Error(`HTTP error! status: ${messagesResponse.status}`)
      }
      const messagesData = await messagesResponse.json()
      
      // Transform the data to match the expected structure
      const transformedMessages = Array.isArray(messagesData) ? messagesData.map(msg => ({
        id: msg.MessageID,
        // Determine if the current user is the sender or receiver
        senderID: msg.Sender === user.name ? user.id : chatId,
        receiverID: msg.Receiver === user.name ? chatId : user.id,
        messageText: msg.MessageText,
        timestamp: msg.CreatedAt,
        // Add these fields to help with display
        isCurrentUser: msg.Sender === user.name
      })) : []
      
      setMessages(transformedMessages)
    } catch (err) {
      console.error("Error sending message:", err)
      toast.error("Failed to send message")
    }
  }

  // Get the selected conversation with defensive checks
  const safeConversations = Array.isArray(conversations) ? conversations : []
  const activeConversation = safeConversations.find(
    (conversation) => {
      // Try different possible property paths
      return (
        conversation?.user?.id === selectedChat || 
        conversation?.id === selectedChat ||
        conversation?.userId === selectedChat
      )
    }
  )
  
  console.log("Selected chat:", selectedChat)
  console.log("Active conversation:", activeConversation)

  return (
    <div className="flex h-screen">
      {/* Left Sidebar - Hidden on mobile */}
      <SidebarNav className="hidden lg:block" />

      {/* Messages Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Conversations List */}
        <div className="w-full border-r md:w-80">
          <div className="flex h-16 items-center justify-between border-b px-4">
            <h1 className="text-xl font-bold">Messages</h1>
            <Button variant="ghost" size="icon">
              <Edit className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-4">
            {/* Removed search input and filtering */}
          </div>

          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="space-y-1 p-2">
              {loading ? (
                <div className="p-4 text-center">Loading conversations...</div>
              ) : safeConversations.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No conversations yet. Start messaging someone!
                </div>
              ) : (
                safeConversations.map((conversation) => {
                  // Try different possible property paths for user data
                  const userId = conversation?.user?.userid || conversation?.userid || conversation?.userId
                  const userName = conversation?.user?.FullName || conversation?.FullName || "Unknown User"
                  const userAvatar = conversation?.user?.avatar || conversation?.avatar || "/placeholder.svg"
                  const isOnline = conversation?.user?.isOnline || conversation?.isOnline || false
                  const lastMessage = conversation?.lastMessage || {}
                  const unreadCount = conversation?.unreadCount || 0
                  
                  return (
                    <button
                      key={userId || Math.random()}
                      className={`flex w-full items-start gap-3 rounded-lg p-3 text-left hover:bg-muted ${
                        selectedChat === userId ? "bg-muted" : ""
                      }`}
                      onClick={() => setSelectedChat(userId)}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={userAvatar} alt={userName} />
                          <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {isOnline && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background"></span>
                        )}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{userName}</h3>
                          <span className="text-xs text-muted-foreground">
                            {lastMessage?.timestamp &&
                              formatDistanceToNow(new Date(lastMessage.timestamp), { addSuffix: false })}
                          </span>
                        </div>
                        <p className="truncate text-sm text-muted-foreground">
                          {lastMessage?.sender === user?.id ? "You: " : ""}
                          {lastMessage?.text || "No messages yet"}
                        </p>
                        {unreadCount > 0 && <Badge className="mt-1">{unreadCount}</Badge>}
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        {selectedChat ? (
          <div className="flex flex-1 flex-col">
            {/* Chat Header */}
            <div className="flex h-16 items-center justify-between border-b px-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={activeConversation?.user?.avatar || "/placeholder.svg"}
                    alt={activeConversation?.user?.name || "User"}
                  />
                  <AvatarFallback>{activeConversation?.user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-medium">{activeConversation?.user?.name || "User"}</h2>
                  <p className="text-xs text-muted-foreground">
                    {activeConversation?.user?.isOnline ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Info className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {loadingMessages ? (
                  <div className="text-center">Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-muted-foreground">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map((message) => {
                    // Use the isCurrentUser flag to determine message position
                    const isCurrentUser = message.isCurrentUser || message.senderID === user?.id
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                      >
                        {!isCurrentUser && (
                          <Avatar className="mr-2 h-8 w-8">
                            <AvatarImage
                              src={activeConversation?.user?.avatar || "/placeholder.svg"}
                              alt={activeConversation?.user?.name || "User"}
                            />
                            <AvatarFallback>{activeConversation?.user?.name?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                          }`}
                        >
                          <p>{message.messageText}</p>
                          <p className="mt-1 text-right text-xs opacity-70">
                            {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="border-t p-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <ImageIcon className="h-5 w-5" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <Button variant="ghost" size="icon">
                  <Smile className="h-5 w-5" />
                </Button>
                <Button size="icon" onClick={handleSendMessage} disabled={!messageText.trim()}>
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-medium">Select a conversation</h2>
              <p className="text-muted-foreground">Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  )
}
