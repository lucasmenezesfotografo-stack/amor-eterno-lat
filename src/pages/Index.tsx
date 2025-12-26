import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, Sparkles, Gift, Calendar, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-romantic.jpg";

const Index = () => {
  const features = [
    {
      icon: Calendar,
      title: "Contador del Amor",
      description: "Mide cada segundo, minuto y día de su historia juntos",
    },
    {
      icon: Sparkles,
      title: "Efecto Mágico",
      description: "Transforma tus fotos con un filtro artístico inspirado en Ghibli",
    },
    {
      icon: Music,
      title: "Tu Canción",
      description: "Añade la banda sonora de su amor con música de fondo",
    },
    {
      icon: Gift,
      title: "Carta de Amor",
      description: "Escribe palabras eternas con tipografía elegante",
    },
  ];

  return (
    <main className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Pareja romántica"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Floating Heart */}
            <motion.div
              className="inline-block mb-6"
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart className="w-12 h-12 md:w-16 md:h-16 text-accent fill-accent/30" />
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6">
              <span className="text-gradient-romantic">Tu Amor Lat</span>
            </h1>

            <p className="text-xl md:text-2xl lg:text-3xl font-serif italic text-foreground/80 mb-8 max-w-2xl mx-auto">
              Inmortaliza tu historia de amor
            </p>

            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-10">
              Crea una página de aniversario única y hermosa para celebrar cada momento 
              especial junto a tu persona favorita.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/crear">
                <Button variant="romantic" size="xl">
                  <Gift className="w-5 h-5" />
                  Crear Mi Regalo
                </Button>
              </Link>
              <Link to="/regalo/demo">
                <Button variant="glass" size="xl">
                  <Sparkles className="w-5 h-5" />
                  Ver Ejemplo
                </Button>
              </Link>
            </div>
          </motion.div>
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
          <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-foreground/50 rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 px-4 bg-gradient-to-b from-background to-cream-warm">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4">
              Todo lo que necesitas
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Herramientas diseñadas para crear el regalo digital perfecto
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="glass-card p-6 md:p-8 text-center group hover:scale-105 transition-transform duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 md:w-8 md:h-8 text-primary-foreground" />
                </div>
                <h3 className="text-lg md:text-xl font-serif font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 px-4">
        <div className="container mx-auto">
          <motion.div
            className="glass-card p-8 md:p-16 text-center relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Background Decoration */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-gradient-to-br from-accent to-primary blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-gradient-to-tr from-primary to-gold blur-3xl" />
            </div>

            <div className="relative z-10">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Heart className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 text-accent fill-accent/20" />
              </motion.div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4">
                ¿Listo para sorprender?
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-8">
                Crea una página de aniversario única que tu pareja nunca olvidará
              </p>

              <Link to="/crear">
                <Button variant="romantic" size="xl">
                  <Gift className="w-5 h-5" />
                  Comenzar Ahora
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            Hecho con <Heart className="w-4 h-4 text-accent fill-accent animate-heartbeat" /> Tu Amor Lat
          </p>
        </div>
      </footer>
    </main>
  );
};

export default Index;
