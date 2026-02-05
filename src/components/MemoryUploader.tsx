import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImagePlus, X, Loader2, Sparkles, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";

export interface Memory {
  imageUrl: string;
  caption: string;
  title: string; // NEW: Editable title for each memory
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
  const { t } = useLanguage();

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (memories.length >= maxMemories) {
      toast({
        title: t('memories.limit.title'),
        description: `${t('memories.limit.desc')} ${maxMemories} ${t('memories.limit.suffix')}`,
        variant: "destructive",
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast({
        title: t('memories.invalid.title'),
        description: t('memories.invalid.desc'),
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: t('memories.size.title'),
        description: t('memories.size.desc'),
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

      // Create new memory with default title
      const memoryNumber = memories.length + 1;
      const newMemory: Memory = {
        imageUrl: urlData.publicUrl,
        caption: "",
        title: `${t('memories.default.title')} ${memoryNumber}`,
      };

      onMemoriesChange([...memories, newMemory]);

      toast({
        title: t('memories.uploaded.title'),
        description: t('memories.uploaded.desc'),
      });
    } catch (error) {
      console.error("Error uploading memory:", error);
      toast({
        title: t('memories.error.title'),
        description: t('memories.error.desc'),
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [memories, maxMemories, onMemoriesChange, toast, t]);

  const handleRemoveMemory = (index: number) => {
    const newMemories = memories.filter((_, i) => i !== index);
    onMemoriesChange(newMemories);
  };

  const handleTitleChange = (index: number, title: string) => {
    if (title.length > 50) return; // Max 50 chars for title
    const newMemories = memories.map((memory, i) => 
      i === index ? { ...memory, title } : memory
    );
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
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">{t('memories.title')}</h3>
        </div>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          {t('memories.subtitle')}
        </p>
      </div>

      {/* Memory Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {memories.map((memory, index) => (
            <motion.div
              key={memory.imageUrl}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.3 }}
              layout
              className="relative group bg-card border border-border rounded-xl overflow-hidden shadow-sm"
            >
              {/* Image container */}
              <div className="relative aspect-square">
                <img
                  src={memory.imageUrl}
                  alt={memory.title || `Recuerdo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Remove button */}
                <button
                  onClick={() => handleRemoveMemory(index)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-destructive hover:text-destructive-foreground shadow-lg"
                  aria-label="Eliminar recuerdo"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Overlay gradient */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                
                {/* Memory number badge */}
                <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold shadow-lg">
                  {index + 1}
                </div>
              </div>

              {/* Title and Caption inputs */}
              <div className="p-4 space-y-3 bg-card">
                {/* Title input - EDITABLE */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1 block">
                    {t('memories.name.label')}
                  </label>
                  <Input
                    placeholder={t('memories.name.placeholder')}
                    value={memory.title || ""}
                    onChange={(e) => handleTitleChange(index, e.target.value)}
                    maxLength={50}
                    className="text-sm h-9 font-medium bg-secondary/50 border-border focus:border-primary"
                  />
                </div>
                
                {/* Caption input */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1 block">
                    {t('memories.desc.label')}
                  </label>
                  <Input
                    placeholder={t('memories.desc.placeholder')}
                    value={memory.caption}
                    onChange={(e) => handleCaptionChange(index, e.target.value)}
                    maxLength={120}
                    className="text-sm h-9 bg-secondary/50 border-border focus:border-primary"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1 text-right">
                    {memory.caption.length}/120
                  </p>
                </div>
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
              "aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200",
              isUploading
                ? "border-primary bg-primary/5"
                : "border-border bg-secondary/30 hover:border-primary hover:bg-primary/5"
            )}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-sm font-medium text-foreground">{t('memories.uploading')}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Camera className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    {t('memories.add')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {memories.length} {t('memories.of')} {maxMemories} {t('memories.photos')}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Empty state message */}
      {memories.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-muted-foreground italic"
        >
          {t('memories.empty')}
        </motion.p>
      )}

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
