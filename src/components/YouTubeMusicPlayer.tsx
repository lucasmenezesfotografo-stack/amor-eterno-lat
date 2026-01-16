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
      {/* Main Floating Player Button */}
      <motion.div
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4, type: "spring" }}
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, width: 56, height: 56 }}
              animate={{ opacity: 1, width: "auto", height: "auto" }}
              exit={{ opacity: 0, width: 56, height: 56 }}
              className="bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-4 shadow-2xl max-w-[calc(100vw-2rem)]"
            >
              <div className="flex flex-col gap-4 min-w-[300px] sm:min-w-[340px]">
                {/* Header with track info */}
                <div className="flex items-center gap-3">
                  {/* Thumbnail */}
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                    <img 
                      src={thumbnailUrl} 
                      alt={trackName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Youtube className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Track Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{trackName}</p>
                    {artistName && (
                      <p className="text-xs text-muted-foreground truncate">{artistName}</p>
                    )}
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-[10px] text-primary font-medium">
                        {isPlaying ? "♪ Reproduciendo" : "♪ Pausado"}
                      </span>
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center gap-2">
                    {/* Play/Pause */}
                    <button
                      onClick={handleTogglePlay}
                      className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                      aria-label={isPlaying ? "Pausar" : "Reproducir"}
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 ml-0.5" />
                      )}
                    </button>

                    {/* Mute */}
                    <button
                      onClick={handleToggleMute}
                      className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                      aria-label={isMuted ? "Activar sonido" : "Silenciar"}
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-foreground" />
                      )}
                    </button>

                    {/* Close */}
                    <button
                      onClick={handleToggleExpand}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Cerrar"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* YouTube Embed Player - Only render when playing */}
                {isPlaying && playerReady && (
                  <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
                    <iframe
                      ref={iframeRef}
                      className="absolute inset-0 w-full h-full"
                      src={getPlayerUrl(true, isMuted)}
                      title="Reproductor de música"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}

                <p className="text-[10px] text-center text-muted-foreground">
                  La música se reproduce mediante YouTube
                </p>
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
                "w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all relative overflow-hidden",
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
              <div className="relative z-10 flex items-end justify-center gap-0.5 h-6">
                {isPlaying ? (
                  [...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-white rounded-full"
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
                  <Music className="w-6 h-6 text-white" />
                )}
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Hidden player for background playback - CRITICAL for iOS */}
      {isPlaying && playerReady && !isExpanded && (
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
