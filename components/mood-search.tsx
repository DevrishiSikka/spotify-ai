"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, Heart, Clock, Play, Download, ListMusic, Loader2, Music, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useGeminiPlaylist } from "@/hooks/useGeminiPlaylist";
import AudioWaveform from "@/components/AudioWaveform";
import PlaylistHeaderArtwork from "@/components/PlaylistHeaderArtwork";

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
    playlistName,
    isGeneratingName
  } = useGeminiPlaylist();

  const [isGenerating, setIsGenerating] = useState(false);
  const [savedSongs, setSavedSongs] = useState<Set<number>>(new Set());
  const [showSaveMessage, setShowSaveMessage] = useState<number | null>(null);

  const premadePrompts = [
    "Late Night Coding Vibes",
    "Rainy Day Chill Beats",
    "Golden Hour Indie Hits",
    "Deep Focus Work Mode",
    "Feel Good Morning Jams",
    "Heartfelt Acoustic Love Songs",
  ];
  
  const handlePromptClick = (prompt) => {
    setInputValue(prompt);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() === "") {
      console.error("Input value is empty. Please enter a mood.");
      return;
    }
    console.log("Form submitted with inputValue:", inputValue);
    setIsGenerating(true);
    setUserMood(inputValue);
  };

  const handleSaveSong = (index: number) => {
    if (savedSongs.has(index)) {
      setSavedSongs(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
      setShowSaveMessage(index);
      setTimeout(() => setShowSaveMessage(null), 1000);
    } else {
      setSavedSongs(prev => new Set(prev).add(index));
      setShowSaveMessage(index);
      setTimeout(() => setShowSaveMessage(null), 1000);
    }
  };

  useEffect(() => {
    if (playlist.length > 0 && !isLoadingArtwork) {
      console.log("Playlist data from API:", playlist);
      setIsGenerating(false);
    }
  }, [playlist, isLoadingArtwork]);

  useEffect(() => {
    if (error) {
      console.error("Error from API:", error.message);
      setIsGenerating(false);
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
          <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-center">
            Crafting your vibe...
          </h2>
          {/* Use the AudioWaveform component */}
          <div className="mb-8">
            <AudioWaveform />
          </div>
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
      <AnimatePresence mode="wait">
        <motion.div
          key="ai-playlist"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="min-h-screen w-full bg-black text-white overflow-x-hidden flex"
        >
          {/* Sidebar placeholder - reduced from w-2 to w-1 */}
          <div className="w-1 flex-shrink-0" />
          {/* Main playlist section - adjusted margin */}
          <div className="flex-1 ml-0 rounded-lg overflow-hidden bg-black">
            {/* Playlist header */}
            <motion.div 
              className="bg-gradient-to-b from-purple-800 to-black pt-4 pb-3 rounded-t-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <motion.div 
                className="px-8 flex items-end gap-8 relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                {/* Playlist cover art */}
                <motion.div 
                  className="w-48 h-48 min-w-[12rem] min-h-[12rem] bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center shadow-lg rounded-md"
                  initial={{ scale: 0.9, rotate: -5 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <PlaylistHeaderArtwork />
                </motion.div>
                {/* Playlist info */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <div className="text-xs mb-2">Playlist</div>
                  <h1 className="text-6xl md:text-7xl font-extrabold mb-4 leading-tight tracking-tight truncate">
                    {isGeneratingName ? (
                      <div className="flex items-center gap-2">
                        <span className="opacity-70">Naming playlist...</span>
                        <Loader2 className="w-6 h-6 animate-spin" />
                      </div>
                    ) : (
                      playlistName || inputValue
                    )}
                  </h1>
                  <div className="flex items-center gap-2 text-base mb-4">
                    <div className="w-7 h-7 rounded-full p-0.5 bg-gray-700 flex items-center justify-center">
                      <div className="w-full h-full rounded-full overflow-hidden">
                        <Image
                          src="https://avatar.iran.liara.run/public/25"
                          alt="Profile"
                          width={28}
                          height={28}
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <span className="font-bold">Devrishi Sikka</span>
                    <span className="text-gray-300">• {playlist.length} songs</span>
                  </div>
                  <div>
                    <Button
                      className="bg-white hover:bg-gray-200 text-black rounded-md py-2 px-8 text-base font-bold transition-all"
                      onClick={() => console.log("Added to library")}
                    >
                      Add to Library
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Playlist controls */}
            <motion.div 
              className="flex items-center gap-6 mb-6 px-8 bg-black"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <div className="w-14 h-14 rounded-full bg-[#1ed760] flex items-center justify-center shadow-lg">
                <Play className="w-7 h-7 text-black fill-black ml-1" />
              </div>
              <Download className="w-8 h-8 text-gray-400 hover:text-white cursor-pointer" />
              <div className="ml-auto flex items-center gap-4">
                <Search className="w-5 h-5 text-gray-400" />
                <div className="text-base text-gray-400">List</div>
                <ListMusic className="w-5 h-5 text-gray-400" />
              </div>
            </motion.div>

            {/* Songs table */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              {/* Table header */}
              <div className="grid grid-cols-[40px_1.5fr_1.2fr_1fr_80px_40px] gap-4 border-b border-[#2a2a2a] px-8 py-2 text-base text-gray-400 font-semibold">
                <div className="text-center">#</div>
                <div>Title</div>
                <div>Album</div>
                <div>Date added</div>
                <div className="flex justify-end pr-2">
                  <Clock className="w-5 h-5" />
                </div>
                <div></div>
              </div>
              {/* Table rows */}
              <motion.div
                className="overflow-y-auto max-h-[calc(100vh-450px)] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
                style={{ paddingBottom: "40px" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                {playlist.map((song, index) => (
                  <motion.div
                    key={index}
                    className="grid grid-cols-[40px_1.5fr_1.2fr_1fr_80px_40px] gap-4 px-8 py-2 hover:bg-[#2a2a2a] rounded-md text-base items-center group"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.8 + index * 0.02 }}
                  >
                    <div className="text-gray-400 relative flex justify-center">
                      <span className="group-hover:hidden">{index + 1}</span>
                      <Play className="w-4 h-4 text-white hidden group-hover:block" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 min-w-[40px] rounded-md overflow-hidden bg-gray-800">
                        {song.albumArt ? (
                          <Image
                            src={song.albumArt}
                            alt={song.title}
                            width={40}
                            height={40}
                            className="object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                            <Music className="w-5 h-5 text-gray-600" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-white font-medium">{song.title}</div>
                        <div className="text-gray-400 text-sm">{song.artist}</div>
                      </div>
                    </div>
                    <div className="text-gray-400">{song.album}</div>
                    <div className="text-gray-400">{song.dateAdded || "2 days ago"}</div>
                    <div className="text-gray-400 flex justify-end pr-2">{song.duration || "3:30"}</div>
                    <div className="relative flex items-center justify-center">
                      <button
                        onClick={() => handleSaveSong(index)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          savedSongs.has(index) ? 'bg-[#1ed760] text-black' : 'text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
                        }`}
                      >
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={savedSongs.has(index) ? "minus" : "plus"}
                            initial={{ scale: 0, rotate: -90 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 90 }}
                            transition={{ duration: 0.1 }}
                          >
                            {savedSongs.has(index) ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                          </motion.div>
                        </AnimatePresence>
                      </button>
                      <AnimatePresence>
                        {showSaveMessage === index && (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-full mr-2 bg-[#1ed760] text-black text-xs px-2 py-1 rounded-full whitespace-nowrap"
                          >
                            {savedSongs.has(index) ? "Saved to My Collection" : "Removed from My Collection"}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-b from-[#323232] to-[#121212]">
      {/* Sidebar placeholder (match the sidebar width used elsewhere, e.g., w-60) */}
      <div className="w-12 flex-shrink-0" />
      {/* Main content with animation */}
      <AnimatePresence>
        <motion.div
          key="ai-search"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 32 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex-1 flex items-center justify-center"
        >
          <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center py-6">
            {/* Heading - reduced size */}
            <div className="flex flex-col items-center w-full mb-4">
              <h1 className="text-xl md:text-2xl font-extrabold text-center mb-3 leading-snug">
                Create Your Perfect Playlist<br className="hidden md:block" />with AI
              </h1>
              <p className="text-gray-300 text-center text-sm max-w-xl mb-6 leading-relaxed">
                Tell us how you're feeling, what you're doing, or the vibe you want—
                <br className="hidden md:block" />
                our AI will instantly craft the perfect playlist just for you.
              </p>
            </div>

            {/* Search bar and mascot - smaller */}
            <form
              onSubmit={onSubmit}
              className="w-full max-w-2xl mx-auto flex flex-col items-center gap-2 mb-4"
            >
              <div className="w-full flex items-center gap-2 justify-center">
                <div className="relative flex-1 max-w-2xl">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="bg-[#232323] border border-gray-700 hover:border-gray-600 focus:border-[#1ed760] rounded-full pl-9 pr-9 py-2 text-xs w-full placeholder:text-gray-400 focus:outline-none transition-colors"
                    placeholder='e.g. "Evening chill for studying".'
                  />
                </div>
                <div className="flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 1 }}
                    animate={{ 
                      scale: [1, 1.05, 1],
                      rotate: [0, 3, -3, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "loop"
                    }}
                    className="flex items-center justify-center"
                  >
                    <svg width="72" height="72" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                      {/* Character Body */}
                      <circle cx="100" cy="100" r="50" fill="#7FFFA0" />
                      {/* Character Face */}
                      <ellipse cx="80" cy="95" rx="8" ry="10" fill="transparent" />
                      <ellipse cx="120" cy="95" rx="8" ry="10" fill="transparent" />
                      <path d="M 85 120 Q 100 135 115 120" stroke="transparent" strokeWidth="6" fill="none" strokeLinecap="round" />
                      {/* Headphone Band */}
                      <path d="M 50 80 C 50 30, 150 30, 150 80" stroke="#1DA93B" strokeWidth="8" fill="none" />
                      {/* Headphone Ear Cups */}
                      <ellipse cx="50" cy="90" rx="15" ry="20" fill="#1DA93B" />
                      <ellipse cx="150" cy="90" rx="15" ry="20" fill="#1DA93B" />
                    </svg>
                  </motion.div>
                </div>
              </div>
            </form>

            {/* Prompt chips - smaller - wider container */}
            <div className="w-full max-w-2xl mx-auto flex flex-wrap justify-center gap-2 mb-6">
              {premadePrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handlePromptClick(prompt)}
                  className="bg-[#232323] text-white px-4 py-1.5 rounded-full font-medium text-xs hover:bg-[#282828] transition"
                  style={{ minWidth: 0 }}
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Generate button - wider */}
            <div className="w-full max-w-2xl mx-auto flex justify-center">
              <button
                type="submit"
                onClick={onSubmit}
                className="w-full bg-[#1ed760] hover:bg-[#1fdf64] text-black font-bold rounded-full py-2.5 text-sm flex items-center justify-center gap-1.5 transition"
              >
                Generate My Playlist
                <span role="img" aria-label="headphones">🎧</span>
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MoodSearch;
