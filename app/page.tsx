"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import albumArt from "album-art";
import ColorThief from "colorthief";
import {
  Search,
  Home,
  Library,
  Heart,
  Clock,
  Play,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Mic2,
  ListMusic,
  Volume2,
  Maximize2,
  CircleArrowDown,
  Box,
  Users,
  Sparkles,
} from "lucide-react";
import MoodSearch from "@/components/mood-search";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PlaylistHeaderArtwork from "@/components/PlaylistHeaderArtwork";
import LoadingScreen from "@/components/LoadingScreen";
import { motion, AnimatePresence } from "framer-motion";
import AudioWaveform from "@/components/AudioWaveform";

export default function SpotifyClone() {
  const [showMoodSearch, setShowMoodSearch] = useState(false);
  const [showMoodResults, setShowMoodResults] = useState(false);
  const [moodQuery, setMoodQuery] = useState("");
  const [sidebarWidth, setSidebarWidth] = useState(400); // Increased from 320 to 400
  const [isResizing, setIsResizing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [playlistArtwork, setPlaylistArtwork] = useState({});
  const [songsWithArt, setSongsWithArt] = useState(songs);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [hasWaited, setHasWaited] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [backgroundColors, setBackgroundColors] = useState<string[]>(['#000000', '#000000', '#000000', '#000000']);
  const [animationKey, setAnimationKey] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const colorThief = useRef(new ColorThief());
  const minWidth = 80; // Minimum width before collapsing
  const maxWidth = 500; // Increased from 400 to 500
  const collapseThreshold = 300; // Width threshold to trigger auto-collapse
  const collapsedWidth = 64; // Fixed width when collapsed
  const expandedWidth = 400; // Increased from 320 to 400
  const sidebarRef = useRef(null);
  const fullscreenPlayerRef = useRef(null); // Add this at the top with other refs
  const [selectedPlaylistIndex, setSelectedPlaylistIndex] = useState<number>(5); // Default to "My Collection" playlist
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  const fetchSongs = async () => {
    try {
      const response = await fetch('https://dcpzr4ju26.execute-api.ap-south-1.amazonaws.com/spotify-dev/api/songs');
      if (!response.ok) {
        throw new Error('Failed to fetch songs');
      }
      const data = await response.json();
      // Fetch album art for each song
      const updatedSongs = await Promise.all(
        data.map(async (song) => {
          try {
            const artUrl = await albumArt(song.artist, { album: song.album, size: 'large' });
            return { ...song, image: artUrl || '/placeholder.svg' };
          } catch (error) {
            return { ...song, image: '/placeholder.svg' };
          }
        })
      );
      setSongsWithArt(updatedSongs);
      setIsLoadingData(false);
    } catch (error) {
      console.error('Error fetching songs:', error);
      setIsLoadingData(false);
    }
  };

  const toggleMoodSearch = () => {
    setShowMoodSearch(true);
    setShowMoodResults(false);
    setMoodQuery("");
  };

  const handleMoodSearch = (e) => {
    e.preventDefault();
    if (moodQuery.trim()) {
      setShowMoodResults(true);
    }
  };

  const startResizing = () => {
    setIsResizing(true);
  };

  const stopResizing = () => {
    setIsResizing(false);

    // Simplified collapse/expand logic
    if (sidebarWidth < collapseThreshold) {
      // If below threshold, always collapse completely
      setIsCollapsed(true);
      setSidebarWidth(collapsedWidth);
    } else {
      // If above threshold, always expand
      setIsCollapsed(false);

      // Snap to expanded width if close
      if (Math.abs(sidebarWidth - expandedWidth) < 50) {
        setSidebarWidth(expandedWidth);
      }
    }
  };

  const resize = (e) => {
    if (isResizing) {
      const newWidth = Math.max(minWidth, Math.min(e.clientX, maxWidth));

      // Update width
      setSidebarWidth(newWidth);

      // Immediately update collapsed state based on width
      // This prevents the "stuck in the middle" state
      if (newWidth < collapseThreshold && !isCollapsed) {
        setIsCollapsed(true);
      } else if (newWidth >= collapseThreshold && isCollapsed) {
        setIsCollapsed(false);
      }
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    setSidebarWidth(isCollapsed ? expandedWidth : collapsedWidth);
  };

  const extractColorsFromImage = (imageUrl: string) => {
    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      try {
        const colors = colorThief.current.getPalette(img, 4); // Get 4 colors instead of 2
        const hexColors = colors.map((color: number[]) => 
          `#${color.map((c: number) => c.toString(16).padStart(2, '0')).join('')}`
        );
        setBackgroundColors(hexColors);
        setAnimationKey(prev => prev + 1); // Force animation restart
          } catch (error) {
        console.error("Error extracting colors:", error);
        setBackgroundColors(['#000000', '#000000', '#000000', '#000000']);
        }
    };
    img.src = imageUrl;
  };

  useEffect(() => {
    if (isFullScreen && songsWithArt[currentSongIndex]?.image) {
      extractColorsFromImage(songsWithArt[currentSongIndex].image);
    }
  }, [isFullScreen, currentSongIndex, songsWithArt]);

  useEffect(() => {
    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResizing);

    return () => {
      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  useEffect(() => {
    // Fetch album artwork for library items with Travis Scott fallbacks
    const fetchArtworkForLibrary = async () => {
      const artworkMap = {};

      // Travis Scott albums for guaranteed aesthetic fallbacks
      const travisScottAlbums = [
        { artist: "Travis Scott", album: "Astroworld" },
        { artist: "Travis Scott", album: "UTOPIA" },
        { artist: "Travis Scott", album: "Birds in the Trap Sing McKnight" },
        { artist: "Travis Scott", album: "Rodeo" },
        { artist: "Travis Scott", album: "Days Before Rodeo" },
        { artist: "Travis Scott", album: "Owl Pharaoh" },
        { artist: "Travis Scott", album: "Huncho Jack, Jack Huncho" },
        { artist: "Travis Scott", album: "JACKBOYS" },
      ];

      for (let i = 0; i < libraryItems.length; i++) {
        const item = libraryItems[i];

        // Special case for "Liked Songs" - keep the heart graphic
        if (item.title.toLowerCase().includes("liked")) {
          artworkMap[i] = null;
          continue;
        }

        // For all other playlists, use Travis Scott album art
        try {
          // Get Travis Scott album art for this playlist
          const tsIndex = i % travisScottAlbums.length;
          const tsAlbum = travisScottAlbums[tsIndex];

          console.log(
            `Fetching Travis Scott album art for ${item.title}: ${tsAlbum.album}`
          );

          const travisArt = await albumArt(tsAlbum.artist, {
            album: tsAlbum.album,
            size: "large",
          });
          artworkMap[i] = travisArt;

          console.log(
            `Set Travis Scott album cover for ${item.title}: ${travisArt}`
          );
        } catch (error) {
          console.error(
            `Failed to fetch Travis Scott album art for ${item.title}:`,
            error
          );
          artworkMap[i] = null;
        }
      }

      console.log("Final artwork map:", artworkMap);
      setPlaylistArtwork(artworkMap);
    };

    fetchArtworkForLibrary();
  }, []);

  useEffect(() => {
    // Fetch songs from API on initial load
    fetchSongs();
    // Start 3 second timer
    const timer = setTimeout(() => setHasWaited(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      // If fullscreen was exited, update our state to match
      if (!document.fullscreenElement && 
          !document.webkitFullscreenElement && 
          !document.mozFullScreenElement && 
          !document.msFullscreenElement) {
        if (isFullScreen) {
          console.log("Fullscreen was exited externally, updating state");
          setIsFullScreen(false);
        }
      }
    };

    // Add event listeners
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, [isFullScreen]); // Add isFullScreen as a dependency

  useEffect(() => {
    if (!isFullScreen) return;
    setProgress(0);
    setElapsed(0);
    let raf;
    let start = null;
    const durationSec = parseDuration(songsWithArt[currentSongIndex]?.duration);
    const durationMs = durationSec * 1000;
    function animateBar(ts) {
      if (!start) start = ts;
      const elapsedMs = ts - start;
      let p = Math.min(elapsedMs / durationMs, 1);
      setProgress(p);
      setElapsed(Math.min(Math.floor(elapsedMs / 1000), durationSec));
      if (p < 1 && isFullScreen) {
        raf = requestAnimationFrame(animateBar);
      } else if (p >= 1 && isFullScreen) {
        // Loop for demo
        setTimeout(() => {
          setProgress(0);
          setElapsed(0);
          start = null;
          raf = requestAnimationFrame(animateBar);
        }, 1000);
      }
    }
    raf = requestAnimationFrame(animateBar);
    return () => raf && cancelAnimationFrame(raf);
  }, [isFullScreen, currentSongIndex, songsWithArt]);

  const isLoading = isLoadingData || !hasWaited;

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Random gradient generator for playlist covers
  const getRandomGradient = (index) => {
    const gradients = [
      "bg-gradient-to-br from-pink-500 to-orange-400",
      "bg-gradient-to-br from-purple-500 to-indigo-500",
      "bg-gradient-to-br from-green-400 to-blue-500",
      "bg-gradient-to-br from-yellow-400 to-red-500",
      "bg-gradient-to-br from-blue-500 to-teal-400",
      "bg-gradient-to-br from-red-500 to-purple-500",
      "bg-gradient-to-br from-teal-400 to-blue-500",
      "bg-gradient-to-br from-orange-500 to-pink-500",
    ];

    return gradients[index % gradients.length];
  };

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      setIsFullScreen(true);
      
      // Use setTimeout to ensure the DOM element is rendered before requesting fullscreen
      setTimeout(() => {
        const fullscreenElement = document.getElementById('fullscreen-player');
        
        if (fullscreenElement) {
          console.log("Requesting fullscreen on element:", fullscreenElement);
          
          try {
            if (fullscreenElement.requestFullscreen) {
              fullscreenElement.requestFullscreen().catch((err: Error) => console.error("Fullscreen error:", err));
            } else if ((fullscreenElement as any).mozRequestFullScreen) {
              (fullscreenElement as any).mozRequestFullScreen();
            } else if ((fullscreenElement as any).webkitRequestFullscreen) {
              (fullscreenElement as any).webkitRequestFullscreen();
            } else if ((fullscreenElement as any).msRequestFullscreen) {
              (fullscreenElement as any).msRequestFullscreen();
            } else {
              console.error("No fullscreen API available");
            }
          } catch (error) {
            console.error("Error entering fullscreen:", error);
          }
        } else {
          console.error("Fullscreen element not found");
        }
      }, 100); // Small delay to ensure element is in the DOM
    } else {
      setIsFullScreen(false);
      
      try {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          (document as any).mozCancelFullScreen();
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          (document as any).msExitFullscreen();
        }
      } catch (error) {
        console.error("Error exiting fullscreen:", error);
      }
    }
  };

  // Helper to parse mm:ss to seconds
  function parseDuration(durationStr) {
    if (!durationStr) return 0;
    const [min, sec] = durationStr.split(":").map(Number);
    return (isNaN(min) ? 0 : min) * 60 + (isNaN(sec) ? 0 : sec);
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Navbar - now spans the full width, fixed at the top */}
      <div className="h-16 bg-black flex items-center px-8 w-full z-20">
        {/* Spotify Logo - leftmost */}
        <div className="flex items-center mr-6">
          <svg viewBox="0 0 24 24" width="36" height="36" fill="white">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.48.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
        </div>
        {/* Centered group: Home Icon + Search Bar */}
        <div className="flex flex-1 justify-center items-center">
          <div className="flex items-center gap-4">
            <Home className="w-9 h-9 text-gray-200 bg-[#232323] rounded-full p-2" />
            <div className="relative w-[400px]">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="w-full h-12 bg-[#232323] border-none rounded-full pl-12 pr-12 text-base placeholder:text-gray-400 focus:outline-none"
                placeholder="What do you want to play?"
                type="text"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Box className="w-7 h-7 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
        {/* Right Side Controls */}
        <div className="flex items-center gap-8 ml-auto">
          <Bell className="w-6 h-6 text-gray-200" />
          <Users className="w-6 h-6 text-gray-200" />
          <div>
            <Image
              src="https://avatar.iran.liara.run/public/25"
              alt="Profile"
              width={36}
              height={36}
              className="rounded-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Main content area: sidebar under navbar, then main content */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar - now sits below navbar with reduced height and is resizable */}
        <div
          ref={sidebarRef}
          className={`bg-[#121212] flex flex-col relative ${
            isCollapsed ? "w-16" : ""
          } shadow-lg rounded-md transition-all duration-300 ease-in-out`}
          style={{
            width: `${sidebarWidth}px`,
            height: "calc(100vh - 4rem - 80px)", // 4rem = 64px (navbar), 80px for player bar
            minHeight: "0",
          }}
        >
          {isCollapsed && (
            <div className="flex flex-col items-center mt-4 space-y-5">
              {/* Library icon */}
              <Library className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />

              {/* AI Playlist button */}
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="h-8 w-8 flex items-center justify-center bg-gradient-to-br from-[#1ed760] to-[#1db954] rounded-full shadow hover:from-[#1db954] hover:to-[#1ed760] transition-colors p-1.5"
                      onClick={toggleMoodSearch}
                      aria-label="Create playlist using prompt"
                    >
                      <Sparkles className="w-5 h-5 text-black" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    align="center"
                    sideOffset={5}
                    className="bg-[#282828] border-none px-3 py-2"
                  >
                    <div className="text-xs font-medium">
                      Create playlist using prompt
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Expand sidebar button */}
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
                      onClick={toggleSidebar}
                      aria-label="Expand sidebar"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                      >
                        <path d="M5.3 12.7c-.4-.4-.4-1 0-1.4L8.6 8 5.3 4.7c-.4-.4-.4-1 0-1.4s1-.4 1.4 0l4 4c.4.4.4 1 0 1.4l-4 4c-.4.4-1 .4-1.4 0z" />
                      </svg>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    align="center"
                    className="bg-[#282828] border-none px-3 py-2"
                  >
                    <div className="text-xs font-medium">Expand sidebar</div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Album covers with tooltips */}
              <div className="flex flex-col items-center space-y-3 overflow-y-auto scrollbar-none max-h-[calc(100vh-280px)]">
                {libraryItems.map((item, index) => (
                  <TooltipProvider key={index} delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div 
                          className="w-10 h-10 rounded-md overflow-hidden cursor-pointer"
                          onClick={() => {
                            setSelectedPlaylistIndex(index);
                            setShowMoodSearch(false);
                            setShowMoodResults(false);
                            fetchSongs();
                          }}
                        >
                          {playlistArtwork[index] ? (
                            <Image
                              src={playlistArtwork[index] || "/placeholder.svg"}
                              alt={`${item.title} cover`}
                              width={40}
                              height={40}
                              className="object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg";
                              }}
                            />
                          ) : (
                            <div
                              className={`w-full h-full ${getRandomGradient(
                                index
                              )} flex items-center justify-center`}
                            >
                              {item.title.includes("Liked") && (
                                <Heart className="w-5 h-5 text-white fill-white" />
                              )}
                            </div>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        align="start"
                        alignOffset={-14}
                        sideOffset={5}
                        className="bg-[#282828] border-none px-3 py-2"
                      >
                        <div className="font-semibold text-xs">
                          {item.title}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {item.subtitle}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          )}

          {!isCollapsed && (
            <>
              {/* Library Header */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Library className="w-6 h-6 text-gray-400" />
                    <span className="text-base font-bold">Your Library</span>
                  </div>

                  {/* Add the collapse button next to the AI button */}
                  <div className="flex items-center gap-2">
                    {/* AI Sparkles Button */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className="h-8 w-8 flex items-center justify-center bg-gradient-to-br from-[#1ed760] to-[#1db954] rounded-full shadow hover:from-[#1db954] hover:to-[#1ed760] transition-colors p-1.5"
                            onClick={toggleMoodSearch}
                            aria-label="Create playlist using prompt"
                          >
                            <Sparkles className="w-5 h-5 text-black" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          className="bg-[#282828] border-none px-3 py-2 text-xs font-medium"
                        >
                          Create playlist using prompt
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {/* Collapse sidebar button */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className="h-8 w-8 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
                            onClick={toggleSidebar}
                            aria-label="Collapse sidebar"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="currentColor"
                            >
                              <path d="M10.7 12.7L6.7 8.7c-.4-.4-.4-1 0-1.4l4-4c.4-.4 1-.4 1.4 0s.4 1 0 1.4L8.4 8l3.7 3.7c.4.4.4 1 0 1.4-.4.4-1 .4-1.4 0z" />
                            </svg>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          className="bg-[#282828] border-none px-3 py-2 text-xs font-medium"
                        >
                          Collapse sidebar
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
                    className="flex items-center gap-3 p-2 pl-4 hover:bg-[#232323] rounded-md cursor-pointer"
                    onClick={() => {
                      setSelectedPlaylistIndex(index);
                      setShowMoodSearch(false);
                      setShowMoodResults(false);
                      fetchSongs();
                    }}
                  >
                    <div className="w-12 h-12 flex-shrink-0 relative rounded-md overflow-hidden">
                      {playlistArtwork[index] ? (
                        <Image
                          src={playlistArtwork[index] || "/placeholder.svg"}
                          alt={`${item.title} cover`}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                      ) : (
                        <div
                          className={`w-full h-full ${getRandomGradient(index)}`}
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm truncate">
                        {item.title}
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Resize handle */}
          <div
            className="absolute top-0 right-0 w-2 h-full cursor-ew-resize opacity-0 hover:opacity-100 bg-green-500 bg-opacity-20"
            onMouseDown={startResizing}
          />
        </div>

        {/* Add gap between sidebar and main content */}
        <div className="w-2" />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Existing Content */}
          <div className="flex-1 overflow-hidden rounded-md">
            <div className="flex flex-1 overflow-hidden">
              {/* Scrollable Playlist Section */}
              <div className="flex-1 overflow-y-auto bg-black">
                {showMoodSearch ? (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-800 to-gray-900">
                    <div className="w-full mx-auto flex items-center justify-center">
                      <MoodSearch
                        moodQuery={moodQuery}
                        setMoodQuery={setMoodQuery}
                        handleMoodSearch={handleMoodSearch}
                      />
                    </div>
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedPlaylistIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="w-full"
                    >
                    {/* Playlist header */}
                      <motion.div 
                        className="bg-gradient-to-b from-purple-800 to-black pt-4 pb-3 rounded-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        <motion.div 
                          className="px-6 flex items-end gap-6"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                        >
                        {/* Playlist Header Artwork */}
                          <motion.div 
                            className="w-48 h-48 min-w-[12rem] min-h-[12rem] bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center shadow-lg rounded-md"
                            initial={{ scale: 0.9, rotate: -5 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                          >
                            {playlistArtwork[selectedPlaylistIndex] ? (
                              <Image
                                src={playlistArtwork[selectedPlaylistIndex] || "/placeholder.svg"}
                                alt={`${libraryItems[selectedPlaylistIndex].title} cover`}
                                width={192}
                                height={192}
                                className="object-cover rounded-md"
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder.svg";
                                }}
                              />
                            ) : (
                              <div className={`w-full h-full ${getRandomGradient(selectedPlaylistIndex)}`} />
                            )}
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.4 }}
                          >
                          <div className="text-xs mb-1">Playlist</div>
                          <h1 className="text-8xl font-extrabold mb-3 leading-tight tracking-tight">
                              {libraryItems[selectedPlaylistIndex].title}
                          </h1>
                          <div className="flex items-center gap-1 text-xs">
                            <div className="w-6 h-6 rounded-full overflow-hidden">
                              <Image
                                src="https://avatar.iran.liara.run/public/25"
                                alt="Profile"
                                width={24}
                                height={24}
                              />
                            </div>
                            <span className="font-bold">Devrishi Sikka</span>
                              <span className="text-gray-400">• {libraryItems[selectedPlaylistIndex].subtitle}</span>
                          </div>
                          </motion.div>
                        </motion.div>
                      </motion.div>

                    {/* Playlist controls */}
                      <motion.div 
                        className="flex items-center gap-6 mb-6 px-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                      >
                      <div className="w-14 h-14 rounded-full bg-[#1ed760] flex items-center justify-center shadow-lg">
                        <Play className="w-7 h-7 text-black fill-black ml-1" />
                      </div>
                      <CircleArrowDown className="w-9 h-9 text-gray-400 hover:text-white cursor-pointer" />
                      <div className="ml-auto flex items-center gap-4">
                        <Search className="w-5 h-5 text-gray-400" />
                        <div className="text-sm text-gray-400">List</div>
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
                      <div className="grid grid-cols-[40px_1.5fr_1.2fr_1fr_80px] gap-4 border-b border-[#2a2a2a] px-4 py-2 text-sm text-gray-400 font-semibold">
                        <div className="text-center">#</div>
                        <div>Title</div>
                        <div>Album</div>
                        <div>Date added</div>
                        <div className="flex justify-end pr-2">
                          <Clock className="w-5 h-5" />
                        </div>
                      </div>
                        {/* Table rows */}
                        <motion.div
                        className="overflow-y-auto max-h-[calc(100vh-360px)] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
                        style={{ paddingBottom: "120px" }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.7 }}
                      >
                        {songsWithArt.map((song, index) => (
                            <motion.div
                            key={index}
                              className="grid grid-cols-[40px_1.5fr_1.2fr_1fr_80px] gap-4 px-4 py-2 hover:bg-[#2a2a2a] rounded-md text-sm items-center group cursor-pointer"
                              onClick={() => setCurrentSongIndex(index)}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2, delay: 0.8 + index * 0.02 }}
                          >
                            <div className="text-gray-400 relative flex justify-center">
                              <span className="group-hover:opacity-0 absolute">
                                {index + 1}
                              </span>
                              <div className="opacity-0 group-hover:opacity-100">
                                <Play className="w-4 h-4 text-white fill-white cursor-pointer" />
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 relative overflow-hidden rounded-sm">
                                <Image
                                  src={song.image || song.albumArt || "/placeholder.svg"}
                                  alt={song.album ? `${song.album} cover` : "cover"}
                                  fill
                                  className="object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = "/placeholder.svg";
                                  }}
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
                            <div className="text-gray-400">
                              {song.dateAdded}
                            </div>
                            <div className="text-gray-400 flex justify-end pr-2">
                              {song.duration}
                            </div>
                            </motion.div>
                        ))}
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Player bar - positioned absolutely to span full width */}
      <motion.div 
        className="h-20 bg-[#181818] border-t border-[#282828] flex items-center px-8 w-full fixed bottom-0 left-0 right-0"
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="flex items-center gap-3 w-80">
          {/* Album cover for the currently playing song */}
          <motion.div 
            className="w-14 h-14 relative rounded-md overflow-hidden"
            key={currentSongIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Image
              src={songsWithArt[currentSongIndex]?.image || songsWithArt[currentSongIndex]?.albumArt || "/placeholder.svg"}
              alt={songsWithArt[currentSongIndex]?.title || "Now playing"}
              fill
              className="object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
          </motion.div>
          <motion.div
            key={`${currentSongIndex}-info`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="font-medium text-sm">
              {songsWithArt[currentSongIndex]?.title || "Plain Sight"}
            </div>
            <div className="text-xs text-gray-400">
              {songsWithArt[currentSongIndex]?.artist || "ansh"}
            </div>
          </motion.div>
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
            <div className="text-xs text-gray-400">{`${Math.floor(elapsed / 60)}:${(elapsed % 60).toString().padStart(2, "0")}`}</div>
            <div className="flex-1 h-1 bg-[#4d4d4d] rounded-full">
              <motion.div
                initial={false}
                animate={{ width: `${Math.max(progress * 100, 2)}%` }}
                transition={{ ease: "linear", duration: 0.1 }}
                className="h-full bg-[#1ED760] rounded-full"
              />
            </div>
            <div className="text-xs text-gray-400">{`${Math.floor(elapsed / 60)}:${(elapsed % 60).toString().padStart(2, "0")}`}</div>
          </div>
        </div>

        <div className="w-80 flex items-center justify-end gap-3">
          <Mic2 className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
          <ListMusic className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
          <Volume2 className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
          <div className="w-24 h-1 bg-[#4d4d4d] rounded-full">
            <div className="w-3/4 h-full bg-white rounded-full"></div>
          </div>
          <Maximize2
            className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer"
            onClick={toggleFullScreen}
          />
        </div>
      </motion.div>

      {/* Full screen player with enhanced animations */}
      <AnimatePresence mode="wait">
        {isFullScreen && (
          <motion.div
            id="fullscreen-player"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.3 },
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.2 },
            }}
            className="fixed inset-0 z-[9999] flex flex-col w-screen h-screen overflow-hidden p-0 m-0"
          >
            {/* Animated background with extracted colors */}
            <motion.div
              key={animationKey}
              className="absolute inset-0 z-0"
            style={{
                backgroundImage: `linear-gradient(45deg, ${backgroundColors[0]}, ${backgroundColors[1]}, ${backgroundColors[2]}, ${backgroundColors[3]}, ${backgroundColors[0]})`,
                backgroundSize: '400% 400%',
              }}
              animate={{
                backgroundPosition: [
                  '0% 0%',
                  '100% 0%',
                  '100% 100%',
                  '0% 100%',
                  '0% 0%'
                ],
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
                times: [0, 0.25, 0.5, 0.75, 1]
              }}
            />

            {/* Animated overlay with different gradient */}
            <motion.div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `linear-gradient(135deg, ${backgroundColors[2]}, ${backgroundColors[0]}, ${backgroundColors[3]}, ${backgroundColors[1]}, ${backgroundColors[2]})`,
                backgroundSize: '400% 400%',
                opacity: 0.4,
                mixBlendMode: 'overlay',
              }}
              animate={{
                backgroundPosition: [
                  '100% 0%',
                  '0% 0%',
                  '0% 100%',
                  '100% 100%',
                  '100% 0%'
                ],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
                times: [0, 0.25, 0.5, 0.75, 1]
              }}
            />

            {/* Additional animated layer */}
            <motion.div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `linear-gradient(90deg, ${backgroundColors[1]}, ${backgroundColors[3]}, ${backgroundColors[0]}, ${backgroundColors[2]}, ${backgroundColors[1]})`,
                backgroundSize: '400% 400%',
                opacity: 0.2,
                mixBlendMode: 'soft-light',
              }}
              animate={{
                backgroundPosition: [
                  '0% 50%',
                  '100% 50%',
                  '0% 50%'
                ],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
                times: [0, 0.5, 1]
              }}
            />

            {/* Dark overlay with gradient for readability */}
            <div
              className="absolute inset-0 z-0"
              style={{
                backdropFilter: "blur(100px)",
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.7) 100%)",
              }}
            />

            {/* Content positioned above the background */}
            <div className="relative z-10 flex flex-col h-full">
              {/* Top bar with logo and time */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.1, duration: 0.4 },
                }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full flex justify-between items-center p-6"
              >
                {/* Close button */}
                <button
                  className="absolute top-6 left-6 text-white/70 hover:text-white transition-colors"
                  onClick={toggleFullScreen}
                  aria-label="Close full screen"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>

                {/* Spotify logo */}
                <div className="flex-1 flex justify-center items-center">
                  <svg viewBox="0 0 24 24" width="36" height="36" fill="white">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.48.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                  </svg>
                </div>

                {/* Clock - increased size */}
                <div className="text-white text-3xl font-medium">
                  {new Date().toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </div>
              </motion.div>

              {/* Rest of full-screen content */}
              <div className="flex-1 flex items-center justify-center px-12">
                <div className="flex items-center gap-24 max-w-6xl w-full">
                  {/* Album Cover with animation */}
                  <motion.div
                    initial={{ opacity: 0, x: -50, rotateY: "10deg" }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      rotateY: "0deg",
                      transition: {
                        delay: 0.2,
                        duration: 0.6,
                        type: "spring",
                        stiffness: 100,
                      },
                    }}
                    exit={{ opacity: 0, x: -30, transition: { duration: 0.3 } }}
                    className="rounded-2xl overflow-hidden border-4 border-[#202020] transform-gpu"
                  >
                    <div className="w-96 h-96">
                      <Image
                        src={songsWithArt[currentSongIndex]?.image || songsWithArt[currentSongIndex]?.albumArt || "/placeholder.svg"}
                        alt={songsWithArt[currentSongIndex]?.title || "Album Cover"}
                        width={400}
                        height={400}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                    </div>
                  </motion.div>

                  {/* Song Info and Progress Bar with staggered animation */}
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex flex-col gap-4">
                    {/* Song Title */}
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: { delay: 0.3, duration: 0.5 },
                      }}
                      exit={{ opacity: 0, y: 10, transition: { duration: 0.2 } }}
                        className="text-7xl font-bold text-white"
                    >
                        {songsWithArt[currentSongIndex]?.title || "Haseen"}
                    </motion.h1>

                      {/* Artist Name */}
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: { delay: 0.4, duration: 0.5 },
                      }}
                      exit={{ opacity: 0, y: 10, transition: { duration: 0.2 } }}
                        className="text-3xl font-normal text-white/80"
                    >
                        {songsWithArt[currentSongIndex]?.artist || "Talwiinder, NDS, Rippy Grewal"}
                    </motion.h2>

                    {/* Progress Bar */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: { delay: 0.5, duration: 0.5 },
                      }}
                      exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        className="w-full max-w-2xl"
                    >
                        <div className="w-full h-2 bg-[#3B3B3B] rounded-full mb-2">
                          <motion.div
                            initial={false}
                            animate={{ width: `${Math.max(progress * 100, 2)}%` }}
                            transition={{ ease: "linear", duration: 0.1 }}
                            className="h-full bg-[#1ED760] rounded-full"
                          />
                        </div>
                        <div className="flex justify-between text-white/70 text-lg">
                          <div>{`${Math.floor(elapsed / 60)}:${(elapsed % 60).toString().padStart(2, "0")}`}</div>
                          <div>-{(() => {
                            const durationSec = parseDuration(songsWithArt[currentSongIndex]?.duration);
                            const remaining = Math.max(durationSec - elapsed, 0);
                            return `${Math.floor(remaining / 60)}:${(remaining % 60).toString().padStart(2, "0")}`;
                          })()}</div>
                        </div>
                    </motion.div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls at bottom with animation */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.5, duration: 0.5 },
                }}
                exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
                className="flex justify-center items-center gap-16 pb-8 mt-8"
              >
                {/* Previous Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-white"
                >
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <polygon points="19 20 9 12 19 4 19 20"></polygon>
                    <line x1="5" y1="20" x2="5" y2="4"></line>
                  </svg>
                </motion.button>

                {/* Pause Button (shows white circle) */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white w-20 h-20 rounded-full flex items-center justify-center"
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="black"
                    stroke="none"
                  >
                    <rect x="7" y="6" width="3" height="12" rx="1"></rect>
                    <rect x="14" y="6" width="3" height="12" rx="1"></rect>
                  </svg>
                </motion.button>

                {/* Next Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-white"
                >
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <polygon points="5 4 15 12 5 20 5 4"></polygon>
                    <line x1="19" y1="4" x2="19" y2="20"></line>
                  </svg>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
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
    title: "My Collection",
    subtitle: "Playlist • 2,970 songs",
    image: "/placeholder.svg",
  },
  { title: "JK's Punjabi Playlist", subtitle: "Playlist • JK", image: "/placeholder.svg" },
  { title: "Bali", subtitle: "Artist", image: "/placeholder.svg" },
];

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
];

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
  );
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
  );
}
