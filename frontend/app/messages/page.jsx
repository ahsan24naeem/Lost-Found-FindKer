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

export default function MessagesPage() {
  const { user } = useAuth()
  const [selectedChat, setSelectedChat] = useState(null)
  const [messageText, setMessageText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)

  // Fetch all conversations for the current user
  useEffect(() => {
    if (!user?.id) return
    setLoading(true)
    // For now, fetch all users the current user has messaged or been messaged by
    // This assumes a backend endpoint /api/message/conversations/:userID exists
    // If not, you may need to fetch all users or all messages and build the list
    fetch(`http://localhost:5000/api/message/conversations/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setConversations(data)
        setLoading(false)
      })
      .catch(err => {
        setLoading(false)
        setConversations([])
      })
  }, [user])

  // Fetch messages for the selected conversation
  useEffect(() => {
    if (!user?.id || !selectedChat) return
    setLoadingMessages(true)
    fetch(`http://localhost:5000/api/message/messages/${user.id}/${selectedChat}`)
      .then(res => res.json())
      .then(data => {
        setMessages(data)
        setLoadingMessages(false)
      })
      .catch(err => {
        setMessages([])
        setLoadingMessages(false)
      })
  }, [user, selectedChat])

  // Filter conversations based on search query
  const filteredConversations = conversations.filter((conversation) =>
    conversation.user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedChat || !user?.id) return
    try {
      await fetch("http://localhost:5000/api/message/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderID: user.id,
          receiverID: selectedChat,
          postID: null, // or pass a postID if needed
          messageText,
        }),
      })
      setMessageText("")
      // Refresh messages
      fetch(`http://localhost:5000/api/message/messages/${user.id}/${selectedChat}`)
        .then(res => res.json())
        .then(data => setMessages(data))
    } catch (err) {
      // handle error
    }
  }

  // Get the selected conversation
  const activeConversation = conversations.find((conversation) => conversation.user.id === selectedChat)

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
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search conversations..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="space-y-1 p-2">
              {loading ? (
                <div>Loading...</div>
              ) : filteredConversations.map((conversation) => (
                <button
                  key={conversation.user.id}
                  className={`flex w-full items-start gap-3 rounded-lg p-3 text-left hover:bg-muted ${
                    selectedChat === conversation.user.id ? "bg-muted" : ""
                  }`}
                  onClick={() => setSelectedChat(conversation.user.id)}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={conversation.user.avatar || "/placeholder.svg"} alt={conversation.user.name} />
                      <AvatarFallback>{conversation.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {conversation.user.isOnline && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background"></span>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{conversation.user.name}</h3>
                      <span className="text-xs text-muted-foreground">
                        {/* Show last message time if available */}
                        {conversation.lastMessage && conversation.lastMessage.timestamp &&
                          formatDistanceToNow(new Date(conversation.lastMessage.timestamp), { addSuffix: false })}
                      </span>
                    </div>
                    <p className="truncate text-sm text-muted-foreground">
                      {conversation.lastMessage && conversation.lastMessage.sender === user.id ? "You: " : ""}
                      {conversation.lastMessage && conversation.lastMessage.text}
                    </p>
                    {conversation.unreadCount > 0 && <Badge className="mt-1">{conversation.unreadCount}</Badge>}
                  </div>
                </button>
              ))}
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
                    src={activeConversation?.user.avatar || "/placeholder.svg"}
                    alt={activeConversation?.user.name}
                  />
                  <AvatarFallback>{activeConversation?.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-medium">{activeConversation?.user.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    {activeConversation?.user.isOnline ? "Online" : "Offline"}
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
                  <div>Loading messages...</div>
                ) : messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderID === user.id ? "justify-end" : "justify-start"}`}
                  >
                    {message.senderID !== user.id && (
                      <Avatar className="mr-2 h-8 w-8">
                        <AvatarImage
                          src={activeConversation?.user.avatar || "/placeholder.svg"}
                          alt={activeConversation?.user.name}
                        />
                        <AvatarFallback>{activeConversation?.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.senderID === user.id ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                      }`}
                    >
                      <p>{message.messageText}</p>
                      <p className="mt-1 text-right text-xs opacity-70">
                        {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
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
