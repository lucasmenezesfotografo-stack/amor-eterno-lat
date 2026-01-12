import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, X, Youtube, Volume2, VolumeX } from "lucide-react";
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
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const playerRef = useRef<HTMLIFrameElement>(null);

  // YouTube Player URL with loop
  // Using playlist parameter with same video ID enables looping
  const getPlayerUrl = (autoplay: boolean, muted: boolean) => {
    const params = new URLSearchParams({
      autoplay: autoplay ? "1" : "0",
      mute: muted ? "1" : "0",
      loop: "1",
      playlist: videoId, // Required for loop to work
      enablejsapi: "1",
      playsinline: "1",
      controls: "0",
      modestbranding: "1",
      rel: "0",
    });
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
    // Update iframe src to reflect mute state
    if (playerRef.current) {
      playerRef.current.src = getPlayerUrl(isPlaying, !isMuted);
    }
  };

  if (!videoId) return null;

  // Use YouTube thumbnail if no album cover provided
  const thumbnailUrl = albumCover || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <>
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
              <div className="flex flex-col gap-3 min-w-[280px] sm:min-w-[320px]">
                {/* Header with track info */}
                <div className="flex items-center gap-3">
                  {/* Thumbnail */}
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden flex-shrink-0">
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
                    <p className="text-xs sm:text-sm font-medium text-foreground truncate">{trackName}</p>
                    {artistName && (
                      <p className="text-xs text-muted-foreground truncate">{artistName}</p>
                    )}
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-[10px] text-primary">♪ En loop</span>
                    </div>
                  </div>

                  {/* Mute Button */}
                  <button
                    onClick={handleToggleMute}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                    ) : (
                      <Volume2 className="w-3 h-3 sm:w-4 sm:h-4 text-foreground" />
                    )}
                  </button>

                  {/* Close Button */}
                  <button
                    onClick={handleToggleExpand}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* YouTube Embed Player */}
                <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
                  <iframe
                    ref={playerRef}
                    className="absolute inset-0 w-full h-full"
                    src={getPlayerUrl(true, isMuted)}
                    title="YouTube music player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

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
                "w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-2xl transition-all relative overflow-hidden",
                "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              {/* Thumbnail in collapsed state */}
              <img 
                src={thumbnailUrl} 
                alt={trackName}
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50" />
              
              {/* Music Visualizer */}
              <div className="relative z-10 flex items-end justify-center gap-0.5 h-5 sm:h-6">
                {[...Array(3)].map((_, i) => (
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
                ))}
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Hidden player for autoplay (positioned off-screen) */}
      {autoPlay && !isExpanded && (
        <div className="fixed -left-[9999px] -top-[9999px] w-[1px] h-[1px] overflow-hidden">
          <iframe
            src={getPlayerUrl(true, isMuted)}
            title="Background music"
            allow="autoplay"
          />
        </div>
      )}
    </>
  );
};

export default YouTubeMusicPlayer;
