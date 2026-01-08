import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, Sparkles, Clock, Music, FileText, QrCode, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const benefits = [
    "Página individual personalizada",
    "Música ambiente integrada",
    "Contador en tiempo real",
    "Carta generada con IA",
    "QR Code exclusivo",
    "Actualizaciones gratuitas",
  ];

  return (
    <main className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary fill-primary" />
            <span className="text-lg font-semibold">Forever Love</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/demo">
              <Button variant="ghost" size="sm">
                Ver Demo
              </Button>
            </Link>
            <Link to="/crear">
              <Button variant="default" size="sm">
                Comenzar
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-16">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]" />
        </div>

        <div className="relative z-10 container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Sparkles className="w-4 h-4" />
                Eterniza tu amor digitalmente
              </motion.div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold mb-6 tracking-tight">
                Tu historia de amor,{" "}
                <span className="text-gradient-cherry">eternizada digitalmente</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                Crea una página única para celebrar cada momento especial con tu amor. 
                Contador en tiempo real, música, fotos y mucho más.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/crear">
                  <Button variant="default" size="xl" className="group">
                    Crear nuestra página por $5/año
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/demo">
                  <Button variant="outline" size="xl">
                    Ver demostración
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ 
            opacity: { delay: 1, duration: 0.5 },
            y: { delay: 1.5, duration: 1.5, repeat: Infinity }
          }}
        >
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-muted-foreground/50 rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* Demo Section - Phone Mockup */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
        
        <div className="container mx-auto relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4">
              Mira cómo quedará
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Una página elegante y moderna para celebrar tu amor
            </p>
          </motion.div>

          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Phone Mockup */}
            <div className="phone-mockup w-[300px] md:w-[340px]">
              <div className="phone-mockup-screen aspect-[9/19.5] relative">
                {/* Screen Content */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background p-6 flex flex-col items-center justify-center">
                  {/* Mini Counter */}
                  <div className="mb-6">
                    <Heart className="w-10 h-10 text-primary fill-primary mx-auto mb-4 animate-heartbeat" />
                    <p className="text-sm text-muted-foreground mb-2">Maria & João</p>
                    <p className="text-2xl font-semibold text-gradient-cherry">2 Anos, 5 Meses</p>
                  </div>

                  {/* Mini Photo */}
                  <div className="w-32 h-32 rounded-2xl bg-card border border-border mb-6 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=400&auto=format&fit=crop"
                      alt="Couple"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Mini Music Player */}
                  <div className="w-full bg-card/80 rounded-xl p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Music className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-foreground font-medium">Perfect</p>
                      <p className="text-xs text-muted-foreground">Ed Sheeran</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4">
              Todo lo que necesitas
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Herramientas premium para crear el regalo digital perfecto
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Clock, title: "Contador en Tiempo Real", description: "Años, meses, días, horas y minutos desde el inicio" },
              { icon: Music, title: "Música Ambiente", description: "Elige la banda sonora de tu amor" },
              { icon: FileText, title: "Carta con IA", description: "Genera una carta única y personalizada" },
              { icon: QrCode, title: "QR Code Exclusivo", description: "Comparte fácilmente el regalo" },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-lg">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4">
              Precio simple
            </h2>
            <p className="text-lg text-muted-foreground">
              Un regalo que dura todo el año
            </p>
          </motion.div>

          <motion.div
            className="pricing-card"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative z-10">
              {/* Price */}
              <div className="text-center mb-8">
                <div className="inline-flex items-baseline gap-1">
                  <span className="text-5xl md:text-6xl font-bold text-gradient-cherry">$5</span>
                  <span className="text-muted-foreground">/año</span>
                </div>
                <p className="text-muted-foreground mt-2">Menos de $0.50 por mes</p>
              </div>

              {/* Benefits */}
              <div className="space-y-4 mb-8">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link to="/crear" className="block">
                <Button variant="default" size="xl" className="w-full">
                  Crear nuestra página ahora
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary fill-primary" />
              <span className="font-semibold">Forever Love</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Forever Love. Hecho con ❤️ para parejas enamoradas.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Index;