"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Search, Heart, Clock, Play, Download, 
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import useGeminiPlaylist from "@/hooks/useGeminiPlaylist"

const MoodSearch = ({ moodQuery, setMoodQuery }) => {
  const router = useRouter()
  const [showResults, setShowResults] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const { playlist, error } = useGeminiPlaylist(moodQuery)

  const premadePrompts = [
    "Hindi Pop",
    "ADHD Soothing",
    "Workout Energy",
    "Focus Flow",
    "Bollywood Romance",
    "Chill Vibes"
  ]

  const handlePromptClick = (prompt) => {
    setMoodQuery(prompt)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    setIsGenerating(true)

    // Simulate API delay for generating playlist
    setTimeout(() => {
      setIsGenerating(false)
      setShowResults(true)
    }, 1500) // Overall generation takes 1.5 seconds
  }

  if (error) {
    return <div>Error fetching playlist: {error.message}</div>
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-purple-900 to-black text-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <div className="w-32 h-32 mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-400 rounded-lg flex items-center justify-center">
              <Heart className="w-16 h-16 text-white" />
            </div>
            <div className="absolute inset-0 border-2 border-white rounded-lg opacity-40 animate-pulse"></div>
          </div>
          
          <h2 className="text-2xl font-bold mb-3">Creating Your Playlist</h2>
          <p className="text-gray-300 mb-6 text-center max-w-md">
            Our AI is curating songs based on "{moodQuery}"
          </p>
          
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-green-500" />
            <span className="text-green-500">Generating playlist...</span>
          </div>
        </motion.div>
      </div>
    )
  }

  if (showResults) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen w-full flex flex-col bg-black text-white"
      >
        {/* Hero section with gradient and playlist info */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-b from-purple-800 to-black pt-6 pb-6"
        >
          <div className="px-8 flex items-end gap-6">
            {/* Playlist cover art */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-60 h-60 bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center"
            >
              <Heart className="w-28 h-28 text-white" />
            </motion.div>
            
            {/* Playlist info */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <p className="text-sm mb-2">Playlist</p>
              <h1 className="text-8xl font-bold mb-6">{moodQuery}</h1>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-white overflow-hidden flex items-center justify-center">
                  <span className="text-xs font-bold text-black">AI</span>
                </div>
                <span className="text-sm">Spotify AI</span>
                <span className="text-sm">• {playlist.length} songs</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Controls section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="px-8 py-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center">
                <Play className="w-6 h-6 text-black" fill="black" />
              </button>
              <button className="p-2">
                <Download className="w-8 h-8 text-gray-400" />
              </button>
            </div>

            {/* Add to Library button shifted to the right */}
            <div className="ml-auto">
              <button className="px-4 py-2 bg-white text-black font-bold rounded-md hover:bg-gray-200 transition-colors">
                Add to Library
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* Songs table with proper scrolling - always show all songs */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col px-8 overflow-hidden flex-1" // Flexbox ensures it takes available space
        >
          {/* Fixed Table header */}
          <div className="grid grid-cols-[auto,4fr,2fr,1fr,auto] gap-4 border-b border-[#282828] py-2 text-gray-400 text-sm bg-black z-10 sticky top-0">
            <div className="text-center w-6">#</div>
            <div className="pl-14">Title</div>
            <div>Album</div>
            <div>Date added</div>
            <div className="flex justify-end pr-8">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          
          {/* Scrollable Table rows */}
          <div 
            className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900" 
            style={{ maxHeight: "calc(100vh - 570px)" }} // Adjust height dynamically
          > 
            {playlist.map((song, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-[auto,4fr,2fr,1fr,auto] gap-4 py-[10px] hover:bg-[#181818] rounded text-sm items-center group"
              >
                <div className="text-center text-gray-400 group-hover:hidden w-6">{index + 1}</div>
                <div className="hidden group-hover:flex group-hover:items-center group-hover:justify-center w-6">
                  <Play className="w-4 h-4 text-white" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-700 flex-shrink-0"></div>
                  <div>
                    <div className="text-white font-normal">{song.title}</div>
                    <div className="text-gray-400">{song.artist}</div>
                  </div>
                </div>
                <div className="text-gray-400">{song.album}</div>
                <div className="text-gray-400">{song.duration}</div>
              </motion.div>
            ))}
          </div>
          
          {/* Song count indicator */}
          <div className="py-1 border-t border-[#282828] text-xs text-gray-400 bg-black sticky bottom-0 z-10">
            Showing all {playlist.length} songs
          </div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#121212] overflow-y-auto">
      {/* Form section */}
      <div className="flex-1 flex flex-col items-center justify-center w-full px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-6 text-center">
            AI Mood-Based Playlist Generator
          </h1>
          <p className="text-gray-400 mb-8 text-center max-w-lg text-base">
            Describe your mood, activity, or the vibe you're looking for, and we'll create a custom playlist just for you.
          </p>
        </motion.div>
        
        <motion.form 
          onSubmit={onSubmit} 
          className="w-full max-w-lg mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative w-full mb-6">
            <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              value={moodQuery}
              onChange={(e) => setMoodQuery(e.target.value)}
              className="bg-[#2a2a2a] border-none rounded-full pl-10 py-4 text-base w-full"
              placeholder="e.g., 'hindi pop sexy'"
            />
          </div>
          
          {/* Premade prompt options */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {premadePrompts.map((prompt, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                onClick={() => handlePromptClick(prompt)}
                className="bg-[#2a2a2a] px-4 py-2 rounded-full text-sm cursor-pointer hover:bg-[#333333] transition-colors"
              >
                {prompt}
              </motion.div>
            ))}
          </div>
          
          <Button 
            type="submit"
            className="bg-[#1ed760] hover:bg-[#1fdf64] text-black font-bold rounded-full w-full py-4 text-lg"
          >
            Generate Playlist
          </Button>
        </motion.form>
      </div>
    </div>
  )
}

export default MoodSearch
