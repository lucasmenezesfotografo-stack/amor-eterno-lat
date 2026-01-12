import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImagePlus, X, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Memory {
  imageUrl: string;
  caption: string;
}

interface MemoryUploaderProps {
  memories: Memory[];
  onMemoriesChange: (memories: Memory[]) => void;
  maxMemories?: number;
}

const MemoryUploader = ({ 
  memories, 
  onMemoriesChange, 
  maxMemories = 4 
}: MemoryUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (memories.length >= maxMemories) {
      toast({
        title: "Límite alcanzado",
        description: `Solo puedes agregar ${maxMemories} recuerdos.`,
        variant: "destructive",
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo de imagen válido.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "La imagen debe ser menor a 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `memories/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error } = await supabase.storage
        .from("gift-photos")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("gift-photos")
        .getPublicUrl(fileName);

      const newMemory: Memory = {
        imageUrl: urlData.publicUrl,
        caption: "",
      };

      onMemoriesChange([...memories, newMemory]);

      toast({
        title: "¡Foto subida!",
        description: "Tu recuerdo está listo para agregar un mensaje.",
      });
    } catch (error) {
      console.error("Error uploading memory:", error);
      toast({
        title: "Error al subir",
        description: "No se pudo subir la foto. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [memories, maxMemories, onMemoriesChange, toast]);

  const handleRemoveMemory = (index: number) => {
    const newMemories = memories.filter((_, i) => i !== index);
    onMemoriesChange(newMemories);
  };

  const handleCaptionChange = (index: number, caption: string) => {
    if (caption.length > 120) return;
    const newMemories = memories.map((memory, i) => 
      i === index ? { ...memory, caption } : memory
    );
    onMemoriesChange(newMemories);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Recuerdos especiales</h3>
      </div>
      <p className="text-sm text-muted-foreground">
        Agrega hasta 4 fotos con pequeños mensajes para guardar momentos importantes de su historia.
      </p>

      {/* Memory Cards Grid */}
      <div className="grid grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {memories.map((memory, index) => (
            <motion.div
              key={memory.imageUrl}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              layout
              className="relative group"
            >
              <div className="aspect-square rounded-xl overflow-hidden bg-secondary border border-border">
                <img
                  src={memory.imageUrl}
                  alt={`Recuerdo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Remove button */}
                <button
                  onClick={() => handleRemoveMemory(index)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Gradient overlay */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
              </div>

              {/* Caption input */}
              <div className="mt-2">
                <Input
                  placeholder="Escribe un mensaje..."
                  value={memory.caption}
                  onChange={(e) => handleCaptionChange(index, e.target.value)}
                  maxLength={120}
                  className="text-xs h-8 bg-secondary/50"
                />
                <p className="text-[10px] text-muted-foreground mt-1 text-right">
                  {memory.caption.length}/120
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add Memory Button */}
        {memories.length < maxMemories && (
          <motion.div
            layout
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all",
              isUploading
                ? "border-primary/50 bg-primary/5"
                : "border-border bg-secondary/30 hover:border-primary/50 hover:bg-secondary/50"
            )}
          >
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            ) : (
              <>
                <ImagePlus className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-xs text-muted-foreground text-center px-2">
                  Agregar recuerdo
                </span>
                <span className="text-[10px] text-muted-foreground mt-1">
                  {memories.length}/{maxMemories}
                </span>
              </>
            )}
          </motion.div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default MemoryUploader;
