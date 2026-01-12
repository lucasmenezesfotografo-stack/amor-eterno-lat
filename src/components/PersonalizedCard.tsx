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
import FontSelector, { fontOptions, serifFontOptions, FontOption } from "@/components/FontSelector";
import NamePositionSelector, { NamePosition } from "@/components/NamePositionSelector";

interface PersonalizedCardProps {
  person1: string;
  person2: string;
  qrUrl: string;
  photoUrl?: string;
  startDate?: Date;
}

// Premium romantic color accents
const accentColors = [
  { id: "charcoal", name: "Carbón", color: "#2D2D2D", hex: "#2D2D2D" },
  { id: "rose", name: "Rosa", color: "#e11d48", hex: "#e11d48" },
  { id: "blush", name: "Rubor", color: "#f472b6", hex: "#f472b6" },
  { id: "burgundy", name: "Borgoña", color: "#881337", hex: "#881337" },
  { id: "gold", name: "Dorado", color: "#d4af37", hex: "#d4af37" },
  { id: "sage", name: "Salvia", color: "#84a98c", hex: "#84a98c" },
  { id: "navy", name: "Marino", color: "#1e3a5f", hex: "#1e3a5f" },
];

const layouts = [
  { id: "classic", name: "Clásico", description: "Foto superior, texto elegante" },
  { id: "minimal", name: "Minimalista", description: "QR Code como protagonista" },
  { id: "horizontal", name: "Horizontal", description: "Formato paisaje elegante" },
  { id: "photo-focus", name: "Con Foto", description: "Estilo moderno digital" },
];

