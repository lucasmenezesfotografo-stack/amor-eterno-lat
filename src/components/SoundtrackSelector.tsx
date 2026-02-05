import { motion } from "framer-motion";
import { Music, Check, Play, Pause, Youtube, Loader2, Search, Link, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/hooks/use-language";

export interface YouTubeTrack {
  id: string;
  name: string;
  artist: string;
  youtubeVideoId: string;
  albumCover?: string;
  color: string;
}

// Pre-configured famous romantic songs with YouTube video IDs
export const romanticTracks: YouTubeTrack[] = [
  {
    id: "perfect",
    name: "Perfect",
    artist: "Ed Sheeran",
    youtubeVideoId: "2Vv-BfVoq4g",
    albumCover: "https://i.ytimg.com/vi/2Vv-BfVoq4g/hqdefault.jpg",
    color: "from-rose-500 to-pink-600",
  },
  {
    id: "thinking-out-loud",
    name: "Thinking Out Loud",
    artist: "Ed Sheeran",
    youtubeVideoId: "lp-EO5I60KA",
    albumCover: "https://i.ytimg.com/vi/lp-EO5I60KA/hqdefault.jpg",
    color: "from-amber-500 to-orange-600",
  },
  {
    id: "just-the-way-you-are",
    name: "Just The Way You Are",
    artist: "Bruno Mars",
    youtubeVideoId: "LjhCEhWiKXk",
    albumCover: "https://i.ytimg.com/vi/LjhCEhWiKXk/hqdefault.jpg",
    color: "from-violet-500 to-purple-600",
  },
  {
    id: "marry-you",
    name: "Marry You",
    artist: "Bruno Mars",
    youtubeVideoId: "dElRVQFqj-k",
    albumCover: "https://i.ytimg.com/vi/dElRVQFqj-k/hqdefault.jpg",
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "all-of-me",
    name: "All of Me",
    artist: "John Legend",
    youtubeVideoId: "450p7goxZqg",
    albumCover: "https://i.ytimg.com/vi/450p7goxZqg/hqdefault.jpg",
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: "a-thousand-years",
    name: "A Thousand Years",
    artist: "Christina Perri",
    youtubeVideoId: "rtOvBOTyX00",
    albumCover: "https://i.ytimg.com/vi/rtOvBOTyX00/hqdefault.jpg",
    color: "from-pink-500 to-rose-600",
  },
  {
    id: "cant-help-falling",
    name: "Can't Help Falling in Love",
    artist: "Elvis Presley",
    youtubeVideoId: "vGJTaP6anOU",
    albumCover: "https://i.ytimg.com/vi/vGJTaP6anOU/hqdefault.jpg",
    color: "from-red-500 to-pink-600",
  },
  {
    id: "make-you-feel-my-love",
    name: "Make You Feel My Love",
    artist: "Adele",
    youtubeVideoId: "0put0_a--Ng",
    albumCover: "https://i.ytimg.com/vi/0put0_a--Ng/hqdefault.jpg",
    color: "from-indigo-500 to-violet-600",
  },
];

// Helper function to extract YouTube video ID from URL
export const extractYoutubeVideoId = (url: any): string | null => {
  // 1. Força a conversão para string e limpa espaços
  const urlString = String(url || "").trim();
  
  if (!urlString || urlString === "[object Object]") return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  
  for (const pattern of patterns) {
    const match = urlString.match(pattern);
    if (match) return match[1];
  }
  
  return null;
};
// Validate if URL is a valid YouTube URL
export const isValidYoutubeUrl = (url: string): boolean => {
  if (!url) return false;
  return extractYoutubeVideoId(url) !== null;
};

interface SoundtrackSelectorProps {
  selectedTrack: string | null;
  customYoutubeUrl: string;
  onSelect: (trackId: string | null, trackData?: { 
    name: string; 
    artist: string; 
    youtubeVideoId: string; 
    albumCover?: string 
  }) => void;
  onCustomUrlChange: (url: string) => void;
}

const SoundtrackSelector = ({ 
  selectedTrack, 
  customYoutubeUrl,
  onSelect, 
  onCustomUrlChange 
}: SoundtrackSelectorProps) => {
  const [previewingTrack, setPreviewingTrack] = useState<string | null>(null);
  const [customUrlError, setCustomUrlError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { t } = useLanguage();

  // Validate custom URL when it changes
  useEffect(() => {
    if (customYoutubeUrl && !isValidYoutubeUrl(customYoutubeUrl)) {
      setCustomUrlError(t('soundtrack.custom.error'));
    } else {
      setCustomUrlError(null);
    }
  }, [customYoutubeUrl, t]);

  const handlePreview = (track: YouTubeTrack, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (previewingTrack === track.id) {
      setPreviewingTrack(null);
    } else {
      setPreviewingTrack(track.id);
    }
  };

  const handleSelect = (track: YouTubeTrack) => {
    // Clear custom URL when selecting a preset
    onCustomUrlChange("");
    setPreviewingTrack(null);
    
    onSelect(track.id, {
      name: track.name,
      artist: track.artist,
      youtubeVideoId: track.youtubeVideoId,
      albumCover: track.albumCover,
    });
  };

  const handleCustomUrlBlur = () => {
    if (customYoutubeUrl && isValidYoutubeUrl(customYoutubeUrl)) {
      const videoId = extractYoutubeVideoId(customYoutubeUrl);
      if (videoId) {
        // Deselect any preset track
        onSelect("custom", {
          name: t('soundtrack.custom.name'),
          artist: "YouTube",
          youtubeVideoId: videoId,
          albumCover: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        });
      }
    }
  };

  // Get the current video ID to preview (custom takes priority)
  const getPreviewVideoId = (): string | null => {
    if (customYoutubeUrl && isValidYoutubeUrl(customYoutubeUrl)) {
      return extractYoutubeVideoId(customYoutubeUrl);
    }
    if (previewingTrack) {
      const track = romanticTracks.find(t => t.id === previewingTrack);
      return track?.youtubeVideoId || null;
    }
    return null;
  };

  const previewVideoId = getPreviewVideoId();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Youtube className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-medium text-foreground">{t('soundtrack.title')}</h3>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        {t('soundtrack.subtitle')}
      </p>

      {/* YouTube Preview Player */}
      {previewVideoId && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 rounded-xl overflow-hidden bg-black"
        >
          <div className="relative pt-[56.25%]">
            <iframe
              ref={iframeRef}
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${previewVideoId}?autoplay=1&enablejsapi=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </motion.div>
      )}

      {/* Preset Tracks List */}
      <div className="grid gap-3 max-h-[350px] overflow-y-auto pr-2">
        {romanticTracks.map((track) => {
          const isSelected = selectedTrack === track.id && !customYoutubeUrl;
          const isPreviewing = previewingTrack === track.id;

          return (
            <motion.div
              key={track.id}
              className={cn(
                "relative flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl cursor-pointer transition-all border",
                isSelected
                  ? "bg-primary/20 border-primary/50"
                  : "bg-secondary/50 border-transparent hover:bg-secondary hover:border-border"
              )}
              onClick={() => handleSelect(track)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {/* Album Art */}
              <div className={cn(
                "relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0",
                !track.albumCover && `bg-gradient-to-br ${track.color}`
              )}>
                {track.albumCover ? (
                  <img 
                    src={track.albumCover} 
                    alt={track.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Music className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                )}
                
                {/* Playing indicator overlay */}
                {isPreviewing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="flex items-end justify-center gap-0.5 h-6">
                      {[...Array(4)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1 bg-white rounded-full"
                          animate={{
                            height: ["30%", "100%", "50%", "80%", "30%"],
                          }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.1,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Track Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate text-sm sm:text-base">{track.name}</p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">{track.artist}</p>
              </div>

              {/* Preview Button */}
              <button
                onClick={(e) => handlePreview(track, e)}
                className={cn(
                  "w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all flex-shrink-0",
                  isPreviewing
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary hover:bg-secondary/80 text-foreground"
                )}
              >
                {isPreviewing ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 ml-0.5" />
                )}
              </button>

              {/* Selected Indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-primary-foreground" />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Custom YouTube URL Input */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center gap-2 mb-3">
          <Link className="w-4 h-4 text-muted-foreground" />
          <label className="text-sm font-medium text-foreground">
            {t('soundtrack.custom.label')}
          </label>
        </div>
        
        <Input
          placeholder={t('soundtrack.custom.placeholder')}
          value={customYoutubeUrl}
          onChange={(e) => onCustomUrlChange(e.target.value)}
          onBlur={handleCustomUrlBlur}
          className={cn(
            "transition-colors",
            customUrlError && customYoutubeUrl ? "border-destructive focus-visible:ring-destructive" : ""
          )}
        />
        
        {customUrlError && customYoutubeUrl && (
          <div className="flex items-center gap-2 mt-2 text-sm text-destructive">
            <AlertCircle className="w-4 h-4" />
            <span>{customUrlError}</span>
          </div>
        )}

        {customYoutubeUrl && isValidYoutubeUrl(customYoutubeUrl) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
              <img 
                src={`https://i.ytimg.com/vi/${extractYoutubeVideoId(customYoutubeUrl)}/hqdefault.jpg`}
                alt="Video thumbnail"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{t('soundtrack.custom.name')}</p>
              <p className="text-xs text-muted-foreground">{t('soundtrack.custom.priority')}</p>
            </div>
            <Check className="w-5 h-5 text-primary" />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SoundtrackSelector;
