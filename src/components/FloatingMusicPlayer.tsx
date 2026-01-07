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
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Try to autoplay when component mounts
  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.volume = volume;
      
      // Try to play automatically
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setShowPrompt(false);
            setHasInteracted(true);
          })
          .catch(() => {
            // Autoplay was prevented, show prompt
            setShowPrompt(true);
          });
      }
    }
  }, [autoPlay, volume]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      setShowPrompt(false);
      setHasInteracted(true);
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

  const handleStartMusic = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      setShowPrompt(false);
      setHasInteracted(true);
    }
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
    setHasInteracted(true);
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

      {/* Initial Prompt to Start Music */}
      <AnimatePresence>
        {showPrompt && !hasInteracted && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-4 shadow-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Music className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Música de fondo</p>
                <p className="text-xs text-muted-foreground">{trackName}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleStartMusic}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Reproducir
                </button>
                <button
                  onClick={dismissPrompt}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Player */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
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
              className="bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-4 shadow-2xl"
            >
              <div className="flex items-center gap-4 min-w-[200px]">
                {/* Visualizer Animation */}
                <div className="relative w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center overflow-hidden">
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
                    <Music className="w-5 h-5 text-primary" />
                  )}
                </div>

                {/* Track Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{trackName}</p>
                  <p className="text-xs text-muted-foreground">
                    {isPlaying ? "Reproduciendo" : "Pausado"}
                  </p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePlayPause}
                    className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 text-primary" />
                    ) : (
                      <Play className="w-4 h-4 text-primary ml-0.5" />
                    )}
                  </button>
                  <button
                    onClick={handleMuteToggle}
                    className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-foreground" />
                    )}
                  </button>
                </div>

                {/* Collapse Button */}
                <button
                  onClick={() => setIsExpanded(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Volume Slider */}
              <div className="mt-3 flex items-center gap-2">
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
                "w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all",
                isPlaying 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-card border border-border text-foreground hover:bg-card/80"
              )}
            >
              {/* Music Visualizer or Icon */}
              {isPlaying ? (
                <div className="flex items-end justify-center gap-0.5 h-6">
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
                <Music className="w-5 h-5" />
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default FloatingMusicPlayer;
