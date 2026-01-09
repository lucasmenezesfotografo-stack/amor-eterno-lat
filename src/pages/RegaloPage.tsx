import { motion } from "framer-motion";
import { Heart, Download, Loader2, Music, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import RelationshipCounter from "@/components/RelationshipCounter";
import LoveLetter from "@/components/LoveLetter";
import FloatingMusicPlayer from "@/components/FloatingMusicPlayer";
import ShareButtons from "@/components/ShareButtons";
import { QRCodeSVG } from "qrcode.react";
import { useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { soundtracks } from "@/components/SoundtrackSelector";

interface GiftPageData {
  id: string;
  slug: string;
  your_name: string;
  partner_name: string;
  start_date: string;
  cover_photo_url: string | null;
  love_letter: string | null;
  soundtrack_name: string | null;
  soundtrack_url: string | null;
  spotify_link: string | null;
}

// Demo data for /regalo/demo route
const demoData: GiftPageData = {
  id: "demo",
  slug: "demo",
  your_name: "María",
  partner_name: "Juan",
  start_date: "2022-02-14",
  cover_photo_url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200&auto=format&fit=crop",
  soundtrack_name: "Romantic Piano",
  soundtrack_url: "https://cdn.pixabay.com/audio/2022/01/18/audio_d0ef34a3f0.mp3",
  spotify_link: null,
  love_letter: `Mi amor Juan,

Desde el día 14 de febrero de 2022, mi vida cobró un nuevo significado. Cada momento a tu lado es un regalo que guardo en el corazón.

Tú me haces querer ser una mejor persona cada día, y contigo descubrí el verdadero significado del amor.

Gracias por elegir construir esta historia conmigo. Prometo seguir amándote con la misma intensidad de siempre.

Con todo mi amor,
María`,
};

const RegaloPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qrRef = useRef<HTMLDivElement>(null);
  const [pageData, setPageData] = useState<GiftPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchGiftPage = async () => {
      // If demo route, use demo data
      if (id === "demo") {
        setPageData(demoData);
        setIsLoading(false);
        return;
      }

      if (!id) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("gift_pages")
          .select("*")
          .eq("slug", id)
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          setNotFound(true);
        } else {
          setPageData(data);
        }
      } catch (error) {
        console.error("Error fetching gift page:", error);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGiftPage();
  }, [id]);

  const handleDownloadQR = () => {
    if (!qrRef.current || !pageData) return;
    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = 400;
      canvas.height = 400;
      if (ctx) {
        ctx.fillStyle = "#1a1a1a";
        ctx.beginPath();
        ctx.roundRect(0, 0, 400, 400, 20);
        ctx.fill();
        ctx.drawImage(img, 50, 50, 300, 300);
        ctx.fillStyle = "#e11d48";
        ctx.font = "bold 18px 'Inter', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`${pageData.your_name} ❤ ${pageData.partner_name}`, 200, 385);
      }
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `forever-love-${pageData.your_name}-${pageData.partner_name}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  // Loading state
  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando tu regalo...</p>
        </div>
      </main>
    );
  }

  // Not found state
  if (notFound || !pageData) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-2xl font-semibold mb-2">Página no encontrada</h1>
          <p className="text-muted-foreground mb-6">
            Este regalo no existe o el enlace ha expirado.
          </p>
          <Button onClick={() => navigate("/crear")}>
            Crear mi regalo
          </Button>
        </div>
      </main>
    );
  }

  const startDate = new Date(pageData.start_date);
  const defaultCoverPhoto = "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200&auto=format&fit=crop";

  // Find track info from soundtracks
  const currentTrack = soundtracks.find(t => t.url === pageData.soundtrack_url) || 
    soundtracks.find(t => t.name === pageData.soundtrack_name);

  return (
    <main className="min-h-screen bg-background">
      {/* Floating Music Player with Autoplay and Loop */}
      {pageData.soundtrack_url && (
        <FloatingMusicPlayer 
          audioUrl={pageData.soundtrack_url}
          trackName={currentTrack?.name || pageData.soundtrack_name || "Nuestra Canción"}
          artistName={currentTrack?.artist}
          albumCover={currentTrack?.albumCover}
          autoPlay={true}
        />
      )}

      {/* Hero Section with Cover Photo */}
      <section className="relative min-h-[80vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
        {/* Cover Photo */}
        <div className="absolute inset-0">
          <img
            src={pageData.cover_photo_url || defaultCoverPhoto}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 py-16 sm:py-20 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Heart */}
            <motion.div
              className="mb-6 sm:mb-8"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-primary/20 backdrop-blur-xl flex items-center justify-center">
                <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-primary fill-primary" />
              </div>
            </motion.div>

            {/* Names */}
            <div className="flex flex-col items-center justify-center gap-2 sm:gap-4 md:flex-row md:gap-6 mb-4 sm:mb-6">
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {pageData.your_name}
              </motion.h1>

              <span className="text-primary text-3xl sm:text-4xl md:text-5xl">&</span>

              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {pageData.partner_name}
              </motion.h1>
            </div>

            {/* Date Badge */}
            <motion.div
              className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-card/80 backdrop-blur-xl border border-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm sm:text-base text-muted-foreground">Juntos desde</span>
              <span className="text-sm sm:text-base font-semibold text-foreground">
                {startDate.toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </motion.div>
            
            {/* Music indicator */}
            {pageData.soundtrack_name && (
              <motion.div
                className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Music className="w-4 h-4" />
                <span>♪ {pageData.soundtrack_name}</span>
              </motion.div>
            )}
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-2 sm:w-1.5 sm:h-3 bg-white/50 rounded-full mt-1.5 sm:mt-2" />
          </div>
        </motion.div>
      </section>

      {/* Counter Section */}
      <section className="py-16 sm:py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="container mx-auto relative z-10">
          <motion.div
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
              Tiempo juntos
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">Cada segundo cuenta cuando estás enamorado</p>
          </motion.div>

          <RelationshipCounter startDate={startDate} />
        </div>
      </section>

      {/* Love Letter */}
      {pageData.love_letter && (
        <section className="py-16 sm:py-24 px-4">
          <div className="container mx-auto max-w-2xl">
            <motion.div
              className="text-center mb-8 sm:mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
                Carta de Amor
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">Palabras del corazón</p>
            </motion.div>

            <LoveLetter content={pageData.love_letter} author={pageData.your_name} />
          </div>
        </section>
      )}

      {/* QR Code Download Section */}
      <section className="py-16 sm:py-24 px-4 border-t border-border">
        <div className="container mx-auto max-w-md text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-xl sm:text-2xl font-semibold mb-2">
              Descarga el QR Code
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mb-6 sm:mb-8">
              Comparte este regalo especial
            </p>

            <div
              ref={qrRef}
              className="w-40 h-40 sm:w-48 sm:h-48 mx-auto bg-card border border-border rounded-2xl flex items-center justify-center mb-4 sm:mb-6 p-3 sm:p-4"
            >
              <QRCodeSVG
                value={window.location.href}
                size={140}
                level="H"
                fgColor="#e11d48"
                bgColor="transparent"
              />
            </div>

            <Button variant="default" size="lg" onClick={handleDownloadQR} className="mb-6 w-full sm:w-auto">
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Descargar mi QR Code</span>
            </Button>

            {/* Share Buttons */}
            <ShareButtons 
              url={window.location.href}
              title={`${pageData.your_name} & ${pageData.partner_name} - Forever Love`}
              description="Mira nuestra página de amor ❤️"
            />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center">
          <p className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center gap-2">
            Hecho con <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-primary fill-primary" /> Forever Love
          </p>
        </div>
      </footer>
    </main>
  );
};

export default RegaloPage;
