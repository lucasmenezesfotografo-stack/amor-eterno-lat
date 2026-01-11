import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Download, Heart, ImageIcon, Calendar, MessageSquare, LayoutGrid, Sparkles } from "lucide-react";
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
  { id: "romantic", name: "Romántico", bg: "from-rose-500/90 to-pink-600/90", accent: "#e11d48", qrColor: "#881337", texture: "none" },
  { id: "elegant", name: "Elegante", bg: "from-zinc-700/90 to-zinc-900/90", accent: "#d4af37", qrColor: "#3f3f46", texture: "none" },
  { id: "sunset", name: "Atardecer", bg: "from-orange-400/90 to-rose-500/90", accent: "#f59e0b", qrColor: "#9a3412", texture: "none" },
  { id: "ocean", name: "Océano", bg: "from-cyan-500/90 to-blue-600/90", accent: "#0ea5e9", qrColor: "#164e63", texture: "none" },
  { id: "forest", name: "Bosque", bg: "from-emerald-500/90 to-teal-600/90", accent: "#10b981", qrColor: "#14532d", texture: "none" },
  { id: "lavender", name: "Lavanda", bg: "from-purple-400/90 to-violet-600/90", accent: "#a855f7", qrColor: "#4c1d95", texture: "none" },
  { id: "gold", name: "Dorado", bg: "from-amber-500/90 to-orange-600/90", accent: "#d4af37", qrColor: "#78350f", texture: "none" },
  { id: "midnight", name: "Noche", bg: "from-indigo-800/90 to-slate-900/90", accent: "#c4b5fd", qrColor: "#1e1b4b", texture: "none" },
  // New Premium Styles
  { id: "vintage-sepia", name: "Vintage Sepia", bg: "from-amber-100/95 to-orange-100/95", accent: "#92400e", qrColor: "#78350f", texture: "sepia", isLight: true },
  { id: "modern-dark", name: "Moderno Oscuro", bg: "from-neutral-900/98 to-zinc-950/98", accent: "#f43f5e", qrColor: "#27272a", texture: "dark" },
  { id: "watercolor", name: "Acuarela", bg: "from-sky-200/90 via-pink-200/90 to-violet-200/90", accent: "#db2777", qrColor: "#6b21a8", texture: "watercolor", isLight: true },
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

  // Premium glassmorphism card styles
  const glassStyles = {
    background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
  };

  // Standard subtle texture
  const texturedBg = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  };

  // Vintage sepia paper texture
  const sepiaBg = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23a16207' fill-opacity='0.08'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  };

  // Modern dark grid texture
  const darkBg = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 20.83l2.83-2.83 1.41 1.41L1.41 22.24H0v-1.41zM0 3.07l2.83-2.83 1.41 1.41L1.41 4.48H0V3.07zm20 0l2.83-2.83 1.41 1.41L21.41 4.48H20V3.07zm0 17.76l2.83-2.83 1.41 1.41-2.83 2.83H20v-1.41zm0 17.76l2.83-2.83 1.41 1.41L21.41 40H20v-1.41zM40 3.07V4.48l-2.83-2.83-1.41 1.41 2.83 2.83v1.41l-4.24-4.24L40 0v3.07zm0 17.76V22.24l-2.83-2.83-1.41 1.41 2.83 2.83v1.41l-4.24-4.24L40 17.76v3.07zm0 17.76V40l-4.24-4.24 4.24-4.24v1.41l-2.83 2.83-1.41-1.41 2.83-2.83v1.41l-4.24 4.24L40 38.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  };

  // Watercolor organic texture
  const watercolorBg = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ec4899' fill-opacity='0.1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  };

  // Get the appropriate texture based on style
  const getTextureStyle = () => {
    switch (selectedStyle.texture) {
      case "sepia": return sepiaBg;
      case "dark": return darkBg;
      case "watercolor": return watercolorBg;
      default: return texturedBg;
    }
  };

  // Get text color based on style
  const getTextColor = () => selectedStyle.isLight ? "text-amber-900" : "text-white";
  const getSubTextColor = () => selectedStyle.isLight ? "text-amber-700" : "text-white/80";

  const renderClassicCard = () => (
    <div
      ref={cardRef}
      className={cn(
        "w-80 rounded-2xl overflow-hidden bg-gradient-to-br relative",
        selectedStyle.bg
      )}
      style={{
        boxShadow: selectedStyle.isLight 
          ? "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0,0,0,0.05)"
          : "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.1)",
        ...getTextureStyle(),
      }}
    >
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-30" style={getTextureStyle()} />
      
      {/* Vintage vignette effect for sepia */}
      {selectedStyle.texture === "sepia" && (
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(139, 69, 19, 0.15) 100%)",
        }} />
      )}
      
      {/* Watercolor paint splashes */}
      {selectedStyle.texture === "watercolor" && (
        <div className="absolute inset-0 pointer-events-none opacity-40" style={{
          background: "radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(14, 165, 233, 0.2) 0%, transparent 40%)",
        }} />
      )}
      
      {showPhoto && photoUrl && (
        <div className="relative h-44 overflow-hidden m-4 mb-0 rounded-xl">
          {/* Golden/Rose metallic frame */}
          <div 
            className="absolute inset-0 rounded-xl z-10 pointer-events-none"
            style={{
              boxShadow: `inset 0 0 0 3px ${selectedStyle.accent}40, inset 0 0 0 4px ${selectedStyle.accent}20`,
            }}
          />
          <img 
            src={photoUrl} 
            alt="Foto" 
            className={cn(
              "w-full h-full object-cover rounded-xl",
              selectedStyle.texture === "sepia" && "sepia-[0.3]"
            )}
            crossOrigin="anonymous" 
          />
          <div className={cn(
            "absolute inset-0 rounded-xl",
            selectedStyle.isLight 
              ? "bg-gradient-to-t from-amber-900/40 to-transparent"
              : "bg-gradient-to-t from-black/50 to-transparent"
          )} />
        </div>
      )}
      
      <div className={cn("p-6 text-center relative z-10", getTextColor())}>
        {/* Heart with glow effect */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className={cn("w-8 h-px", selectedStyle.isLight ? "bg-amber-800/30" : "bg-white/30")} />
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="relative"
          >
            <Heart 
              className="w-6 h-6 fill-current" 
              style={{ 
                filter: `drop-shadow(0 0 8px ${selectedStyle.accent})`,
                color: selectedStyle.accent,
              }}
            />
            <div 
              className="absolute inset-0 w-6 h-6 rounded-full blur-md opacity-50"
              style={{ backgroundColor: selectedStyle.accent }}
            />
          </motion.div>
          <div className={cn("w-8 h-px", selectedStyle.isLight ? "bg-amber-800/30" : "bg-white/30")} />
        </div>
        
        {/* Names with elegant serif font */}
        <h2 className="text-2xl font-display font-bold tracking-wide mb-1">{person1}</h2>
        <div className="flex items-center justify-center gap-3 my-2">
          <Sparkles className="w-3 h-3 opacity-60" />
          <span className="text-lg font-romantic opacity-80">&</span>
          <Sparkles className="w-3 h-3 opacity-60" />
        </div>
        <h2 className="text-2xl font-display font-bold tracking-wide mb-4">{person2}</h2>
        
        {showDate && formattedDate && (
          <p className="text-sm opacity-80 mb-3 flex items-center justify-center gap-2 font-sans">
            <Calendar className="w-3 h-3" />
            <span className="tracking-wider">{formattedDate}</span>
          </p>
        )}
        
        {customMessage && (
          <p className="text-sm font-romantic italic opacity-90 mb-4 px-3">"{customMessage}"</p>
        )}

        {/* Premium QR Code container - FIXED SIZE */}
        <div 
          className="rounded-2xl p-4 mx-auto mb-3 relative inline-block"
          style={{
            ...glassStyles,
            border: `1px solid ${selectedStyle.accent}30`,
          }}
        >
          <QRCodeSVG 
            value={qrUrl} 
            size={100} 
            level="H" 
            fgColor={selectedStyle.qrColor}
            bgColor="rgba(255,255,255,0.95)"
            className="rounded-lg block"
            includeMargin={true}
          />
        </div>
        <p className="text-[10px] opacity-60 tracking-widest uppercase font-sans">Escanea para ver nuestra historia</p>
      </div>
    </div>
  );

  const renderMinimalCard = () => (
    <div
      ref={cardRef}
      className="w-72 rounded-2xl overflow-hidden relative"
      style={{
        ...glassStyles,
        background: selectedStyle.texture === "dark" 
          ? "linear-gradient(135deg, rgba(23,23,23,0.98) 0%, rgba(10,10,10,0.98) 100%)"
          : selectedStyle.texture === "sepia"
          ? "linear-gradient(135deg, rgba(254,243,199,0.98) 0%, rgba(253,230,138,0.95) 100%)"
          : selectedStyle.texture === "watercolor"
          ? "linear-gradient(135deg, rgba(224,242,254,0.95) 0%, rgba(252,231,243,0.95) 50%, rgba(237,233,254,0.95) 100%)"
          : "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)",
        boxShadow: selectedStyle.isLight 
          ? "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0,0,0,0.05)"
          : "0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255,255,255,0.05)",
        ...getTextureStyle(),
      }}
    >
      {/* Watercolor paint splashes for minimal */}
      {selectedStyle.texture === "watercolor" && (
        <div className="absolute inset-0 pointer-events-none opacity-30" style={{
          background: "radial-gradient(circle at 10% 90%, rgba(236, 72, 153, 0.4) 0%, transparent 40%), radial-gradient(circle at 90% 10%, rgba(168, 85, 247, 0.4) 0%, transparent 40%)",
        }} />
      )}
      <div className="p-10 text-center relative z-10">
        {/* Centered heart with gradient glow */}
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={cn(
            "w-20 h-20 mx-auto rounded-full bg-gradient-to-br flex items-center justify-center mb-8 relative",
            selectedStyle.bg
          )}
          style={{
            boxShadow: `0 8px 30px ${selectedStyle.accent}40`,
          }}
        >
          <Heart className="w-10 h-10 text-white fill-white" />
          <div 
            className="absolute inset-0 rounded-full blur-xl opacity-40"
            style={{ backgroundColor: selectedStyle.accent }}
          />
        </motion.div>
        
        <h2 className={cn(
          "text-xl font-display font-semibold mb-1 tracking-wide",
          selectedStyle.texture === "dark" ? "text-white" : selectedStyle.isLight ? "text-amber-900" : "text-gray-800"
        )}>{person1}</h2>
        <span className={cn(
          "text-2xl font-romantic",
          selectedStyle.texture === "dark" ? "text-gray-400" : "text-gray-400"
        )}>&</span>
        <h2 className={cn(
          "text-xl font-display font-semibold mt-1 mb-5 tracking-wide",
          selectedStyle.texture === "dark" ? "text-white" : selectedStyle.isLight ? "text-amber-900" : "text-gray-800"
        )}>{person2}</h2>
        
        {showDate && formattedDate && (
          <p className={cn(
            "text-xs mb-4 font-sans tracking-wider",
            selectedStyle.texture === "dark" ? "text-gray-400" : "text-gray-500"
          )}>{formattedDate}</p>
        )}
        
        {customMessage && (
          <p className={cn(
            "text-sm font-romantic italic mb-5",
            selectedStyle.texture === "dark" ? "text-gray-300" : "text-gray-600"
          )}>"{customMessage}"</p>
        )}

        {/* Elegant QR container */}
        <div 
          className="rounded-2xl p-4 mx-auto inline-block"
          style={{
            border: `2px solid ${selectedStyle.accent}20`,
            backgroundColor: "rgba(255,255,255,0.9)",
          }}
        >
          <QRCodeSVG 
            value={qrUrl} 
            size={90} 
            level="H" 
            fgColor={selectedStyle.qrColor}
            bgColor="transparent"
            includeMargin={true}
          />
        </div>
      </div>
    </div>
  );

  const renderHorizontalCard = () => (
    <div
      ref={cardRef}
      className={cn(
        "w-[420px] h-52 rounded-2xl overflow-hidden bg-gradient-to-r flex relative",
        selectedStyle.bg
      )}
      style={{
        boxShadow: selectedStyle.isLight 
          ? "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0,0,0,0.05)"
          : "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.1)",
        ...getTextureStyle(),
      }}
    >
      <div className="absolute inset-0 opacity-30" style={getTextureStyle()} />
      
      {/* Vintage vignette for horizontal sepia */}
      {selectedStyle.texture === "sepia" && (
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(139, 69, 19, 0.1) 100%)",
        }} />
      )}
      
      {showPhoto && photoUrl && (
        <div className="w-1/3 h-full overflow-hidden p-3">
          <div className="relative w-full h-full rounded-xl overflow-hidden">
            <div 
              className="absolute inset-0 rounded-xl z-10 pointer-events-none"
              style={{
                boxShadow: `inset 0 0 0 3px ${selectedStyle.accent}40`,
              }}
            />
            <img 
              src={photoUrl} 
              alt="Foto" 
              className={cn(
                "w-full h-full object-cover rounded-xl",
                selectedStyle.texture === "sepia" && "sepia-[0.3]"
              )}
              crossOrigin="anonymous" 
            />
          </div>
        </div>
      )}
      
      <div className={cn("flex-1 p-5 flex relative z-10", getTextColor())}>
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Heart 
                className="w-4 h-4 fill-current" 
                style={{ 
                  filter: `drop-shadow(0 0 6px ${selectedStyle.accent})`,
                  color: selectedStyle.accent,
                }}
              />
            </motion.div>
            <span className="text-[10px] uppercase tracking-[0.2em] opacity-70 font-sans">Forever Love</span>
          </div>
          
          <h2 className="text-xl font-display font-bold leading-tight tracking-wide">{person1}</h2>
          <span className="text-sm opacity-70 font-romantic">&</span>
          <h2 className="text-xl font-display font-bold leading-tight mb-3 tracking-wide">{person2}</h2>
          
          {showDate && formattedDate && (
            <p className="text-[10px] opacity-70 font-sans tracking-wider">{formattedDate}</p>
          )}
          {customMessage && (
            <p className="text-[10px] font-romantic italic opacity-80 mt-2 line-clamp-2">"{customMessage}"</p>
          )}
        </div>
        
        <div className="flex items-center flex-shrink-0">
          <div 
            className="rounded-xl p-3"
            style={{
              ...glassStyles,
              border: `1px solid ${selectedStyle.accent}30`,
            }}
          >
            <QRCodeSVG 
              value={qrUrl} 
              size={80} 
              level="H" 
              fgColor={selectedStyle.qrColor}
              bgColor="rgba(255,255,255,0.95)"
              className="rounded-lg block"
              includeMargin={true}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPhotoFocusCard = () => (
    <div
      ref={cardRef}
      className="w-80 rounded-2xl overflow-hidden relative"
      style={{
        boxShadow: selectedStyle.isLight 
          ? "0 25px 50px -12px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0,0,0,0.05)"
          : "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.1)",
      }}
    >
      {photoUrl ? (
        <div className="relative h-80 overflow-hidden">
          {/* Metallic frame around photo */}
          <div 
            className="absolute inset-3 rounded-2xl z-10 pointer-events-none"
            style={{
              boxShadow: `inset 0 0 0 3px ${selectedStyle.accent}50, 0 0 20px ${selectedStyle.accent}20`,
            }}
          />
          <img 
            src={photoUrl} 
            alt="Foto" 
            className={cn(
              "w-full h-full object-cover",
              selectedStyle.texture === "sepia" && "sepia-[0.3]"
            )}
            crossOrigin="anonymous" 
          />
          <div className={cn(
            "absolute inset-0",
            selectedStyle.texture === "sepia" 
              ? "bg-gradient-to-t from-amber-900/90 via-amber-900/30 to-transparent"
              : "bg-gradient-to-t from-black/90 via-black/30 to-transparent"
          )} />
          
          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="inline-block mb-3"
            >
              <Heart 
                className="w-5 h-5 fill-current mx-auto" 
                style={{ 
                  filter: `drop-shadow(0 0 8px ${selectedStyle.accent})`,
                  color: selectedStyle.accent,
                }}
              />
            </motion.div>
            <h2 className="text-xl font-display font-bold tracking-wide">{person1} & {person2}</h2>
            {showDate && formattedDate && (
              <p className="text-xs opacity-80 mt-2 font-sans tracking-wider">{formattedDate}</p>
            )}
            {customMessage && (
              <p className="text-xs font-romantic italic opacity-90 mt-2">"{customMessage}"</p>
            )}
          </div>
        </div>
      ) : (
        <div className={cn("h-52 bg-gradient-to-br flex items-center justify-center relative", selectedStyle.bg)}>
          <div className="absolute inset-0 opacity-30" style={getTextureStyle()} />
          {selectedStyle.texture === "sepia" && (
            <div className="absolute inset-0 pointer-events-none" style={{
              background: "radial-gradient(ellipse at center, transparent 0%, rgba(139, 69, 19, 0.15) 100%)",
            }} />
          )}
          <div className={cn("text-center relative z-10", getTextColor())}>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="inline-block mb-3"
            >
              <Heart 
                className="w-6 h-6 fill-current mx-auto" 
                style={{ 
                  filter: `drop-shadow(0 0 8px ${selectedStyle.accent})`,
                  color: selectedStyle.accent,
                }}
              />
            </motion.div>
            <h2 className="text-xl font-display font-bold tracking-wide">{person1} & {person2}</h2>
            {showDate && formattedDate && (
              <p className="text-xs opacity-80 mt-2 font-sans tracking-wider">{formattedDate}</p>
            )}
          </div>
        </div>
      )}
      
      {/* Bottom QR section */}
      <div 
        className={cn("p-5 text-center bg-gradient-to-br relative", selectedStyle.bg)}
      >
        <div className="absolute inset-0 opacity-30" style={getTextureStyle()} />
        {selectedStyle.texture === "sepia" && (
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(ellipse at center, transparent 0%, rgba(139, 69, 19, 0.1) 100%)",
          }} />
        )}
        <div 
          className="rounded-xl p-3 mx-auto relative z-10 inline-block"
          style={{
            ...glassStyles,
            border: `1px solid ${selectedStyle.accent}30`,
          }}
        >
          <QRCodeSVG 
            value={qrUrl} 
            size={90} 
            level="H" 
            fgColor={selectedStyle.qrColor}
            bgColor="rgba(255,255,255,0.95)"
            className="rounded-lg block"
            includeMargin={true}
          />
        </div>
        <p className={cn(
          "text-[10px] mt-3 tracking-widest uppercase font-sans relative z-10",
          selectedStyle.isLight ? "text-amber-800/60" : "text-white/60"
        )}>
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h3 className="text-lg font-display font-semibold text-foreground mb-2">
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
                "px-3 py-2 rounded-xl text-xs font-medium transition-all border",
                selectedLayout.id === layout.id
                  ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/20"
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
                "w-9 h-9 rounded-full bg-gradient-to-br transition-all",
                style.bg.replace("/90", ""),
                selectedStyle.id === style.id
                  ? "ring-2 ring-offset-2 ring-primary ring-offset-background scale-110 shadow-lg"
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
          className="text-sm rounded-xl"
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
            className="text-xs rounded-xl"
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
            className="text-xs rounded-xl"
          >
            <Calendar className="w-3 h-3 mr-1" />
            Fecha
          </Button>
        )}
      </div>

      {/* Card Preview */}
      <div className="flex justify-center py-6 overflow-x-auto">
        <motion.div
          key={selectedLayout.id + selectedStyle.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {renderCard()}
        </motion.div>
      </div>

      {/* Download Button */}
      <div className="flex justify-center">
        <Button 
          onClick={handleDownloadCard} 
          size="lg" 
          className="gap-2 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
        >
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
