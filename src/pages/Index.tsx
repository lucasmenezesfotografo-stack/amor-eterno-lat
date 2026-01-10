import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, Sparkles, Clock, Music, FileText, QrCode, Check, ArrowRight, Play, Calendar, MessageSquareHeart, Lock, Wand2, Gift, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";

const Index = () => {
  const benefits = [
    "Página individual personalizada",
    "Música ambiente integrada",
    "Contador en tiempo real",
    "Carta generada con IA",
    "QR Code exclusivo",
    "Actualizaciones gratuitas",
  ];

  const steps = [
    { 
      number: "01", 
      icon: Heart, 
      title: "Personaliza tu historia", 
      description: "Añade nombres, fecha especial, fotos y elige la música que define su amor." 
    },
    { 
      number: "02", 
      icon: Wand2, 
      title: "Nuestra IA escribe tu carta", 
      description: "Un mensaje único y emotivo generado especialmente para ustedes." 
    },
    { 
      number: "03", 
      icon: Gift, 
      title: "Sorprende con el QR", 
      description: "Descarga la tarjeta premium y comparte físicamente o digitalmente." 
    },
  ];

  return (
    <main className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary fill-primary" />
            <span className="text-lg font-display font-semibold">Forever Love</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/demo">
              <Button variant="ghost" size="sm">
                Ver Demo
              </Button>
            </Link>
            <Link to="/crear">
              <Button variant="default" size="sm" className="shadow-champagne">
                Comenzar
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-16">
        {/* Background Gradient - Bordeaux */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(340,45%,15%)]/30 via-background to-background" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-primary/10 blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[hsl(340,45%,25%)]/20 blur-[100px]" />
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
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-premium text-primary text-sm font-medium mb-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Sparkles className="w-4 h-4" />
                El regalo digital más romántico
                <Star className="w-4 h-4 fill-primary" />
              </motion.div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 tracking-tight leading-tight">
                El regalo que el tiempo{" "}
                <span className="text-gradient-champagne">no puede borrar</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
                Eterniza tu historia de amor con una página web única, música, 
                contador en tiempo real y una carta creada por IA.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/crear">
                  <Button variant="default" size="xl" className="group shadow-champagne hover:shadow-glow transition-shadow">
                    Crear nuestra página por $5/año
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/demo">
                  <Button variant="outline" size="xl" className="border-primary/30 hover:bg-primary/10">
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
          <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-primary/50 rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* Premium Demo Section - iPhone + Card 3D */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-[hsl(340,45%,10%)]/20 to-background" />
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[hsl(340,45%,25%)]/20 rounded-full blur-[120px]" />
        
        <div className="container mx-auto relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
              Un regalo <span className="text-gradient-champagne">inolvidable</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Página web personalizada + tarjeta física con QR
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* iPhone 15 Pro Mockup */}
            <div className="relative">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Phone Frame - iPhone 15 Pro style */}
                <div className="relative w-[280px] sm:w-[300px] md:w-[320px]">
                  {/* Titanium frame */}
                  <div className="relative bg-gradient-to-b from-[#3a3a3c] via-[#2c2c2e] to-[#1c1c1e] rounded-[3rem] p-[3px] shadow-2xl shadow-black/60">
                    <div className="bg-gradient-to-b from-[#1c1c1e] to-[#000] rounded-[2.9rem] p-2">
                      {/* Dynamic Island */}
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[100px] h-[32px] bg-black rounded-full z-20 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-[#1a1a1a] mr-8" />
                      </div>
                      
                      {/* Screen */}
                      <div className="relative bg-gradient-to-b from-background to-card rounded-[2.5rem] overflow-hidden aspect-[9/19.5]">
                        {/* Background Cover Photo */}
                        <div className="absolute inset-0">
                          <img 
                            src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&auto=format&fit=crop"
                            alt="Couple"
                            className="w-full h-full object-cover opacity-40"
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
                        </div>
                        
                        {/* Content */}
                        <div className="relative z-10 h-full flex flex-col p-5 pt-14">
                          {/* Heart Animation */}
                          <motion.div
                            className="flex justify-center mb-4"
                            animate={{ scale: [1, 1.15, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <div className="w-14 h-14 rounded-full bg-primary/20 backdrop-blur-xl flex items-center justify-center border border-primary/30">
                              <Heart className="w-7 h-7 text-primary fill-primary" />
                            </div>
                          </motion.div>
                          
                          {/* Names */}
                          <div className="text-center mb-4">
                            <h3 className="text-xl sm:text-2xl font-display font-bold text-foreground">
                              Sofía <span className="text-primary">&</span> Miguel
                            </h3>
                            <div className="flex items-center justify-center gap-1.5 mt-2 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              <span>Juntos desde 15 de junio, 2021</span>
                            </div>
                          </div>
                          
                          {/* Counter Cards */}
                          <div className="grid grid-cols-3 gap-2 mb-4">
                            {[
                              { value: "3", label: "Años" },
                              { value: "6", label: "Meses" },
                              { value: "24", label: "Días" },
                            ].map((item) => (
                              <div key={item.label} className="glass-premium p-2 text-center">
                                <p className="text-lg sm:text-xl font-display font-bold text-primary">{item.value}</p>
                                <p className="text-[10px] text-muted-foreground">{item.label}</p>
                              </div>
                            ))}
                          </div>
                          
                          {/* Photo Preview */}
                          <div className="relative rounded-xl overflow-hidden mb-4 flex-shrink-0 border border-primary/20">
                            <img 
                              src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop"
                              alt="Couple photo"
                              className="w-full h-24 object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                            <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2">
                              <MessageSquareHeart className="w-3 h-3 text-primary" />
                              <span className="text-[10px] text-foreground/80">Carta de amor incluida</span>
                            </div>
                          </div>
                          
                          {/* Music Player */}
                          <div className="mt-auto glass-premium p-3 flex items-center gap-3">
                            <div className="relative">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                                <Music className="w-5 h-5 text-primary-foreground" />
                              </div>
                              <motion.div
                                className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"
                                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-foreground truncate">Perfect - Ed Sheeran</p>
                              <p className="text-[10px] text-muted-foreground truncate">♪ Reproduciendo</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <motion.div className="w-0.5 h-3 bg-primary rounded-full" animate={{ height: ["30%", "100%", "50%"] }} transition={{ duration: 0.5, repeat: Infinity }} />
                              <motion.div className="w-0.5 h-3 bg-primary rounded-full" animate={{ height: ["60%", "30%", "100%"] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }} />
                              <motion.div className="w-0.5 h-3 bg-primary rounded-full" animate={{ height: ["100%", "50%", "30%"] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Reflection effect */}
                  <div className="absolute inset-x-4 -bottom-20 h-20 bg-gradient-to-b from-primary/10 to-transparent blur-2xl rounded-full" />
                </div>
              </motion.div>
            </div>

            {/* Premium Card with 3D tilt */}
            <motion.div
              className="relative"
              initial={{ rotateY: 15, rotateX: -5 }}
              whileHover={{ rotateY: 0, rotateX: 0, scale: 1.02 }}
              transition={{ duration: 0.4 }}
              style={{ perspective: 1000 }}
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
                style={{ transformStyle: "preserve-3d", transform: "rotateY(-12deg) rotateX(5deg)" }}
              >
                {/* Premium Card */}
                <div 
                  className="w-72 rounded-2xl overflow-hidden relative"
                  style={{
                    background: "linear-gradient(135deg, hsl(340 45% 20%), hsl(340 50% 12%))",
                    boxShadow: "0 30px 60px -15px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.2), 0 0 40px rgba(212,175,55,0.1)",
                  }}
                >
                  {/* Textured overlay */}
                  <div 
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                  />
                  
                  {/* Photo with golden frame */}
                  <div className="relative m-4 mb-0 rounded-xl overflow-hidden">
                    <div 
                      className="absolute inset-0 rounded-xl z-10 pointer-events-none"
                      style={{ boxShadow: "inset 0 0 0 2px rgba(212,175,55,0.5)" }}
                    />
                    <img 
                      src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop"
                      alt="Couple"
                      className="w-full h-36 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[hsl(340,50%,12%)] to-transparent" />
                  </div>
                  
                  <div className="p-5 text-center relative z-10">
                    {/* Heart with glow */}
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="flex justify-center mb-3"
                    >
                      <Heart 
                        className="w-6 h-6 text-primary fill-primary" 
                        style={{ filter: "drop-shadow(0 0 8px hsl(43 74% 60%))" }}
                      />
                    </motion.div>
                    
                    <h3 className="text-xl font-display font-bold text-foreground mb-1">Sofía & Miguel</h3>
                    <p className="text-xs text-muted-foreground mb-4">15 de junio, 2021</p>
                    
                    {/* QR with blur and lock */}
                    <div className="relative mx-auto w-fit">
                      <div 
                        className="rounded-xl p-3 relative overflow-hidden"
                        style={{
                          background: "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
                          border: "1px solid rgba(212,175,55,0.3)",
                        }}
                      >
                        <div className="blur-md">
                          <QRCodeSVG value="https://foreverlove.app/demo" size={70} fgColor="#4a3728" bgColor="rgba(255,255,255,0.9)" />
                        </div>
                        {/* Lock overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl">
                          <div className="w-10 h-10 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center border border-primary/30">
                            <Lock className="w-5 h-5 text-primary" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-[10px] text-muted-foreground mt-3 tracking-widest uppercase">Desbloquea con la compra</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* CTA below preview */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/demo">
              <Button variant="outline" size="lg" className="gap-2 border-primary/30 hover:bg-primary/10">
                <Play className="w-4 h-4" />
                Ver demo interactiva
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 3 Steps Section */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-[hsl(340,45%,8%)]/30 to-background" />
        
        <div className="container mx-auto relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
              Crea tu regalo en <span className="text-gradient-champagne">3 pasos</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple, rápido y con resultados increíbles
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/50 to-transparent" />
                )}
                
                <div className="glass-premium p-8 text-center hover:border-primary/30 transition-all duration-300">
                  {/* Step number */}
                  <div className="text-5xl font-display font-bold text-primary/20 mb-4">{step.number}</div>
                  
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5 border border-primary/20">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-display font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
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
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
              Todo lo que <span className="text-gradient-champagne">necesitas</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Herramientas premium para crear el regalo digital perfecto
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Clock, title: "Contador en Tiempo Real", description: "Años, meses, días, horas y minutos desde el inicio" },
              { icon: Music, title: "Música Ambiente", description: "Elige la banda sonora de tu amor con Deezer" },
              { icon: FileText, title: "Carta con IA", description: "Genera una carta única y personalizada" },
              { icon: QrCode, title: "QR Code Premium", description: "Tarjeta física con diseño de lujo" },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="glass-premium p-6 hover:border-primary/30 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-display font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-[hsl(340,45%,10%)]/30 to-background" />
        
        <div className="container mx-auto max-w-lg relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
              Precio <span className="text-gradient-champagne">simple</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Un regalo que dura todo el año
            </p>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Launch Offer Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
              <div className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 shadow-champagne">
                <Sparkles className="w-4 h-4" />
                Oferta de Lanzamiento
              </div>
            </div>
            
            <div 
              className="glass-premium p-8 pt-12 relative overflow-hidden"
              style={{
                boxShadow: "0 20px 60px rgba(212,175,55,0.15), 0 0 0 1px rgba(212,175,55,0.2)",
              }}
            >
              {/* Radial glow */}
              <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(ellipse at center, hsl(43 74% 60% / 0.3) 0%, transparent 70%)" }} />
              
              <div className="relative z-10">
                {/* Price */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-baseline gap-2">
                    <span className="text-6xl md:text-7xl font-display font-bold text-gradient-champagne">$5</span>
                    <span className="text-xl text-muted-foreground font-display">/año</span>
                  </div>
                  <p className="text-muted-foreground mt-2">Menos de $0.50 por mes</p>
                </div>

                {/* Benefits */}
                <div className="space-y-4 mb-8">
                  {benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 border border-primary/30">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link to="/crear" className="block">
                  <Button variant="default" size="xl" className="w-full shadow-champagne hover:shadow-glow transition-shadow">
                    Crear nuestra página ahora
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
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
              <span className="font-display font-semibold">Forever Love</span>
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
