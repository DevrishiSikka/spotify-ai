import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const useGeminiPlaylist = () => {
  const [userMood, setUserMood] = useState("");
  const [inputValue, setInputValue] = useState(""); // Temporary input value
  const [playlist, setPlaylist] = useState([]);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const fetchPlaylist = async () => {
    const url = "https://spotify-gemini-backend.onrender.com/api/generate";

    try {
      console.log("Sending request to API with prompt:", userMood);

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mood: userMood }), // Send only the userMood as the prompt
      });

      console.log("Raw response from API:", res);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Parsed response data from API:", data);

      setPlaylist(data); // Assuming the API directly returns the playlist JSON
      setError(null);
      setShowResults(true);
    } catch (err) {
      console.error("Error fetching playlist:", err);
      setError(err);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      setUserMood(inputValue); // Update userMood state
    }
  };

  useEffect(() => {
    if (userMood) {
      fetchPlaylist(); // Trigger API call only when userMood is updated
    }
  }, [userMood]);

  return {
    playlist,
    error,
    inputValue,
    setInputValue,
    showResults,
    handleKeyPress,
    setUserMood, // Include setUserMood in the return statement
  };
};

const GeminiPlaylistComponent = ({ playlist, showResults, userMood }) => {
  if (showResults && playlist.length > 0) {
    return (
      <div className="min-h-screen w-full flex flex-col bg-[#121212] text-white">
        {/* Top navigation bar - similar to Spotify */}
        <div className="bg-[#0A0A0A] h-16 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path fill="white" d="M15.957 2.793a1 1 0 010 1.414L8.164 12l7.793 7.793a1 1 0 11-1.414 1.414l-8.5-8.5a1 1 0 010-1.414l8.5-8.5a1 1 0 011.414 0z" />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center">
              <span className="text-white text-sm font-bold">DS</span>
            </div>
          </div>
        </div>
        
        {/* Playlist header */}
        <div className="bg-gradient-to-b from-[#4c1d95] to-[#121212] px-8 pt-6 pb-10">
          <div className="flex items-end gap-6 mb-8">
            <div className="w-56 h-56 bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center shadow-lg">
              <svg className="w-28 h-28 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <div>
              <p className="text-xs uppercase font-normal text-gray-300">Playlist</p>
              <h1 className="text-[5rem] font-bold text-white mb-4 mt-1">{userMood || "Liked Songs"}</h1>
              <div className="flex items-center text-sm text-gray-300">
                <span>Devrishi Sikka</span>
                <span className="mx-1">•</span>
                <span>{playlist.length} songs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="bg-[#121212] px-8 pb-8">
          {/* Controls */}
          <div className="flex items-center gap-4 my-6">
            <button className="w-12 h-12 rounded-full bg-[#1DB954] flex items-center justify-center hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"></path>
              </svg>
            </button>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-[16px_6fr_4fr_3fr_1fr] gap-4 border-b border-[#2A2A2A] py-2 px-4 text-sm text-gray-400">
            <div className="text-center">#</div>
            <div>TITLE</div>
            <div>ALBUM</div>
            <div>DATE ADDED</div>
            <div className="flex justify-end">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>

          {/* Songs */}
          {playlist.map((song, index) => (
            <div
              key={index}
              className="grid grid-cols-[16px_6fr_4fr_3fr_1fr] gap-4 px-4 py-3 hover:bg-[#2A2A2A] rounded group"
            >
              <div className="flex items-center justify-center text-gray-400 group-hover:text-white">
                {index + 1}
              </div>
              <div className="flex items-center">
                <div className="min-w-0">
                  <p className="font-normal text-white truncate">{song.title}</p>
                  <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-400 truncate">
                {song.album}
              </div>
              <div className="flex items-center text-gray-400 truncate">
                {song.days || '2 days ago'}
              </div>
              <div className="flex items-center justify-end text-gray-400">
                {song.duration}
              </div>
            </div>
          ))}
        </div>

        {/* Playback controls */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#181818] border-t border-[#2A2A2A] h-20 px-4 flex items-center justify-between">
          <div className="flex items-center w-1/3">
            <div className="w-14 h-14 bg-gray-700"></div>
            <div className="ml-3">
              <p className="text-sm text-white">Play a song</p>
              <p className="text-xs text-gray-400">Artist</p>
            </div>
          </div>
          <div className="flex flex-col items-center w-1/3">
            <div className="flex items-center gap-4">
              <button className="text-gray-400 hover:text-white">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M12.5 4a.5.5 0 0 0-1 0v3.248L5.233 3.612C4.693 3.3 4 3.678 4 4.308v7.384c0 .63.692 1.01 1.233.697L11.5 8.753V12a.5.5 0 0 0 1 0V4z"/>
                </svg>
              </button>
              <button className="bg-white rounded-full w-8 h-8 flex items-center justify-center">
                <svg width="16" height="16" fill="black" viewBox="0 0 16 16">
                  <path d="M4 4v8h8V4H4z"/>
                </svg>
              </button>
              <button className="text-gray-400 hover:text-white">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M3.5 4a.5.5 0 0 1 1 0v3.248l6.267-3.636c.54-.313 1.232.066 1.232.696v7.384c0 .63-.692 1.01-1.232.697L4.5 8.753V12a.5.5 0 0 1-1 0V4z"/>
                </svg>
              </button>
            </div>
            <div className="w-full flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-400">0:00</span>
              <div className="h-1 flex-1 bg-gray-600 rounded-full">
                <div className="h-full w-0 bg-white rounded-full"></div>
              </div>
              <span className="text-xs text-gray-400">0:00</span>
            </div>
          </div>
          <div className="flex items-center justify-end w-1/3 gap-2">
            <button className="text-gray-400 hover:text-white">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/>
                <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/>
                <path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7.22 4v8a.5.5 0 0 1-.997.1L4 8.869V11.5a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0v2.631l2.223-3.168a.5.5 0 0 1 .494-.413z"/>
              </svg>
            </button>
            <div className="w-24 h-1 bg-gray-600 rounded-full">
              <div className="h-full w-1/2 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export { useGeminiPlaylist, GeminiPlaylistComponent };