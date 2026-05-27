import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, X, Youtube, Volume2, VolumeX, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

interface YouTubeMusicPlayerProps {
  videoId: string;
  trackName?: string;
  artistName?: string;
  albumCover?: string;
  autoPlay?: boolean;
}

const YouTubeMusicPlayer = ({ 
  videoId, 
  trackName = "Nuestra Canción", 
  artistName,
  albumCover,
  autoPlay = false
}: YouTubeMusicPlayerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
    // 🔒 PROTEÇÃO CONTRA videoId INVÁLIDO (evita tela preta)
  if (typeof videoId !== "string" || videoId.trim() === "") {
    console.error("YouTubeMusicPlayer: videoId inválido", videoId);
    return null;
  }

  // Build YouTube embed URL with mobile-optimized parameters
  const getPlayerUrl = useCallback((autoplay: boolean, muted: boolean) => {
    const params = new URLSearchParams({
      autoplay: autoplay ? "1" : "0",
      mute: muted ? "1" : "0",
      loop: "1",
      playlist: videoId, // Required for loop to work
      enablejsapi: "1",
      playsinline: "1", // CRITICAL for iOS Safari
      controls: "0",
      modestbranding: "1",
      rel: "0",
      fs: "0",
      iv_load_policy: "3",
      disablekb: "1",
      origin: window.location.origin,
    });
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  }, [videoId]);

  // Start playing when autoPlay is triggered (after user interaction)
  useEffect(() => {
    if (autoPlay && !isPlaying) {
      setIsPlaying(true);
      setPlayerReady(true);
    }
  }, [autoPlay]);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  if (!videoId) return null;

  // Use YouTube thumbnail if no album cover provided
  const thumbnailUrl = albumCover || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <>
      {/* Main Floating Player */}
      <motion.div
        className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4, type: "spring" }}
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="bg-card/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl"
            >
              {/* Compact expanded panel - no video iframe, just mini controls */}
              <div className="flex items-center gap-2 sm:gap-2.5 p-2 sm:p-2.5 pr-3">
                {/* Tiny thumbnail */}
                <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={thumbnailUrl} 
                    alt={trackName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Youtube className="w-3 h-3 text-white" />
                  </div>
                </div>

                {/* Track Info - minimal */}
                <div className="flex-1 min-w-0 max-w-[120px] sm:max-w-[140px]">
                  <p className="text-[11px] font-medium text-foreground truncate leading-tight">{trackName}</p>
                  {artistName && (
                    <p className="text-[10px] text-muted-foreground truncate leading-tight">{artistName}</p>
                  )}
                </div>

                {/* Control Buttons - compact */}
                <div className="flex items-center gap-1">
                  {/* Play/Pause */}
                  <button
                    onClick={handleTogglePlay}
                    className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                    aria-label={isPlaying ? "Pausar" : "Reproducir"}
                  >
                    {isPlaying ? (
                      <Pause className="w-3 h-3" />
                    ) : (
                      <Play className="w-3 h-3 ml-0.5" />
                    )}
                  </button>

                  {/* Mute */}
                  <button
                    onClick={handleToggleMute}
                    className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                    aria-label={isMuted ? "Activar sonido" : "Silenciar"}
                  >
                    {isMuted ? (
                      <VolumeX className="w-3 h-3 text-muted-foreground" />
                    ) : (
                      <Volume2 className="w-3 h-3 text-foreground" />
                    )}
                  </button>

                  {/* Close */}
                  <button
                    onClick={handleToggleExpand}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Cerrar"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.button
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleToggleExpand}
              className={cn(
                "w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-2xl transition-all relative overflow-hidden",
                "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
              aria-label="Abrir reproductor de música"
            >
              {/* Thumbnail in collapsed state */}
              <img 
                src={thumbnailUrl} 
                alt={trackName}
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50" />
              
              {/* Music Visualizer - only when playing */}
              <div className="relative z-10 flex items-end justify-center gap-0.5 h-5">
                {isPlaying ? (
                  [...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-[3px] bg-white rounded-full"
                      animate={{
                        height: ["30%", "100%", "50%", "80%", "30%"],
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.15,
                      }}
                    />
                  ))
                ) : (
                  <Music className="w-5 h-5 text-white" />
                )}
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Hidden player for background playback - CRITICAL for iOS */}
      {isPlaying && playerReady && (
        <div className="fixed -left-[9999px] -top-[9999px] w-[1px] h-[1px] overflow-hidden pointer-events-none">
          <iframe
            src={getPlayerUrl(true, isMuted)}
            title="Música de fondo"
            allow="autoplay"
            style={{ width: '1px', height: '1px' }}
          />
        </div>
      )}
    </>
  );
};

export default YouTubeMusicPlayer;
