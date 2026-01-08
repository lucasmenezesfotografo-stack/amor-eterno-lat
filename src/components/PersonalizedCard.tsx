import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Download, Heart, Palette, Type, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";

interface PersonalizedCardProps {
  person1: string;
  person2: string;
  qrUrl: string;
  photoUrl?: string;
}

const cardStyles = [
  { id: "romantic", name: "Romántico", bg: "bg-gradient-to-br from-rose-500 to-pink-600", text: "text-white" },
  { id: "elegant", name: "Elegante", bg: "bg-gradient-to-br from-zinc-800 to-zinc-900", text: "text-white" },
  { id: "sunset", name: "Atardecer", bg: "bg-gradient-to-br from-orange-400 to-rose-500", text: "text-white" },
  { id: "ocean", name: "Océano", bg: "bg-gradient-to-br from-cyan-500 to-blue-600", text: "text-white" },
];

const PersonalizedCard = ({ person1, person2, qrUrl, photoUrl }: PersonalizedCardProps) => {
  const [selectedStyle, setSelectedStyle] = useState(cardStyles[0]);
  const [showPhoto, setShowPhoto] = useState(!!photoUrl);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownloadCard = async () => {
    if (!cardRef.current) return;

    // Dynamic import for html2canvas
    const html2canvas = (await import("html2canvas")).default;
    
    const canvas = await html2canvas(cardRef.current, {
      scale: 2,
      backgroundColor: null,
      useCORS: true,
    });

    const link = document.createElement("a");
    link.download = `tarjeta-amor-${person1}-${person2}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Crea tu tarjeta personalizada
        </h3>
        <p className="text-sm text-muted-foreground">
          Perfecta para imprimir o compartir
        </p>
      </div>

      {/* Style Selector */}
      <div className="flex flex-wrap justify-center gap-2">
        {cardStyles.map((style) => (
          <button
            key={style.id}
            onClick={() => setSelectedStyle(style)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
              style.bg,
              style.text,
              selectedStyle.id === style.id
                ? "ring-2 ring-offset-2 ring-primary ring-offset-background"
                : "opacity-70 hover:opacity-100"
            )}
          >
            {style.name}
          </button>
        ))}
      </div>

      {/* Toggle Photo */}
      {photoUrl && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPhoto(!showPhoto)}
            className="text-xs"
          >
            <ImageIcon className="w-3 h-3 mr-1" />
            {showPhoto ? "Ocultar foto" : "Mostrar foto"}
          </Button>
        </div>
      )}

      {/* Card Preview */}
      <div className="flex justify-center">
        <div
          ref={cardRef}
          className={cn(
            "w-80 rounded-2xl overflow-hidden shadow-2xl",
            selectedStyle.bg
          )}
        >
          {/* Photo Section */}
          {showPhoto && photoUrl && (
            <div className="relative h-40 overflow-hidden">
              <img
                src={photoUrl}
                alt="Foto de pareja"
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          )}

          {/* Content */}
          <div className={cn("p-6 text-center", selectedStyle.text)}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="w-5 h-5 fill-current" />
              <span className="text-sm uppercase tracking-wider opacity-80">
                Nuestra Historia
              </span>
              <Heart className="w-5 h-5 fill-current" />
            </div>

            <h2 className="text-2xl font-bold mb-1">{person1}</h2>
            <div className="flex items-center justify-center gap-2 my-2">
              <div className="w-8 h-px bg-current opacity-50" />
              <Heart className="w-4 h-4 fill-current" />
              <div className="w-8 h-px bg-current opacity-50" />
            </div>
            <h2 className="text-2xl font-bold mb-6">{person2}</h2>

            {/* QR Code */}
            <div className="bg-white rounded-xl p-3 w-fit mx-auto mb-4">
              <QRCodeSVG
                value={qrUrl}
                size={100}
                level="H"
                fgColor="#1a1a1a"
                bgColor="white"
              />
            </div>

            <p className="text-xs opacity-80">
              Escanea para ver nuestra página de amor
            </p>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="flex justify-center">
        <Button onClick={handleDownloadCard} size="lg" className="gap-2">
          <Download className="w-5 h-5" />
          Descargar Tarjeta
        </Button>
      </div>
    </motion.div>
  );
};

export default PersonalizedCard;