const PersonalizedCard = ({ person1, person2, qrUrl, photoUrl, startDate }: PersonalizedCardProps) => {
  const [selectedAccent, setSelectedAccent] = useState(accentColors[0]);
  const [selectedLayout, setSelectedLayout] = useState(layouts[0]);
  const [showPhoto, setShowPhoto] = useState(!!photoUrl);
  const [customMessage, setCustomMessage] = useState("");
  const [showDate, setShowDate] = useState(!!startDate);
  const [selectedScriptFont, setSelectedScriptFont] = useState<FontOption>(fontOptions[0]);
  const [selectedSerifFont, setSelectedSerifFont] = useState<FontOption>(serifFontOptions[0]);
  const [namesPosition, setNamesPosition] = useState<NamePosition>("center");
  const cardRef = useRef<HTMLDivElement>(null);

  const formattedDate = startDate 
    ? format(startDate, "dd.MM.yyyy", { locale: es })
    : "";

  const handleDownloadCard = async () => {
    if (!cardRef.current) return;
    const html2canvas = (await import("html2canvas")).default;
    
    const canvas = await html2canvas(cardRef.current, {
      scale: 4,
      backgroundColor: null,
      useCORS: true,
    });

    const link = document.createElement("a");
    link.download = `tarjeta-${person1}-${person2}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // ============================================
  // CLASSIC CARD - 10x15cm (2:3 ratio) - Like Image 1
  // Photo on top, elegant text below with names, date, QR
  // ============================================
  const renderClassicCard = () => (
    <div
      ref={cardRef}
      className="overflow-hidden animate-card-entrance"
      style={{
        width: "300px",
        height: "450px", // 10x15cm ratio (2:3)
        backgroundColor: "#FFFFFF",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)",
        borderRadius: "2px",
      }}
    >
      {/* Photo section - top half */}
      {showPhoto && photoUrl ? (
        <div className="relative overflow-hidden" style={{ height: "55%" }}>
          <img 
            src={photoUrl} 
            alt="Foto de pareja" 
            className="w-full h-full object-cover"
            crossOrigin="anonymous" 
          />
        </div>
      ) : (
        <div 
          className="flex items-center justify-center"
          style={{ height: "55%", backgroundColor: "#F5F4F2" }}
        >
          <div className="text-center">
            <Heart 
              className="w-12 h-12 mx-auto mb-3 fill-current" 
              style={{ color: selectedAccent.color }}
            />
            <p 
              className={cn("text-3xl", selectedScriptFont.className)}
              style={{ color: selectedAccent.color, fontFamily: selectedScriptFont.fontFamily }}
            >
              Forever
            </p>
          </div>
        </div>
      )}
      
      {/* Content section - bottom half */}
      <div className="flex flex-col justify-between p-5" style={{ height: "45%" }}>
        <div className="flex-1 flex flex-col justify-center">
          {/* Script word */}
          <p 
            className={cn("text-3xl mb-2", selectedScriptFont.className)}
            style={{ color: selectedAccent.color, fontFamily: selectedScriptFont.fontFamily }}
          >
            Forever
          </p>
          
          {/* Names and Date row */}
          <div className="flex items-start justify-between">
            <div>
              <p 
                className={cn("text-sm font-medium tracking-wide text-[#2D2D2D] uppercase", selectedSerifFont.className)}
                style={{ fontFamily: selectedSerifFont.fontFamily, letterSpacing: "0.05em" }}
              >
                {person1} & {person2}
              </p>
              {showDate && formattedDate && (
                <p className="font-sans text-xs text-[#6B6B6B] mt-0.5">
                  {formattedDate}
                </p>
              )}
            </div>
            
            {/* QR Code */}
            <div className="flex flex-col items-center">
              <div className="p-1 bg-white" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <QRCodeSVG 
                  value={qrUrl} 
                  size={60} 
                  level="H" 
                  fgColor="#2D2D2D"
                  bgColor="transparent"
                  includeMargin={false}
                />
              </div>
              <p className="font-sans text-[8px] text-[#6B6B6B] mt-1 uppercase tracking-wider">
                Share the love
              </p>
            </div>
          </div>
        </div>
        
        {/* Custom message */}
        {customMessage && (
          <p 
            className={cn("text-xs text-[#6B6B6B] italic mt-2 text-center", selectedSerifFont.className)}
            style={{ fontFamily: selectedSerifFont.fontFamily }}
          >
            "{customMessage}"
          </p>
        )}
      </div>
    </div>
  );

  // ============================================
  // MINIMAL CARD - 10x15cm (2:3 ratio) - Like Image 3
  // Clean, centered, "Capture the love" style
  // ============================================
  const renderMinimalCard = () => (
    <div
      ref={cardRef}
      className="overflow-hidden animate-card-entrance flex flex-col items-center justify-center"
      style={{
        width: "280px",
        height: "420px", // 10x15cm ratio (2:3)
        backgroundColor: "#FAF9F7",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)",
        borderRadius: "2px",
      }}
    >
      <div className="flex flex-col items-center justify-center h-full px-8 py-10 text-center">
        {/* Top text */}
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#2D2D2D] mb-4">
          Capture the
        </p>
        
        {/* Main script word */}
        <p 
          className={cn("text-5xl mb-8", selectedScriptFont.className)}
          style={{ color: selectedAccent.color, fontFamily: selectedScriptFont.fontFamily }}
        >
          love
        </p>
        
        {/* QR Code - PROTAGONIST */}
        <div className="p-3 bg-white mb-8" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <QRCodeSVG 
            value={qrUrl} 
            size={140} 
            level="H" 
            fgColor="#2D2D2D"
            bgColor="transparent"
            includeMargin={false}
          />
        </div>
        
        {/* Instructions */}
        <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-[#2D2D2D] font-medium mb-1">
          Share your photos with us!
        </p>
        <p className="font-sans text-[9px] text-[#6B6B6B] leading-relaxed max-w-[180px]">
          Scan the QR code and upload your favourites for us!
        </p>
        
        {/* Names - subtle at bottom */}
        <div className="mt-6 pt-4 border-t border-[#E8E6E3] w-full">
          <p 
            className={cn("text-sm font-medium text-[#2D2D2D]", selectedSerifFont.className)}
            style={{ fontFamily: selectedSerifFont.fontFamily }}
          >
            {person1} & {person2}
          </p>
          {showDate && formattedDate && (
            <p className="font-sans text-[10px] text-[#6B6B6B] mt-1">
              {formattedDate}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  // ============================================
  // HORIZONTAL CARD - 15x10cm (3:2 ratio) - Like Image 2
  // Photo on left, elegant text with message and QR on right
  // ============================================
  const renderHorizontalCard = () => (
    <div
      ref={cardRef}
      className="overflow-hidden flex animate-card-entrance"
      style={{
        width: "450px",
        height: "280px", // 15x10cm ratio (approximately 3:2)
        backgroundColor: "#FAF9F7",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)",
        borderRadius: "2px",
      }}
    >
      {/* Left - Photo (50%) */}
      {showPhoto && photoUrl ? (
        <div className="w-1/2 h-full overflow-hidden">
          <img 
            src={photoUrl} 
            alt="Foto de pareja" 
            className="w-full h-full object-cover"
            crossOrigin="anonymous" 
          />
        </div>
      ) : (
        <div 
          className="w-1/2 h-full flex items-center justify-center"
          style={{ backgroundColor: "#F0EFED" }}
        >
          <div className="text-center">
            <Heart 
              className="w-10 h-10 mx-auto mb-2 fill-current" 
              style={{ color: selectedAccent.color }}
            />
            <p 
              className={cn("text-2xl", selectedScriptFont.className)} 
              style={{ color: selectedAccent.color, fontFamily: selectedScriptFont.fontFamily }}
            >
              Love
            </p>
          </div>
        </div>
      )}
      
      {/* Right - Content (50%) */}
      <div className="w-1/2 h-full flex flex-col justify-between p-6">
        {/* Message area */}
        <div className="flex-1 flex flex-col justify-center">
          <p 
            className={cn("text-sm leading-relaxed text-[#4A4A4A] mb-4", selectedSerifFont.className)}
            style={{ fontFamily: selectedSerifFont.fontFamily }}
          >
            {customMessage || "Our hearts are filled with love and gratitude. Thank you so much for helping to make our special day unforgettable. It would not have been the same without you."}
          </p>
          
          {/* Signature */}
          <p className="font-sans text-xs text-[#6B6B6B] mb-1">
            All our love,
          </p>
          <p 
            className={cn("text-xl", selectedScriptFont.className)}
            style={{ color: selectedAccent.color, fontFamily: selectedScriptFont.fontFamily }}
          >
            {person1} & {person2}
          </p>
        </div>
        
        {/* QR Code area */}
        <div className="flex items-end justify-between mt-4">
          <div className="flex flex-col items-start">
            <div className="p-1.5 bg-white" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <QRCodeSVG 
                value={qrUrl} 
                size={55} 
                level="H" 
                fgColor="#2D2D2D"
                bgColor="transparent"
                includeMargin={false}
              />
            </div>
            <p className="font-sans text-[8px] text-[#6B6B6B] mt-1.5 leading-tight">
              Scan to see<br />more memories
            </p>
          </div>
          
          {showDate && formattedDate && (
            <p className="font-sans text-[10px] text-[#6B6B6B]">
              {formattedDate}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  // ============================================
  // PHOTO FOCUS CARD - Modern/Digital (preserved)
  // ============================================
  const renderPhotoFocusCard = () => (
    <div
      ref={cardRef}
      className="w-72 sm:w-80 rounded-2xl overflow-hidden relative animate-card-entrance"
      style={{
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.1)",
      }}
    >
      {photoUrl ? (
        <div className="relative h-64 sm:h-80 overflow-hidden">
          <img 
            src={photoUrl} 
            alt="Foto" 
            className="w-full h-full object-cover"
            crossOrigin="anonymous" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          
          <div className={cn(
            "absolute left-0 right-0 p-4 sm:p-6 text-white text-center",
            namesPosition === "top" ? "top-0 pt-6 sm:pt-8" :
            namesPosition === "bottom" ? "bottom-0" :
            "top-1/2 -translate-y-1/2"
          )}>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="inline-block mb-2 sm:mb-3"
            >
              <Heart 
                className="w-4 h-4 sm:w-5 sm:h-5 fill-current mx-auto" 
                style={{ 
                  filter: `drop-shadow(0 0 8px ${selectedAccent.color})`,
                  color: selectedAccent.color,
                }}
              />
            </motion.div>
            <h2 className="text-lg sm:text-xl font-serif font-semibold tracking-wide">
              {person1} & {person2}
            </h2>
            {showDate && formattedDate && (
              <p className="text-[10px] sm:text-xs opacity-80 mt-1.5 sm:mt-2 font-sans tracking-wider">
                {formattedDate}
              </p>
            )}
            {customMessage && (
              <p className="text-[10px] sm:text-xs italic opacity-90 mt-1.5 sm:mt-2 font-serif">
                "{customMessage}"
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="h-44 sm:h-52 bg-gradient-to-br from-rose-500/90 to-pink-600/90 flex items-center justify-center relative">
          <div className="text-center text-white">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="inline-block mb-2 sm:mb-3"
            >
              <Heart 
                className="w-5 h-5 sm:w-6 sm:h-6 fill-current mx-auto" 
                style={{ 
                  filter: `drop-shadow(0 0 8px ${selectedAccent.color})`,
                  color: "white",
                }}
              />
            </motion.div>
            <h2 className="text-lg sm:text-xl font-serif font-semibold tracking-wide">
              {person1} & {person2}
            </h2>
            {showDate && formattedDate && (
              <p className="text-[10px] sm:text-xs opacity-80 mt-1.5 sm:mt-2 font-sans tracking-wider">
                {formattedDate}
              </p>
            )}
          </div>
        </div>
      )}
      
      <div className="p-4 sm:p-5 text-center bg-gradient-to-br from-rose-500/90 to-pink-600/90">
        <div 
          className="rounded-xl p-2 sm:p-3 mx-auto inline-block"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
            backdropFilter: "blur(20px)",
            border: `1px solid ${selectedAccent.color}30`,
          }}
        >
          <QRCodeSVG 
            value={qrUrl} 
            size={70} 
            level="H" 
            fgColor="#881337"
            bgColor="rgba(255,255,255,0.95)"
            className="rounded-lg block"
            includeMargin={true}
          />
        </div>
        <p className="text-[9px] sm:text-[10px] mt-2 sm:mt-3 tracking-widest uppercase font-sans text-white/60">
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
  const LayoutPreviewCard = ({ layout, isSelected, index }: { layout: typeof layouts[0], isSelected: boolean, index: number }) => {
    const previewContent = () => {
      switch (layout.id) {
        case "classic":
          return (
            <div className="w-full h-full flex flex-col bg-white">
              <div className="h-8 bg-[#E8E6E3]" />
              <div className="flex-1 p-1.5 flex flex-col justify-center">
                <div className="text-[6px] font-script mb-0.5" style={{ color: selectedAccent.color }}>Forever</div>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="w-8 h-0.5 bg-[#2D2D2D]/40 rounded-full mb-0.5" />
                    <div className="w-5 h-0.5 bg-[#2D2D2D]/20 rounded-full" />
                  </div>
                  <div className="w-4 h-4 bg-[#2D2D2D]/10" />
                </div>
              </div>
            </div>
          );
        case "minimal":
          return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#FAF9F7] p-1">
              <div className="text-[5px] text-[#2D2D2D]/60 mb-0.5">CAPTURE THE</div>
              <div className="text-[8px] font-script mb-1" style={{ color: selectedAccent.color }}>love</div>
              <div className="w-6 h-6 bg-[#2D2D2D]/10 mb-1" />
              <div className="w-8 h-0.5 bg-[#2D2D2D]/20 rounded-full" />
            </div>
          );
        case "horizontal":
          return (
            <div className="w-full h-full flex bg-[#FAF9F7]">
              <div className="w-1/2 h-full bg-[#E8E6E3]" />
              <div className="w-1/2 h-full p-1 flex flex-col justify-between">
                <div className="space-y-0.5">
                  <div className="w-full h-0.5 bg-[#2D2D2D]/15 rounded-full" />
                  <div className="w-3/4 h-0.5 bg-[#2D2D2D]/15 rounded-full" />
                </div>
                <div className="text-[5px] font-script" style={{ color: selectedAccent.color }}>Love</div>
                <div className="w-3 h-3 bg-[#2D2D2D]/10" />
              </div>
            </div>
          );
        case "photo-focus":
          return (
            <div className="w-full h-full flex flex-col bg-gradient-to-br from-rose-500 to-pink-600 rounded-sm">
              <div className="flex-1 flex items-end justify-center pb-1">
                <div className="w-6 h-0.5 bg-white/40 rounded-full" />
              </div>
              <div className="h-4 bg-gradient-to-br from-rose-600 to-pink-700 flex items-center justify-center">
                <div className="w-3 h-3 bg-white/20" />
              </div>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <motion.button
        onClick={() => setSelectedLayout(layout)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.4 }}
        className={cn(
          "relative rounded-lg overflow-hidden transition-all duration-200 text-left",
          "border-2",
          isSelected 
            ? "border-[#2D2D2D] shadow-md" 
            : "border-[#E8E6E3] hover:border-[#D0CDCA]"
        )}
        style={{ width: "80px" }}
      >
        {/* Preview */}
        <div className="h-14 overflow-hidden rounded-t-md">
          {previewContent()}
        </div>
        
        {/* Label */}
        <div className="p-1.5 bg-white">
          <p className="font-sans text-[9px] font-medium text-[#2D2D2D] truncate text-center">
            {layout.name}
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
      </motion.button>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 sm:space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <h3 className="font-serif text-lg sm:text-xl font-medium text-foreground mb-2">
          Elige tu diseño
        </h3>
        <p className="font-sans text-xs sm:text-sm text-muted-foreground">
          Vista previa de tu tarjeta personalizada
        </p>
      </div>

      {/* Layout Selector */}
      <div>
        <label className="font-sans text-xs font-medium text-muted-foreground mb-3 flex items-center gap-1.5">
          <LayoutGrid className="w-3.5 h-3.5" /> Selecciona un estilo
        </label>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {layouts.map((layout, index) => (
            <LayoutPreviewCard 
              key={layout.id} 
              layout={layout} 
              isSelected={selectedLayout.id === layout.id}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Font Selectors */}
      <div className="space-y-4 sm:space-y-6">
        <FontSelector 
          selectedFont={selectedScriptFont}
          onFontChange={setSelectedScriptFont}
          label="Fuente romántica"
          fonts={fontOptions}
        />
        <FontSelector 
          selectedFont={selectedSerifFont}
          onFontChange={setSelectedSerifFont}
          label="Fuente para nombres"
          fonts={serifFontOptions}
        />
      </div>

      {/* Name Position Selector - only for photo-focus layout */}
      {selectedLayout.id === "photo-focus" && (
        <NamePositionSelector 
          selectedPosition={namesPosition}
          onPositionChange={setNamesPosition}
        />
      )}

      {/* Accent Color Selector */}
      <div>
        <label className="font-sans text-xs font-medium text-muted-foreground mb-3 block">
          Color de acento
        </label>
        <div className="flex flex-wrap justify-center gap-2">
          {accentColors.map((color) => (
            <button
              key={color.id}
              onClick={() => setSelectedAccent(color)}
              className={cn(
                "w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all duration-200",
                selectedAccent.id === color.id
                  ? "ring-2 ring-offset-2 ring-foreground scale-110"
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
        <label className="font-sans text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5" /> Mensaje personalizado (opcional)
        </label>
        <Input
          placeholder="Ej: Te amo con todo mi corazón..."
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value.slice(0, 100))}
          maxLength={100}
          className="text-sm rounded-lg border-border bg-background focus:border-foreground"
        />
        <p className="font-sans text-[10px] text-muted-foreground mt-1 text-right">{customMessage.length}/100</p>
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
      <div className="flex justify-center py-6 sm:py-8 overflow-x-auto">
        <motion.div
          key={selectedLayout.id + selectedAccent.id + selectedScriptFont.id + selectedSerifFont.id + namesPosition}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="animate-float-gentle"
        >
          {renderCard()}
        </motion.div>
      </div>

      {/* Selected indicator */}
      <div className="text-center">
        <span 
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-sans"
          style={{ backgroundColor: selectedAccent.color + "15", color: selectedAccent.color }}
        >
          <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          Seleccionado: {selectedLayout.name}
        </span>
      </div>

      {/* Download Button */}
      <div className="flex justify-center">
        <Button 
          onClick={handleDownloadCard} 
          size="lg" 
          className="gap-2 rounded-lg shadow-md w-full sm:w-auto"
        >
          <Download className="w-4 h-4 sm:w-5 sm:h-5" />
          Descargar Tarjeta
        </Button>
      </div>

      {/* Share Section */}
      <div className="pt-4 sm:pt-6 border-t border-border">
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
