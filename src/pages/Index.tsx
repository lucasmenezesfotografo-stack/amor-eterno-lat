import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, Sparkles, Clock, Music, FileText, QrCode, Check, ArrowRight, Play, Calendar, MessageSquareHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
const Index = () => {
  const benefits = ["Página individual personalizada", "Música ambiente integrada", "Contador en tiempo real", "Carta generada con IA", "QR Code exclusivo", "Actualizaciones gratuitas"];
  return <main className="min-h-screen bg-background overflow-hidden">
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
            <motion.div initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}>
              {/* Badge */}
              

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold mb-6 tracking-tight">
                Tu historia de amor,{" "}
                <span className="text-gradient-cherry text-paper bg-paper">eternizada digitalmente</span>
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
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" initial={{
        opacity: 0
      }} animate={{
        opacity: 1,
        y: [0, 10, 0]
      }} transition={{
        opacity: {
          delay: 1,
          duration: 0.5
        },
        y: {
          delay: 1.5,
          duration: 1.5,
          repeat: Infinity
        }
      }}>
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-muted-foreground/50 rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* Demo Section - Beautiful Phone Preview */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px]" />
        
        <div className="container mx-auto relative z-10">
          <motion.div className="text-center mb-16" initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4">
              Mira cómo quedará
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Una página elegante y moderna para celebrar tu amor
            </p>
          </motion.div>

          <motion.div className="flex justify-center" initial={{
          opacity: 0,
          y: 50
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.8
        }}>
            {/* Premium Phone Mockup */}
            <div className="relative">
              {/* Phone Frame */}
              <div className="relative w-[280px] sm:w-[320px] md:w-[360px]">
                {/* Phone body with glass effect */}
                <div className="relative bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-[3rem] p-2 shadow-2xl shadow-black/50">
                  {/* Dynamic Island / Notch */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-20" />
                  
                  {/* Screen */}
                  <div className="relative bg-gradient-to-b from-background to-card rounded-[2.5rem] overflow-hidden aspect-[9/19]">
                    {/* Background Cover Photo */}
                    <div className="absolute inset-0">
                      <img src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&auto=format&fit=crop" alt="Couple" className="w-full h-full object-cover opacity-40" />
                      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col p-5 pt-12">
                      {/* Heart Animation */}
                      <motion.div className="flex justify-center mb-4" animate={{
                      scale: [1, 1.15, 1]
                    }} transition={{
                      duration: 1.5,
                      repeat: Infinity
                    }}>
                        <div className="w-14 h-14 rounded-full bg-primary/20 backdrop-blur-xl flex items-center justify-center">
                          <Heart className="w-7 h-7 text-primary fill-primary" />
                        </div>
                      </motion.div>
                      
                      {/* Names */}
                      <div className="text-center mb-4">
                        <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                          Sofía <span className="text-primary">&</span> Miguel
                        </h3>
                        <div className="flex items-center justify-center gap-1.5 mt-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>Juntos desde 15 de junio, 2021</span>
                        </div>
                      </div>
                      
                      {/* Counter Cards */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {[{
                        value: "3",
                        label: "Años"
                      }, {
                        value: "6",
                        label: "Meses"
                      }, {
                        value: "24",
                        label: "Días"
                      }].map(item => <div key={item.label} className="bg-card/80 backdrop-blur-sm rounded-xl p-2 text-center border border-border/50">
                            <p className="text-lg sm:text-xl font-bold text-primary">{item.value}</p>
                            <p className="text-[10px] text-muted-foreground">{item.label}</p>
                          </div>)}
                      </div>
                      
                      {/* Photo Preview */}
                      <div className="relative rounded-xl overflow-hidden mb-4 flex-shrink-0">
                        <img src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop" alt="Couple photo" className="w-full h-28 object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2">
                          <MessageSquareHeart className="w-3 h-3 text-primary" />
                          <span className="text-[10px] text-foreground/80">Carta de amor incluida</span>
                        </div>
                      </div>
                      
                      {/* Music Player */}
                      <div className="mt-auto bg-card/90 backdrop-blur-xl rounded-xl p-3 flex items-center gap-3 border border-border/50">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
                            <Music className="w-5 h-5 text-white" />
                          </div>
                          {/* Playing indicator */}
                          <motion.div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full" animate={{
                          scale: [1, 1.3, 1],
                          opacity: [1, 0.7, 1]
                        }} transition={{
                          duration: 1,
                          repeat: Infinity
                        }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground truncate">Romantic Piano</p>
                          <p className="text-[10px] text-muted-foreground truncate">♪ Reproduciendo</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <motion.div className="w-0.5 h-3 bg-primary rounded-full" animate={{
                          height: ["30%", "100%", "50%"]
                        }} transition={{
                          duration: 0.5,
                          repeat: Infinity
                        }} />
                          <motion.div className="w-0.5 h-3 bg-primary rounded-full" animate={{
                          height: ["60%", "30%", "100%"]
                        }} transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          delay: 0.1
                        }} />
                          <motion.div className="w-0.5 h-3 bg-primary rounded-full" animate={{
                          height: ["100%", "50%", "30%"]
                        }} transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          delay: 0.2
                        }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Reflection effect */}
                <div className="absolute inset-x-4 -bottom-20 h-20 bg-gradient-to-b from-primary/10 to-transparent blur-2xl rounded-full" />
              </div>
              
              {/* Floating elements around phone */}
              <motion.div className="absolute -left-16 top-20 hidden lg:block" animate={{
              y: [0, -10, 0]
            }} transition={{
              duration: 3,
              repeat: Infinity
            }}>
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
              
              <motion.div className="absolute -right-16 bottom-32 hidden lg:block" animate={{
              y: [0, 10, 0]
            }} transition={{
              duration: 2.5,
              repeat: Infinity
            }}>
                <div className="bg-card/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Check className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Personalizable</p>
                      <p className="text-xs text-muted-foreground">Foto, música y más</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          {/* CTA below preview */}
          <motion.div className="text-center mt-12" initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          delay: 0.3
        }}>
            <Link to="/demo">
              <Button variant="outline" size="lg" className="gap-2">
                <Play className="w-4 h-4" />
                Ver demo interactiva
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <motion.div className="text-center mb-16" initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4">
              Todo lo que necesitas
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Herramientas premium para crear el regalo digital perfecto
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[{
            icon: Clock,
            title: "Contador en Tiempo Real",
            description: "Años, meses, días, horas y minutos desde el inicio"
          }, {
            icon: Music,
            title: "Música Ambiente",
            description: "Elige la banda sonora de tu amor"
          }, {
            icon: FileText,
            title: "Carta con IA",
            description: "Genera una carta única y personalizada"
          }, {
            icon: QrCode,
            title: "QR Code Exclusivo",
            description: "Comparte fácilmente el regalo"
          }].map((feature, index) => <motion.div key={feature.title} className="feature-card" initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.1,
            duration: 0.5
          }}>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="text-5xl md:text-6xl font-bold text-gradient-cherry" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-lg">
          <motion.div className="text-center mb-12" initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4">
              Precio simple
            </h2>
            <p className="text-lg text-muted-foreground">
              Un regalo que dura todo el año
            </p>
          </motion.div>

          <motion.div className="pricing-card" initial={{
          opacity: 0,
          scale: 0.95
        }} whileInView={{
          opacity: 1,
          scale: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <div className="relative z-10">
              {/* Price */}
              <div className="text-center mb-8">
                <div className="inline-flex items-baseline gap-1">
                  <span className="text-5xl md:text-6xl font-bold text-gradient-cherry bg-paper">$5</span>
                  <span className="text-muted-foreground">/año</span>
                </div>
                <p className="text-muted-foreground mt-2">Menos de $0.50 por mes</p>
              </div>

              {/* Benefits */}
              <div className="space-y-4 mb-8">
                {benefits.map(benefit => <div key={benefit} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-foreground">{benefit}</span>
                  </div>)}
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
    </main>;
};
export default Index;