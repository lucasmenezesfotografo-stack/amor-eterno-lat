import { motion } from "framer-motion";
import { Heart, Download, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import RelationshipCounter from "@/components/RelationshipCounter";
import LoveLetter from "@/components/LoveLetter";
import SpotifyEmbed from "@/components/SpotifyEmbed";
import { QRCodeSVG } from "qrcode.react";
import { useRef } from "react";

// Demo data
const demoData = {
  names: { person1: "Maria", person2: "João" },
  startDate: new Date("2022-02-14"),
  coverPhoto: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=1200&auto=format&fit=crop",
  spotifyUrl: "https://open.spotify.com/track/0tgVpDi06FyKpA1z0VMD4v",
  loveLetter: `Meu amor João,

Desde o dia 14 de fevereiro de 2022, minha vida ganhou um novo significado. Cada momento ao seu lado é um presente que guardo no coração.

Você me faz querer ser uma pessoa melhor a cada dia, e com você descobri o verdadeiro significado do amor.

Obrigada por escolher construir essa história comigo. Prometo continuar te amando com a mesma intensidade de sempre.

Com todo meu amor,
Maria`,
  author: "Maria",
};

const RegaloPage = () => {
  const qrRef = useRef<HTMLDivElement>(null);

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
        ctx.fillText(`${demoData.names.person1} ❤ ${demoData.names.person2}`, 200, 385);
      }
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `forever-love-${demoData.names.person1}-${demoData.names.person2}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section with Cover Photo */}
      <section className="relative h-[70vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Cover Photo */}
        <div className="absolute inset-0">
          <img
            src={demoData.coverPhoto}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Heart */}
            <motion.div
              className="mb-6"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Heart className="w-12 h-12 mx-auto text-primary fill-primary" />
            </motion.div>

            {/* Names */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mb-4">
              <motion.h1
                className="text-4xl md:text-6xl font-semibold"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {demoData.names.person1}
              </motion.h1>

              <span className="text-primary text-3xl md:text-5xl">&</span>

              <motion.h1
                className="text-4xl md:text-6xl font-semibold"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {demoData.names.person2}
              </motion.h1>
            </div>

            {/* Date */}
            <motion.p
              className="text-lg text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              Juntos desde {demoData.startDate.toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Counter Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
        <div className="container mx-auto relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">
              Tempo juntos
            </h2>
            <p className="text-muted-foreground">Cada segundo conta</p>
          </motion.div>

          <RelationshipCounter startDate={demoData.startDate} />
        </div>
      </section>

      {/* Music Player - Floating */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-4"
          >
            <SpotifyEmbed spotifyUrl={demoData.spotifyUrl} compact />
          </motion.div>
        </div>
      </section>

      {/* Love Letter */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">
              Carta de Amor
            </h2>
            <p className="text-muted-foreground">Palavras do coração</p>
          </motion.div>

          <LoveLetter content={demoData.loveLetter} author={demoData.author} />
        </div>
      </section>

      {/* QR Code Download Section */}
      <section className="py-20 px-4 border-t border-border">
        <div className="container mx-auto max-w-md text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-semibold mb-2">
              Baixe o QR Code
            </h2>
            <p className="text-muted-foreground mb-8">
              Compartilhe este presente especial
            </p>

            <div
              ref={qrRef}
              className="w-48 h-48 mx-auto bg-card border border-border rounded-2xl flex items-center justify-center mb-6 p-4"
            >
              <QRCodeSVG
                value={window.location.href}
                size={160}
                level="H"
                fgColor="#e11d48"
                bgColor="transparent"
              />
            </div>

            <Button variant="default" size="lg" onClick={handleDownloadQR}>
              <Download className="w-5 h-5" />
              Baixar meu QR Code de presente
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            Feito com <Heart className="w-4 h-4 text-primary fill-primary" /> Forever Love
          </p>
        </div>
      </footer>
    </main>
  );
};

export default RegaloPage;