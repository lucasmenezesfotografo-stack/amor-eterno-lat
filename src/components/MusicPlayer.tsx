import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Music } from "lucide-react";

interface MusicPlayerProps {
  audioUrl?: string;
  songTitle?: string;
  artist?: string;
}

const MusicPlayer = ({ 
  audioUrl = "", 
  songTitle = "Nuestra Canción", 
  artist = "Amor Eterno" 
}: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      <audio ref={audioRef} src={audioUrl} loop />
      
      <motion.div
        className="glass-card overflow-hidden"
        layout
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="flex items-center gap-4 p-4 pr-6"
            >
              <button
                onClick={() => setIsExpanded(false)}
                className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center shadow-romantic"
              >
                <Music className="w-5 h-5 text-primary-foreground" />
              </button>
              
              <div className="flex flex-col min-w-[120px]">
                <span className="text-sm font-medium text-foreground truncate">
                  {songTitle}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {artist}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 text-foreground" />
                  ) : (
                    <Play className="w-4 h-4 text-foreground ml-0.5" />
                  )}
                </button>
                
                <button
                  onClick={toggleMute}
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-foreground" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-foreground" />
                  )}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.button
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(true)}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center shadow-romantic hover:scale-110 transition-transform"
            >
              <Music className="w-6 h-6 text-primary-foreground" />
              {isPlaying && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary-foreground/30"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default MusicPlayer;
