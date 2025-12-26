import { motion } from "framer-motion";
import { Heart, Calendar, Music } from "lucide-react";
import RelationshipCounter from "@/components/RelationshipCounter";
import PhotoGallery from "@/components/PhotoGallery";
import LoveLetter from "@/components/LoveLetter";
import SpotifyEmbed from "@/components/SpotifyEmbed";

// Demo data for the gift page
const demoData = {
  names: { person1: "María", person2: "Carlos" },
  startDate: new Date("2020-02-14"),
  photos: [
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=800&auto=format&fit=crop",
      caption: "Nuestro primer viaje juntos",
    },
    {
      id: "2",
      url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&auto=format&fit=crop",
      caption: "Atardecer en la playa",
    },
    {
      id: "3",
      url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&auto=format&fit=crop",
      caption: "Cena romántica",
    },
    {
      id: "4",
      url: "https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=600&auto=format&fit=crop",
      caption: "Bailando bajo las estrellas",
    },
    {
      id: "5",
      url: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=600&auto=format&fit=crop",
      caption: "Picnic en el parque",
    },
  ],
  loveLetter: `Mi amor, cada día a tu lado es un regalo que atesoro en lo más profundo de mi corazón.

Desde el momento en que nuestras miradas se cruzaron, supe que mi vida cambiaría para siempre. Tu sonrisa ilumina mis días más oscuros, y tu amor me da la fuerza para enfrentar cualquier desafío.

Gracias por elegirme cada día, por soñar conmigo y por construir este hermoso camino juntos. Eres mi compañero, mi confidente, mi mejor amigo y el amor de mi vida.

Prometo seguir amándote con la misma intensidad que el primer día, celebrar cada pequeño momento y crear juntos mil recuerdos más.`,
  author: "María",
  spotifyUrl: "https://open.spotify.com/track/0tgVpDi06FyKpA1z0VMD4v",
};

const RegaloPage = () => {
  return (
    <main className="min-h-screen bg-background">

      {/* Hero Section with Names */}
      <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-cream-warm via-background to-background">
          {/* Floating Hearts */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-accent/20"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                rotate: [-10, 10, -10],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            >
              <Heart className="w-8 h-8 md:w-12 md:h-12 fill-current" />
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Names */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-8">
              <motion.h1
                className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {demoData.names.person1}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <Heart className="w-10 h-10 md:w-14 md:h-14 text-accent fill-accent animate-heartbeat" />
              </motion.div>

              <motion.h1
                className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {demoData.names.person2}
              </motion.h1>
            </div>

            {/* Date Info */}
            <motion.div
              className="flex flex-col md:flex-row items-center justify-center gap-4 text-muted-foreground mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-lg">
                  Desde el {demoData.startDate.toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </motion.div>

            {/* Tagline */}
            <motion.p
              className="text-xl md:text-2xl font-serif italic text-gradient-romantic mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              "Nuestra historia de amor"
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Relationship Counter */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-background to-cream-warm">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-foreground mb-2">
              Tiempo juntos
            </h2>
            <p className="text-muted-foreground">Cada segundo cuenta</p>
          </motion.div>

          <RelationshipCounter startDate={demoData.startDate} />
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-foreground mb-2">
              Nuestros Momentos
            </h2>
            <p className="text-muted-foreground">Recuerdos que atesoramos</p>
          </motion.div>

          <PhotoGallery photos={demoData.photos} />
        </div>
      </section>

      {/* Spotify Player */}
      <section className="py-16 md:py-24 px-4 bg-cream-warm/30">
        <div className="container mx-auto max-w-xl">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-foreground mb-2">
              Nuestra Canción
            </h2>
            <p className="text-muted-foreground">La música de nuestro amor</p>
          </motion.div>

          <SpotifyEmbed spotifyUrl={demoData.spotifyUrl} />
        </div>
      </section>

      {/* Love Letter */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-background to-cream-warm">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-foreground mb-2">
              Carta de Amor
            </h2>
            <p className="text-muted-foreground">Palabras desde el corazón</p>
          </motion.div>

          <LoveLetter content={demoData.loveLetter} author={demoData.author} />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 text-center border-t border-border">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-muted-foreground flex items-center justify-center gap-2 mb-4">
            Creado con <Heart className="w-4 h-4 text-accent fill-accent animate-heartbeat" />
          </p>
          <p className="text-sm text-muted-foreground">
            Powered by <span className="text-gradient-romantic font-semibold">Tu Amor Lat</span>
          </p>
        </motion.div>
      </footer>
    </main>
  );
};

export default RegaloPage;
