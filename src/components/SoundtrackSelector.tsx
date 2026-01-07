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

// Royalty-free music tracks from public sources
export const soundtracks: Soundtrack[] = [
  {
    id: "romantic-piano",
    name: "Romantic Piano",
    artist: "Ambient Music",
    style: "Piano Romántico",
    duration: "3:20",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "lofi-love",
    name: "Lofi Love",
    artist: "Chill Beats",
    style: "Lofi Love",
    duration: "2:45",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "from-purple-500 to-indigo-500",
  },
  {
    id: "acoustic-soft",
    name: "Soft Acoustic",
    artist: "Guitar Melodies",
    style: "Acústico Suave",
    duration: "4:10",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "dreamy-ambient",
    name: "Dreamy Ambient",
    artist: "Ethereal Sounds",
    style: "Ambiental Soñador",
    duration: "3:55",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    color: "from-cyan-500 to-blue-500",
  },
  {
    id: "classic-romance",
    name: "Classic Romance",
    artist: "Orchestra",
    style: "Romance Clásico",
    duration: "5:00",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    color: "from-red-500 to-pink-500",
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
      // Stop current preview
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
      setPreviewingTrack(null);
    } else {
      // Start new preview
      if (audioRef.current) {
        audioRef.current.src = track.url;
        audioRef.current.volume = 0.3;
        audioRef.current.play();
      }
      setPreviewingTrack(track.id);
      setIsPlaying(true);
    }
  };

  const handleSelect = (trackId: string) => {
    onSelect(trackId);
    // Stop preview when selecting
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setPreviewingTrack(null);
  };

  return (
    <div className="space-y-4">
      {/* Hidden audio element for previews */}
      <audio 
        ref={audioRef} 
        onEnded={() => {
          setIsPlaying(false);
          setPreviewingTrack(null);
        }}
      />

      <div className="flex items-center gap-2 mb-4">
        <Music className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-medium text-foreground">Elige tu Trilha Sonora</h3>
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
                <p className="text-sm text-muted-foreground truncate">{track.style}</p>
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
          La música se reproducirá automáticamente cuando abran tu página
        </motion.p>
      )}
    </div>
  );
};

export default SoundtrackSelector;
