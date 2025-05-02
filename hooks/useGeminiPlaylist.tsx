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

const GeminiPlaylistComponent = ({ playlist, showResults }) => {
  if (showResults && playlist.length > 0) {
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
    );
  }
  return null;
};

export { useGeminiPlaylist, GeminiPlaylistComponent };