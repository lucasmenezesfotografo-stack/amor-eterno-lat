import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Volume2, VolumeX, Pause, Play, X, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingMusicPlayerProps {
  audioUrl: string;
  trackName?: string;
  artistName?: string;
  albumCover?: string;
  autoPlay?: boolean;
}

const FloatingMusicPlayer = ({ 
  audioUrl, 
  trackName = "Trilha Sonora", 
  artistName,
  albumCover,
  autoPlay = true 
}: FloatingMusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30); // Deezer preview is 30s
  const audioRef = useRef<HTMLAudioElement>(null);

  // Auto-play on first user interaction
  useEffect(() => {
    if (!autoPlay || hasAutoPlayed || !audioUrl) return;

    const attemptPlay = () => {
      if (audioRef.current && !hasAutoPlayed) {
        audioRef.current.volume = volume;
        audioRef.current.loop = true; // Enable looping
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setHasAutoPlayed(true);
          })
          .catch(() => {
            // Autoplay blocked
          });
      }
    };

    const handleFirstInteraction = () => {
      attemptPlay();
      // Remove listeners after first interaction
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('scroll', handleFirstInteraction);
    };

    // Try immediate autoplay
    attemptPlay();

    // If blocked, wait for user interaction
    if (!hasAutoPlayed) {
      document.addEventListener('click', handleFirstInteraction, { once: true });
      document.addEventListener('touchstart', handleFirstInteraction, { once: true });
      document.addEventListener('scroll', handleFirstInteraction, { once: true });
    }

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('scroll', handleFirstInteraction);
    };
  }, [autoPlay, hasAutoPlayed, volume, audioUrl]);

  // Update current time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 30);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.loop = true;
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
    setIsMuted(newVolume === 0);
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!audioUrl) return null;

  return (
    <>
      {/* Hidden Audio Element with Loop */}
      <audio
        ref={audioRef}
        src={audioUrl}
        loop
        preload="auto"
      />

      {/* Floating Player */}
      <motion.div
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4, type: "spring" }}
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
              <div className="flex items-center gap-3 sm:gap-4 min-w-[200px] sm:min-w-[280px]">
                {/* Album Cover or Visualizer */}
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden flex-shrink-0">
                  {albumCover ? (
                    <>
                      <img 
                        src={albumCover} 
                        alt={trackName}
                        className="w-full h-full object-cover"
                      />
                      {isPlaying && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="flex items-end justify-center gap-0.5 h-5">
                            {[...Array(4)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="w-1 bg-white rounded-full"
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
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                      {isPlaying ? (
                        <div className="flex items-end justify-center gap-0.5 h-5">
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
                      ) : (
                        <Music className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  )}
                </div>

                {/* Track Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-foreground truncate">{trackName}</p>
                  {artistName && (
                    <p className="text-xs text-muted-foreground truncate">{artistName}</p>
                  )}
                  <div className="flex items-center gap-1 mt-1">
                    <RotateCcw className="w-3 h-3 text-primary" />
                    <span className="text-[10px] text-primary">Loop</span>
                    <span className="text-[10px] text-muted-foreground ml-1">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={handlePlayPause}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 text-primary-foreground" />
                    ) : (
                      <Play className="w-4 h-4 text-primary-foreground ml-0.5" />
                    )}
                  </button>
                  <button
                    onClick={handleMuteToggle}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
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

              {/* Progress Bar */}
              <div className="mt-2 sm:mt-3 h-1 bg-secondary rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>

              {/* Volume Slider */}
              <div className="mt-2 flex items-center gap-2">
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
                "w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-2xl transition-all relative overflow-hidden",
                isPlaying 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-card border border-border text-foreground hover:bg-card/80"
              )}
            >
              {/* Album cover in collapsed state */}
              {albumCover && (
                <img 
                  src={albumCover} 
                  alt={trackName}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              
              {/* Overlay for playing state */}
              {albumCover && isPlaying && (
                <div className="absolute inset-0 bg-black/50" />
              )}
              
              {/* Music Visualizer or Icon */}
              <div className="relative z-10">
                {isPlaying ? (
                  <div className="flex items-end justify-center gap-0.5 h-5 sm:h-6">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={cn(
                          "w-1 rounded-full",
                          albumCover ? "bg-white" : "bg-primary-foreground"
                        )}
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
                  <Music className={cn(
                    "w-4 h-4 sm:w-5 sm:h-5",
                    albumCover ? "text-white" : ""
                  )} />
                )}
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default FloatingMusicPlayer;
