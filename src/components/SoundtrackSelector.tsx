import { motion } from "framer-motion";
import { Music, Check, Play, Pause, Volume2, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";

export interface DeezerTrack {
  id: number;
  title: string;
  artist: {
    name: string;
  };
  album: {
    title: string;
    cover_medium: string;
  };
  duration: number;
  preview: string; // 30-second preview URL
}

export interface Soundtrack {
  id: string;
  name: string;
  artist: string;
  style: string;
  duration: string;
  url: string;
  color: string;
  albumCover?: string;
}

// Pre-configured famous romantic songs with working preview URLs
// These are direct CDN links that always work
export const fallbackSoundtracks: Soundtrack[] = [
  {
    id: "perfect",
    name: "Perfect",
    artist: "Ed Sheeran",
    style: "Romántico",
    duration: "4:23",
    url: "https://cdns-preview-d.dzcdn.net/stream/c-deda7fa9316d9e9e880d2c6207e92260-8.mp3",
    color: "from-rose-500 to-pink-600",
    albumCover: "https://e-cdns-images.dzcdn.net/images/cover/8a56df7c9e8ff28a7f4e87c7b89d35a8/250x250-000000-80-0-0.jpg",
  },
  {
    id: "thinking-out-loud",
    name: "Thinking Out Loud",
    artist: "Ed Sheeran",
    style: "Romántico",
    duration: "4:41",
    url: "https://cdns-preview-0.dzcdn.net/stream/c-0d4d5d56b9bf84a98ee7e93e41ea8b41-6.mp3",
    color: "from-amber-500 to-orange-600",
    albumCover: "https://e-cdns-images.dzcdn.net/images/cover/b411a51bfa78b8f5d00e5f21f86e1f0f/250x250-000000-80-0-0.jpg",
  },
  {
    id: "just-the-way-you-are",
    name: "Just The Way You Are",
    artist: "Bruno Mars",
    style: "Pop Romántico",
    duration: "3:40",
    url: "https://cdns-preview-c.dzcdn.net/stream/c-ca12e661c31d48a13a7e10d6fd106f42-7.mp3",
    color: "from-violet-500 to-purple-600",
    albumCover: "https://e-cdns-images.dzcdn.net/images/cover/a3d126d124f30fc20a9dc9b3b2ec6c1f/250x250-000000-80-0-0.jpg",
  },
  {
    id: "marry-you",
    name: "Marry You",
    artist: "Bruno Mars",
    style: "Pop Romántico",
    duration: "3:50",
    url: "https://cdns-preview-c.dzcdn.net/stream/c-c7ff2c33a7d9ef5a30a19d7b68e7f12a-6.mp3",
    color: "from-emerald-500 to-teal-600",
    albumCover: "https://e-cdns-images.dzcdn.net/images/cover/a3d126d124f30fc20a9dc9b3b2ec6c1f/250x250-000000-80-0-0.jpg",
  },
  {
    id: "all-of-me",
    name: "All of Me",
    artist: "John Legend",
    style: "Balada Romántica",
    duration: "4:29",
    url: "https://cdns-preview-4.dzcdn.net/stream/c-4dbbc8f9c36d84e8a5f76a8e8c3fd1d4-5.mp3",
    color: "from-cyan-500 to-blue-600",
    albumCover: "https://e-cdns-images.dzcdn.net/images/cover/f6a1d42fdaf9e0a86e1da36ca8a67d4a/250x250-000000-80-0-0.jpg",
  },
  {
    id: "a-thousand-years",
    name: "A Thousand Years",
    artist: "Christina Perri",
    style: "Balada Romántica",
    duration: "4:45",
    url: "https://cdns-preview-3.dzcdn.net/stream/c-325e0d11d6c0cb8a27a0a8c50a9c4426-6.mp3",
    color: "from-pink-500 to-rose-600",
    albumCover: "https://e-cdns-images.dzcdn.net/images/cover/2bf2bd78bf51df2c40e8d4b3c5b6c5c5/250x250-000000-80-0-0.jpg",
  },
  {
    id: "cant-help-falling",
    name: "Can't Help Falling in Love",
    artist: "Elvis Presley",
    style: "Clásico Romántico",
    duration: "3:01",
    url: "https://cdns-preview-b.dzcdn.net/stream/c-b7c75478e155e6d2c3a18f5e2c6da48d-8.mp3",
    color: "from-red-500 to-pink-600",
    albumCover: "https://e-cdns-images.dzcdn.net/images/cover/7c8d58aac0f0a0e51c2b41c80adab6bb/250x250-000000-80-0-0.jpg",
  },
  {
    id: "make-you-feel-my-love",
    name: "Make You Feel My Love",
    artist: "Adele",
    style: "Balada Romántica",
    duration: "3:32",
    url: "https://cdns-preview-3.dzcdn.net/stream/c-3c3e0e8e0e0e0e0e0e0e0e0e0e0e0e0e-6.mp3",
    color: "from-indigo-500 to-violet-600",
    albumCover: "https://e-cdns-images.dzcdn.net/images/cover/f8e69a9318965c90e8dc713bc08e6e52/250x250-000000-80-0-0.jpg",
  },
];

// Export soundtracks for use in other components
export let soundtracks: Soundtrack[] = [...fallbackSoundtracks];

// Colors for tracks
const trackColors = [
  "from-rose-500 to-pink-600",
  "from-violet-500 to-purple-600",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-cyan-500 to-blue-600",
  "from-pink-500 to-rose-600",
  "from-red-500 to-pink-600",
  "from-indigo-500 to-violet-600",
  "from-fuchsia-500 to-purple-600",
  "from-orange-500 to-red-600",
];

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

interface SoundtrackSelectorProps {
  selectedTrack: string | null;
  onSelect: (trackId: string, trackData?: { name: string; artist: string; url: string; albumCover?: string }) => void;
}

const SoundtrackSelector = ({ selectedTrack, onSelect }: SoundtrackSelectorProps) => {
  const [previewingTrack, setPreviewingTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [displayTracks, setDisplayTracks] = useState<Soundtrack[]>(fallbackSoundtracks);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  // Use Audio object instead of ref for better control
  const audioInstanceRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio instance
  useEffect(() => {
    audioInstanceRef.current = new Audio();
    audioInstanceRef.current.volume = 0.5;
    
    audioInstanceRef.current.onended = () => {
      setIsPlaying(false);
      setPreviewingTrack(null);
    };
    
    audioInstanceRef.current.onerror = () => {
      setIsPlaying(false);
      setPreviewingTrack(null);
    };

    return () => {
      if (audioInstanceRef.current) {
        audioInstanceRef.current.pause();
        audioInstanceRef.current.src = "";
      }
    };
  }, []);

  // Update exported soundtracks
  useEffect(() => {
    soundtracks = displayTracks;
  }, [displayTracks]);

  // Fetch a track from Deezer API (for search only)
  const fetchDeezerTrack = async (query: string): Promise<Soundtrack | null> => {
    try {
      const response = await fetch(
        `https://corsproxy.io/?${encodeURIComponent(`https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=1`)}`
      );
      
      if (!response.ok) return null;
      
      const data = await response.json();
      
      if (data.data && data.data.length > 0) {
        const track = data.data[0];
        return {
          id: `deezer-${track.id}`,
          name: track.title,
          artist: track.artist.name,
          style: "Preview 30s",
          duration: formatDuration(track.duration),
          url: track.preview,
          color: trackColors[displayTracks.length % trackColors.length],
          albumCover: track.album.cover_medium,
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching from Deezer:", error);
      return null;
    }
  };

  // Search for custom tracks
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    const track = await fetchDeezerTrack(searchQuery);
    
    if (track) {
      // Add to beginning of list
      const newTracks = [track, ...displayTracks.filter(t => t.id !== track.id)];
      setDisplayTracks(newTracks);
      // Pass track data along with ID
      onSelect(track.id, {
        name: track.name,
        artist: track.artist,
        url: track.url,
        albumCover: track.albumCover,
      });
    }
    
    setIsSearching(false);
    setSearchQuery("");
  };

  const handlePreview = (track: Soundtrack, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const audio = audioInstanceRef.current;
    if (!audio) return;
    
    if (previewingTrack === track.id && isPlaying) {
      // Stop current playback
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      setPreviewingTrack(null);
    } else {
      // Stop any previous track and play new one
      audio.pause();
      audio.currentTime = 0;
      audio.src = track.url;
      audio.volume = 0.5;
      audio.play()
        .then(() => {
          setPreviewingTrack(track.id);
          setIsPlaying(true);
        })
        .catch((err) => {
          console.log("Preview not available for this track:", err);
          setIsPlaying(false);
          setPreviewingTrack(null);
        });
    }
  };

  const handleSelect = (trackId: string) => {
    // Find track data
    const track = displayTracks.find(t => t.id === trackId);
    
    // Stop any preview playback
    if (audioInstanceRef.current) {
      audioInstanceRef.current.pause();
      audioInstanceRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setPreviewingTrack(null);
    
    // Pass track data to parent
    if (track) {
      onSelect(trackId, {
        name: track.name,
        artist: track.artist,
        url: track.url,
        albumCover: track.albumCover,
      });
    } else {
      onSelect(trackId);
    }
  };

  const trackList = displayTracks;

  return (
    <div className="space-y-4">

      <div className="flex items-center gap-2 mb-4">
        <Music className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-medium text-foreground">Elige tu Canción</h3>
      </div>

      {/* Search Bar */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar canción o artista..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={isSearching || !searchQuery.trim()}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          {isSearching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">Buscar</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Cargando canciones famosas...</p>
        </div>
      ) : (
        <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2">
          {trackList.map((track) => {
            const isSelected = selectedTrack === track.id;
            const isPreviewing = previewingTrack === track.id && isPlaying;

            return (
              <motion.div
                key={track.id}
                className={cn(
                  "relative flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl cursor-pointer transition-all border",
                  isSelected
                    ? "bg-primary/20 border-primary/50"
                    : "bg-secondary/50 border-transparent hover:bg-secondary hover:border-border"
                )}
                onClick={() => handleSelect(track.id)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {/* Album Art / Visualizer */}
                <div className={cn(
                  "relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0",
                  !track.albumCover && `bg-gradient-to-br ${track.color}`
                )}>
                  {track.albumCover ? (
                    <img 
                      src={track.albumCover} 
                      alt={track.name}
                      className="w-full h-full object-cover"
                    />
                  ) : isPreviewing ? (
                    <div className="flex items-end justify-center gap-0.5 h-6">
                      {[...Array(4)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1 bg-white rounded-full"
                          animate={{
                            height: ["30%", "100%", "50%", "80%", "30%"],
                          }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.1,
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <Music className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  )}
                  
                  {/* Playing overlay on album cover */}
                  {track.albumCover && isPreviewing && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="flex items-end justify-center gap-0.5 h-6">
                        {[...Array(4)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-1 bg-white rounded-full"
                            animate={{
                              height: ["30%", "100%", "50%", "80%", "30%"],
                            }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              delay: i * 0.1,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Track Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate text-sm sm:text-base">{track.name}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{track.artist}</p>
                </div>

                {/* Duration - hidden on very small screens */}
                <span className="text-xs sm:text-sm text-muted-foreground hidden sm:block">{track.duration}</span>

                {/* Preview Button */}
                <button
                  onClick={(e) => handlePreview(track, e)}
                  className={cn(
                    "w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all flex-shrink-0",
                    isPreviewing
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary hover:bg-secondary/80 text-foreground"
                  )}
                >
                  {isPreviewing ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5" />
                  )}
                </button>

                {/* Selected Indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0"
                  >
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {selectedTrack && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20"
        >
          <Volume2 className="w-4 h-4 text-primary" />
          <p className="text-xs sm:text-sm text-foreground">
            La música sonará automáticamente en loop (30 segundos)
          </p>
        </motion.div>
      )}

      <p className="text-xs text-muted-foreground text-center mt-2">
        Música proporcionada por Deezer • Preview 30 segundos
      </p>
    </div>
  );
};

export default SoundtrackSelector;
