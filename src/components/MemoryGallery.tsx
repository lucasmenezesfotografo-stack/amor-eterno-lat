import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Sparkles, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Memory {
  imageUrl: string;
  caption: string;
  title?: string;
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
        <p className="text-2xl font-serif text-primary mb-2">Recuerdos</p>
        <div className="w-16 h-px bg-primary/30 mx-auto" />
      </div>
      <div className="grid grid-cols-2 gap-6">
        {memories.map((memory, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15, duration: 0.5 }}
            onClick={() => setSelectedIndex(index)}
            className="cursor-pointer group"
          >
            <div className="aspect-square rounded-lg overflow-hidden bg-muted shadow-sm">
              <img
                src={memory.imageUrl}
                alt={memory.title || `Recuerdo ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            {memory.title && (
              <p className="mt-3 text-sm font-medium text-foreground text-center">
                {memory.title}
              </p>
            )}
            {memory.caption && (
              <p className="mt-1 text-xs text-muted-foreground text-center leading-relaxed">
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
    <div className="space-y-8">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <Heart className="w-5 h-5 text-primary fill-primary" />
          </div>
          <h3 className="text-2xl md:text-3xl font-serif text-foreground mb-2">
            Nuestros Recuerdos
          </h3>
          <p className="text-sm text-muted-foreground">
            Momentos que guardamos en el corazón
          </p>
        </motion.div>
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
            transition={{ delay: index * 0.15, duration: 0.5 }}
            onClick={() => setSelectedIndex(index)}
            className={cn(
              "cursor-pointer group relative",
              memories.length === 3 && index === 2 ? "col-span-2" : ""
            )}
          >
            <div className={cn(
              "overflow-hidden rounded-xl border border-border bg-card shadow-md transition-all duration-300 group-hover:shadow-lg",
              memories.length === 3 && index === 2 ? "aspect-video" : "aspect-square"
            )}>
              <img
                src={memory.imageUrl}
                alt={memory.title || `Recuerdo ${index + 1}`}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
              />
              {/* Elegant overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                {memory.title && (
                  <p className="text-white text-base font-medium mb-1">
                    {memory.title}
                  </p>
                )}
                {memory.caption && (
                  <p className="text-white/80 text-sm italic">
                    "{memory.caption}"
                  </p>
                )}
              </div>
            </div>
            {/* Title below image - always visible */}
            {memory.title && (
              <p className="mt-3 text-sm font-medium text-foreground text-center">
                {memory.title}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Horizontal style - placed below main content
  const renderHorizontalGallery = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xl font-serif text-foreground flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Recuerdos
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
        {memories.map((memory, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedIndex(index)}
            className="flex-shrink-0 w-40 snap-center cursor-pointer group"
          >
            <div className="aspect-square rounded-xl overflow-hidden border border-border bg-card shadow-sm">
              <img
                src={memory.imageUrl}
                alt={memory.title || `Recuerdo ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            {memory.title && (
              <p className="mt-2 text-sm font-medium text-foreground text-center line-clamp-1">
                {memory.title}
              </p>
            )}
            {memory.caption && (
              <p className="mt-1 text-xs text-muted-foreground text-center line-clamp-2">
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Recuerdos especiales
        </h3>
        <span className="text-sm text-muted-foreground">{memories.length} fotos</span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
        {memories.map((memory, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedIndex(index)}
            className="flex-shrink-0 w-44 snap-center cursor-pointer group"
          >
            <div className="aspect-[4/5] rounded-xl overflow-hidden bg-secondary border border-border shadow-md">
              <img
                src={memory.imageUrl}
                alt={memory.title || `Recuerdo ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            {memory.title && (
              <p className="mt-2 text-sm font-medium text-foreground text-center line-clamp-1">
                {memory.title}
              </p>
            )}
            {memory.caption && (
              <p className="mt-1 text-xs text-muted-foreground text-center line-clamp-2">
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
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
              aria-label="Cerrar"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation arrows */}
            {memories.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                  aria-label="Siguiente"
                >
                  <ChevronRight className="w-6 h-6" />
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
              className="max-w-4xl max-h-[85vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={memories[selectedIndex].imageUrl}
                alt={memories[selectedIndex].title || `Recuerdo ${selectedIndex + 1}`}
                className="max-h-[70vh] w-auto object-contain rounded-lg shadow-2xl"
              />
              
              {/* Title and caption */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-center max-w-md"
              >
                {memories[selectedIndex].title && (
                  <p className="text-white text-xl font-medium mb-2">
                    {memories[selectedIndex].title}
                  </p>
                )}
                {memories[selectedIndex].caption && (
                  <p className="text-white/80 text-base italic px-4">
                    "{memories[selectedIndex].caption}"
                  </p>
                )}
              </motion.div>
              
              {/* Dots indicator */}
              {memories.length > 1 && (
                <div className="flex gap-2 mt-6">
                  {memories.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setSelectedIndex(i); }}
                      className={cn(
                        "h-2 rounded-full transition-all",
                        i === selectedIndex ? "bg-white w-8" : "bg-white/40 w-2 hover:bg-white/60"
                      )}
                      aria-label={`Ver recuerdo ${i + 1}`}
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
