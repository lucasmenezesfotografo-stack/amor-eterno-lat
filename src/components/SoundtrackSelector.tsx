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

// Famous romantic songs with FREE royalty-free audio that actually works
export const soundtracks: Soundtrack[] = [
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
  {
    id: "eternal-love",
    name: "Eternal Love",
    artist: "Piano Romance",
    style: "Balada Piano",
    duration: "3:22",
    url: "https://cdn.pixabay.com/audio/2022/02/15/audio_8c3f8e8c03.mp3",
    color: "from-amber-500 to-orange-600",
  },
  {
    id: "beautiful-moments",
    name: "Beautiful Moments",
    artist: "Soft Melodies",
    style: "Instrumental Suave",
    duration: "4:10",
    url: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3",
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "sweet-memories",
    name: "Sweet Memories",
    artist: "Lovely Tunes",
    style: "Romántico Moderno",
    duration: "3:33",
    url: "https://cdn.pixabay.com/audio/2022/08/02/audio_884fe92c21.mp3",
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: "wedding-dance",
    name: "Wedding Dance",
    artist: "Celebration Music",
    style: "Vals Moderno",
    duration: "3:15",
    url: "https://cdn.pixabay.com/audio/2022/03/15/audio_c8c8a73467.mp3",
    color: "from-pink-500 to-rose-600",
  },
  {
    id: "first-kiss",
    name: "First Kiss",
    artist: "Tender Hearts",
    style: "Pop Romántico",
    duration: "2:45",
    url: "https://cdn.pixabay.com/audio/2022/01/20/audio_d16737dc28.mp3",
    color: "from-red-500 to-pink-600",
  },
  {
    id: "forever-together",
    name: "Forever Together",
    artist: "Love Orchestra",
    style: "Orquestal Suave",
    duration: "4:02",
    url: "https://cdn.pixabay.com/audio/2022/04/27/audio_67bcb0d0db.mp3",
    color: "from-indigo-500 to-violet-600",
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
        audioRef.current.volume = 0.4;
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
