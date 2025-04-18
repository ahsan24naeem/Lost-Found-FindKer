"use client"

import { useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export default function StoriesCarousel({ stories }) {
  const scrollContainerRef = useRef(null)
  const [selectedStory, setSelectedStory] = useState(null)

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef
      const scrollAmount = direction === "left" ? -200 : 200
      current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  const openStory = (story) => {
    setSelectedStory(story)
  }

  const closeStory = () => {
    setSelectedStory(null)
  }

  return (
    <div className="relative">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 z-10 h-8 w-8 rounded-full bg-background/80 shadow-md"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div
          ref={scrollContainerRef}
          className="no-scrollbar flex items-start gap-2 overflow-x-auto scroll-smooth px-4"
        >
          {/* Create Story */}
          <div className="flex-shrink-0">
            <div className="flex w-[100px] flex-col items-center">
              <div className="relative mb-1 h-[160px] w-[100px] overflow-hidden rounded-xl bg-muted">
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                    <Plus className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span className="mt-2 text-xs font-medium">Create Story</span>
                </div>
              </div>
              <span className="text-xs">Your Story</span>
            </div>
          </div>

          {/* Stories */}
          {stories.map((story) => (
            <div key={story.id} className="flex-shrink-0" onClick={() => openStory(story)}>
              <div className="flex w-[100px] flex-col items-center">
                <div className="relative mb-1 h-[160px] w-[100px] overflow-hidden rounded-xl">
                  <img
                    src={story.image || "/placeholder.svg"}
                    alt={story.title}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <Badge
                      variant={story.title.toLowerCase().includes("lost") ? "destructive" : "default"}
                      className="mb-1 text-[10px]"
                    >
                      {story.title.toLowerCase().includes("lost") ? "Lost" : "Found"}
                    </Badge>
                    <p className="truncate text-xs font-medium text-white">{story.title}</p>
                  </div>
                  <div className="absolute left-2 top-2 rounded-full ring-2 ring-primary ring-offset-1">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={story.user.avatar || "/placeholder.svg"} alt={story.user.name} />
                      <AvatarFallback>{story.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <span className="truncate text-xs">{story.user.name}</span>
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 z-10 h-8 w-8 rounded-full bg-background/80 shadow-md"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Story Dialog */}
      {selectedStory && (
        <Dialog open={!!selectedStory} onOpenChange={closeStory}>
          <DialogContent className="max-w-md p-0 md:max-w-lg">
            <div className="relative h-[70vh] overflow-hidden">
              <img
                src={selectedStory.image || "/placeholder.svg"}
                alt={selectedStory.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60"></div>
              <div className="absolute left-4 right-4 top-4 flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedStory.user.avatar || "/placeholder.svg"} alt={selectedStory.user.name} />
                  <AvatarFallback>{selectedStory.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-white">{selectedStory.user.name}</div>
                  <div className="text-xs text-white/80">Just now</div>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <Badge
                  variant={selectedStory.title.toLowerCase().includes("lost") ? "destructive" : "default"}
                  className="mb-2 text-xs"
                >
                  {selectedStory.title.toLowerCase().includes("lost") ? "Lost" : "Found"}
                </Badge>
                <h3 className="mb-1 text-lg font-bold text-white">{selectedStory.title}</h3>
                <p className="text-sm text-white/90">
                  {selectedStory.title.toLowerCase().includes("lost")
                    ? "Please help me find this item. Contact if you have any information."
                    : "I found this item. Please contact me if it belongs to you."}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
