import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Download, Heart, ImageIcon, Calendar, MessageSquare, LayoutGrid, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import ShareButtons from "@/components/ShareButtons";

interface PersonalizedCardProps {
  person1: string;
  person2: string;
  qrUrl: string;
  photoUrl?: string;
  startDate?: Date;
}

const cardStyles = [
  { id: "romantic", name: "Romántico", bg: "from-rose-500 to-pink-600" },
  { id: "elegant", name: "Elegante", bg: "from-zinc-800 to-zinc-900" },
  { id: "sunset", name: "Atardecer", bg: "from-orange-400 to-rose-500" },
  { id: "ocean", name: "Océano", bg: "from-cyan-500 to-blue-600" },
  { id: "forest", name: "Bosque", bg: "from-emerald-500 to-teal-600" },
  { id: "lavender", name: "Lavanda", bg: "from-purple-400 to-violet-600" },
  { id: "gold", name: "Dorado", bg: "from-amber-400 to-orange-500" },
  { id: "midnight", name: "Noche", bg: "from-indigo-900 to-slate-900" },
];

const layouts = [
  { id: "classic", name: "Clásico", icon: "❤️" },
  { id: "minimal", name: "Minimalista", icon: "◯" },
  { id: "horizontal", name: "Horizontal", icon: "▭" },
  { id: "photo-focus", name: "Con Foto", icon: "🖼️" },
];

