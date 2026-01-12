import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Download, Heart, ImageIcon, Calendar, MessageSquare, LayoutGrid, Check } from "lucide-react";
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

// Premium romantic color accents (used for hearts and small details only)
const accentColors = [
  { id: "rose", name: "Rosa", color: "#e11d48", hex: "#e11d48" },
  { id: "blush", name: "Rubor", color: "#f472b6", hex: "#f472b6" },
  { id: "burgundy", name: "Borgoña", color: "#881337", hex: "#881337" },
  { id: "gold", name: "Dorado", color: "#d4af37", hex: "#d4af37" },
  { id: "sage", name: "Salvia", color: "#84a98c", hex: "#84a98c" },
  { id: "navy", name: "Marino", color: "#1e3a5f", hex: "#1e3a5f" },
  { id: "terracotta", name: "Terracota", color: "#c08552", hex: "#c08552" },
  { id: "lavender", name: "Lavanda", color: "#9f7aea", hex: "#9f7aea" },
];

const layouts = [
  { id: "classic", name: "Diseño clásico", description: "Foto superior con texto elegante" },
  { id: "minimal", name: "Diseño minimalista", description: "QR Code como protagonista" },
  { id: "horizontal", name: "Diseño horizontal", description: "Formato paisaje con foto" },
  { id: "photo-focus", name: "Diseño con foto", description: "Estilo moderno digital" },
];

