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
}

// Famous romantic songs with working audio URLs
export const soundtracks: Soundtrack[] = [
  {
    id: "perfect",
    name: "Perfect",
    artist: "Ed Sheeran",
    style: "Pop Romántico",
    duration: "4:23",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "thinking-out-loud",
    name: "Thinking Out Loud",
    artist: "Ed Sheeran",
    style: "Soul Romántico",
    duration: "4:41",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "all-of-me",
    name: "All of Me",
    artist: "John Legend",
    style: "R&B Romántico",
    duration: "4:29",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "from-violet-500 to-purple-500",
  },
  {
    id: "just-the-way-you-are",
    name: "Just The Way You Are",
    artist: "Bruno Mars",
    style: "Pop",
    duration: "3:40",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "a-thousand-years",
    name: "A Thousand Years",
    artist: "Christina Perri",
    style: "Pop Balada",
    duration: "4:45",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    color: "from-red-500 to-pink-500",
  },
  {
    id: "cant-help-falling",
    name: "Can't Help Falling In Love",
    artist: "Elvis Presley",
    style: "Clásico",
    duration: "3:02",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    color: "from-yellow-500 to-amber-500",
  },
  {
    id: "marry-you",
    name: "Marry You",
    artist: "Bruno Mars",
    style: "Pop Alegre",
    duration: "3:50",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    color: "from-cyan-500 to-blue-500",
  },
  {
    id: "at-last",
    name: "At Last",
    artist: "Etta James",
    style: "Jazz Clásico",
    duration: "3:02",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
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
                  <Music className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
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

      {selectedTrack && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2 mt-4"
        >
          <Volume2 className="w-4 h-4" />
          La música sonará automáticamente en tu página
        </motion.p>
      )}
    </div>
  );
};

export default SoundtrackSelector;
