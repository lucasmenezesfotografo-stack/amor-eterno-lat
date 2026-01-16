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

  // FIXED: Export as JPG with visible background, not transparent PNG
  const handleDownloadCard = async () => {
    if (!cardRef.current) return;
    const html2canvas = (await import("html2canvas")).default;
    
    // Wait a bit for any animations to settle
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const canvas = await html2canvas(cardRef.current, {
      scale: 4,
      backgroundColor: "#FAF9F7", // IMPORTANT: Solid background for JPG
      useCORS: true,
      logging: false,
      allowTaint: true,
      scrollX: 0,
      scrollY: 0,
      windowWidth: cardRef.current.scrollWidth,
      windowHeight: cardRef.current.scrollHeight,
    });

    const link = document.createElement("a");
    link.download = `tarjeta-${person1}-${person2}.jpg`; // JPG format
    link.href = canvas.toDataURL("image/jpeg", 0.95); // High quality JPG
    link.click();
  };

  // ============================================
  // CLASSIC CARD - 10x15cm (2:3 ratio)
  // Photo on top, elegant text below with names, date, QR
  // ============================================
  const renderClassicCard = () => (
    <div
      ref={cardRef}
      className="overflow-hidden"
      style={{
        width: "300px",
        height: "450px", // 10x15cm ratio (2:3)
        backgroundColor: "#FAF9F7",
        boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
        borderRadius: "4px",
      }}
    >
      {/* Photo section - top 60% with preserved aspect ratio */}
      {showPhoto && photoUrl ? (
        <div className="relative overflow-hidden" style={{ height: "60%" }}>
          <img 
            src={photoUrl} 
            alt="Foto de pareja" 
            className="w-full h-full object-cover"
            style={{ objectPosition: "center center" }}
            crossOrigin="anonymous" 
          />
        </div>
      ) : (
        <div 
          className="flex items-center justify-center"
          style={{ height: "55%", backgroundColor: "#F0EFED" }}
        >
          <div className="text-center">
            <Heart 
              className="w-14 h-14 mx-auto mb-3 fill-current" 
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
      
      {/* Content section - bottom 40% */}
      <div className="flex flex-col justify-between p-5" style={{ height: "40%", backgroundColor: "#FAF9F7" }}>
        <div className="flex-1 flex flex-col justify-center">
          {/* Script word */}
          <p 
            className={cn("text-3xl mb-3", selectedScriptFont.className)}
            style={{ color: selectedAccent.color, fontFamily: selectedScriptFont.fontFamily }}
          >
            Forever
          </p>
          
          {/* Names and Date row */}
          <div className="flex items-start justify-between">
            <div>
              <p 
                className={cn("text-sm font-medium tracking-wide uppercase mb-1", selectedSerifFont.className)}
                style={{ 
                  fontFamily: selectedSerifFont.fontFamily, 
                  letterSpacing: "0.08em",
                  color: "#2D2D2D",
                }}
              >
                {person1} & {person2}
              </p>
              {showDate && formattedDate && (
                <p style={{ fontFamily: "system-ui, sans-serif", fontSize: "12px", color: "#6B6B6B" }}>
                  {formattedDate}
                </p>
              )}
            </div>
            
            {/* QR Code */}
            <div className="flex flex-col items-center">
              <div className="p-2 bg-white rounded" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                <QRCodeSVG 
                  value={qrUrl} 
                  size={65} 
                  level="H" 
                  fgColor="#2D2D2D"
                  bgColor="#FFFFFF"
                  includeMargin={false}
                />
              </div>
              <p style={{ fontFamily: "system-ui, sans-serif", fontSize: "8px", color: "#6B6B6B", marginTop: "6px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Escanea aquí
              </p>
            </div>
          </div>
        </div>
        
        {/* Custom message */}
        {customMessage && (
          <p 
            className={cn("text-xs italic mt-3 text-center", selectedSerifFont.className)}
            style={{ fontFamily: selectedSerifFont.fontFamily, color: "#6B6B6B" }}
          >
            "{customMessage}"
          </p>
        )}
      </div>
    </div>
  );

  // ============================================
  // MINIMAL CARD - 10x15cm (2:3 ratio)
  // Clean, centered, "Capture the love" style
  // ============================================
  const renderMinimalCard = () => (
    <div
      ref={cardRef}
      className="overflow-hidden flex flex-col items-center justify-center"
      style={{
        width: "280px",
        height: "420px", // 10x15cm ratio (2:3)
        backgroundColor: "#FAF9F7",
        boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
        borderRadius: "4px",
      }}
    >
      <div className="flex flex-col items-center justify-center h-full px-8 py-10 text-center">
        {/* Top text */}
        <p style={{ fontFamily: "system-ui, sans-serif", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#2D2D2D", marginBottom: "16px" }}>
          Captura el
        </p>
        
        {/* Main script word */}
        <p 
          className={cn("text-5xl mb-10", selectedScriptFont.className)}
          style={{ color: selectedAccent.color, fontFamily: selectedScriptFont.fontFamily }}
        >
          amor
        </p>
        
        {/* QR Code - PROTAGONIST */}
        <div className="p-4 bg-white rounded-lg mb-10" style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
          <QRCodeSVG 
            value={qrUrl} 
            size={140} 
            level="H" 
            fgColor="#2D2D2D"
            bgColor="#FFFFFF"
            includeMargin={false}
          />
        </div>
        
        {/* Instructions */}
        <p style={{ fontFamily: "system-ui, sans-serif", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#2D2D2D", fontWeight: "500", marginBottom: "6px" }}>
          ¡Escanea y descubre!
        </p>
        <p style={{ fontFamily: "system-ui, sans-serif", fontSize: "9px", color: "#6B6B6B", lineHeight: "1.6", maxWidth: "180px" }}>
          Escanea el código QR para ver nuestra historia de amor
        </p>
        
        {/* Names - subtle at bottom */}
        <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #E8E6E3", width: "100%" }}>
          <p 
            className={cn("text-sm font-medium", selectedSerifFont.className)}
            style={{ fontFamily: selectedSerifFont.fontFamily, color: "#2D2D2D" }}
          >
            {person1} & {person2}
          </p>
          {showDate && formattedDate && (
            <p style={{ fontFamily: "system-ui, sans-serif", fontSize: "10px", color: "#6B6B6B", marginTop: "4px" }}>
              {formattedDate}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  // ============================================
  // HORIZONTAL CARD - 15x10cm (3:2 ratio)
  // Photo on left, elegant text with message and QR on right
  // ============================================
  const renderHorizontalCard = () => (
    <div
      ref={cardRef}
      className="overflow-hidden flex"
      style={{
        width: "450px",
        height: "280px", // 15x10cm ratio (approximately 3:2)
        backgroundColor: "#FAF9F7",
        boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
        borderRadius: "4px",
      }}
    >
      {/* Left - Photo (50%) with proper aspect ratio */}
      {showPhoto && photoUrl ? (
        <div className="w-1/2 h-full overflow-hidden">
          <img 
            src={photoUrl} 
            alt="Foto de pareja" 
            className="w-full h-full object-cover"
            style={{ objectPosition: "center center" }}
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
              className="w-12 h-12 mx-auto mb-3 fill-current" 
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
      <div className="w-1/2 h-full flex flex-col justify-between p-4" style={{ backgroundColor: "#FAF9F7" }}>
        {/* Message area */}
        <div className="flex-1 flex flex-col justify-center">
          <p 
            className={cn("text-xs leading-relaxed mb-3", selectedSerifFont.className)}
            style={{ fontFamily: selectedSerifFont.fontFamily, color: "#4A4A4A" }}
          >
            {customMessage || "Nuestros corazones están llenos de amor y gratitud. Gracias por ser parte de nuestra historia."}
          </p>
          
          {/* Signature */}
          <p style={{ fontFamily: "system-ui, sans-serif", fontSize: "10px", color: "#6B6B6B", marginBottom: "2px" }}>
            Con todo nuestro amor,
          </p>
          <p 
            className={cn("text-lg", selectedScriptFont.className)}
            style={{ color: selectedAccent.color, fontFamily: selectedScriptFont.fontFamily }}
          >
            {person1} & {person2}
          </p>
        </div>
        
        {/* QR Code area */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E8E6E3]">
          <div className="flex flex-col items-start">
            <div className="p-1.5 bg-white rounded" style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}>
              <QRCodeSVG 
                value={qrUrl} 
                size={48} 
                level="H" 
                fgColor="#2D2D2D"
                bgColor="#FFFFFF"
                includeMargin={false}
              />
            </div>
            <p style={{ fontFamily: "system-ui, sans-serif", fontSize: "7px", color: "#6B6B6B", marginTop: "4px", lineHeight: "1.3" }}>
              Escanea aquí
            </p>
          </div>
          
          {showDate && formattedDate && (
            <p style={{ fontFamily: "system-ui, sans-serif", fontSize: "9px", color: "#6B6B6B" }}>
              {formattedDate}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  // ============================================
  // PHOTO FOCUS CARD - Modern/Digital
  // ============================================
  const renderPhotoFocusCard = () => (
    <div
      ref={cardRef}
      className="overflow-hidden relative"
      style={{
        width: "300px",
        backgroundColor: "#FAF9F7",
        boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
        borderRadius: "12px",
      }}
    >
      {photoUrl ? (
        <div className="relative overflow-hidden" style={{ height: "280px" }}>
          <img 
            src={photoUrl} 
            alt="Foto" 
            className="w-full h-full object-cover"
            style={{ objectPosition: "center center" }}
            crossOrigin="anonymous" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          
          <div className={cn(
            "absolute left-0 right-0 p-4 text-white text-center",
            namesPosition === "top" ? "top-0 pt-6" :
            namesPosition === "bottom" ? "bottom-0 pb-4" :
            "top-1/2 -translate-y-1/2"
          )}>
            <Heart 
              className="w-4 h-4 fill-current mx-auto mb-2" 
              style={{ 
                color: selectedAccent.color,
              }}
            />
            <h2 className="text-lg font-serif font-semibold tracking-wide">
              {person1} & {person2}
            </h2>
            {showDate && formattedDate && (
              <p className="text-[10px] opacity-80 mt-1.5 font-sans tracking-wider">
                {formattedDate}
              </p>
            )}
            {customMessage && (
              <p className="text-[10px] italic opacity-90 mt-1.5 font-serif">
                "{customMessage}"
              </p>
            )}
          </div>
        </div>
      ) : (
        <div style={{ height: "200px" }} className="bg-gradient-to-br from-rose-500/90 to-pink-600/90 flex items-center justify-center relative">
          <div className="text-center text-white">
            <Heart 
              className="w-5 h-5 fill-current mx-auto mb-2" 
              style={{ 
                color: "white",
              }}
            />
            <h2 className="text-lg font-serif font-semibold tracking-wide">
              {person1} & {person2}
            </h2>
            {showDate && formattedDate && (
              <p className="text-[10px] opacity-80 mt-1.5 font-sans tracking-wider">
                {formattedDate}
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* QR Code Section - Always visible with fixed height */}
      <div 
        className="text-center flex flex-col items-center justify-center" 
        style={{ 
          backgroundColor: "#FAF9F7", 
          padding: "16px",
          minHeight: "130px",
        }}
      >
        <div 
          className="mx-auto inline-block bg-white"
          style={{
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            borderRadius: "8px",
            padding: "8px",
          }}
        >
          <QRCodeSVG 
            value={qrUrl} 
            size={80} 
            level="H" 
            fgColor="#2D2D2D"
            bgColor="#FFFFFF"
            includeMargin={false}
          />
        </div>
        <p style={{ fontFamily: "system-ui, sans-serif", fontSize: "9px", color: "#6B6B6B", marginTop: "10px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
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
            <div className="w-full h-full flex flex-col bg-[#FAF9F7]">
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
              <div className="text-[5px] text-[#2D2D2D]/60 mb-0.5">CAPTURA EL</div>
              <div className="text-[8px] font-script mb-1" style={{ color: selectedAccent.color }}>amor</div>
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
        <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
          Elige tu diseño de tarjeta
        </h3>
        <p className="text-sm text-muted-foreground">
          Personaliza y descarga tu tarjeta para imprimir
        </p>
      </div>

      {/* Layout Selector */}
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-1.5">
          <LayoutGrid className="w-3.5 h-3.5" /> Estilo de tarjeta
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
        <label className="text-xs font-medium text-muted-foreground mb-3 block">
          Color de acento
        </label>
        <div className="flex flex-wrap justify-center gap-2">
          {accentColors.map((color) => (
            <button
              key={color.id}
              onClick={() => setSelectedAccent(color)}
              className={cn(
                "w-8 h-8 rounded-full transition-all duration-200 shadow-sm",
                selectedAccent.id === color.id
                  ? "ring-2 ring-offset-2 ring-foreground scale-110"
                  : "opacity-70 hover:opacity-100 hover:scale-105"
              )}
              style={{ backgroundColor: color.color }}
              title={color.name}
              aria-label={`Seleccionar color ${color.name}`}
            />
          ))}
        </div>
      </div>

      {/* Custom Message */}
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5" /> Mensaje personalizado (opcional)
        </label>
        <Input
          placeholder="Ej: Te amo con todo mi corazón..."
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value.slice(0, 100))}
          maxLength={100}
          className="text-sm"
        />
        <p className="text-[10px] text-muted-foreground mt-1 text-right">{customMessage.length}/100</p>
      </div>

      {/* Toggle Options */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {photoUrl && (
          <Button
            variant={showPhoto ? "default" : "outline"}
            size="sm"
            onClick={() => setShowPhoto(!showPhoto)}
            className="min-w-[80px] sm:min-w-[100px] h-9 sm:h-10 text-xs sm:text-sm px-3 sm:px-4"
          >
            <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
            Foto
          </Button>
        )}
        {startDate && (
          <Button
            variant={showDate ? "default" : "outline"}
            size="sm"
            onClick={() => setShowDate(!showDate)}
            className="min-w-[80px] sm:min-w-[100px] h-9 sm:h-10 text-xs sm:text-sm px-3 sm:px-4"
          >
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
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
        >
          {renderCard()}
        </motion.div>
      </div>

      {/* Selected indicator */}
      <div className="text-center">
        <span 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium"
          style={{ backgroundColor: selectedAccent.color + "15", color: selectedAccent.color }}
        >
          <Check className="w-3 h-3" />
          Estilo seleccionado: {selectedLayout.name}
        </span>
      </div>

      {/* Download Button */}
      <div className="flex justify-center px-4 sm:px-0">
        <Button 
          onClick={handleDownloadCard} 
          size="lg" 
          className="gap-2 shadow-md w-full sm:w-auto min-h-[48px] sm:min-h-[52px] text-sm sm:text-base px-6 sm:px-8"
        >
          <Download className="w-5 h-5 sm:w-6 sm:h-6" />
          Descargar Tarjeta (JPG)
        </Button>
      </div>

      {/* Share Section */}
      <div className="pt-6 border-t border-border">
        <ShareButtons 
          url={qrUrl}
          title={`${person1} & ${person2} - Memory Link`}
          description="Mira nuestra página de amor ❤️"
        />
      </div>
    </motion.div>
  );
};

export default PersonalizedCard;
