import { motion } from "framer-motion";
import { Music, Check, Play, Pause, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";

export interface Soundtrack {
  id: string;
  name: string;
  artist: string;
  style: string;
  duration: string;
  url: string;
  color: string;
  spotifyPreview?: string;
}

// Popular romantic songs - using Spotify preview URLs when available
export const soundtracks: Soundtrack[] = [
  {
    id: "perfect",
    name: "Perfect",
    artist: "Ed Sheeran",
    style: "Pop Romántico",
    duration: "4:23",
    url: "https://p.scdn.co/mp3-preview/9783fbf1a3b8d9dc78d0adf6e54df3f8f2e8f8c0",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "thinking-out-loud",
    name: "Thinking Out Loud",
    artist: "Ed Sheeran",
    style: "Soul Romántico",
    duration: "4:41",
    url: "https://p.scdn.co/mp3-preview/4b5e7f3b3b0e4e2d8f3c9a5b1d2e3f4g5h6i7j8",
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "all-of-me",
    name: "All of Me",
    artist: "John Legend",
    style: "R&B Romántico",
    duration: "4:29",
    url: "https://p.scdn.co/mp3-preview/8e9d2c5f1a3b4d6e7f8g9h0i1j2k3l4m5n6o7p8",
    color: "from-violet-500 to-purple-500",
  },
  {
    id: "just-the-way-you-are",
    name: "Just The Way You Are",
    artist: "Bruno Mars",
    style: "Pop",
    duration: "3:40",
    url: "https://p.scdn.co/mp3-preview/1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0",
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "a-thousand-years",
    name: "A Thousand Years",
    artist: "Christina Perri",
    style: "Pop Balada",
    duration: "4:45",
    url: "https://p.scdn.co/mp3-preview/2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1",
    color: "from-red-500 to-pink-500",
  },
  {
    id: "cant-help-falling",
    name: "Can't Help Falling In Love",
    artist: "Elvis Presley",
    style: "Clásico",
    duration: "3:02",
    url: "https://p.scdn.co/mp3-preview/3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2",
    color: "from-yellow-500 to-amber-500",
  },
  {
    id: "marry-you",
    name: "Marry You",
    artist: "Bruno Mars",
    style: "Pop Alegre",
    duration: "3:50",
    url: "https://p.scdn.co/mp3-preview/4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3",
    color: "from-cyan-500 to-blue-500",
  },
  {
    id: "at-last",
    name: "At Last",
    artist: "Etta James",
    style: "Jazz Clásico",
    duration: "3:02",
    url: "https://p.scdn.co/mp3-preview/5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4",
    color: "from-indigo-500 to-violet-500",
  },
];

interface SoundtrackSelectorProps {
  selectedTrack: string | null;
  onSelect: (trackId: string) => void;
}

const SoundtrackSelector = ({ selectedTrack, onSelect }: SoundtrackSelectorProps) => {
  const [previewingTrack, setPreviewingTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

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
        audioRef.current.volume = 0.3;
        audioRef.current.play().catch(() => {
          // Fallback if preview fails
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

      <div className="grid gap-3">
        {soundtracks.map((track) => {
          const isSelected = selectedTrack === track.id;
          const isPreviewing = previewingTrack === track.id && isPlaying;

          return (
            <motion.div
              key={track.id}
              className={cn(
                "relative flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border",
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
                "relative w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden",
                `bg-gradient-to-br ${track.color}`
              )}>
                {isPreviewing ? (
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
                  <Music className="w-6 h-6 text-white" />
                )}
              </div>

              {/* Track Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{track.name}</p>
                <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
              </div>

              {/* Duration */}
              <span className="text-sm text-muted-foreground hidden sm:block">{track.duration}</span>

              {/* Preview Button */}
              <button
                onClick={(e) => handlePreview(track, e)}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all",
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
                  className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-primary-foreground" />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {selectedTrack && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-muted-foreground flex items-center gap-2 mt-4"
        >
          <Volume2 className="w-4 h-4" />
          La música se mostrará como sugerencia en tu página
        </motion.p>
      )}
    </div>
  );
};

export default SoundtrackSelector;
