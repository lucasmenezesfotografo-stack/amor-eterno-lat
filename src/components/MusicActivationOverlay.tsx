import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Heart, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [isVisible, setIsVisible] = useState(true);

  const handleActivate = () => {
    setIsVisible(false);
    onActivate();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="max-w-sm w-full text-center"
          >
            {/* Animated Hearts Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${15 + i * 15}%`,
                    top: `${20 + (i % 3) * 25}%`,
                  }}
                  animate={{
                    y: [-10, 10, -10],
                    opacity: [0.2, 0.5, 0.2],
                    scale: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                >
                  <Heart className="w-4 h-4 sm:w-6 sm:h-6 text-primary/30 fill-primary/20" />
                </motion.div>
              ))}
            </div>

            {/* Album Cover or Music Icon */}
            <motion.div
              className="relative mx-auto mb-6 sm:mb-8"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {albumCover ? (
                <div className="w-28 h-28 sm:w-36 sm:h-36 mx-auto rounded-2xl overflow-hidden shadow-2xl ring-4 ring-primary/30">
                  <img 
                    src={albumCover} 
                    alt={trackName || "Album cover"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-2 right-2">
                    <Youtube className="w-6 h-6 text-white drop-shadow-lg" />
                  </div>
                </div>
              ) : (
                <div className="w-28 h-28 sm:w-36 sm:h-36 mx-auto rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-2xl shadow-primary/30">
                  <Music className="w-12 h-12 sm:w-16 sm:h-16 text-primary-foreground" />
                </div>
              )}
              
              {/* Pulsing ring */}
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-primary"
                animate={{ 
                  scale: [1, 1.15, 1],
                  opacity: [0.5, 0, 0.5],
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
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-primary fill-primary" />
                Este regalo tiene música
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Activa la música para escuchar la canción elegida
              </p>
            </motion.div>

            {/* Activation Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                size="lg"
                onClick={handleActivate}
                className="w-full sm:w-auto px-8 py-6 text-base sm:text-lg gap-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl shadow-primary/30"
              >
                <Music className="w-5 h-5 sm:w-6 sm:h-6" />
                🎵 Activar Música
              </Button>
            </motion.div>

            {/* YouTube attribution */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-xs text-muted-foreground flex items-center justify-center gap-1"
            >
              <Youtube className="w-3 h-3" />
              La música se reproduce mediante YouTube
            </motion.p>

            {/* Skip Option */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={() => setIsVisible(false)}
              className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Continuar sin música
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MusicActivationOverlay;
