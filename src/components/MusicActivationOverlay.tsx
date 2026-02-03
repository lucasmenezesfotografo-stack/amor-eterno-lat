import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Youtube, Play } from "lucide-react";
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
          className="fixed inset-0 z-[100] bg-background/98 backdrop-blur-xl flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="max-w-sm w-full text-center relative"
          >
            {/* Animated Hearts Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${10 + i * 12}%`,
                    top: `${15 + (i % 4) * 20}%`,
                  }}
                  animate={{
                    y: [-15, 15, -15],
                    opacity: [0.15, 0.4, 0.15],
                    scale: [0.8, 1.1, 0.8],
                  }}
                  transition={{
                    duration: 3 + i * 0.4,
                    repeat: Infinity,
                    delay: i * 0.25,
                  }}
                >
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-primary/40 fill-primary/30" />
                </motion.div>
              ))}
            </div>

            {/* Album Cover or Music Icon */}
            <motion.div
              className="relative mx-auto mb-8"
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              {albumCover ? (
                <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-2xl overflow-hidden shadow-2xl ring-4 ring-primary/20">
                  <img 
                    src={albumCover} 
                    alt={trackName || "Album cover"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-3 right-3">
                    <Youtube className="w-6 h-6 text-white drop-shadow-lg" />
                  </div>
                </div>
              ) : (
                <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-2xl shadow-primary/30">
                  <Heart className="w-14 h-14 sm:w-16 sm:h-16 text-primary-foreground" />
                </div>
              )}
              
              {/* Pulsing ring */}
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-primary"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 0, 0.4],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>

            {/* Track Info */}
            {trackName && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <p className="text-lg sm:text-xl font-semibold text-foreground mb-1">
                  {trackName}
                </p>
                {artistName && (
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {artistName}
                  </p>
                )}
              </motion.div>
            )}

            {/* Main Message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 flex items-center justify-center gap-2">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-primary fill-primary" />
                {t('music.title')}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {t('music.subtitle')}
              </p>
            </motion.div>

            {/* Activation Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <Button
                size="lg"
                onClick={handleActivate}
                className="w-full min-h-[60px] px-8 py-5 text-lg gap-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl shadow-primary/30 active:scale-95 transition-transform touch-manipulation"
              >
                <Play className="w-6 h-6 fill-current" />
                {t('music.play')}
              </Button>
              
              {/* Skip Option */}
              <button
                onClick={handleSkip}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2 px-4"
              >
                {t('music.skip')}
              </button>
            </motion.div>

            {/* YouTube attribution */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-xs text-muted-foreground flex items-center justify-center gap-1"
            >
              <Youtube className="w-3 h-3" />
              {t('music.youtube')}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MusicActivationOverlay;
