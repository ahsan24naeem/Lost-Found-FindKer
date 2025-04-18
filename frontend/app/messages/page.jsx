"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Search, Edit, Phone, Video, Info, Send, ImageIcon, Paperclip, Smile } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import MobileNav from "@/components/mobile-nav"
import SidebarNav from "@/components/sidebar-nav"

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState(null)
  const [messageText, setMessageText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  // Mock conversations data
  const conversations = [
    {
      id: 1,
      user: {
        name: "Sarah Williams",
        avatar: "/placeholder.svg?height=40&width=40",
        isOnline: true,
      },
      lastMessage: {
        text: "I found your wallet! It was near the bench at Central Park.",
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
        isRead: false,
        sender: "them",
      },
      unreadCount: 2,
    },
    {
      id: 2,
      user: {
        name: "David Brown",
        avatar: "/placeholder.svg?height=40&width=40",
        isOnline: false,
      },
      lastMessage: {
        text: "Thanks for returning my phone! Really appreciate it.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
        isRead: true,
        sender: "them",
      },
      unreadCount: 0,
    },
    {
      id: 3,
      user: {
        name: "Emily Davis",
        avatar: "/placeholder.svg?height=40&width=40",
        isOnline: true,
      },
      lastMessage: {
        text: "Is the gold necklace still available?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
        isRead: true,
        sender: "them",
      },
      unreadCount: 0,
    },
    {
      id: 4,
      user: {
        name: "Mike Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        isOnline: false,
      },
      lastMessage: {
        text: "I'll be at the coffee shop at 3 PM to pick up my keys.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        isRead: true,
        sender: "you",
      },
      unreadCount: 0,
    },
    {
      id: 5,
      user: {
        name: "Jessica Taylor",
        avatar: "/placeholder.svg?height=40&width=40",
        isOnline: false,
      },
      lastMessage: {
        text: "Can you describe the backpack in more detail?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
        isRead: true,
        sender: "you",
      },
      unreadCount: 0,
    },
  ]

  // Mock messages for the selected conversation
  const getMessages = (conversationId) => {
    if (conversationId === 1) {
      return [
        {
          id: 1,
          text: "Hi there! I saw your post about a lost wallet.",
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
          sender: "them",
        },
        {
          id: 2,
          text: "Yes, I lost my black leather wallet yesterday at Central Park. Have you found it?",
          timestamp: new Date(Date.now() - 1000 * 60 * 59).toISOString(), // 59 minutes ago
          sender: "you",
        },
        {
          id: 3,
          text: "I think I did! Does it have the initials 'JD' on it?",
          timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString(), // 55 minutes ago
          sender: "them",
        },
        {
          id: 4,
          text: "Yes, that's mine! It also has my driver's license and two credit cards inside.",
          timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString(), // 50 minutes ago
          sender: "you",
        },
        {
          id: 5,
          text: "Great! I found it near the fountain. Everything is still inside.",
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
          sender: "them",
        },
        {
          id: 6,
          text: "Thank you so much! Can we meet somewhere so I can pick it up?",
          timestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString(), // 40 minutes ago
          sender: "you",
        },
        {
          id: 7,
          text: "How about the coffee shop on Main Street tomorrow at 2 PM?",
          timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 minutes ago
          sender: "them",
        },
        {
          id: 8,
          text: "That works perfectly for me. Thank you again for your honesty!",
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          sender: "you",
        },
        {
          id: 9,
          text: "No problem at all. I'll be wearing a red jacket so you can recognize me.",
          timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 minutes ago
          sender: "them",
        },
        {
          id: 10,
          text: "Perfect! I'll see you tomorrow at 2 PM.",
          timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(), // 20 minutes ago
          sender: "you",
        },
        {
          id: 11,
          text: "I found your wallet! It was near the bench at Central Park.",
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
          sender: "them",
        },
      ]
    }
    return []
  }

  // Filter conversations based on search query
  const filteredConversations = conversations.filter((conversation) =>
    conversation.user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle sending a message
  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedChat) return

    // This would be handled by your state management and API
    console.log("Sending message:", messageText, "to conversation:", selectedChat)
    setMessageText("")
  }

  // Get the selected conversation
  const activeConversation = conversations.find((conversation) => conversation.id === selectedChat)
  const messages = selectedChat ? getMessages(selectedChat) : []

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
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  className={`flex w-full items-start gap-3 rounded-lg p-3 text-left hover:bg-muted ${
                    selectedChat === conversation.id ? "bg-muted" : ""
                  }`}
                  onClick={() => setSelectedChat(conversation.id)}
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
                        {formatDistanceToNow(new Date(conversation.lastMessage.timestamp), { addSuffix: false })}
                      </span>
                    </div>
                    <p className="truncate text-sm text-muted-foreground">
                      {conversation.lastMessage.sender === "you" ? "You: " : ""}
                      {conversation.lastMessage.text}
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
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "you" ? "justify-end" : "justify-start"}`}
                  >
                    {message.sender === "them" && (
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
                        message.sender === "you" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                      }`}
                    >
                      <p>{message.text}</p>
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
