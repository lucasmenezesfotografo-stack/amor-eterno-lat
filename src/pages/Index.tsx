import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Sparkles, Clock, Music, FileText, QrCode, Check, ArrowRight, Play, 
  Calendar, MessageSquareHeart, Heart, Shield, Lock, Star, Users,
  Gift, Share2, Smartphone, Image, ChevronDown, Mail, Instagram
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import memoryLinkLogo from "@/assets/memory-link-logo.png";
import demoCoupleImage from "@/assets/demo-couple.jpg";

const Index = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.1 } },
    viewport: { once: true }
  };

  return (
    <main className="min-h-screen bg-background overflow-hidden">
      {/* Navigation - Glassmorphism */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img 
              src={memoryLinkLogo} 
              alt="Memory Link" 
              className="w-10 h-10 object-contain transition-transform group-hover:scale-110" 
            />
            <span className="text-lg font-semibold tracking-tight">Memory Link</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/demo">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                Ver ejemplo
              </Button>
            </Link>
            <Link to="/crear">
              <Button variant="default" size="sm">
                Crear mi página
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ========== HERO SECTION ========== */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 pb-16">
        {/* Premium Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-background" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-primary/15 blur-[150px] opacity-60" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-rose-500/10 blur-[120px]" />
        </div>

        {/* Floating Hearts Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.4, 0.2],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            >
              <Heart className="w-4 h-4 text-primary/30 fill-primary/20" />
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Trust Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-card/60 backdrop-blur-xl border border-border/50 rounded-full px-4 py-2 mb-8"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Miles de historias creadas 💕</span>
              </motion.div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-[1.1]">
                Crea una página única{" "}
                <span className="relative">
                  <span className="bg-gradient-to-r from-primary via-rose-400 to-primary bg-clip-text text-transparent">
                    para la persona que amas
                  </span>
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                Fotos, música, contador de amor y una carta que queda para siempre.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Link to="/crear">
                  <Button variant="default" size="xl" className="group min-w-[220px] h-14 text-base">
                    <Gift className="w-5 h-5 mr-2" />
                    Crear mi página
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/demo">
                  <Button variant="outline" size="xl" className="min-w-[180px] h-14 text-base">
                    <Play className="w-5 h-5 mr-2" />
                    Ver ejemplo
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Pago seguro</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>Listo en 5 minutos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-primary fill-primary" />
                  <span>Solo $5/año</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2 cursor-pointer"
          >
            <span className="text-xs text-muted-foreground">Descubre más</span>
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </motion.div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
        
        <div className="container mx-auto relative z-10">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="inline-block text-primary text-sm font-semibold tracking-wider uppercase mb-4">
              Así de fácil
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Crea tu regalo en 3 pasos
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Sin complicaciones. Tu página lista en minutos.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 max-w-5xl mx-auto">
            {[
              {
                icon: Calendar,
                step: "01",
                title: "Elige nombres y fecha",
                description: "Ingresa sus nombres y la fecha especial que quieres celebrar."
              },
              {
                icon: Image,
                step: "02",
                title: "Sube fotos y música",
                description: "Agrega sus fotos favoritas y elige la música perfecta."
              },
              {
                icon: Share2,
                step: "03",
                title: "Comparte el regalo",
                description: "Recibe un link único o QR para sorprender a tu amor."
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
              >
                <Card className="relative h-full p-8 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 hover:bg-card/80 transition-all duration-300 group">
                  {/* Step Number */}
                  <span className="absolute top-6 right-6 text-6xl font-bold text-primary/10 group-hover:text-primary/20 transition-colors">
                    {item.step}
                  </span>
                  
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PHONE PREVIEW SECTION ========== */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px]" />
        </div>
        
        <div className="container mx-auto relative z-10">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="inline-block text-primary text-sm font-semibold tracking-wider uppercase mb-4">
              Vista previa
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
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
            {/* Premium Phone Mockup */}
            <div className="relative">
              <div className="relative w-[280px] sm:w-[320px] md:w-[360px]">
                <div className="relative bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-[3rem] p-2 shadow-2xl shadow-black/50">
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-20" />
                  
                  <div className="relative bg-gradient-to-b from-background to-card rounded-[2.5rem] overflow-hidden aspect-[9/19]">
                    <div className="absolute inset-0">
                      <img src={demoCoupleImage} alt="Couple" className="w-full h-full object-cover opacity-40" />
                      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
                    </div>
                    
                    <div className="relative z-10 h-full flex flex-col p-5 pt-12">
                      <motion.div
                        className="flex justify-center mb-4"
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <div className="w-14 h-14 rounded-full bg-primary/20 backdrop-blur-xl flex items-center justify-center">
                          <Heart className="w-7 h-7 text-primary fill-primary" />
                        </div>
                      </motion.div>
                      
                      <div className="text-center mb-4">
                        <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                          Sofía <span className="text-primary">&</span> Miguel
                        </h3>
                        <div className="flex items-center justify-center gap-1.5 mt-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>Juntos desde 15 de junio, 2021</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {[
                          { value: "3", label: "Años" },
                          { value: "6", label: "Meses" },
                          { value: "24", label: "Días" }
                        ].map((item) => (
                          <div
                            key={item.label}
                            className="bg-card/80 backdrop-blur-sm rounded-xl p-2 text-center border border-border/50"
                          >
                            <p className="text-lg sm:text-xl font-bold text-primary">{item.value}</p>
                            <p className="text-[10px] text-muted-foreground">{item.label}</p>
                          </div>
                        ))}
                      </div>
                      
                      <div className="relative rounded-xl overflow-hidden mb-4 flex-shrink-0">
                        <img src={demoCoupleImage} alt="Couple photo" className="w-full h-28 object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2">
                          <MessageSquareHeart className="w-3 h-3 text-primary" />
                          <span className="text-[10px] text-foreground/80">Carta de amor incluida</span>
                        </div>
                      </div>
                      
                      <div className="mt-auto bg-card/90 backdrop-blur-xl rounded-xl p-3 flex items-center gap-3 border border-border/50">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
                            <Music className="w-5 h-5 text-white" />
                          </div>
                          <motion.div
                            className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"
                            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground truncate">Romantic Piano</p>
                          <p className="text-[10px] text-muted-foreground truncate">♪ Reproduciendo</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[0, 0.1, 0.2].map((delay, i) => (
                            <motion.div
                              key={i}
                              className="w-0.5 h-3 bg-primary rounded-full"
                              animate={{ height: ["30%", "100%", "50%"] }}
                              transition={{ duration: 0.5, repeat: Infinity, delay }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute inset-x-4 -bottom-20 h-20 bg-gradient-to-b from-primary/10 to-transparent blur-2xl rounded-full" />
              </div>
              
              {/* Floating cards */}
              <motion.div
                className="absolute -left-20 top-20 hidden lg:block"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="bg-card/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <QrCode className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">QR Code</p>
                      <p className="text-xs text-muted-foreground">Listo para compartir</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                className="absolute -right-20 bottom-32 hidden lg:block"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <div className="bg-card/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Check className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">100% Personalizable</p>
                      <p className="text-xs text-muted-foreground">Foto, música y más</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/demo">
              <Button variant="outline" size="lg" className="gap-2">
                <Play className="w-4 h-4" />
                Ver demo interactiva
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ========== BENEFITS SECTION ========== */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        
        <div className="container mx-auto relative z-10">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="inline-block text-primary text-sm font-semibold tracking-wider uppercase mb-4">
              Características
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Todo lo que incluye tu página
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Herramientas premium para crear el regalo digital perfecto
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Clock,
                title: "Contador en tiempo real",
                description: "Años, meses, días, horas y minutos contando cada segundo juntos."
              },
              {
                icon: FileText,
                title: "Carta personalizada",
                description: "Escribe palabras únicas que quedarán para siempre."
              },
              {
                icon: Music,
                title: "Música integrada",
                description: "Agrega la canción que define su historia de amor."
              },
              {
                icon: Smartphone,
                title: "Diseño único y elegante",
                description: "Página moderna optimizada para cualquier dispositivo."
              },
              {
                icon: Lock,
                title: "Página privada",
                description: "Solo las personas con el link pueden verla."
              },
              {
                icon: Share2,
                title: "Compartible por link",
                description: "Envía el link por WhatsApp, email o cualquier medio."
              },
              {
                icon: QrCode,
                title: "QR Code exclusivo",
                description: "Código QR para imprimir o compartir físicamente."
              },
              {
                icon: Gift,
                title: "Regalo digital inmediato",
                description: "Tu página lista en minutos para sorprender hoy."
              },
              {
                icon: Sparkles,
                title: "Actualizaciones incluidas",
                description: "Mejoras constantes sin costo adicional."
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <Card className="h-full p-6 bg-card/40 backdrop-blur-sm border-border/50 hover:bg-card/60 hover:border-primary/30 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== EMOTIONAL STORYTELLING SECTION ========== */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[150px]" />
        </div>
        
        <div className="container mx-auto relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Heart className="w-12 h-12 text-primary fill-primary mx-auto mb-8 animate-heartbeat" />
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
              Imagina enviarle un link...{" "}
              <span className="bg-gradient-to-r from-primary via-rose-400 to-primary bg-clip-text text-transparent">
                y que al abrirlo vea toda su historia contigo.
              </span>
            </h2>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Las fotos que atesoran, la música que los define, y un contador que marca cada segundo de su amor.
            </p>
            
            <Link to="/crear">
              <Button variant="default" size="xl" className="group">
                Crear esta experiencia
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ========== SOCIAL PROOF / TESTIMONIALS ========== */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
        
        <div className="container mx-auto relative z-10">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="inline-block text-primary text-sm font-semibold tracking-wider uppercase mb-4">
              Historias reales
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Parejas enamorándose cada día
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Miles de personas ya crearon su página de amor
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            {[
              {
                name: "María & Carlos",
                location: "México",
                text: "Mi novio lloró cuando abrió el link. El mejor regalo que le he dado en 5 años juntos.",
                rating: 5
              },
              {
                name: "Valentina & Andrés",
                location: "Colombia",
                text: "Lo usamos para nuestro aniversario. La música, las fotos, el contador... ¡todo perfecto!",
                rating: 5
              },
              {
                name: "Lucía & Diego",
                location: "Argentina",
                text: "Súper fácil de crear y quedó hermoso. Mi esposo lo abre todos los días. 100% recomendado.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="h-full p-6 bg-card/50 backdrop-blur-sm border-border/50">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  
                  <p className="text-foreground mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-primary fill-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Trust Stats */}
          <motion.div
            className="flex flex-wrap justify-center gap-8 md:gap-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {[
              { value: "5,000+", label: "Páginas creadas" },
              { value: "4.9/5", label: "Calificación promedio" },
              { value: "15+", label: "Países" }
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== SECURITY & TRUST ========== */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            className="flex flex-wrap justify-center items-center gap-6 md:gap-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {[
              { icon: Shield, label: "Pago seguro" },
              { icon: Lock, label: "SSL encriptado" },
              { icon: Users, label: "Privacidad garantizada" },
              { icon: Mail, label: "Sin spam" }
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-muted-foreground">
                <item.icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== PRICING SECTION ========== */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        
        <div className="container mx-auto max-w-lg relative z-10">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <span className="inline-block text-primary text-sm font-semibold tracking-wider uppercase mb-4">
              Precio único
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Un regalo que dura todo el año
            </h2>
            <p className="text-lg text-muted-foreground">
              Menos de lo que cuesta un café al mes
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="relative p-8 md:p-10 bg-card border-2 border-primary/30 shadow-[0_8px_40px_hsl(var(--primary)/0.15)]">
              {/* Popular Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-1.5 rounded-full">
                  Más popular
                </span>
              </div>
              
              {/* Price */}
              <div className="text-center mb-8 pt-4">
                <div className="inline-flex items-baseline gap-1">
                  <span className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-rose-400 to-primary bg-clip-text text-transparent">
                    $5
                  </span>
                  <span className="text-muted-foreground text-lg">/año</span>
                </div>
                <p className="text-muted-foreground mt-2">Solo $0.42 por mes</p>
              </div>

              {/* Benefits */}
              <div className="space-y-4 mb-8">
                {[
                  "Página individual personalizada",
                  "Contador de tiempo real",
                  "Música ambiente integrada",
                  "Galería de fotos ilimitada",
                  "Carta personalizada",
                  "QR Code exclusivo",
                  "Actualizaciones gratuitas"
                ].map((benefit) => (
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
                <Button variant="default" size="xl" className="w-full h-14 text-base">
                  Crear nuestra página ahora
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              
              {/* Trust text */}
              <p className="text-center text-xs text-muted-foreground mt-4">
                Pago seguro con Stripe. Cancelación en cualquier momento.
              </p>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-background to-background" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-primary/20 blur-[150px]" />
        </div>
        
        <div className="container mx-auto relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block mb-8"
            >
              <Heart className="w-16 h-16 text-primary fill-primary" />
            </motion.div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Haz sonreír a la persona que amas{" "}
              <span className="bg-gradient-to-r from-primary via-rose-400 to-primary bg-clip-text text-transparent">
                hoy.
              </span>
            </h2>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
              Crea una sorpresa que recordarán para siempre.
            </p>
            
            <Link to="/crear">
              <Button variant="default" size="xl" className="group h-16 px-12 text-lg">
                <Gift className="w-6 h-6 mr-3" />
                Crear mi página ahora
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="py-12 px-4 border-t border-border/50 bg-card/30">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <img src={memoryLinkLogo} alt="Memory Link" className="w-8 h-8 object-contain" />
              <span className="font-semibold">Memory Link</span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <Link to="/demo" className="hover:text-foreground transition-colors">
                Demo
              </Link>
              <a href="mailto:hola@memoryl.ink" className="hover:text-foreground transition-colors">
                Contacto
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Términos
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Privacidad
              </a>
            </div>
            
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-border/30 text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Memory Link. Hecho con ❤️ para parejas enamoradas.
            </p>
          </div>
        </div>
      </footer>

      {/* ========== STICKY MOBILE CTA ========== */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-border/50 md:hidden z-40">
        <Link to="/crear" className="block">
          <Button variant="default" size="lg" className="w-full">
            <Gift className="w-5 h-5 mr-2" />
            Crear mi página - $3/año
          </Button>
        </Link>
      </div>
    </main>
  );
};

export default Index;
