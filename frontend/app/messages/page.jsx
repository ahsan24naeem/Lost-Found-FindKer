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
    if (!user?.id) return
    
    setLoading(true)
    const userId = Number(user.id)
    
    if (isNaN(userId)) {
      console.error("Invalid user ID:", user.id)
      toast.error("Invalid user ID. Please log in again.")
      setLoading(false)
      return
    }
    
    fetch(`http://localhost:5000/api/message/contacts/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        return res.json()
      })
      .then(data => {
        const conversationsData = Array.isArray(data) ? data : []
        setConversations(conversationsData)
      })
      .catch(err => {
        console.error("Error fetching conversations:", err)
        toast.error("Failed to load conversations")
        setConversations([])
      })
      .finally(() => setLoading(false))
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
    
    fetch(`http://localhost:5000/api/message/messagesBetweenUsers/${userId}/${chatId}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        return res.json()
      })
      .then(data => {
        const transformedMessages = Array.isArray(data) ? data.map(msg => ({
          id: msg.MessageID,
          senderID: msg.SenderID,
          senderName: msg.SenderName || `User ${msg.SenderID}`,
          receiverID: msg.ReceiverID,
          receiverName: msg.ReceiverName || `User ${msg.ReceiverID}`,
          messageText: msg.MessageText,
          timestamp: msg.CreatedAt,
          isCurrentUser: Number(msg.SenderID) === Number(user.id)
        })) : []
        setMessages(transformedMessages)
      })
      .catch(err => {
        console.error("Error fetching messages:", err)
        toast.error("Failed to load messages")
        setMessages([])
      })
      .finally(() => setLoadingMessages(false))
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
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      
      setMessageText("")
      toast.success("Message sent")
      
      // Refresh messages
      const messagesResponse = await fetch(`http://localhost:5000/api/message/messagesBetweenUsers/${userId}/${chatId}`)
      if (!messagesResponse.ok) throw new Error(`HTTP error! status: ${messagesResponse.status}`)
      
      const messagesData = await messagesResponse.json()
      const transformedMessages = Array.isArray(messagesData) ? data.map(msg => ({
        id: msg.MessageID,
        senderID: msg.SenderID,
        senderName: msg.SenderName || `User ${msg.SenderID}`,
        receiverID: msg.ReceiverID,
        receiverName: msg.ReceiverName || `User ${msg.ReceiverID}`,
        messageText: msg.MessageText,
        timestamp: msg.CreatedAt,
        isCurrentUser: Number(msg.SenderID) === Number(user.id)
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
    (conversation) => Number(conversation?.UserID) === Number(selectedChat)
  )

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
                  const userId = conversation?.UserID
                  const userName = conversation?.FullName || "Unknown User"
                  const userAvatar = conversation?.avatar || "/placeholder.svg"
                  const isOnline = conversation?.isOnline || false
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
                    src={activeConversation?.avatar || "/placeholder.svg"}
                    alt={activeConversation?.FullName || "User"}
                  />
                  <AvatarFallback>{activeConversation?.FullName?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-medium">{activeConversation?.FullName || "User"}</h2>
                  <p className="text-xs text-muted-foreground">
                    {activeConversation?.isOnline ? "Online" : "Offline"}
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
                    const isCurrentUser = message.isCurrentUser || Number(message.senderID) === Number(user?.id)
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`flex max-w-[80%] gap-2 ${isCurrentUser ? "flex-row-reverse" : ""}`}>
                          {!isCurrentUser && (
                            <Avatar className="h-8 w-8 mt-1">
                              <AvatarImage src={activeConversation?.avatar} />
                              <AvatarFallback>{message.senderName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                          )}
                          <div className="flex flex-col">
                            <span className={`text-xs text-muted-foreground mb-1 ${isCurrentUser ? "text-right" : ""}`}>
                              {isCurrentUser ? "You" : message.senderName}
                            </span>
                            <div
                              className={`rounded-lg p-3 ${
                                isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                              }`}
                            >
                              <p>{message.messageText}</p>
                              <p className={`mt-1 text-xs opacity-70 ${isCurrentUser ? "text-right" : "text-left"}`}>
                                {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
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