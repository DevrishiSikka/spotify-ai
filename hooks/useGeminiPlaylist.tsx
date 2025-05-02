import { useEffect, useState } from "react";

const useGeminiPlaylist = () => {
  const [userMood, setUserMood] = useState("");
  const [inputValue, setInputValue] = useState(""); // Temporary input value
  const [playlist, setPlaylist] = useState([]);
  const [error, setError] = useState(null);

  const fetchPlaylist = async () => {
    const url = "https://spotify-gemini-backend.onrender.com/api/generate"; // Proxy server URL

    const masterPrompt = `
      i need a json in the below format and i will give you a mood and you will give me a playlist of 10 songs in the below format:
      User mood: ${userMood}
      Return the data strictly in the following JSON format:
      [
        {
          "title": "Song Title",
          "artist": "Artist Name",
          "album": "Album Name",
          "duration": "4:30",
          "days": "2 days ago"
        }
      ]
    `;

    const payload = {
      prompt: masterPrompt,
      temperature: 0.7,
      maxOutputTokens: 500,
    };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Parsed response data:", data);

      // Extract raw text response
      const rawText = data?.candidates?.[0]?.output || "";
      console.log("Raw text output:", rawText);

      // Parse JSON portion
      const jsonStart = rawText.indexOf("[");
      const jsonEnd = rawText.lastIndexOf("]");
      const jsonString = rawText.slice(jsonStart, jsonEnd + 1);

      const parsedPlaylist = JSON.parse(jsonString);
      setPlaylist(parsedPlaylist);
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
  };
};

export default useGeminiPlaylist;