import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

interface Photo {
  id: string;
  url: string;
  caption?: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
  className?: string;
}

const PhotoGallery = ({ photos, className = "" }: PhotoGalleryProps) => {
  const [ghibliMode, setGhibliMode] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  const nextPhoto = () => {
    if (selectedPhoto !== null) {
      setSelectedPhoto((selectedPhoto + 1) % photos.length);
    }
  };

  const prevPhoto = () => {
    if (selectedPhoto !== null) {
      setSelectedPhoto((selectedPhoto - 1 + photos.length) % photos.length);
    }
  };

  return (
    <div className={className}>
      {/* Ghibli Toggle Button */}
      <motion.div
        className="flex justify-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Button
          variant={ghibliMode ? "romantic" : "glass"}
          size="lg"
          onClick={() => setGhibliMode(!ghibliMode)}
          className="gap-3"
        >
          <Sparkles className="w-5 h-5" />
          {ghibliMode ? "Efecto Mágico Activado" : "Activar Efecto Mágico"}
        </Button>
      </motion.div>

      {/* Photo Grid */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            variants={itemVariants}
            className={`relative overflow-hidden rounded-2xl cursor-pointer group ${
              index === 0 ? "col-span-2 row-span-2" : ""
            }`}
            onClick={() => setSelectedPhoto(index)}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className={`aspect-square w-full h-full transition-all duration-500 ${
                ghibliMode ? "ghibli-filter" : ""
              }`}
            >
              <img
                src={photo.url}
                alt={photo.caption || `Foto ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Ghibli Overlay Effect */}
              {ghibliMode && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    background: `linear-gradient(
                      135deg,
                      hsla(350, 50%, 58%, 0.1) 0%,
                      hsla(38, 70%, 50%, 0.08) 50%,
                      hsla(180, 40%, 60%, 0.1) 100%
                    )`,
                  }}
                />
              )}
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              {photo.caption && (
                <p className="text-primary-foreground text-sm font-medium">
                  {photo.caption}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/90 backdrop-blur-md p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              className="relative max-w-4xl max-h-[90vh] w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={photos[selectedPhoto].url}
                alt={photos[selectedPhoto].caption || `Foto ${selectedPhoto + 1}`}
                className={`w-full h-full object-contain rounded-2xl ${
                  ghibliMode ? "ghibli-filter" : ""
                }`}
              />

              {/* Navigation */}
              <button
                onClick={prevPhoto}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-foreground" />
              </button>

              <button
                onClick={nextPhoto}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-foreground" />
              </button>

              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
              >
                <X className="w-6 h-6 text-foreground" />
              </button>

              {photos[selectedPhoto].caption && (
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <p className="text-primary-foreground text-lg font-serif italic bg-foreground/50 backdrop-blur-sm rounded-full px-6 py-2 inline-block">
                    {photos[selectedPhoto].caption}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhotoGallery;
