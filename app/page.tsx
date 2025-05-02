"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import {
  Search,
  Home,
  Library,
  Plus,
  ArrowRight,
  Heart,
  Clock,
  Download,
  Play,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Mic2,
  ListMusic,
  Volume2,
  Maximize2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import MoodSearch from "@/components/mood-search"

export default function SpotifyClone() {
  const [showMoodSearch, setShowMoodSearch] = useState(false)
  const [showMoodResults, setShowMoodResults] = useState(false)
  const [moodQuery, setMoodQuery] = useState("")
  const [sidebarWidth, setSidebarWidth] = useState(256) // Default width
  const [isResizing, setIsResizing] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const minWidth = 80 // Minimum width before collapsing
  const maxWidth = 400
  const collapseThreshold = 140 // Width threshold to trigger auto-collapse
  const collapsedWidth = 64 // Fixed width when collapsed
  const expandedWidth = 256 // Default expanded width
  const sidebarRef = useRef(null)

  const toggleMoodSearch = () => {
    setShowMoodSearch(!showMoodSearch)
    setShowMoodResults(false)
  }

  const handleMoodSearch = (e) => {
    e.preventDefault()
    if (moodQuery.trim()) {
      setShowMoodResults(true)
    }
  }

  const startResizing = () => {
    setIsResizing(true)
  }

  const stopResizing = () => {
    setIsResizing(false)

    // Snap to collapsed or expanded width when done resizing
    if (isCollapsed) {
      setSidebarWidth(collapsedWidth)
    } else {
      // Only snap to expanded if it's closer to expanded than to collapsed
      if (sidebarWidth < collapseThreshold + 30) {
        setSidebarWidth(expandedWidth)
      }
    }
  }

  const resize = (e) => {
    if (isResizing) {
      const newWidth = Math.max(minWidth, Math.min(e.clientX, maxWidth))

      // Auto collapse/expand based on width
      if (newWidth <= collapseThreshold && !isCollapsed) {
        setIsCollapsed(true)
        setSidebarWidth(collapsedWidth)
      } else if (newWidth > collapseThreshold && isCollapsed) {
        setIsCollapsed(false)
        setSidebarWidth(newWidth)
      } else {
        setSidebarWidth(newWidth)
      }
    }
  }

  useEffect(() => {
    document.addEventListener("mousemove", resize)
    document.addEventListener("mouseup", stopResizing)

    return () => {
      document.removeEventListener("mousemove", resize)
      document.removeEventListener("mouseup", stopResizing)
    }
  }, [isResizing, resize, stopResizing])

  return (
    <div
      className="flex h-screen bg-black text-white"
      onMouseMove={resize}
      onMouseUp={stopResizing}
    >
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`bg-[#121212] flex flex-col relative transition-width duration-150 ${
          isCollapsed ? "w-16" : ""
        }`}
        style={{ width: `${sidebarWidth}px` }}
      >
        {/* Spotify Logo */}
        <div className="h-20 flex items-center pl-6 border-b border-[#282828]">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.48.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
        </div>

        {/* Resizing Handle */}
        <div
          className="absolute right-0 top-0 w-1 h-full cursor-ew-resize opacity-0 hover:opacity-100 bg-gray-500 z-10"
          onMouseDown={startResizing}
        />

        {!isCollapsed && (
          <>
            {/* Library Header */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Library className="w-6 h-6 text-gray-400" />
                  <span className="text-base font-bold">Your Library</span>
                </div>
                <div className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                  <div className="bg-[#232323] w-8 h-8 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-none">
                <div className="bg-[#232323] px-4 py-1.5 rounded-full text-sm whitespace-nowrap">
                  Playlists
                </div>
                <div className="bg-[#232323] px-4 py-1.5 rounded-full text-sm whitespace-nowrap">
                  Artists
                </div>
                <div className="bg-[#232323] px-4 py-1.5 rounded-full text-sm whitespace-nowrap">
                  Albums
                </div>
              </div>

              {/* Search and Sort */}
              <div className="flex items-center justify-between mb-4">
                <Search className="w-5 h-5 text-gray-400" />
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <span>Recents</span>
                  <ListMusic className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Library Items */}
            <div className="flex-1 overflow-y-auto scrollbar-none pr-2">
              {libraryItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-2 hover:bg-[#232323] rounded-md cursor-pointer"
                >
                  <div className="w-12 h-12 flex-shrink-0 relative rounded-md overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm truncate">{item.title}</div>
                    <div className="text-xs text-gray-400 truncate">{item.subtitle}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {isCollapsed && (
          <div className="flex flex-col items-center mt-4 space-y-4">
            <Home className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
            <Search className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
            <Library className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="h-20 bg-[#181818] flex items-center px-4 border-b border-[#282828]">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                className="w-64 bg-[#242424] border-none rounded-full pl-10 text-sm placeholder:text-gray-400"
                placeholder="What do you want to play?"
              />
            </div>
            <Button
              onClick={toggleMoodSearch}
              className="bg-[#1ed760] hover:bg-[#1fdf64] text-black font-bold rounded-full"
            >
              AI Mood Playlist
            </Button>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-[#000000] flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Existing Content */}
        <div className="flex-1 overflow-hidden">
          <div className="flex flex-1 overflow-hidden">
            {/* Scrollable Liked Songs Section */}
            <div className="flex-1 overflow-y-auto bg-black">
              {showMoodSearch ? (
                <MoodSearch
                  moodQuery={moodQuery}
                  setMoodQuery={setMoodQuery}
                  handleMoodSearch={handleMoodSearch}
                />
              ) : (
                <>
                  {/* Playlist header */}
                  <div className="bg-gradient-to-b from-purple-800 to-black pt-6 pb-6">
                    <div className="px-8 flex items-end gap-6">
                      {/* Playlist cover art */}
                      <div className="w-60 h-60 bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center shadow-lg">
                        <Heart className="w-28 h-28 text-white fill-white" />
                      </div>
                      <div>
                        <div className="text-sm mb-2">Playlist</div>
                        <h1 className="text-8xl font-bold mb-6">Liked Songs</h1>
                        <div className="flex items-center gap-1 text-sm">
                          <div className="w-6 h-6 rounded-full overflow-hidden">
                            <Image
                              src="/placeholder.svg"
                              alt="Profile"
                              width={24}
                              height={24}
                            />
                          </div>
                          <span className="font-bold">Devrishi Sikka</span>
                          <span className="text-gray-400">• 2,970 songs</span>
                        </div>
                      </div>
                    </div>
                  </div>

                    {/* Playlist controls */}
                    <div className="flex items-center gap-6 mb-6 px-4">
                    <div className="w-14 h-14 rounded-full bg-[#1ed760] flex items-center justify-center shadow-lg">
                      <Play className="w-7 h-7 text-black fill-black ml-1" />
                    </div>
                    <Download className="w-9 h-9 text-gray-400 hover:text-white cursor-pointer" />
                    <div className="ml-auto flex items-center gap-4">
                      <Search className="w-5 h-5 text-gray-400" />
                      <div className="text-sm text-gray-400">List</div>
                      <ListMusic className="w-5 h-5 text-gray-400" />
                    </div>
                    </div>

                  {/* Songs table */}
                  <div className="w-full">
                    <div className="grid grid-cols-[40px_1fr_1fr_auto_auto] gap-4 border-b border-[#2a2a2a] px-4 py-2 text-sm text-gray-400">
                      <div className="text-center">#</div>
                      <div>Title</div>
                      <div>Album</div>
                      <div>Date added</div>
                      <div>
                        <Clock className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Scrollable Songs List */}
                    <div 
                      className="overflow-y-auto max-h-[calc(100vh-450px)] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900" 
                      style={{ paddingBottom: "120px" }} // Add padding to account for the music player height
                    >
                      {songs.map((song, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-[40px_1fr_1fr_auto_auto] gap-4 px-4 py-2 hover:bg-[#2a2a2a] rounded-md text-sm items-center"
                        >
                          <div className="text-gray-400 text-right pr-2">
                            {index + 1}
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 relative">
                              <Image
                                src={song.image || "/placeholder.svg"}
                                alt={song.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium">{song.title}</div>
                              <div className="text-gray-400 text-xs">
                                {song.artist}
                              </div>
                            </div>
                          </div>
                          <div className="text-gray-400">{song.album}</div>
                          <div className="text-gray-400">{song.dateAdded}</div>
                          <div className="text-gray-400">{song.duration}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Player bar */}
        <div className="h-20 bg-[#181818] border-t border-[#282828] flex items-center px-8">
          <div className="flex items-center gap-3 w-80">
            <div className="w-14 h-14 relative">
              <Image
                src="/placeholder.svg"
                alt="Now playing"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="font-medium text-sm">Plain Sight</div>
              <div className="text-xs text-gray-400">ansh</div>
            </div>
            <Heart className="w-4 h-4 text-[#1ed760] fill-[#1ed760] ml-4" />
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="flex items-center gap-5 mb-2">
              <Shuffle className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
              <SkipBack className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <Play className="w-4 h-4 text-black fill-black ml-0.5" />
              </div>
              <SkipForward className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
              <Repeat className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
            </div>

            <div className="flex items-center gap-2 w-full max-w-md">
              <div className="text-xs text-gray-400">0:51</div>
              <div className="flex-1 h-1 bg-[#4d4d4d] rounded-full">
                <div className="w-1/4 h-full bg-white rounded-full"></div>
              </div>
              <div className="text-xs text-gray-400">3:05</div>
            </div>
          </div>

          <div className="w-80 flex items-center justify-end gap-3">
            <Mic2 className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
            <ListMusic className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
            <Volume2 className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
            <div className="w-24 h-1 bg-[#4d4d4d] rounded-full">
              <div className="w-3/4 h-full bg-white rounded-full"></div>
            </div>
            <Maximize2 className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Mock data
const libraryItems = [
  {
    title: "Vibe Tribe",
    subtitle: "Playlist • Devrishi Sikka",
    image: "/placeholder.svg",
  },
  {
    title: "echoe of your name",
    subtitle: "Playlist • Devrishi Sikka",
    image: "/placeholder.svg",
  },
  {
    title: "Kill'em all",
    subtitle: "Playlist • Devrishi Sikka",
    image: "/placeholder.svg",
  },
  {
    title: "Apricity 🍁",
    subtitle: "Playlist • Devrishi Sikka",
    image: "/placeholder.svg",
  },
  { title: "daylist", subtitle: "Playlist • Spotify", image: "/placeholder.svg" },
  {
    title: "Liked Songs",
    subtitle: "Playlist • 2,970 songs",
    image: "/placeholder.svg",
  },
  { title: "JK's Punjabi Playlist", subtitle: "Playlist • JK", image: "/placeholder.svg" },
  { title: "Bali", subtitle: "Artist", image: "/placeholder.svg" },
]

const songs = [
  {
    title: "Haseen",
    artist: "Talwiinder, NDS, Rippy Grewal",
    album: "Haseen",
    dateAdded: "2 days ago",
    duration: "2:54",
    image: "/placeholder.svg",
  },
  {
    title: "Bachke Bachke (feat. Yarah)",
    artist: "Karan Aujla, Ikky, Yarah",
    album: "Making Memories",
    dateAdded: "2 days ago",
    duration: "3:30",
    image: "/placeholder.svg",
  },
  {
    title: "Shake It To The Max (FLY) - Remix",
    artist: "MOLIY, Silent Addy, Skillibeng",
    album: "Shake It To The Max (FLY) (Remix)",
    dateAdded: "2 days ago",
    duration: "2:58",
    image: "/placeholder.svg",
  },
  {
    title: "No One Noticed",
    artist: "The Marias",
    album: "Submarine",
    dateAdded: "4 days ago",
    duration: "3:56",
    image: "/placeholder.svg",
  },
  {
    title: "Intaha Ho Gai Intezar Ki",
    artist: "Arijit Singh, Pritam",
    album: "Sharaabi",
    dateAdded: "4 days ago",
    duration: "8:49",
    image: "/placeholder.svg",
  },
  {
    title: "Haseen",
    artist: "Talwiinder, NDS, Rippy Grewal",
    album: "Haseen",
    dateAdded: "2 days ago",
    duration: "2:54",
    image: "/placeholder.svg",
  },
  {
    title: "Bachke Bachke (feat. Yarah)",
    artist: "Karan Aujla, Ikky, Yarah",
    album: "Making Memories",
    dateAdded: "2 days ago",
    duration: "3:30",
    image: "/placeholder.svg",
  },
  {
    title: "Shake It To The Max (FLY) - Remix",
    artist: "MOLIY, Silent Addy, Skillibeng",
    album: "Shake It To The Max (FLY) (Remix)",
    dateAdded: "2 days ago",
    duration: "2:58",
    image: "/placeholder.svg",
  },
  {
    title: "No One Noticed",
    artist: "The Marias",
    album: "Submarine",
    dateAdded: "4 days ago",
    duration: "3:56",
    image: "/placeholder.svg",
  },
  {
    title: "Intaha Ho Gai Intezar Ki",
    artist: "Arijit Singh, Pritam",
    album: "Sharaabi",
    dateAdded: "4 days ago",
    duration: "8:49",
    image: "/placeholder.svg",
  },
  {
    title: "Haseen",
    artist: "Talwiinder, NDS, Rippy Grewal",
    album: "Haseen",
    dateAdded: "2 days ago",
    duration: "2:54",
    image: "/placeholder.svg",
  },
  {
    title: "Bachke Bachke (feat. Yarah)",
    artist: "Karan Aujla, Ikky, Yarah",
    album: "Making Memories",
    dateAdded: "2 days ago",
    duration: "3:30",
    image: "/placeholder.svg",
  },
  {
    title: "Shake It To The Max (FLY) - Remix",
    artist: "MOLIY, Silent Addy, Skillibeng",
    album: "Shake It To The Max (FLY) (Remix)",
    dateAdded: "2 days ago",
    duration: "2:58",
    image: "/placeholder.svg",
  },
  {
    title: "No One Noticed",
    artist: "The Marias",
    album: "Submarine",
    dateAdded: "4 days ago",
    duration: "3:56",
    image: "/placeholder.svg",
  },
  {
    title: "Intaha Ho Gai Intezar Ki",
    artist: "Arijit Singh, Pritam",
    album: "Sharaabi",
    dateAdded: "4 days ago",
    duration: "8:49",
    image: "/placeholder.svg",
  },
]

function Bell(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
}

function Check(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
