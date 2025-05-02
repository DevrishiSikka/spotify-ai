import { useEffect, useState } from "react";

const useGeminiPlaylist = (userMood) => {
  const [playlist, setPlaylist] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      const url = "https://silver-palm-tree-p97jqvv5qx7f74xg-5000.app.github.dev/api/generate"; // Proxy server URL

      const masterPrompt = `
        You are a music recommendation assistant. Based on the user's mood or input, generate a playlist of 10 songs.
        Each song should include:
        - title: name of the song
        - artist: artist or group name
        - album: the album it belongs to
        - duration: estimated song length (e.g., "4:22")
        - days: how long ago it was added (e.g., "2 days ago", "1 week ago")

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

        User mood: ${userMood}
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

        const data = await res.json();

        // Extract raw text response
        const rawText = data?.candidates?.[0]?.output || "";

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

    if (userMood) fetchPlaylist();
  }, [userMood]);

  return { playlist, error };
};

export default useGeminiPlaylist;