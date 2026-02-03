import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Sparkles, Clock, Music, FileText, QrCode, Check, ArrowRight, Play, 
  Calendar, MessageSquareHeart, Heart, Shield, Lock, Star, Users,
  Gift, Share2, Smartphone, Image, ChevronDown, Mail, CreditCard,
  ScanLine, Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import memoryLinkLogo from "@/assets/memory-link-logo.png";
import demoCoupleImage from "@/assets/demo-couple.jpg";
import { useLanguage, LanguageToggle } from "@/hooks/use-language";

// Main Index Content with translations
const IndexContent = () => {
  const { t, language } = useLanguage();
  
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
            <LanguageToggle />
            <Link to="/demo">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                {t('nav.example')}
              </Button>
            </Link>
            <Link to="/crear">
              <Button variant="default" size="sm">
                {t('nav.create')}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-center lg:text-left"
            >
              {/* Trust Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-card/60 backdrop-blur-xl border border-border/50 rounded-full px-4 py-2 mb-8"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">{t('hero.badge')}</span>
              </motion.div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-[1.1]">
                <span className="bg-gradient-to-r from-primary via-rose-400 to-primary bg-clip-text text-transparent">
                  {t('hero.headline')}
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                {t('hero.subheadline')}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-8">
                <Link to="/crear">
                  <Button variant="default" size="xl" className="group min-w-[220px] h-14 text-base">
                    <Gift className="w-5 h-5 mr-2" />
                    {t('hero.cta.primary')}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/demo">
                  <Button variant="outline" size="xl" className="min-w-[180px] h-14 text-base">
                    <Play className="w-5 h-5 mr-2" />
                    {t('hero.cta.secondary')}
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>{t('hero.trust.secure')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{t('hero.trust.time')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-primary fill-primary" />
                  <span>{t('hero.trust.price')}</span>
                </div>
              </div>
            </motion.div>

            {/* Right: Hero Mockup - Card + Phone + QR */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative flex justify-center"
            >
              {/* Card Mockup with QR */}
              <div className="relative">
                {/* Physical Card */}
                <motion.div
                  className="relative z-20 w-[280px] sm:w-[320px]"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <div className="bg-gradient-to-br from-card to-card/80 rounded-2xl p-6 border border-border/50 shadow-2xl shadow-primary/10">
                    {/* Card Header */}
                    <div className="text-center mb-4">
                      <div className="flex justify-center mb-3">
                        <Heart className="w-8 h-8 text-primary fill-primary" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground">Sofía & Miguel</h3>
                      <p className="text-xs text-muted-foreground">Nuestra historia de amor</p>
                    </div>
                    
                    {/* QR Code Preview */}
                    <div className="bg-white rounded-xl p-3 mb-4 mx-auto w-fit">
                      <div className="w-24 h-24 grid grid-cols-5 gap-0.5">
                        {[...Array(25)].map((_, i) => (
                          <div
                            key={i}
                            className={`aspect-square rounded-sm ${
                              Math.random() > 0.5 ? 'bg-foreground' : 'bg-transparent'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Card Footer */}
                    <p className="text-center text-xs text-muted-foreground">
                      {language === 'es' ? 'Escanea para descubrir' : 'Scan to discover'}
                    </p>
                  </div>
                </motion.div>

                {/* Phone Mockup */}
                <motion.div
                  className="absolute -right-16 sm:-right-24 top-12 z-30"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                >
                  <div className="w-[140px] sm:w-[160px]">
                    <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-[1.5rem] p-1 shadow-xl">
                      <div className="bg-gradient-to-b from-background to-card rounded-[1.3rem] overflow-hidden aspect-[9/18]">
                        <div className="relative h-full">
                          <img src={demoCoupleImage} alt="Couple" className="w-full h-full object-cover opacity-50" />
                          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background/90" />
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                            <Heart className="w-6 h-6 text-primary fill-primary mb-2" />
                            <p className="text-[10px] font-semibold text-center">Sofía & Miguel</p>
                            <div className="flex gap-1 mt-2">
                              <div className="bg-card/80 rounded px-1.5 py-0.5 text-center">
                                <p className="text-[8px] font-bold text-primary">3</p>
                                <p className="text-[6px] text-muted-foreground">años</p>
                              </div>
                              <div className="bg-card/80 rounded px-1.5 py-0.5 text-center">
                                <p className="text-[8px] font-bold text-primary">6</p>
                                <p className="text-[6px] text-muted-foreground">meses</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Scanning Line Animation */}
                <motion.div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-32 h-32 rounded-full border-2 border-primary/30 flex items-center justify-center">
                    <ScanLine className="w-8 h-8 text-primary/50" />
                  </div>
                </motion.div>

                {/* Floating Badge */}
                <motion.div
                  className="absolute -left-8 bottom-4 z-40"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <div className="bg-emerald-500/20 backdrop-blur-sm rounded-xl px-3 py-2 border border-emerald-500/30">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-medium text-emerald-400">
                        {language === 'es' ? '¡Página activa!' : 'Page active!'}
                      </span>
                    </div>
                  </div>
                </motion.div>
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
            <span className="text-xs text-muted-foreground">{t('scroll.discover')}</span>
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </motion.div>
      </section>

      {/* ========== VISUAL EXPLANATION SECTION ========== */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            {/* Step 1: Hand with Card */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
            >
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Gift className="w-12 h-12 text-primary" />
              </div>
              <p className="text-lg font-semibold">{t('visual.step1')}</p>
            </motion.div>

            {/* Arrow */}
            <motion.div 
              className="hidden md:block"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <ArrowRight className="w-8 h-8 text-muted-foreground" />
            </motion.div>

            {/* Step 2: QR Scan */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <QrCode className="w-12 h-12 text-primary" />
              </div>
              <p className="text-lg font-semibold">{t('visual.step2')}</p>
            </motion.div>

            {/* Arrow */}
            <motion.div 
              className="hidden md:block"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <ArrowRight className="w-8 h-8 text-muted-foreground" />
            </motion.div>

            {/* Step 3: Discover */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-12 h-12 text-primary fill-primary" />
              </div>
              <p className="text-lg font-semibold">{t('visual.step3')}</p>
            </motion.div>
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <Link to="/crear">
              <Button variant="default" size="lg">
                <Gift className="w-5 h-5 mr-2" />
                {t('hero.cta.primary')}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
        
        <div className="container mx-auto relative z-10">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="inline-block text-primary text-sm font-semibold tracking-wider uppercase mb-4">
              {t('how.badge')}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              {t('how.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              {t('how.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 max-w-5xl mx-auto">
            {[
              {
                icon: Smartphone,
                step: "01",
                title: t('how.step1.title'),
                description: t('how.step1.desc')
              },
              {
                icon: QrCode,
                step: "02",
                title: t('how.step2.title'),
                description: t('how.step2.desc')
              },
              {
                icon: Gift,
                step: "03",
                title: t('how.step3.title'),
                description: t('how.step3.desc')
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

      {/* ========== FEATURES SECTION ========== */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        
        <div className="container mx-auto relative z-10">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="inline-block text-primary text-sm font-semibold tracking-wider uppercase mb-4">
              {t('features.badge')}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              {t('features.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { icon: QrCode, titleKey: 'features.qr.title', descKey: 'features.qr.desc' },
              { icon: Download, titleKey: 'features.card.title', descKey: 'features.card.desc' },
              { icon: Image, titleKey: 'features.photos.title', descKey: 'features.photos.desc' },
              { icon: Music, titleKey: 'features.music.title', descKey: 'features.music.desc' },
              { icon: FileText, titleKey: 'features.letter.title', descKey: 'features.letter.desc' },
              { icon: Clock, titleKey: 'features.counter.title', descKey: 'features.counter.desc' },
              { icon: Lock, titleKey: 'features.private.title', descKey: 'features.private.desc' },
              { icon: Share2, titleKey: 'features.share.title', descKey: 'features.share.desc' },
              { icon: Sparkles, titleKey: 'features.instant.title', descKey: 'features.instant.desc' },
            ].map((feature, index) => (
              <motion.div
                key={feature.titleKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <Card className="h-full p-6 bg-card/40 backdrop-blur-sm border-border/50 hover:bg-card/60 hover:border-primary/30 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{t(feature.titleKey)}</h3>
                  <p className="text-muted-foreground text-sm">{t(feature.descKey)}</p>
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
              <span className="bg-gradient-to-r from-primary via-rose-400 to-primary bg-clip-text text-transparent">
                {t('emotional.text')}
              </span>
            </h2>
            
            <Link to="/crear">
              <Button variant="default" size="xl" className="group">
                {t('emotional.cta')}
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
              {t('social.badge')}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              {t('social.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              {t('social.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            {[
              {
                text: t('social.testimonial1.text'),
                name: t('social.testimonial1.name'),
                location: t('social.testimonial1.location'),
                rating: 5
              },
              {
                text: t('social.testimonial2.text'),
                name: t('social.testimonial2.name'),
                location: t('social.testimonial2.location'),
                rating: 5
              },
              {
                text: t('social.testimonial3.text'),
                name: t('social.testimonial3.name'),
                location: t('social.testimonial3.location'),
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
              { icon: Shield, label: t('trust.payment') },
              { icon: Lock, label: t('trust.ssl') },
              { icon: Users, label: t('trust.privacy') },
              { icon: Mail, label: t('trust.nospam') }
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-muted-foreground">
                <item.icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== PRICING / GIFT SUMMARY SECTION ========== */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <span className="inline-block bg-primary/20 text-primary text-sm font-semibold tracking-wider px-4 py-2 rounded-full mb-4">
              {t('pricing.badge')}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              {t('pricing.title')}:
            </h2>
            <div className="inline-flex items-baseline gap-2">
              <span className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-rose-400 to-primary bg-clip-text text-transparent">
                {t('pricing.price')}
              </span>
              <span className="text-xl text-muted-foreground">— {t('pricing.forever')}</span>
            </div>
            <p className="text-muted-foreground mt-2">{t('pricing.micro')}</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Gift Summary Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 bg-card/60 backdrop-blur-sm border-border/50 h-full">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-primary" />
                  {t('summary.title')}
                </h3>
                <div className="space-y-4">
                  {[
                    t('pricing.benefit1'),
                    t('pricing.benefit2'),
                    t('pricing.benefit3'),
                    t('pricing.benefit4'),
                    t('pricing.benefit5'),
                    t('pricing.benefit6'),
                  ].map((benefit) => (
                    <div key={benefit} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* What Happens After Payment */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 bg-card/60 backdrop-blur-sm border-border/50 h-full">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  {t('summary.subtitle')}
                </h3>
                <div className="space-y-6">
                  {[
                    { num: 1, text: t('summary.step1'), icon: QrCode },
                    { num: 2, text: t('summary.step2'), icon: Download },
                    { num: 3, text: t('summary.step3'), icon: Shield },
                  ].map((step) => (
                    <div key={step.num} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-primary">{step.num}</span>
                      </div>
                      <div className="flex items-center gap-3 pt-1">
                        <step.icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{step.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          <motion.div
            className="text-center mt-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/crear">
              <Button variant="default" size="xl" className="group h-14 px-10 text-base">
                <Gift className="w-5 h-5 mr-2" />
                {t('hero.cta.primary')}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
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
              {t('final.title')}{" "}
              <span className="bg-gradient-to-r from-primary via-rose-400 to-primary bg-clip-text text-transparent">
                {t('final.highlight')}
              </span>
            </h2>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
              {t('final.subtitle')}
            </p>
            
            <Link to="/crear">
              <Button variant="default" size="xl" className="group h-16 px-12 text-lg">
                <Gift className="w-6 h-6 mr-3" />
                {t('final.cta')}
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
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">{t('footer.privacy')}</a>
              <a href="#" className="hover:text-foreground transition-colors">{t('footer.terms')}</a>
              <a href="#" className="hover:text-foreground transition-colors">{t('footer.contact')}</a>
            </div>
            
            <p className="text-sm text-muted-foreground">
              © 2025 Memory Link. {t('footer.rights')}
            </p>
          </div>
        </div>
      </footer>

      {/* ========== STICKY MOBILE CTA ========== */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-border/50 lg:hidden z-50">
        <Link to="/crear" className="block">
          <Button variant="default" size="lg" className="w-full h-12">
            <Gift className="w-5 h-5 mr-2" />
            {t('hero.cta.primary')}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>
    </main>
  );
};

export default IndexContent;
