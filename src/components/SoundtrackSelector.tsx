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

// Famous romantic songs - these will be searched on Deezer
const romanticSearchQueries = [
  "Ed Sheeran Perfect",
  "Bruno Mars Just The Way You Are",
  "John Legend All of Me",
  "Ed Sheeran Thinking Out Loud",
  "Adele Make You Feel My Love",
  "Bruno Mars Marry You",
  "Christina Perri A Thousand Years",
  "Elvis Presley Can't Help Falling in Love",
  "Whitney Houston I Will Always Love You",
  "Aerosmith I Don't Want to Miss a Thing",
];

// Fallback soundtracks if Deezer fails
export const fallbackSoundtracks: Soundtrack[] = [
  {
    id: "romantic-piano",
    name: "Romantic Piano",
    artist: "Romantic Melody",
    style: "Piano Clásico",
    duration: "3:45",
    url: "https://cdn.pixabay.com/audio/2022/01/18/audio_d0ef34a3f0.mp3",
    color: "from-rose-500 to-pink-600",
  },
  {
    id: "love-story",
    name: "Love Story",
    artist: "Acoustic Dreams",
    style: "Acústico Romántico",
    duration: "2:58",
    url: "https://cdn.pixabay.com/audio/2022/10/25/audio_946a7c6a0f.mp3",
    color: "from-violet-500 to-purple-600",
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
  onSelect: (trackId: string) => void;
}

const SoundtrackSelector = ({ selectedTrack, onSelect }: SoundtrackSelectorProps) => {
  const [previewingTrack, setPreviewingTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [deezerTracks, setDeezerTracks] = useState<Soundtrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fetch tracks from Deezer API
  const fetchDeezerTrack = async (query: string, index: number): Promise<Soundtrack | null> => {
    try {
      // Using CORS proxy for Deezer API
      const response = await fetch(
        `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=1`)}`
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
          url: track.preview, // 30-second preview URL
          color: trackColors[index % trackColors.length],
          albumCover: track.album.cover_medium,
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching from Deezer:", error);
      return null;
    }
  };

  // Load initial romantic tracks
  useEffect(() => {
    const loadTracks = async () => {
      setIsLoading(true);
      const tracks: Soundtrack[] = [];
      
      for (let i = 0; i < romanticSearchQueries.length; i++) {
        const track = await fetchDeezerTrack(romanticSearchQueries[i], i);
        if (track) {
          tracks.push(track);
        }
      }
      
      if (tracks.length > 0) {
        setDeezerTracks(tracks);
        soundtracks = tracks; // Update exported soundtracks
      } else {
        setDeezerTracks(fallbackSoundtracks);
        soundtracks = fallbackSoundtracks;
      }
      
      setIsLoading(false);
    };

    loadTracks();
  }, []);

  // Search for custom tracks
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    const track = await fetchDeezerTrack(searchQuery, deezerTracks.length);
    
    if (track) {
      // Add to beginning of list
      const newTracks = [track, ...deezerTracks.filter(t => t.id !== track.id)];
      setDeezerTracks(newTracks);
      soundtracks = newTracks;
      onSelect(track.id);
    }
    
    setIsSearching(false);
    setSearchQuery("");
  };

  const handlePreview = (track: Soundtrack, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (previewingTrack === track.id && isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
      setPreviewingTrack(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = track.url;
        audioRef.current.volume = 0.5;
        audioRef.current.play().catch(() => {
          console.log("Preview not available for this track");
        });
      }
      setPreviewingTrack(track.id);
      setIsPlaying(true);
    }
  };

  const handleSelect = (trackId: string) => {
    onSelect(trackId);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setPreviewingTrack(null);
  };

  const displayTracks = deezerTracks.length > 0 ? deezerTracks : fallbackSoundtracks;

  return (
    <div className="space-y-4">
      <audio 
        ref={audioRef} 
        onEnded={() => {
          setIsPlaying(false);
          setPreviewingTrack(null);
        }}
        onError={() => {
          setIsPlaying(false);
          setPreviewingTrack(null);
        }}
      />

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
          {displayTracks.map((track) => {
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
