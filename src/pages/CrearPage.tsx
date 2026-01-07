import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, ArrowLeft, ArrowRight, Calendar, Upload, Music, FileText, QrCode, Check, Download, CheckCircle, AlertCircle, Sparkles, Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";
import SpotifyEmbed from "@/components/SpotifyEmbed";

// Free romantic songs list
const freeSongs = [
  { id: 1, title: "Perfect", artist: "Ed Sheeran", duration: "4:23" },
  { id: 2, title: "All of Me", artist: "John Legend", duration: "4:29" },
  { id: 3, title: "Thinking Out Loud", artist: "Ed Sheeran", duration: "4:41" },
  { id: 4, title: "A Thousand Years", artist: "Christina Perri", duration: "4:45" },
  { id: 5, title: "Can't Help Falling in Love", artist: "Elvis Presley", duration: "3:00" },
  { id: 6, title: "At Last", artist: "Etta James", duration: "3:02" },
];

// Validate Spotify URL
const validateSpotifyUrl = (url: string): { isValid: boolean; type?: string; id?: string } => {
  if (!url || url.trim() === "") return { isValid: false };
  const patterns = [
    /spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/,
    /spotify\.com\/embed\/(track|album|playlist)\/([a-zA-Z0-9]+)/,
    /spotify:(track|album|playlist):([a-zA-Z0-9]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return { isValid: true, type: match[1], id: match[2] };
  }
  return { isValid: false };
};

const steps = [
  { id: 1, title: "Nombres", icon: Heart, description: "¿Quiénes son ustedes?" },
  { id: 2, title: "Foto y Música", icon: Upload, description: "Elige una foto y una canción" },
  { id: 3, title: "Carta", icon: FileText, description: "Escribe o genera con IA" },
];

const CrearPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    person1: "",
    person2: "",
    startDate: "",
    photoUrl: "",
    selectedSong: null as number | null,
    spotifyUrl: "",
    loveLetter: "",
  });
  const [qrGenerated, setQrGenerated] = useState(false);
  const [isGeneratingLetter, setIsGeneratingLetter] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const qrRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const spotifyValidation = useMemo(() => validateSpotifyUrl(formData.spotifyUrl), [formData.spotifyUrl]);

  const generateRegaloId = () => {
    const names = `${formData.person1}-${formData.person2}`.toLowerCase().replace(/\s+/g, '-');
    const timestamp = Date.now().toString(36);
    return `${names}-${timestamp}`;
  };

  const regaloUrl = `${window.location.origin}/regalo/${generateRegaloId()}`;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = () => {
    setQrGenerated(true);
    toast({
      title: "¡Página creada!",
      description: "Tu QR Code está listo para descargar.",
    });
  };

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
        ctx.fillText(`${formData.person1} ❤ ${formData.person2}`, 200, 385);
      }
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `forever-love-${formData.person1}-${formData.person2}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleGenerateAILetter = () => {
    setIsGeneratingLetter(true);
    const letterTemplates = [
      `Mi amor ${formData.person2},\n\nDesde el día ${formData.startDate ? new Date(formData.startDate).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }) : "en que nos conocimos"}, mi vida cobró un nuevo significado.\n\nCada momento a tu lado es un regalo que guardo en el corazón. Tú me haces querer ser una mejor persona cada día, y contigo descubrí el verdadero significado del amor.\n\nGracias por elegir construir esta historia conmigo. Prometo seguir amándote con la misma intensidad de siempre.\n\nCon todo mi amor,\n${formData.person1}`,
      `${formData.person2}, mi gran amor,\n\nLas palabras parecen pequeñas para describir lo que siento por ti. Desde ${formData.startDate ? new Date(formData.startDate).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }) : "que entraste en mi vida"}, cada día es una nueva aventura.\n\nEres mi paz en medio del caos, mi sonrisa en las mañanas difíciles, y mi certeza de que el amor verdadero existe.\n\nQue podamos construir mil memorias más juntos.\n\nTe amo infinitamente,\n${formData.person1}`,
    ];

    const randomLetter = letterTemplates[Math.floor(Math.random() * letterTemplates.length)];
    
    // Simulate typing effect
    let index = 0;
    const interval = setInterval(() => {
      setGeneratedText(randomLetter.slice(0, index));
      index++;
      if (index > randomLetter.length) {
        clearInterval(interval);
        setFormData({ ...formData, loveLetter: randomLetter });
        setIsGeneratingLetter(false);
      }
    }, 20);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Primer nombre
              </label>
              <Input
                placeholder="Ej: María"
                value={formData.person1}
                onChange={(e) => setFormData({ ...formData, person1: e.target.value })}
                className="input-premium"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Segundo nombre
              </label>
              <Input
                placeholder="Ej: Juan"
                value={formData.person2}
                onChange={(e) => setFormData({ ...formData, person2: e.target.value })}
                className="input-premium"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Fecha de inicio de la relación
              </label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="input-premium"
              />
              {formData.startDate && (
                <motion.p
                  className="mt-3 text-sm text-muted-foreground"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  📅 {new Date(formData.startDate).toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </motion.p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Foto de portada
              </label>
              <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer bg-secondary/30">
                <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                <p className="text-foreground font-medium mb-1">
                  Arrastra una foto o haz clic para seleccionar
                </p>
                <p className="text-sm text-muted-foreground">
                  JPG, PNG (máx. 5MB)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            {/* Music Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Elige una canción romántica
              </label>
              <div className="space-y-2">
                {freeSongs.map((song) => (
                  <motion.div
                    key={song.id}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all",
                      formData.selectedSong === song.id
                        ? "bg-primary/20 border border-primary/50"
                        : "bg-secondary/50 border border-transparent hover:bg-secondary"
                    )}
                    onClick={() => setFormData({ ...formData, selectedSong: song.id })}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      {formData.selectedSong === song.id ? (
                        <Check className="w-5 h-5 text-primary" />
                      ) : (
                        <Play className="w-4 h-4 text-primary ml-0.5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{song.title}</p>
                      <p className="text-sm text-muted-foreground">{song.artist}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{song.duration}</span>
                  </motion.div>
                ))}
              </div>

              {/* Or Spotify Link */}
              <div className="mt-6 pt-6 border-t border-border">
                <label className="block text-sm font-medium text-foreground mb-2">
                  O pega un link de Spotify
                </label>
                <div className="relative">
                  <Input
                    placeholder="https://open.spotify.com/track/..."
                    value={formData.spotifyUrl}
                    onChange={(e) => setFormData({ ...formData, spotifyUrl: e.target.value, selectedSong: null })}
                    className={cn(
                      "input-premium pr-12",
                      formData.spotifyUrl && spotifyValidation.isValid && "border-green-500 focus:ring-green-500/20",
                      formData.spotifyUrl && !spotifyValidation.isValid && "border-destructive focus:ring-destructive/20"
                    )}
                  />
                  {formData.spotifyUrl && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {spotifyValidation.isValid ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"
                        >
                          <Check className="w-4 h-4 text-white" />
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 rounded-full bg-destructive flex items-center justify-center"
                        >
                          <AlertCircle className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
                
                {spotifyValidation.isValid && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4"
                  >
                    <SpotifyEmbed spotifyUrl={formData.spotifyUrl} compact />
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* AI Generate Button */}
            <div className="flex justify-center mb-6">
              <Button
                variant="outline"
                onClick={handleGenerateAILetter}
                disabled={isGeneratingLetter || !formData.person1 || !formData.person2}
                className="gap-2"
              >
                {isGeneratingLetter ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generando carta mágica...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generar carta mágica con IA
                  </>
                )}
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tu carta de amor
              </label>
              <Textarea
                placeholder="Escribe tu carta aquí o usa la IA para generar..."
                value={isGeneratingLetter ? generatedText : formData.loveLetter}
                onChange={(e) => setFormData({ ...formData, loveLetter: e.target.value })}
                className="min-h-[300px] text-base bg-secondary border-border rounded-xl resize-none"
                disabled={isGeneratingLetter}
              />
              <p className="mt-3 text-sm text-muted-foreground">
                {formData.loveLetter.length} caracteres
              </p>
            </div>

            {/* Generate QR Section */}
            {formData.loveLetter && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-8 border-t border-border"
              >
                <div className="text-center">
                  <motion.div
                    ref={qrRef}
                    className="w-56 h-56 mx-auto bg-card border border-border rounded-2xl flex items-center justify-center mb-6 p-4"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                  {qrGenerated ? (
                      <QRCodeSVG
                        value={regaloUrl}
                        size={180}
                        level="H"
                        includeMargin={false}
                        fgColor="#e11d48"
                        bgColor="transparent"
                      />
                    ) : (
                      <div className="text-center">
                        <QrCode className="w-16 h-16 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Tu QR Code</p>
                      </div>
                    )}
                  </motion.div>
                  
                  {qrGenerated && (
                    <motion.p
                      className="text-xs text-muted-foreground mb-4 break-all px-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {regaloUrl}
                    </motion.p>
                  )}
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {!qrGenerated ? (
                      <Button variant="default" size="lg" onClick={handleGenerate}>
                        <QrCode className="w-5 h-5" />
                        Generar QR Code
                      </Button>
                    ) : (
                      <>
                        <Button variant="default" size="lg" onClick={handleDownloadQR}>
                          <Download className="w-5 h-5" />
                          Descargar QR Code
                        </Button>
                        <Link to={`/regalo/demo`}>
                          <Button variant="outline" size="lg">
                            Ver página
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary fill-primary" />
            <span className="font-semibold">Forever Love</span>
          </Link>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="border-b border-border bg-card/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center items-center gap-4 md:gap-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <motion.div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                      currentStep >= step.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    )}
                    whileHover={{ scale: 1.05 }}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </motion.div>
                  <span className={cn(
                    "text-xs mt-2 hidden md:block",
                    currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "w-12 md:w-24 h-0.5 mx-2 md:mx-4",
                    currentStep > step.id ? "bg-primary" : "bg-border"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                  {steps[currentStep - 1].title}
                </h1>
                <p className="text-muted-foreground">{steps[currentStep - 1].description}</p>
              </div>

              <div className="glass-card p-6 md:p-8">
                {renderStepContent()}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={currentStep === 1 ? "invisible" : ""}
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </Button>

            {currentStep < steps.length && (
              <Button variant="default" onClick={handleNext}>
                Próximo
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default CrearPage;