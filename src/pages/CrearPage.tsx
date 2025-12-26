import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, ArrowLeft, ArrowRight, Calendar, Upload, Music, FileText, QrCode, Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { QRCodeSVG } from "qrcode.react";

const steps = [
  { id: 1, title: "Nombres", icon: Heart, description: "¿Cómo se llaman?" },
  { id: 2, title: "Fecha", icon: Calendar, description: "¿Cuándo comenzó su historia?" },
  { id: 3, title: "Fotos", icon: Upload, description: "Sus momentos favoritos" },
  { id: 4, title: "Música", icon: Music, description: "La canción de su amor" },
  { id: 5, title: "Carta", icon: FileText, description: "Palabras desde el corazón" },
  { id: 6, title: "Generar", icon: QrCode, description: "Crea tu código QR" },
];

const CrearPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    person1: "",
    person2: "",
    startDate: "",
    photos: [] as File[],
    spotifyUrl: "",
    loveLetter: "",
  });
  const [qrGenerated, setQrGenerated] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Generate a unique ID for the regalo page
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
      title: "¡Regalo creado!",
      description: "Tu código QR está listo para descargar.",
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
        // Draw rounded background
        ctx.fillStyle = "#FDF8F4";
        ctx.beginPath();
        ctx.roundRect(0, 0, 400, 400, 20);
        ctx.fill();
        
        // Draw QR code centered
        ctx.drawImage(img, 50, 50, 300, 300);
        
        // Add decorative text
        ctx.fillStyle = "#C17A5E";
        ctx.font = "bold 18px 'Playfair Display', serif";
        ctx.textAlign = "center";
        ctx.fillText(`${formData.person1} ❤ ${formData.person2}`, 200, 385);
      }

      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `tu-amor-lat-${formData.person1}-${formData.person2}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nombre de la primera persona
              </label>
              <Input
                placeholder="Ej: María"
                value={formData.person1}
                onChange={(e) => setFormData({ ...formData, person1: e.target.value })}
                className="text-lg h-14"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nombre de la segunda persona
              </label>
              <Input
                placeholder="Ej: Carlos"
                value={formData.person2}
                onChange={(e) => setFormData({ ...formData, person2: e.target.value })}
                className="text-lg h-14"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              ¿Cuándo comenzó su relación?
            </label>
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="text-lg h-14"
            />
            {formData.startDate && (
              <motion.p
                className="mt-4 text-center text-muted-foreground"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {new Date(formData.startDate).toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </motion.p>
            )}
          </div>
        );

      case 3:
        return (
          <div>
            <label className="block text-sm font-medium text-foreground mb-4">
              Sube las fotos de sus momentos favoritos
            </label>
            <div className="border-2 border-dashed border-border rounded-2xl p-8 md:p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-2">
                Arrastra tus fotos aquí o haz clic para seleccionar
              </p>
              <p className="text-sm text-muted-foreground">
                Formatos: JPG, PNG (máx. 5MB cada una)
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) {
                    setFormData({ ...formData, photos: Array.from(e.target.files) });
                  }
                }}
              />
            </div>
            {formData.photos.length > 0 && (
              <p className="mt-4 text-sm text-muted-foreground">
                {formData.photos.length} foto(s) seleccionada(s)
              </p>
            )}
          </div>
        );

      case 4:
        return (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Enlace de Spotify o URL de la canción
            </label>
            <Input
              placeholder="https://open.spotify.com/track/..."
              value={formData.spotifyUrl}
              onChange={(e) => setFormData({ ...formData, spotifyUrl: e.target.value })}
              className="text-lg h-14"
            />
            <p className="mt-4 text-sm text-muted-foreground">
              Pega el enlace de Spotify de la canción que representa su amor
            </p>
          </div>
        );

      case 5:
        return (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Escribe tu carta de amor
            </label>
            <Textarea
              placeholder="Mi amor, desde el primer momento que te vi..."
              value={formData.loveLetter}
              onChange={(e) => setFormData({ ...formData, loveLetter: e.target.value })}
              className="min-h-[250px] text-lg font-serif"
            />
            <p className="mt-4 text-sm text-muted-foreground">
              {formData.loveLetter.length} caracteres
            </p>
          </div>
        );

      case 6:
        return (
          <div className="text-center">
            <motion.div
              ref={qrRef}
              className="w-64 h-64 mx-auto bg-cream-warm border-2 border-primary/20 rounded-2xl flex items-center justify-center mb-6 p-4 shadow-romantic"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {qrGenerated ? (
                <QRCodeSVG
                  value={regaloUrl}
                  size={200}
                  level="H"
                  includeMargin={false}
                  fgColor="#C17A5E"
                  bgColor="transparent"
                  imageSettings={{
                    src: "",
                    height: 40,
                    width: 40,
                    excavate: true,
                  }}
                />
              ) : (
                <div className="text-center">
                  <QrCode className="w-20 h-20 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Tu código QR</p>
                </div>
              )}
            </motion.div>
            
            {qrGenerated && (
              <motion.p
                className="text-sm text-muted-foreground mb-4 break-all px-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {regaloUrl}
              </motion.p>
            )}
            
            <p className="text-muted-foreground mb-6">
              {qrGenerated 
                ? `¡El regalo de ${formData.person1} y ${formData.person2} está listo!`
                : "¡Tu regalo está listo! Genera el código QR para compartirlo."
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!qrGenerated ? (
                <Button variant="romantic" size="xl" onClick={handleGenerate}>
                  <QrCode className="w-5 h-5" />
                  Generar Código QR
                </Button>
              ) : (
                <>
                  <Button variant="gold" size="lg" onClick={handleDownloadQR}>
                    <Download className="w-5 h-5" />
                    Descargar QR
                  </Button>
                  <Link to={`/regalo/demo`}>
                    <Button variant="glass" size="lg">
                      Ver página de regalo
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="py-6 px-4 border-b border-border">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-accent fill-accent/30" />
            <span className="text-xl font-serif font-bold text-gradient-romantic">Tu Amor Lat</span>
          </Link>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="py-8 px-4 border-b border-border bg-cream-warm/50">
        <div className="container mx-auto">
          <div className="flex justify-between items-center max-w-3xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center relative">
                <motion.div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-colors ${
                    currentStep >= step.id
                      ? "bg-gradient-to-r from-primary to-accent"
                      : "bg-secondary"
                  }`}
                  whileHover={{ scale: 1.1 }}
                >
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5 text-primary-foreground" />
                  ) : (
                    <step.icon
                      className={`w-5 h-5 ${
                        currentStep >= step.id ? "text-primary-foreground" : "text-muted-foreground"
                      }`}
                    />
                  )}
                </motion.div>
                <span
                  className={`hidden md:block text-xs mt-2 ${
                    currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </span>
                
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`absolute top-5 left-full w-full h-0.5 -translate-x-1/2 hidden md:block ${
                      currentStep > step.id ? "bg-primary" : "bg-border"
                    }`}
                    style={{ width: "calc(100% - 48px)", left: "calc(50% + 24px)" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto max-w-xl">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-10">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-foreground mb-2">
                {steps[currentStep - 1].title}
              </h1>
              <p className="text-muted-foreground">{steps[currentStep - 1].description}</p>
            </div>

            <div className="glass-card p-6 md:p-8">
              {renderStepContent()}
            </div>
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="glass"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={currentStep === 1 ? "invisible" : ""}
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </Button>

            {currentStep < steps.length && (
              <Button variant="romantic" onClick={handleNext}>
                Siguiente
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
