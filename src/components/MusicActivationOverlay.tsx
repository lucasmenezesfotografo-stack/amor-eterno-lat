import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Youtube, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";

interface MusicActivationOverlayProps {
  trackName?: string;
  artistName?: string;
  albumCover?: string;
  onActivate: () => void;
}

const MusicActivationOverlay = ({
  trackName,
  artistName,
  albumCover,
  onActivate,
}: MusicActivationOverlayProps) => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);

  const handleActivate = () => {
    setIsVisible(false);
    setTimeout(() => {
      onActivate();
    }, 100);
  };

  const handleSkip = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
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
              {/* Album Cover */}
              <motion.div 
                className="relative flex-shrink-0"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                {albumCover ? (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shadow-md ring-2 ring-primary/20">
                    <img 
                      src={albumCover} 
                      alt={trackName || "Album cover"}
                      className="w-full h-full object-cover"
                    />
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

              {/* Track Info */}
              <div className="flex-1 min-w-0">
                {trackName && (
                  <p className="text-sm font-semibold text-foreground truncate">
                    {trackName}
                  </p>
                )}
                {artistName && (
                  <p className="text-xs text-muted-foreground truncate">
                    {artistName}
                  </p>
                )}
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 leading-snug">
                  {t('music.subtitle')}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  onClick={handleActivate}
                  className="h-8 px-3 text-xs gap-1.5 bg-primary hover:bg-primary/90 shadow-md"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  {t('music.play')}
                </Button>
                
                <button
                  onClick={handleSkip}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={t('music.skip')}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MusicActivationOverlay;