const PersonalizedCard = ({ person1, person2, qrUrl, photoUrl, startDate }: PersonalizedCardProps) => {
  const [selectedStyle, setSelectedStyle] = useState(cardStyles[0]);
  const [selectedLayout, setSelectedLayout] = useState(layouts[0]);
  const [showPhoto, setShowPhoto] = useState(!!photoUrl);
  const [customMessage, setCustomMessage] = useState("");
  const [showDate, setShowDate] = useState(!!startDate);
  const cardRef = useRef<HTMLDivElement>(null);

  const formattedDate = startDate 
    ? format(startDate, "d 'de' MMMM, yyyy", { locale: es })
    : "";

  const handleDownloadCard = async () => {
    if (!cardRef.current) return;
    const html2canvas = (await import("html2canvas")).default;
    
    const canvas = await html2canvas(cardRef.current, {
      scale: 3,
      backgroundColor: null,
      useCORS: true,
    });

    const link = document.createElement("a");
    link.download = `tarjeta-amor-${person1}-${person2}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const renderClassicCard = () => (
    <div
      ref={cardRef}
      className={cn(
        "w-80 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br",
        selectedStyle.bg
      )}
    >
      {showPhoto && photoUrl && (
        <div className="relative h-40 overflow-hidden">
          <img src={photoUrl} alt="Foto" className="w-full h-full object-cover" crossOrigin="anonymous" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}
      <div className="p-6 text-center text-white">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart className="w-4 h-4 fill-current" />
          <span className="text-xs uppercase tracking-widest opacity-80">Nuestra Historia</span>
          <Heart className="w-4 h-4 fill-current" />
        </div>
        <h2 className="text-2xl font-bold">{person1}</h2>
        <div className="flex items-center justify-center gap-2 my-2">
          <div className="w-8 h-px bg-white/50" />
          <Heart className="w-4 h-4 fill-current" />
          <div className="w-8 h-px bg-white/50" />
        </div>
        <h2 className="text-2xl font-bold mb-4">{person2}</h2>
        
        {showDate && formattedDate && (
          <p className="text-sm opacity-80 mb-3 flex items-center justify-center gap-1">
            <Calendar className="w-3 h-3" />
            {formattedDate}
          </p>
        )}
        
        {customMessage && (
          <p className="text-sm italic opacity-90 mb-4 px-2">"{customMessage}"</p>
        )}

        <div className="bg-white rounded-xl p-3 w-fit mx-auto mb-3">
          <QRCodeSVG value={qrUrl} size={90} level="H" fgColor="#1a1a1a" bgColor="white" />
        </div>
        <p className="text-[10px] opacity-70">Escanea para ver nuestra página</p>
      </div>
    </div>
  );

  const renderMinimalCard = () => (
    <div
      ref={cardRef}
      className="w-72 bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100"
    >
      <div className="p-8 text-center">
        <div className={cn("w-16 h-16 mx-auto rounded-full bg-gradient-to-br flex items-center justify-center mb-6", selectedStyle.bg)}>
          <Heart className="w-8 h-8 text-white fill-white" />
        </div>
        <h2 className="text-xl font-light text-gray-800 mb-1">{person1}</h2>
        <span className="text-2xl">&</span>
        <h2 className="text-xl font-light text-gray-800 mt-1 mb-4">{person2}</h2>
        
        {showDate && formattedDate && (
          <p className="text-xs text-gray-500 mb-3">{formattedDate}</p>
        )}
        
        {customMessage && (
          <p className="text-sm text-gray-600 italic mb-4">"{customMessage}"</p>
        )}

        <div className="border border-gray-200 rounded-2xl p-4 w-fit mx-auto">
          <QRCodeSVG value={qrUrl} size={80} level="H" fgColor="#374151" bgColor="white" />
        </div>
      </div>
    </div>
  );

  const renderHorizontalCard = () => (
    <div
      ref={cardRef}
      className={cn(
        "w-[400px] h-48 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-r flex",
        selectedStyle.bg
      )}
    >
      {showPhoto && photoUrl && (
        <div className="w-1/3 h-full overflow-hidden">
          <img src={photoUrl} alt="Foto" className="w-full h-full object-cover" crossOrigin="anonymous" />
        </div>
      )}
      <div className={cn("flex-1 p-5 text-white flex", showPhoto && photoUrl ? "" : "")}>
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-1 mb-2">
            <Heart className="w-3 h-3 fill-current" />
            <span className="text-[10px] uppercase tracking-wider opacity-70">Forever Love</span>
          </div>
          <h2 className="text-lg font-bold leading-tight">{person1}</h2>
          <span className="text-sm opacity-70">&</span>
          <h2 className="text-lg font-bold leading-tight mb-2">{person2}</h2>
          {showDate && formattedDate && (
            <p className="text-[10px] opacity-70">{formattedDate}</p>
          )}
          {customMessage && (
            <p className="text-[10px] italic opacity-80 mt-1 line-clamp-2">"{customMessage}"</p>
          )}
        </div>
        <div className="flex items-center">
          <div className="bg-white rounded-xl p-2">
            <QRCodeSVG value={qrUrl} size={70} level="H" fgColor="#1a1a1a" bgColor="white" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPhotoFocusCard = () => (
    <div
      ref={cardRef}
      className="w-80 rounded-2xl overflow-hidden shadow-2xl"
    >
      {photoUrl ? (
        <div className="relative h-72 overflow-hidden">
          <img src={photoUrl} alt="Foto" className="w-full h-full object-cover" crossOrigin="anonymous" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white text-center">
            <h2 className="text-xl font-bold">{person1} & {person2}</h2>
            {showDate && formattedDate && (
              <p className="text-xs opacity-80 mt-1">{formattedDate}</p>
            )}
            {customMessage && (
              <p className="text-xs italic opacity-90 mt-2">"{customMessage}"</p>
            )}
          </div>
        </div>
      ) : (
        <div className={cn("h-48 bg-gradient-to-br flex items-center justify-center", selectedStyle.bg)}>
          <div className="text-center text-white">
            <h2 className="text-xl font-bold">{person1} & {person2}</h2>
            {showDate && formattedDate && (
              <p className="text-xs opacity-80 mt-1">{formattedDate}</p>
            )}
          </div>
        </div>
      )}
      <div className={cn("p-4 text-center bg-gradient-to-br", selectedStyle.bg)}>
        <div className="bg-white rounded-xl p-3 w-fit mx-auto">
          <QRCodeSVG value={qrUrl} size={80} level="H" fgColor="#1a1a1a" bgColor="white" />
        </div>
        <p className="text-[10px] text-white/70 mt-2">Escanea para ver nuestra historia</p>
      </div>
    </div>
  );

  const renderCard = () => {
    switch (selectedLayout.id) {
      case "minimal": return renderMinimalCard();
      case "horizontal": return renderHorizontalCard();
      case "photo-focus": return renderPhotoFocusCard();
      default: return renderClassicCard();
    }
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

      {/* Layout Selector */}
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
          <LayoutGrid className="w-3 h-3" /> Diseño
        </label>
        <div className="flex flex-wrap justify-center gap-2">
          {layouts.map((layout) => (
            <button
              key={layout.id}
              onClick={() => setSelectedLayout(layout)}
              className={cn(
                "px-3 py-2 rounded-lg text-xs font-medium transition-all border",
                selectedLayout.id === layout.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              <span className="mr-1">{layout.icon}</span>
              {layout.name}
            </button>
          ))}
        </div>
      </div>

      {/* Style Selector */}
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-2 block">Color</label>
        <div className="flex flex-wrap justify-center gap-2">
          {cardStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style)}
              className={cn(
                "w-8 h-8 rounded-full bg-gradient-to-br transition-all",
                style.bg,
                selectedStyle.id === style.id
                  ? "ring-2 ring-offset-2 ring-primary ring-offset-background scale-110"
                  : "opacity-70 hover:opacity-100 hover:scale-105"
              )}
              title={style.name}
            />
          ))}
        </div>
      </div>

      {/* Custom Message */}
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
          <MessageSquare className="w-3 h-3" /> Mensaje personalizado (opcional)
        </label>
        <Input
          placeholder="Ej: Te amo con todo mi corazón..."
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value.slice(0, 60))}
          maxLength={60}
          className="text-sm"
        />
        <p className="text-[10px] text-muted-foreground mt-1 text-right">{customMessage.length}/60</p>
      </div>

      {/* Toggle Options */}
      <div className="flex flex-wrap justify-center gap-2">
        {photoUrl && (
          <Button
            variant={showPhoto ? "default" : "outline"}
            size="sm"
            onClick={() => setShowPhoto(!showPhoto)}
            className="text-xs"
          >
            <ImageIcon className="w-3 h-3 mr-1" />
            Foto
          </Button>
        )}
        {startDate && (
          <Button
            variant={showDate ? "default" : "outline"}
            size="sm"
            onClick={() => setShowDate(!showDate)}
            className="text-xs"
          >
            <Calendar className="w-3 h-3 mr-1" />
            Fecha
          </Button>
        )}
      </div>

      {/* Card Preview */}
      <div className="flex justify-center py-4 overflow-x-auto">
        {renderCard()}
      </div>

      {/* Download Button */}
      <div className="flex justify-center">
        <Button onClick={handleDownloadCard} size="lg" className="gap-2">
          <Download className="w-5 h-5" />
          Descargar Tarjeta
        </Button>
      </div>

      {/* Share Section */}
      <div className="pt-4 border-t border-border">
        <ShareButtons 
          url={qrUrl}
          title={`${person1} & ${person2} - Forever Love`}
          description="Mira nuestra página de amor ❤️"
        />
      </div>
    </motion.div>
  );
};

export default PersonalizedCard;
