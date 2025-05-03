"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, Heart, Clock, Play, Download, ListMusic, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useGeminiPlaylist } from "@/hooks/useGeminiPlaylist";

const MoodSearch = () => {
  const router = useRouter();
  const {
    playlist,
    error,
    inputValue,
    setInputValue,
    showResults,
    handleKeyPress,
    setUserMood,
    isLoadingArtwork,
    playlistName,        // Get this from the hook instead of local state
    isGeneratingName     // Get this from the hook instead of local state
  } = useGeminiPlaylist();

  const [isGenerating, setIsGenerating] = useState(false);

  const premadePrompts = [
    "Hindi Pop",
    "ADHD Soothing",
    "Workout Energy",
    "Focus Flow",
    "Bollywood Romance",
    "Chill Vibes",
  ];

  const handlePromptClick = (prompt) => {
    setInputValue(prompt); // Update the input value with the selected prompt
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() === "") {
      console.error("Input value is empty. Please enter a mood.");
      return;
    }
    console.log("Form submitted with inputValue:", inputValue);
    setIsGenerating(true);
    setUserMood(inputValue); // Update userMood to trigger the API call
  };

  useEffect(() => {
    if (playlist.length > 0 && !isLoadingArtwork) {
      console.log("Playlist data from API:", playlist);
      setIsGenerating(false); // Stop the loading state when the playlist is ready
    }
  }, [playlist, isLoadingArtwork]);

  useEffect(() => {
    if (error) {
      console.error("Error from API:", error.message);
      setIsGenerating(false); // Stop the loading state if an error occurs
    }
  }, [error]);

  if (error) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-purple-900 to-black text-white">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-red-500">{error.message}</p>
        <Button 
          onClick={() => window.location.reload()} 
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (isGenerating || isLoadingArtwork) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-purple-900 to-black text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <Loader2 className="w-16 h-16 animate-spin text-green-500 mb-6" />
          <h2 className="text-2xl font-bold mb-3">
            {isLoadingArtwork ? "Fetching Album Artwork" : "Creating Your Playlist"}
          </h2>
          <p className="text-gray-300 mb-6 text-center max-w-md">
            {isLoadingArtwork 
              ? "Adding album covers to enhance your experience..." 
              : `Our AI is curating songs based on "${inputValue}"`}
          </p>
        </motion.div>
      </div>
    );
  }

  if (showResults && playlist.length > 0) {
    return (
      <div className="min-h-screen w-full bg-black text-white">
        {/* Playlist header - with reduced height */}
        <div className="bg-gradient-to-b from-purple-800 to-black pt-4 pb-3">
          <div className="px-8 flex items-end gap-6 relative">
            {/* Playlist cover art - fixed square dimensions */}
            <div className="w-48 h-48 min-w-[12rem] min-h-[12rem] bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center shadow-lg">
              <Heart className="w-24 h-24 text-white fill-white" />
            </div>
            <div className="flex flex-col flex-grow">
              <div className="text-xs mb-1">Playlist</div>
              {/* Display AI-generated playlist name */}
              <h1 className="text-7xl font-extrabold mb-3">
                {isGeneratingName ? (
                  <div className="flex items-center gap-2">
                    <span className="opacity-70">Naming playlist...</span>
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : (
                  playlistName || inputValue
                )}
              </h1>
              <div className="flex items-center gap-1 text-xs">
                {/* Avatar image to the left of the name, sized 24x24 like in page.tsx */}
                <div className="w-6 h-6 rounded-full overflow-hidden">
                  <Image
                    src="https://avatar.iran.liara.run/public/25"
                    alt="Profile"
                    width={24}
                    height={24}
                    className="object-cover"
                  />
                </div>
                <span className="font-bold">Devrishi Sikka</span>
                <span className="text-gray-400">• {playlist.length} songs</span>
              </div>
            </div>
            
            {/* Add to Library Button - Absolute positioning to rightmost edge */}
            <div className="absolute right-8 bottom-0 mt-8">
              <Button 
                className="bg-white hover:bg-gray-200 text-black rounded-md py-1 px-6 text-xs font-bold transition-all"
                onClick={() => console.log("Added to library")}
              >
                Add to Library
              </Button>
            </div>
          </div>
        </div>

        {/* Playlist controls - reduced vertical spacing */}
        <div className="flex items-center gap-6 mb-3 mt-2 px-4">
          <div className="w-12 h-12 rounded-full bg-[#1ed760] flex items-center justify-center shadow-lg">
            <Play className="w-6 h-6 text-black fill-black ml-1" />
          </div>
          <Download className="w-7 h-7 text-gray-400 hover:text-white cursor-pointer" />
          <div className="ml-auto flex items-center gap-4">
            <Search className="w-4 h-4 text-gray-400" />
            <div className="text-xs text-gray-400">List</div>
            <ListMusic className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Songs table - adjusted for more visible songs */}
        <div className="w-full">
          {/* Table header */}
          <div className="grid grid-cols-[40px_1.5fr_1.2fr_1fr_80px] gap-4 border-b border-[#2a2a2a] px-4 py-2 text-sm text-gray-400 font-semibold">
            <div className="text-center">#</div>
            <div>Title</div>
            <div>Album</div>
            <div>Date added</div>
            <div className="flex justify-end pr-2">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          {/* Scrollable Songs List - with animations and album art */}
          <div 
            className="overflow-y-auto max-h-[calc(100vh-350px)] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900" 
            style={{ paddingBottom: "120px" }}
          >
            {playlist.map((song, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.05,
                  ease: "easeOut" 
                }}
                className="grid grid-cols-[40px_1.5fr_1.2fr_1fr_80px] gap-4 px-4 py-2 hover:bg-[#2a2a2a] rounded-md text-sm items-center"
              >
                <div className="text-gray-400 text-right pr-2">
                  {index + 1}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 relative overflow-hidden rounded-sm">
                    {song.albumArt ? (
                      <Image 
                        src={song.albumArt} 
                        alt={`${song.album} cover`} 
                        fill
                        className="object-cover"
                        onError={(e) => {
                          // Fallback if image fails to load
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <div className="text-xs text-white">{song.title.charAt(0)}</div>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{song.title}</div>
                    <div className="text-gray-400 text-xs">
                      {song.artist}
                    </div>
                  </div>
                </div>
                <div className="text-gray-400">{song.album}</div>
                <div className="text-gray-400">{song.days || '2 days ago'}</div>
                <div className="text-gray-400 flex justify-end pr-2">{song.duration}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
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
            Describe your mood, activity, or the vibe you're looking for, and
            we'll create a custom playlist just for you.
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
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-[#2a2a2a] border-none rounded-full pl-10 py-4 text-base w-full"
              placeholder="e.g., 'Hindi Pop'"
            />
          </div>

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
  );
};

export default MoodSearch;
