import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Music, ExternalLink } from "lucide-react";

interface SpotifyEmbedProps {
  spotifyUrl: string;
  compact?: boolean;
}

// Extract Spotify track/album/playlist ID from various URL formats
const parseSpotifyUrl = (url: string): { type: string; id: string } | null => {
  if (!url) return null;
  
  // Handle different Spotify URL formats
  // https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh
  // spotify:track:4iV5W9uYEdYUVa79Axb7Rh
  // https://open.spotify.com/embed/track/4iV5W9uYEdYUVa79Axb7Rh
  
  const patterns = [
    /spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/,
    /spotify\.com\/embed\/(track|album|playlist)\/([a-zA-Z0-9]+)/,
    /spotify:(track|album|playlist):([a-zA-Z0-9]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return { type: match[1], id: match[2] };
    }
  }

  return null;
};

const SpotifyEmbed = ({ spotifyUrl, compact = false }: SpotifyEmbedProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const spotifyData = parseSpotifyUrl(spotifyUrl);
  
  useEffect(() => {
    setIsLoading(true);
    setError(false);
  }, [spotifyUrl]);

  if (!spotifyData) {
    return (
      <motion.div
        className="glass-card p-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Music className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground text-sm">
          Enlace de Spotify no válido
        </p>
        {spotifyUrl && (
          <a
            href={spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-primary hover:underline text-sm"
          >
            Abrir enlace <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </motion.div>
    );
  }

  const embedUrl = `https://open.spotify.com/embed/${spotifyData.type}/${spotifyData.id}?utm_source=generator&theme=0`;
  const height = compact ? 152 : spotifyData.type === "track" ? 152 : 352;

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl shadow-romantic"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary/50 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <span className="text-sm text-muted-foreground">Cargando música...</span>
          </div>
        </div>
      )}
      
      <iframe
        src={embedUrl}
        width="100%"
        height={height}
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setError(true);
        }}
        className="rounded-2xl"
        style={{ borderRadius: "16px" }}
      />
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary/80 backdrop-blur-sm">
          <div className="text-center p-4">
            <Music className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No se pudo cargar el reproductor</p>
            <a
              href={spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 text-primary hover:underline text-sm"
            >
              Abrir en Spotify <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SpotifyEmbed;