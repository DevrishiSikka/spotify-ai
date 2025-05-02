"use client"

import { useEffect, useState } from "react"
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

  // Log the playlist data whenever it updates
  useEffect(() => {
    if (playlist.length > 0) {
      console.log("Playlist data from API:", playlist)
    }
  }, [playlist])

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
        {/* Render playlist data */}
        <div>
          {playlist.map((song, index) => (
            <div key={index}>
              <p>
                {song.title} by {song.artist}
              </p>
            </div>
          ))}
        </div>
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
