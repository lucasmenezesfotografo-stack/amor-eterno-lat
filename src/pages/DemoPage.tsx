import { motion } from "framer-motion";
import { Heart, Download, Star, Sparkles, Calendar, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import RelationshipCounter from "@/components/RelationshipCounter";
import LoveLetter from "@/components/LoveLetter";
import YouTubeMusicPlayer from "@/components/YouTubeMusicPlayer";
import ShareButtons from "@/components/ShareButtons";
import { QRCodeSVG } from "qrcode.react";
import { useRef, useState } from "react";
import { romanticTracks } from "@/components/SoundtrackSelector";
import MusicActivationOverlay from "@/components/MusicActivationOverlay";
import demoCoupleImage from "@/assets/demo-couple.jpg";
import { useLanguage, LanguageToggle } from "@/hooks/use-language";

const DemoPage = () => {
  const { t, language } = useLanguage();
  const qrRef = useRef<HTMLDivElement>(null);
  const [musicActivated, setMusicActivated] = useState(false);
  const [showMusicOverlay, setShowMusicOverlay] = useState(true);

  // Demo couple data
  const demoData = {
    person1: "Sofía",
    person2: "Miguel",
    startDate: new Date("2021-06-15"),
    coverPhoto: demoCoupleImage,
    loveLetter: language === 'en' 
      ? `My dear Miguel,

Every day by your side is a gift that I treasure with all my heart. Since that June 15th when our paths crossed, I knew my life had changed forever.

You are my best friend, my confidant, my adventure partner. With you I learned that true love is not perfect, but real. It's laughing together until it hurts, it's supporting each other on difficult days, it's building shared dreams.

Thank you for choosing me every day, for loving me as I am, for making our story so beautiful.

I love you beyond words,
Sofía ❤️`
      : `Mi querido Miguel,

Cada día a tu lado es un regalo que atesoro con todo mi corazón. Desde aquel 15 de junio cuando nuestros caminos se cruzaron, supe que mi vida había cambiado para siempre.

Eres mi mejor amigo, mi confidente, mi compañero de aventuras. Contigo he aprendido que el amor verdadero no es perfecto, sino real. Es reír juntos hasta que nos duela, es apoyarnos en los días difíciles, es construir sueños compartidos.

Gracias por elegirme cada día, por amarme como soy, por hacer de nuestra historia algo tan hermoso.

Te amo más allá de las palabras,
Sofía ❤️`
  };

  // Use first romantic track for demo
  const demoTrack = romanticTracks[0];

  const handleMusicActivate = () => {
    setMusicActivated(true);
    setShowMusicOverlay(false);
  };

  const currentUrl = typeof window !== "undefined" ? String(window.location.href).split('#')[0] : "";

  const handleDownloadQR = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = 400;
      canvas.height = 450;
      if (ctx) {
        const gradient = ctx.createLinearGradient(0, 0, 400, 450);
        gradient.addColorStop(0, "#1a1a1a");
        gradient.addColorStop(1, "#0a0a0a");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(0, 0, 400, 450, 24);
        ctx.fill();
        ctx.drawImage(img, 50, 40, 300, 300);
        ctx.fillStyle = "#e11d48";
        ctx.font = "bold 22px 'Inter', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`${demoData.person1} ❤️ ${demoData.person2}`, 200, 380);
        ctx.fillStyle = "#888";
        ctx.font = "14px 'Inter', sans-serif";
        ctx.fillText("Memory Link", 200, 420);
      }
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `memory-link-${demoData.person1}-${demoData.person2}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  // Format date according to language
  const formatDate = (date: Date) => {
    if (language === 'en') {
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    }
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Music Activation Overlay */}
      {showMusicOverlay && (
        <MusicActivationOverlay 
          trackName={demoTrack.name} 
          artistName={demoTrack.artist} 
          albumCover={demoTrack.albumCover} 
          onActivate={handleMusicActivate} 
        />
      )}

      {/* Demo Banner */}
      <motion.div 
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary to-rose-500 text-white py-2 sm:py-2.5 px-3 sm:px-4" 
        initial={{ y: -50 }} 
        animate={{ y: 0 }} 
        transition={{ delay: 0.5 }}
      >
        <div className="container mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="hidden xs:inline sm:inline">{t('demo.banner')}</span>
            <span className="xs:hidden sm:hidden">{t('demo.banner.short')}</span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <Link to="/crear">
              <Button size="sm" variant="secondary" className="text-xs gap-1 sm:gap-1.5 h-7 sm:h-8 px-2 sm:px-3">
                <span className="hidden sm:inline">{t('demo.cta')}</span>
                <span className="sm:hidden">{t('demo.cta.short')}</span>
                <Heart className="w-3 h-3 fill-current" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* YouTube Music Player */}
      {musicActivated && demoTrack?.youtubeVideoId && (
        <YouTubeMusicPlayer 
          videoId={String(demoTrack.youtubeVideoId)} 
          trackName={demoTrack.name} 
          artistName={demoTrack.artist} 
          albumCover={demoTrack.albumCover} 
          autoPlay={true} 
        />
      )}

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-10 sm:pt-12">
        <div className="absolute inset-0">
          <img src={demoData.coverPhoto} alt="Couple" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        </div>

        <div className="relative z-10 text-center px-4 py-16 sm:py-20 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex flex-col items-center justify-center gap-2 sm:gap-4 md:flex-row md:gap-8 mb-4 sm:mb-6">
              <motion.h1 className="text-4xl sm:text-5xl md:text-7xl font-bold" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                {demoData.person1}
              </motion.h1>
              <motion.span className="text-3xl sm:text-4xl md:text-6xl text-primary" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: "spring" }}>
                &
              </motion.span>
              <motion.h1 className="text-4xl sm:text-5xl md:text-7xl font-bold" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                {demoData.person2}
              </motion.h1>
            </div>

            <motion.div className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-card/80 backdrop-blur-xl border border-border" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-xs sm:text-sm text-muted-foreground">{t('regalo.together.since')}</span>
              <span className="font-semibold text-foreground text-xs sm:text-base">
                {formatDate(demoData.startDate)}
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Counter Section */}
      <section className="py-16 sm:py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="container mx-auto relative z-10">
          <motion.div className="text-center mb-8 sm:mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm mb-3 sm:mb-4">
              <Star className="w-3 h-3 sm:w-4 sm:h-4" />
              {t('demo.time.badge')}
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
              {t('demo.time.title')}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-lg">{t('demo.time.subtitle')}</p>
          </motion.div>

          <RelationshipCounter startDate={demoData.startDate.toISOString()} />
        </div>
      </section>

      {/* Love Letter Section */}
      <section className="py-16 sm:py-24 px-4">
        <div className="container mx-auto max-w-2xl">
          <LoveLetter content={demoData.loveLetter} author={demoData.person1} />
        </div>
      </section>

      {/* Share & QR Section */}
      <section className="py-16 sm:py-24 px-4">
        <div className="container mx-auto max-w-lg text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">{t('demo.share.title')}</h2>
          
          {/* QR Code */}
          <div ref={qrRef} className="w-40 h-40 sm:w-52 sm:h-52 mx-auto bg-card border border-border rounded-2xl flex items-center justify-center mb-6 p-4 shadow-xl">
            <QRCodeSVG value={String(currentUrl)} size={140} level="H" fgColor="#e11d48" bgColor="transparent" />
          </div>

          <Button variant="default" size="lg" onClick={handleDownloadQR} className="mb-8 gap-2 w-full sm:w-auto">
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{t('demo.share.download')}</span>
          </Button>

          <ShareButtons 
            url={String(currentUrl)} 
            title={`${demoData.person1} & ${demoData.person2} - Memory Link`} 
            description={language === 'en' ? "Check out our love page ❤️" : "Mira nuestra página de amor ❤️"} 
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 px-4 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">{t('demo.like.title')}</h2>
          <Link to="/crear">
            <Button size="lg" className="gap-2 w-full sm:w-auto h-12 sm:h-14 text-lg px-8">
              <Heart className="w-5 h-5 fill-current" />
              {t('demo.cta.price')}
            </Button>
          </Link>
        </div>
      </section>

      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            {t('regalo.footer')} <Heart className="w-4 h-4 text-primary fill-primary" /> Memory Link
          </p>
        </div>
      </footer>
    </main>
  );
};

export default DemoPage;