const PersonalizedCard = ({ person1, person2, qrUrl, photoUrl, startDate }: PersonalizedCardProps) => {
  const [selectedAccent, setSelectedAccent] = useState(accentColors[0]);
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

  // ============================================
  // CLASSIC CARD - Wedding invitation style
  // ============================================
  const renderClassicCard = () => (
    <div
      ref={cardRef}
      className="w-80 overflow-hidden"
      style={{
        backgroundColor: "#FAF9F7",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)",
        borderRadius: "4px",
      }}
    >
      {/* Photo section */}
      {showPhoto && photoUrl && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={photoUrl} 
            alt="Foto" 
            className="w-full h-full object-cover"
            crossOrigin="anonymous" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}
      
      {/* Content section */}
      <div className="p-8 text-center">
        {/* Romantic word in script */}
        <p 
          className="font-script text-3xl mb-4"
          style={{ color: selectedAccent.color }}
        >
          Forever
        </p>
        
        {/* Decorative line with heart */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-12 h-px bg-[#1C1C1C]/20" />
          <Heart 
            className="w-4 h-4 fill-current" 
            style={{ color: selectedAccent.color }}
          />
          <div className="w-12 h-px bg-[#1C1C1C]/20" />
        </div>
        
        {/* Names in serif */}
        <h2 className="font-serif text-2xl font-medium tracking-wide text-[#1C1C1C] mb-1">
          {person1}
        </h2>
        <span className="font-script text-xl text-[#6B6B6B]">&</span>
        <h2 className="font-serif text-2xl font-medium tracking-wide text-[#1C1C1C] mt-1 mb-4">
          {person2}
        </h2>
        
        {/* Date */}
        {showDate && formattedDate && (
          <p className="font-sans text-xs tracking-widest uppercase text-[#6B6B6B] mb-4">
            {formattedDate}
          </p>
        )}
        
        {/* Custom message */}
        {customMessage && (
          <p className="font-serif italic text-sm text-[#6B6B6B] mb-6 px-4">
            "{customMessage}"
          </p>
        )}
        
        {/* QR Code */}
        <div className="inline-block p-3 bg-white rounded-sm" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <QRCodeSVG 
            value={qrUrl} 
            size={100} 
            level="H" 
            fgColor="#1C1C1C"
            bgColor="transparent"
            includeMargin={true}
          />
        </div>
        
        <p className="font-sans text-[10px] tracking-widest uppercase text-[#6B6B6B] mt-4">
          Escanea para ver nuestra historia
        </p>
      </div>
    </div>
  );

  // ============================================
  // MINIMAL CARD - Editorial gallery style
  // ============================================
  const renderMinimalCard = () => (
    <div
      ref={cardRef}
      className="w-72 overflow-hidden"
      style={{
        backgroundColor: "#FAF9F7",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)",
        borderRadius: "4px",
      }}
    >
      <div className="p-12 text-center">
        {/* Small elegant text at top */}
        <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#6B6B6B] mb-8">
          Nuestra Historia
        </p>
        
        {/* Romantic word - main visual element */}
        <p 
          className="font-script text-5xl mb-10"
          style={{ color: selectedAccent.color }}
        >
          Love
        </p>
        
        {/* QR Code - PROTAGONIST - centered with breathing room */}
        <div className="inline-block p-4 bg-white rounded-sm mb-10" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <QRCodeSVG 
            value={qrUrl} 
            size={140} 
            level="H" 
            fgColor="#1C1C1C"
            bgColor="transparent"
            includeMargin={true}
          />
        </div>
        
        {/* Names - subtle, elegant */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-8 h-px bg-[#1C1C1C]/15" />
          <Heart 
            className="w-3 h-3 fill-current" 
            style={{ color: selectedAccent.color }}
          />
          <div className="w-8 h-px bg-[#1C1C1C]/15" />
        </div>
        
        <p className="font-serif text-lg font-medium text-[#1C1C1C] tracking-wide">
          {person1} & {person2}
        </p>
        
        {showDate && formattedDate && (
          <p className="font-sans text-[10px] tracking-widest uppercase text-[#6B6B6B] mt-3">
            {formattedDate}
          </p>
        )}
      </div>
    </div>
  );

  // ============================================
  // HORIZONTAL CARD - Thank you card style
  // ============================================
  const renderHorizontalCard = () => (
    <div
      ref={cardRef}
      className="w-[440px] h-56 overflow-hidden flex"
      style={{
        backgroundColor: "#FAF9F7",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)",
        borderRadius: "4px",
      }}
    >
      {/* Left - Photo (50-60%) */}
      {showPhoto && photoUrl ? (
        <div className="w-[55%] h-full overflow-hidden">
          <img 
            src={photoUrl} 
            alt="Foto" 
            className="w-full h-full object-cover"
            crossOrigin="anonymous" 
          />
        </div>
      ) : (
        <div 
          className="w-[55%] h-full flex items-center justify-center"
          style={{ backgroundColor: "#F5F4F2" }}
        >
          <div className="text-center">
            <Heart 
              className="w-8 h-8 mx-auto fill-current mb-2" 
              style={{ color: selectedAccent.color }}
            />
            <p className="font-script text-2xl" style={{ color: selectedAccent.color }}>
              Love
            </p>
          </div>
        </div>
      )}
      
      {/* Right - Content */}
      <div className="flex-1 p-6 flex flex-col justify-center">
        {/* Romantic script word */}
        <p 
          className="font-script text-2xl mb-3"
          style={{ color: selectedAccent.color }}
        >
          Forever
        </p>
        
        {/* Names */}
        <h2 className="font-serif text-xl font-medium text-[#1C1C1C] leading-tight">
          {person1}
        </h2>
        <span className="font-script text-lg text-[#6B6B6B]">&</span>
        <h2 className="font-serif text-xl font-medium text-[#1C1C1C] leading-tight mb-3">
          {person2}
        </h2>
        
        {showDate && formattedDate && (
          <p className="font-sans text-[9px] tracking-widest uppercase text-[#6B6B6B] mb-4">
            {formattedDate}
          </p>
        )}
        
        {/* QR Code - small and integrated */}
        <div className="inline-block p-2 bg-white rounded-sm self-start" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <QRCodeSVG 
            value={qrUrl} 
            size={60} 
            level="H" 
            fgColor="#1C1C1C"
            bgColor="transparent"
            includeMargin={true}
          />
        </div>
      </div>
    </div>
  );

  // ============================================
  // PHOTO FOCUS CARD - Modern/Digital (UNCHANGED)
  // ============================================
  const renderPhotoFocusCard = () => (
    <div
      ref={cardRef}
      className="w-80 rounded-2xl overflow-hidden relative"
      style={{
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.1)",
      }}
    >
      {photoUrl ? (
        <div className="relative h-80 overflow-hidden">
          <img 
            src={photoUrl} 
            alt="Foto" 
            className="w-full h-full object-cover"
            crossOrigin="anonymous" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="inline-block mb-3"
            >
              <Heart 
                className="w-5 h-5 fill-current mx-auto" 
                style={{ 
                  filter: `drop-shadow(0 0 8px ${selectedAccent.color})`,
                  color: selectedAccent.color,
                }}
              />
            </motion.div>
            <h2 className="text-xl font-serif font-semibold tracking-wide">{person1} & {person2}</h2>
            {showDate && formattedDate && (
              <p className="text-xs opacity-80 mt-2 font-sans tracking-wider">{formattedDate}</p>
            )}
            {customMessage && (
              <p className="text-xs italic opacity-90 mt-2 font-serif">"{customMessage}"</p>
            )}
          </div>
        </div>
      ) : (
        <div className="h-52 bg-gradient-to-br from-rose-500/90 to-pink-600/90 flex items-center justify-center relative">
          <div className="text-center text-white">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="inline-block mb-3"
            >
              <Heart 
                className="w-6 h-6 fill-current mx-auto" 
                style={{ 
                  filter: `drop-shadow(0 0 8px ${selectedAccent.color})`,
                  color: "white",
                }}
              />
            </motion.div>
            <h2 className="text-xl font-serif font-semibold tracking-wide">{person1} & {person2}</h2>
            {showDate && formattedDate && (
              <p className="text-xs opacity-80 mt-2 font-sans tracking-wider">{formattedDate}</p>
            )}
          </div>
        </div>
      )}
      
      <div className="p-5 text-center bg-gradient-to-br from-rose-500/90 to-pink-600/90">
        <div 
          className="rounded-xl p-3 mx-auto inline-block"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
            backdropFilter: "blur(20px)",
            border: `1px solid ${selectedAccent.color}30`,
          }}
        >
          <QRCodeSVG 
            value={qrUrl} 
            size={90} 
            level="H" 
            fgColor="#881337"
            bgColor="rgba(255,255,255,0.95)"
            className="rounded-lg block"
            includeMargin={true}
          />
        </div>
        <p className="text-[10px] mt-3 tracking-widest uppercase font-sans text-white/60">
          Escanea para ver nuestra historia
        </p>
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

  // Layout selector card preview component
  const LayoutPreviewCard = ({ layout, isSelected }: { layout: typeof layouts[0], isSelected: boolean }) => {
    const previewContent = () => {
      switch (layout.id) {
        case "classic":
          return (
            <div className="w-full h-full flex flex-col bg-[#FAF9F7] p-2">
              <div className="h-8 bg-[#E8E6E3] rounded-sm mb-1" />
              <div className="flex-1 flex flex-col items-center justify-center gap-1">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedAccent.color + "30" }} />
                <div className="w-8 h-1 bg-[#1C1C1C]/20 rounded-full" />
                <div className="w-6 h-1 bg-[#1C1C1C]/20 rounded-full" />
                <div className="w-6 h-6 bg-[#1C1C1C]/10 mt-1" />
              </div>
            </div>
          );
        case "minimal":
          return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#FAF9F7] p-2">
              <div className="text-[8px] font-script mb-1" style={{ color: selectedAccent.color }}>Love</div>
              <div className="w-10 h-10 bg-[#1C1C1C]/10 mb-1" />
              <div className="w-6 h-0.5 bg-[#1C1C1C]/20 rounded-full" />
            </div>
          );
        case "horizontal":
          return (
            <div className="w-full h-full flex bg-[#FAF9F7]">
              <div className="w-1/2 h-full bg-[#E8E6E3]" />
              <div className="w-1/2 h-full p-1 flex flex-col justify-center">
                <div className="w-4 h-1 rounded-full mb-1" style={{ backgroundColor: selectedAccent.color + "40" }} />
                <div className="w-6 h-0.5 bg-[#1C1C1C]/20 rounded-full mb-1" />
                <div className="w-4 h-4 bg-[#1C1C1C]/10" />
              </div>
            </div>
          );
        case "photo-focus":
          return (
            <div className="w-full h-full flex flex-col bg-gradient-to-br from-rose-500 to-pink-600">
              <div className="flex-1 flex items-end justify-center pb-1">
                <div className="w-6 h-0.5 bg-white/40 rounded-full" />
              </div>
              <div className="h-6 bg-gradient-to-br from-rose-600 to-pink-700 flex items-center justify-center">
                <div className="w-4 h-4 bg-white/20" />
              </div>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <button
        onClick={() => setSelectedLayout(layout)}
        className={cn(
          "relative rounded-lg overflow-hidden transition-all duration-200 text-left",
          "border-2",
          isSelected 
            ? "border-[#1C1C1C] shadow-md" 
            : "border-[#E8E6E3] hover:border-[#D0CDCA]"
        )}
        style={{ width: "100px" }}
      >
        {/* Preview */}
        <div className="h-16 overflow-hidden rounded-t-md">
          {previewContent()}
        </div>
        
        {/* Label */}
        <div className="p-2 bg-white">
          <p className="font-sans text-[10px] font-medium text-[#1C1C1C] truncate">
            {layout.name.replace("Diseño ", "")}
          </p>
        </div>
        
        {/* Selected indicator */}
        {isSelected && (
          <div 
            className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: selectedAccent.color }}
          >
            <Check className="w-2.5 h-2.5 text-white" />
          </div>
        )}
      </button>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <h3 className="font-serif text-xl font-medium text-[#1C1C1C] mb-2">
          Elige tu diseño
        </h3>
        <p className="font-sans text-sm text-[#6B6B6B]">
          Vista previa de tu tarjeta personalizada
        </p>
      </div>

      {/* Layout Selector - Premium cards */}
      <div>
        <label className="font-sans text-xs font-medium text-[#6B6B6B] mb-3 flex items-center gap-1.5">
          <LayoutGrid className="w-3.5 h-3.5" /> Elige tu diseño
        </label>
        <div className="flex flex-wrap justify-center gap-3">
          {layouts.map((layout) => (
            <LayoutPreviewCard 
              key={layout.id} 
              layout={layout} 
              isSelected={selectedLayout.id === layout.id}
            />
          ))}
        </div>
      </div>

      {/* Accent Color Selector */}
      <div>
        <label className="font-sans text-xs font-medium text-[#6B6B6B] mb-3 block">
          Color de acento
        </label>
        <div className="flex flex-wrap justify-center gap-2">
          {accentColors.map((color) => (
            <button
              key={color.id}
              onClick={() => setSelectedAccent(color)}
              className={cn(
                "w-8 h-8 rounded-full transition-all duration-200",
                selectedAccent.id === color.id
                  ? "ring-2 ring-offset-2 ring-[#1C1C1C] scale-110"
                  : "opacity-70 hover:opacity-100 hover:scale-105"
              )}
              style={{ backgroundColor: color.color }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Custom Message */}
      <div>
        <label className="font-sans text-xs font-medium text-[#6B6B6B] mb-2 flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5" /> Mensaje personalizado (opcional)
        </label>
        <Input
          placeholder="Ej: Te amo con todo mi corazón..."
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value.slice(0, 60))}
          maxLength={60}
          className="text-sm rounded-lg border-[#E8E6E3] bg-white focus:border-[#1C1C1C] focus:ring-[#1C1C1C]/10"
        />
        <p className="font-sans text-[10px] text-[#6B6B6B] mt-1 text-right">{customMessage.length}/60</p>
      </div>

      {/* Toggle Options */}
      <div className="flex flex-wrap justify-center gap-2">
        {photoUrl && (
          <Button
            variant={showPhoto ? "default" : "outline"}
            size="sm"
            onClick={() => setShowPhoto(!showPhoto)}
            className="text-xs rounded-lg"
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
            className="text-xs rounded-lg"
          >
            <Calendar className="w-3 h-3 mr-1" />
            Fecha
          </Button>
        )}
      </div>

      {/* Card Preview */}
      <div className="flex justify-center py-8 overflow-x-auto">
        <motion.div
          key={selectedLayout.id + selectedAccent.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {renderCard()}
        </motion.div>
      </div>

      {/* Selected indicator */}
      <div className="text-center">
        <span 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-sans"
          style={{ backgroundColor: selectedAccent.color + "15", color: selectedAccent.color }}
        >
          <Check className="w-3 h-3" />
          Seleccionado: {selectedLayout.name}
        </span>
      </div>

      {/* Download Button */}
      <div className="flex justify-center">
        <Button 
          onClick={handleDownloadCard} 
          size="lg" 
          className="gap-2 rounded-lg bg-[#1C1C1C] hover:bg-[#2D2D2D] text-white shadow-md"
        >
          <Download className="w-5 h-5" />
          Descargar Tarjeta
        </Button>
      </div>

      {/* Share Section */}
      <div className="pt-6 border-t border-[#E8E6E3]">
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