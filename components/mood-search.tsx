"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
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
    if (playlist.length > 0) {
      console.log("Playlist data from API:", playlist);
      setIsGenerating(false); // Stop the loading state when the playlist is ready
    }
  }, [playlist]);

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
        <Button onClick={() => router.reload()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-purple-900 to-black text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <Loader2 className="w-16 h-16 animate-spin text-green-500 mb-6" />
          <h2 className="text-2xl font-bold mb-3">Creating Your Playlist</h2>
          <p className="text-gray-300 mb-6 text-center max-w-md">
            Our AI is curating songs based on "{inputValue}"
          </p>
        </motion.div>
      </div>
    );
  }

  if (showResults && playlist.length > 0) {
    return (
      <div className="min-h-screen w-full bg-black text-white">
        <div className="w-full max-w-6xl mx-auto py-8">
          <h1 className="text-4xl font-bold mb-6">Your AI-Generated Playlist</h1>
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 px-4 text-gray-400">#</th>
                <th className="py-3 px-4 text-gray-400">Title</th>
                <th className="py-3 px-4 text-gray-400">Artist</th>
                <th className="py-3 px-4 text-gray-400">Album</th>
                <th className="py-3 px-4 text-gray-400">Duration</th>
              </tr>
            </thead>
            <tbody>
              {playlist.map((song, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-800 ${
                    index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                  }`}
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{song.title}</td>
                  <td className="py-3 px-4">{song.artist}</td>
                  <td className="py-3 px-4">{song.album}</td>
                  <td className="py-3 px-4">{song.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
