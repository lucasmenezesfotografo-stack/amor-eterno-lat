import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Memory {
  imageUrl: string;
  caption: string;
}

type DesignStyle = "minimal" | "classic" | "horizontal" | "photo-focus";

interface MemoryGalleryProps {
  memories: Memory[];
  designStyle?: DesignStyle;
}

const MemoryGallery = ({ memories, designStyle = "classic" }: MemoryGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!memories || memories.length === 0) return null;

  const handlePrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? memories.length - 1 : selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === memories.length - 1 ? 0 : selectedIndex + 1);
    }
  };

  // Minimal style - clean gallery with lots of whitespace
  const renderMinimalGallery = () => (
    <div className="space-y-8">
      <div className="text-center">
        <p className="font-romantic text-2xl text-romantic-accent mb-2">Recuerdos</p>
        <div className="w-16 h-px bg-romantic-accent/30 mx-auto" />
      </div>
      <div className="grid grid-cols-2 gap-6">
        {memories.map((memory, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedIndex(index)}
            className="cursor-pointer group"
          >
            <div className="aspect-square rounded-sm overflow-hidden bg-paper-cream">
              <img
                src={memory.imageUrl}
                alt={memory.caption || `Recuerdo ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            {memory.caption && (
              <p className="mt-3 text-xs text-romantic-secondary text-center font-sans-light leading-relaxed">
                {memory.caption}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Classic style - elegant album feel
  const renderClassicGallery = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Sparkles className="w-5 h-5 text-romantic-accent mx-auto mb-3" />
        <h3 className="font-romantic text-3xl text-romantic-accent">Nuestros Recuerdos</h3>
        <p className="text-sm text-romantic-secondary mt-2 font-sans-light">
          Momentos que guardamos en el corazón
        </p>
      </div>
      <div className={cn(
        "grid gap-4",
        memories.length === 1 ? "grid-cols-1 max-w-sm mx-auto" :
        memories.length === 2 ? "grid-cols-2" :
        memories.length === 3 ? "grid-cols-2" :
        "grid-cols-2"
      )}>
        {memories.map((memory, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 }}
            onClick={() => setSelectedIndex(index)}
            className={cn(
              "cursor-pointer group relative",
              memories.length === 3 && index === 2 ? "col-span-2" : ""
            )}
          >
            <div className={cn(
              "overflow-hidden rounded-lg border border-romantic-accent/10 bg-paper shadow-sm",
              memories.length === 3 && index === 2 ? "aspect-video" : "aspect-square"
            )}>
              <img
                src={memory.imageUrl}
                alt={memory.caption || `Recuerdo ${index + 1}`}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-105"
              />
              {/* Elegant overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-romantic-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                {memory.caption && (
                  <p className="text-paper text-sm font-serif-classic leading-relaxed">
                    "{memory.caption}"
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Horizontal style - placed below main content
  const renderHorizontalGallery = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-romantic-accent/20" />
        <span className="font-romantic text-xl text-romantic-accent">Recuerdos</span>
        <div className="flex-1 h-px bg-romantic-accent/20" />
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
        {memories.map((memory, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedIndex(index)}
            className="flex-shrink-0 w-32 snap-center cursor-pointer group"
          >
            <div className="aspect-square rounded-lg overflow-hidden border border-romantic-accent/10 bg-paper">
              <img
                src={memory.imageUrl}
                alt={memory.caption || `Recuerdo ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            {memory.caption && (
              <p className="mt-2 text-[10px] text-romantic-secondary text-center line-clamp-2 font-sans-light">
                {memory.caption}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Photo-focus style - modern carousel
  const renderPhotoFocusGallery = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Recuerdos especiales
        </h3>
        <span className="text-xs text-muted-foreground">{memories.length} fotos</span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
        {memories.map((memory, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedIndex(index)}
            className="flex-shrink-0 w-40 snap-center cursor-pointer group"
          >
            <div className="aspect-[4/5] rounded-xl overflow-hidden bg-secondary border border-border">
              <img
                src={memory.imageUrl}
                alt={memory.caption || `Recuerdo ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            {memory.caption && (
              <p className="mt-2 text-xs text-muted-foreground text-center line-clamp-2">
                {memory.caption}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Render appropriate gallery style
  const renderGallery = () => {
    switch (designStyle) {
      case "minimal":
        return renderMinimalGallery();
      case "horizontal":
        return renderHorizontalGallery();
      case "photo-focus":
        return renderPhotoFocusGallery();
      case "classic":
      default:
        return renderClassicGallery();
    }
  };

  return (
    <>
      {renderGallery()}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedIndex(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Navigation arrows */}
            {memories.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Image and caption */}
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl max-h-[80vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={memories[selectedIndex].imageUrl}
                alt={memories[selectedIndex].caption || `Recuerdo ${selectedIndex + 1}`}
                className="max-h-[70vh] w-auto object-contain rounded-lg"
              />
              {memories[selectedIndex].caption && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6 px-8 py-4 bg-white/10 backdrop-blur-sm rounded-full"
                >
                  <p className="text-white text-center font-serif-classic italic">
                    "{memories[selectedIndex].caption}"
                  </p>
                </motion.div>
              )}
              
              {/* Dots indicator */}
              {memories.length > 1 && (
                <div className="flex gap-2 mt-4">
                  {memories.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setSelectedIndex(i); }}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all",
                        i === selectedIndex ? "bg-white w-6" : "bg-white/40 hover:bg-white/60"
                      )}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MemoryGallery;
