import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Volume2, VolumeX, Pause, Play, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingMusicPlayerProps {
  audioUrl: string;
  trackName?: string;
  autoPlay?: boolean;
}

const FloatingMusicPlayer = ({ audioUrl, trackName = "Trilha Sonora", autoPlay = true }: FloatingMusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Auto-play on first user interaction (click anywhere on page)
  useEffect(() => {
    if (!autoPlay || hasAutoPlayed) return;

    const handleFirstInteraction = () => {
      if (audioRef.current && !hasAutoPlayed) {
        audioRef.current.volume = volume;
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setHasAutoPlayed(true);
          })
          .catch(() => {
            // Still blocked, keep listening
          });
      }
    };

    // Try to autoplay immediately
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setHasAutoPlayed(true);
        })
        .catch(() => {
          // Autoplay blocked, wait for user interaction
          document.addEventListener('click', handleFirstInteraction, { once: true });
          document.addEventListener('touchstart', handleFirstInteraction, { once: true });
          document.addEventListener('scroll', handleFirstInteraction, { once: true });
        });
    }

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('scroll', handleFirstInteraction);
    };
  }, [autoPlay, hasAutoPlayed, volume]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      setHasAutoPlayed(true);
    }
  };

  const handleMuteToggle = () => {
    if (!audioRef.current) return;
    
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  return (
    <>
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        loop
        preload="auto"
      />

      {/* Floating Player */}
      <motion.div
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, width: 56, height: 56 }}
              animate={{ opacity: 1, width: "auto", height: "auto" }}
              exit={{ opacity: 0, width: 56, height: 56 }}
              className="bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-3 sm:p-4 shadow-2xl max-w-[calc(100vw-2rem)]"
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-[180px] sm:min-w-[200px]">
                {/* Visualizer Animation */}
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {isPlaying && (
                    <div className="absolute inset-0 flex items-end justify-center gap-0.5 p-2">
                      {[...Array(4)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 bg-primary rounded-full"
                          animate={{
                            height: ["40%", "100%", "60%", "80%", "40%"],
                          }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: i * 0.1,
                          }}
                        />
                      ))}
                    </div>
                  )}
                  {!isPlaying && (
                    <Music className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  )}
                </div>

                {/* Track Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-foreground truncate">{trackName}</p>
                  <p className="text-xs text-muted-foreground">
                    {isPlaying ? "♪ Reproduciendo" : "Pausado"}
                  </p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={handlePlayPause}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                    ) : (
                      <Play className="w-3 h-3 sm:w-4 sm:h-4 text-primary ml-0.5" />
                    )}
                  </button>
                  <button
                    onClick={handleMuteToggle}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                    ) : (
                      <Volume2 className="w-3 h-3 sm:w-4 sm:h-4 text-foreground" />
                    )}
                  </button>
                </div>

                {/* Collapse Button */}
                <button
                  onClick={() => setIsExpanded(false)}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Volume Slider */}
              <div className="mt-2 sm:mt-3 flex items-center gap-2">
                <VolumeX className="w-3 h-3 text-muted-foreground" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="flex-1 h-1 bg-secondary rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                />
                <Volume2 className="w-3 h-3 text-muted-foreground" />
              </div>
            </motion.div>
          ) : (
            <motion.button
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(true)}
              className={cn(
                "w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-2xl transition-all",
                isPlaying 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-card border border-border text-foreground hover:bg-card/80"
              )}
            >
              {/* Music Visualizer or Icon */}
              {isPlaying ? (
                <div className="flex items-end justify-center gap-0.5 h-5 sm:h-6">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-primary-foreground rounded-full"
                      animate={{
                        height: ["30%", "100%", "50%", "80%", "30%"],
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.15,
                      }}
                    />
                  ))}
                </div>
              ) : (
                <Music className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default FloatingMusicPlayer;
