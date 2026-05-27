import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, X, Youtube, Volume2, VolumeX, Play, Pause, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";

interface YouTubeMusicPlayerProps {
  videoId: string;
  trackName?: string;
  artistName?: string;
  albumCover?: string;
  /** @deprecated kept for backwards compat — activation is handled internally */
  autoPlay?: boolean;
}

const YouTubeMusicPlayer = ({
  videoId,
  trackName = "Nuestra Canción",
  artistName,
  albumCover,
}: YouTubeMusicPlayerProps) => {
  const { t } = useLanguage();
  const [activated, setActivated] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const pendingPlayRef = useRef(false);

  if (typeof videoId !== "string" || videoId.trim() === "") {
    console.error("YouTubeMusicPlayer: videoId inválido", videoId);
    return null;
  }

  // Build YT embed URL - autoplay=0; we trigger play via postMessage from gesture
  const playerUrl = (() => {
    const params = new URLSearchParams({
      autoplay: "0",
      mute: "0",
      loop: "1",
      playlist: videoId,
      enablejsapi: "1",
      playsinline: "1",
      controls: "0",
      modestbranding: "1",
      rel: "0",
      fs: "0",
      iv_load_policy: "3",
      disablekb: "1",
      origin: window.location.origin,
    });
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  })();

  const sendCommand = useCallback((func: string, args: unknown[] = []) => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    try {
      win.postMessage(
        JSON.stringify({ event: "command", func, args }),
        "*"
      );
    } catch (e) {
      console.error("YT postMessage failed", e);
    }
  }, []);

  // If user clicked play before iframe loaded, fire as soon as it loads.
  useEffect(() => {
    if (iframeLoaded && pendingPlayRef.current) {
      pendingPlayRef.current = false;
      // Small delay so YT API initializes inside the iframe
      setTimeout(() => sendCommand("playVideo"), 150);
    }
  }, [iframeLoaded, sendCommand]);

  // Activation handler — MUST be called synchronously from a user gesture (iOS)
  const handleActivate = () => {
    setActivated(true);
    setShowOverlay(false);
    setIsPlaying(true);
    // Fire play immediately within the gesture for iOS Safari
    if (iframeLoaded) {
      sendCommand("playVideo");
    } else {
      pendingPlayRef.current = true;
    }
  };

  const handleSkipOverlay = () => {
    setShowOverlay(false);
  };

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      sendCommand("pauseVideo");
      setIsPlaying(false);
    } else {
      sendCommand("playVideo");
      setIsPlaying(true);
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMuted) {
      sendCommand("unMute");
      setIsMuted(false);
    } else {
      sendCommand("mute");
      setIsMuted(true);
    }
  };

  const handleToggleExpand = () => setIsExpanded((v) => !v);

  const thumbnailUrl = albumCover || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <>
      {/* Hidden iframe — mounted immediately so it's ready when user taps Play (critical for iOS) */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          left: "-9999px",
          top: "-9999px",
          width: 1,
          height: 1,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <iframe
          ref={iframeRef}
          src={playerUrl}
          title="Música de fondo"
          allow="autoplay; encrypted-media"
          onLoad={() => setIframeLoaded(true)}
          style={{ width: 1, height: 1, border: 0 }}
        />
      </div>

      {/* Activation overlay — synchronous tap → play (iOS compatible) */}
      <AnimatePresence>
        {showOverlay && !activated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-x-0 bottom-0 z-[100] p-3 sm:p-4 pointer-events-none flex justify-center"
          >
            <motion.div
              initial={{ y: 100, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 100, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-card/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl pointer-events-auto max-w-[420px] w-full overflow-hidden"
            >
              <div className="flex items-center gap-3 p-3 sm:p-3.5">
                <motion.div
                  className="relative flex-shrink-0"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  {albumCover ? (
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shadow-md ring-2 ring-primary/20 relative">
                      <img src={albumCover} alt={trackName} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <div className="absolute bottom-1 right-1">
                        <Youtube className="w-3.5 h-3.5 text-white drop-shadow" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-md">
                      <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground" />
                    </div>
                  )}
                </motion.div>

                <div className="flex-1 min-w-0">
                  {trackName && (
                    <p className="text-sm font-semibold text-foreground truncate">{trackName}</p>
                  )}
                  {artistName && (
                    <p className="text-xs text-muted-foreground truncate">{artistName}</p>
                  )}
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 leading-snug">
                    {t("music.subtitle")}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    onClick={handleActivate}
                    onTouchEnd={(e) => {
                      // Ensure iOS fires within gesture even if click is delayed
                      e.preventDefault();
                      handleActivate();
                    }}
                    className="h-8 px-3 text-xs gap-1.5 bg-primary hover:bg-primary/90 shadow-md"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    {t("music.play")}
                  </Button>
                  <button
                    onClick={handleSkipOverlay}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={t("music.skip")}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating mini player — appears after activation */}
      {activated && (
        <motion.div
          className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-card/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl"
              >
                <div className="flex items-center gap-2 sm:gap-2.5 p-2 sm:p-2.5 pr-3">
                  <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={thumbnailUrl} alt={trackName} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Youtube className="w-3 h-3 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 max-w-[120px] sm:max-w-[140px]">
                    <p className="text-[11px] font-medium text-foreground truncate leading-tight">{trackName}</p>
                    {artistName && (
                      <p className="text-[10px] text-muted-foreground truncate leading-tight">{artistName}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleTogglePlay}
                      className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                      aria-label={isPlaying ? "Pausar" : "Reproducir"}
                    >
                      {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
                    </button>
                    <button
                      onClick={handleToggleMute}
                      className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                      aria-label={isMuted ? "Activar sonido" : "Silenciar"}
                    >
                      {isMuted ? <VolumeX className="w-3 h-3 text-muted-foreground" /> : <Volume2 className="w-3 h-3 text-foreground" />}
                    </button>
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
                <img src={thumbnailUrl} alt={trackName} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 flex items-end justify-center gap-0.5 h-5">
                  {isPlaying ? (
                    [...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-[3px] bg-white rounded-full"
                        animate={{ height: ["30%", "100%", "50%", "80%", "30%"] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
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
      )}
    </>
  );
};

export default YouTubeMusicPlayer;
