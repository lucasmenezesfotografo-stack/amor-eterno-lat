import { motion } from "framer-motion";
import { Heart, Download, ArrowLeft, Share2, Music, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import RelationshipCounter from "@/components/RelationshipCounter";
import LoveLetter from "@/components/LoveLetter";
import FloatingMusicPlayer from "@/components/FloatingMusicPlayer";
import ShareButtons from "@/components/ShareButtons";
import { QRCodeSVG } from "qrcode.react";
import { useRef } from "react";

const DemoPage = () => {
  const qrRef = useRef<HTMLDivElement>(null);
  
  // Demo couple data - romantic and inspiring
  const demoData = {
    person1: "Sofía",
    person2: "Miguel",
    startDate: new Date("2021-06-15"),
    coverPhoto: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1400&auto=format&fit=crop&q=80",
    soundtrack: {
      name: "Perfect",
      artist: "Ed Sheeran",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    },
    loveLetter: `Mi querido Miguel,

Cada día a tu lado es un regalo que atesoro con todo mi corazón. Desde aquel 15 de junio cuando nuestros caminos se cruzaron, supe que mi vida había cambiado para siempre.

Eres mi mejor amigo, mi confidente, mi compañero de aventuras. Contigo he aprendido que el amor verdadero no es perfecto, sino real. Es reír juntos hasta que nos duela, es apoyarnos en los días difíciles, es construir sueños compartidos.

Gracias por elegirme cada día, por amarme como soy, por hacer de nuestra historia algo tan hermoso.

Te amo más allá de las palabras,
Sofía ❤️`,
  };

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

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
        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, 400, 450);
        gradient.addColorStop(0, "#1a1a1a");
        gradient.addColorStop(1, "#0a0a0a");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(0, 0, 400, 450, 24);
        ctx.fill();

        // QR Code
        ctx.drawImage(img, 50, 40, 300, 300);

        // Names
        ctx.fillStyle = "#e11d48";
        ctx.font = "bold 22px 'Inter', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`${demoData.person1} ❤️ ${demoData.person2}`, 200, 380);

        // Subtitle
        ctx.fillStyle = "#888";
        ctx.font = "14px 'Inter', sans-serif";
        ctx.fillText("Forever Love", 200, 420);
      }
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `forever-love-${demoData.person1}-${demoData.person2}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Demo Banner */}
      <motion.div 
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary to-rose-500 text-white py-2.5 px-4"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">¡Esta es una demostración!</span>
            <span className="sm:hidden">Demo</span>
          </div>
          <Link to="/crear">
            <Button size="sm" variant="secondary" className="text-xs gap-1.5">
              Crear la mía
              <Heart className="w-3 h-3 fill-current" />
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Floating Music Player */}
      <FloatingMusicPlayer 
        audioUrl={demoData.soundtrack.url}
        trackName={`${demoData.soundtrack.name} - ${demoData.soundtrack.artist}`}
        autoPlay={false}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-12">
        {/* Cover Photo */}
        <div className="absolute inset-0">
          <img
            src={demoData.coverPhoto}
            alt="Couple"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Animated Heart */}
            <motion.div
              className="mb-8"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 backdrop-blur-xl flex items-center justify-center">
                <Heart className="w-10 h-10 text-primary fill-primary" />
              </div>
            </motion.div>

            {/* Names */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-6">
              <motion.h1
                className="text-5xl md:text-7xl font-bold"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {demoData.person1}
              </motion.h1>

              <motion.span 
                className="text-4xl md:text-6xl text-primary"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                &
              </motion.span>

              <motion.h1
                className="text-5xl md:text-7xl font-bold"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {demoData.person2}
              </motion.h1>
            </div>

            {/* Date Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card/80 backdrop-blur-xl border border-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Heart className="w-4 h-4 text-primary fill-primary" />
              <span className="text-muted-foreground">Juntos desde</span>
              <span className="font-semibold text-foreground">
                {demoData.startDate.toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-white/50 rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* Counter Section */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="container mx-auto relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm mb-4">
              <Star className="w-4 h-4" />
              Tiempo de amor
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Nuestra historia en números
            </h2>
            <p className="text-muted-foreground text-lg">Cada segundo cuenta cuando estás enamorado</p>
          </motion.div>

          <RelationshipCounter startDate={demoData.startDate} />
        </div>
      </section>

      {/* Love Letter Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Carta de Amor
            </h2>
            <p className="text-muted-foreground text-lg">Palabras que salen del corazón</p>
          </motion.div>

          <LoveLetter content={demoData.loveLetter} author={demoData.person1} />
        </div>
      </section>

      {/* Music Section */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto max-w-md text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/20">
              <Music className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Nuestra canción</h3>
            <p className="text-2xl font-bold text-foreground mb-1">{demoData.soundtrack.name}</p>
            <p className="text-muted-foreground">{demoData.soundtrack.artist}</p>
          </motion.div>
        </div>
      </section>

      {/* Share & QR Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-lg">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-3">
              Comparte el amor
            </h2>
            <p className="text-muted-foreground mb-8">
              Envía este regalo especial a quien quieras
            </p>

            {/* QR Code */}
            <div
              ref={qrRef}
              className="w-52 h-52 mx-auto bg-card border border-border rounded-3xl flex items-center justify-center mb-6 p-5 shadow-xl"
            >
              <QRCodeSVG
                value={currentUrl}
                size={170}
                level="H"
                fgColor="#e11d48"
                bgColor="transparent"
              />
            </div>

            <Button variant="default" size="lg" onClick={handleDownloadQR} className="mb-8 gap-2">
              <Download className="w-5 h-5" />
              Descargar QR Code
            </Button>

            {/* Share Buttons */}
            <ShareButtons 
              url={currentUrl}
              title={`${demoData.person1} & ${demoData.person2} - Forever Love`}
              description="Mira nuestra página de amor ❤️"
            />
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Te gustó? Crea la tuya
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Sorprende a tu amor con una página única y personalizada
            </p>
            <Link to="/crear">
              <Button size="xl" className="gap-2">
                <Heart className="w-5 h-5 fill-current" />
                Crear nuestra página por $5/año
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary fill-primary" />
            <span className="font-semibold">Forever Love</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Hecho con ❤️ para parejas enamoradas
          </p>
        </div>
      </footer>
    </main>
  );
};

export default DemoPage;
