import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, ArrowLeft, ArrowRight, Calendar, Upload, Music, FileText, QrCode, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

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
    toast({
      title: "¡Regalo creado!",
      description: "Tu página de aniversario está lista para compartir.",
    });
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
              className="w-48 h-48 mx-auto bg-card border-2 border-border rounded-2xl flex items-center justify-center mb-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center">
                <QrCode className="w-20 h-20 mx-auto text-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Tu código QR</p>
              </div>
            </motion.div>
            <p className="text-muted-foreground mb-6">
              ¡Tu regalo está listo! Genera el código QR para compartirlo.
            </p>
            <Button variant="romantic" size="xl" onClick={handleGenerate}>
              <QrCode className="w-5 h-5" />
              Generar Código QR
            </Button>
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
