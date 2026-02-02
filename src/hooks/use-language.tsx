import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  es: {
    // Navigation
    'nav.example': 'Ver ejemplo',
    'nav.create': 'Crear mi tarjeta',
    
    // Hero Section
    'hero.badge': 'El regalo perfecto para tu amor 💕',
    'hero.headline': 'Regala una historia de amor que se abre con un QR.',
    'hero.subheadline': 'Diseña una tarjeta personalizada que revela una página única para tu pareja.',
    'hero.cta.primary': 'Crear mi tarjeta',
    'hero.cta.secondary': 'Ver ejemplo',
    'hero.trust.secure': 'Pago seguro',
    'hero.trust.time': 'Listo en 3 min',
    'hero.trust.price': '$3 para siempre',
    
    // Visual Explanation
    'visual.step1': 'Entrega la tarjeta.',
    'visual.step2': 'Escanea el QR.',
    'visual.step3': 'Descubre la historia.',
    
    // How it Works
    'how.badge': 'Así de fácil',
    'how.title': 'Crea tu regalo en 3 pasos',
    'how.subtitle': 'Sin complicaciones. Tu tarjeta lista en minutos.',
    'how.step1.title': 'Crea la página',
    'how.step1.desc': 'Agrega sus nombres, fotos, música y una carta especial.',
    'how.step2.title': 'Genera el QR',
    'how.step2.desc': 'Tu código QR único se genera automáticamente.',
    'how.step3.title': 'Regala el momento',
    'how.step3.desc': 'Imprime o comparte la tarjeta con el código QR.',
    
    // Features
    'features.badge': 'Todo incluido',
    'features.title': 'Todo lo que incluye tu regalo',
    'features.subtitle': 'Una experiencia premium para celebrar su amor',
    'features.qr.title': 'QR personalizado',
    'features.qr.desc': 'Código único que abre su página de amor.',
    'features.card.title': 'Tarjeta imprimible',
    'features.card.desc': 'Diseño listo para imprimir o compartir digital.',
    'features.photos.title': 'Galería de fotos',
    'features.photos.desc': 'Sube las fotos que cuentan su historia.',
    'features.music.title': 'Música integrada',
    'features.music.desc': 'La canción que define su relación.',
    'features.letter.title': 'Carta personalizada',
    'features.letter.desc': 'Palabras de amor que quedan para siempre.',
    'features.counter.title': 'Contador de amor',
    'features.counter.desc': 'Cada segundo juntos contando en tiempo real.',
    'features.private.title': 'Página privada',
    'features.private.desc': 'Solo quien tenga el link puede verla.',
    'features.share.title': 'Compartible por link',
    'features.share.desc': 'Envía por WhatsApp, email o imprime.',
    'features.instant.title': 'Regalo inmediato',
    'features.instant.desc': 'Tu página lista en minutos.',
    
    // Emotional
    'emotional.text': 'Un simple gesto. Un QR. Un recuerdo para siempre.',
    'emotional.cta': 'Crear este momento',
    
    // Social Proof
    'social.badge': 'Historias reales',
    'social.title': 'Parejas celebrando su amor',
    'social.subtitle': 'Testimonios de quienes ya regalaron su historia',
    'social.testimonial1.text': 'Le di la tarjeta y cuando escaneó el QR... ¡lloró de emoción! El mejor regalo de aniversario.',
    'social.testimonial1.name': 'María & Carlos',
    'social.testimonial1.location': 'México',
    'social.testimonial2.text': 'Súper fácil de crear. La música, las fotos, el contador... quedó hermoso. 100% recomendado.',
    'social.testimonial2.name': 'Valentina & Andrés',
    'social.testimonial2.location': 'Colombia',
    'social.testimonial3.text': 'Mi esposo lo abre todos los días. La tarjeta está en su escritorio. Un regalo que perdura.',
    'social.testimonial3.name': 'Lucía & Diego',
    'social.testimonial3.location': 'Argentina',
    
    // Trust Badges
    'trust.payment': 'Pago seguro',
    'trust.ssl': 'SSL encriptado',
    'trust.privacy': 'Privacidad garantizada',
    'trust.nospam': 'Sin spam',
    
    // Pricing
    'pricing.badge': '🎁 Promoción San Valentín',
    'pricing.title': 'Promoción San Valentín',
    'pricing.price': '$3 USD',
    'pricing.forever': 'para siempre',
    'pricing.micro': 'Pago único. Sin mensualidades. Acceso permanente.',
    'pricing.benefit1': 'Tarjeta imprimible o digital con QR',
    'pricing.benefit2': 'Página privada personalizada',
    'pricing.benefit3': 'Fotos + música integrada',
    'pricing.benefit4': 'Carta de amor personalizada',
    'pricing.benefit5': 'Contador del tiempo juntos',
    'pricing.benefit6': 'Acceso permanente',
    
    // Gift Summary
    'summary.title': 'Tu regalo incluye:',
    'summary.subtitle': '¿Qué sucede después del pago?',
    'summary.step1': 'Se genera tu código QR automáticamente',
    'summary.step2': 'Descargas tu tarjeta lista para regalar',
    'summary.step3': 'Tu página queda activa y privada para siempre',
    
    // Final CTA
    'final.title': 'Haz sonreír a la persona que amas',
    'final.highlight': 'hoy.',
    'final.subtitle': 'Toma menos de 3 minutos.',
    'final.cta': 'Crear mi tarjeta ahora',
    
    // Footer
    'footer.privacy': 'Privacidad',
    'footer.terms': 'Términos',
    'footer.contact': 'Contacto',
    'footer.rights': 'Todos los derechos reservados.',
    
    // Scroll
    'scroll.discover': 'Descubre más',
  },
  en: {
    // Navigation
    'nav.example': 'See example',
    'nav.create': 'Create my card',
    
    // Hero Section
    'hero.badge': 'The perfect gift for your love 💕',
    'hero.headline': 'Gift a love story that opens with a QR code.',
    'hero.subheadline': 'Design a personalized card that reveals a unique page for your partner.',
    'hero.cta.primary': 'Create my card',
    'hero.cta.secondary': 'See example',
    'hero.trust.secure': 'Secure payment',
    'hero.trust.time': 'Ready in 3 min',
    'hero.trust.price': '$3 forever',
    
    // Visual Explanation
    'visual.step1': 'Hand over the card.',
    'visual.step2': 'Scan the QR.',
    'visual.step3': 'Discover the story.',
    
    // How it Works
    'how.badge': 'Super easy',
    'how.title': 'Create your gift in 3 steps',
    'how.subtitle': 'No complications. Your card ready in minutes.',
    'how.step1.title': 'Create the page',
    'how.step1.desc': 'Add names, photos, music and a special letter.',
    'how.step2.title': 'Generate the QR',
    'how.step2.desc': 'Your unique QR code is generated automatically.',
    'how.step3.title': 'Gift the moment',
    'how.step3.desc': 'Print or share the card with the QR code.',
    
    // Features
    'features.badge': 'All included',
    'features.title': 'Everything included in your gift',
    'features.subtitle': 'A premium experience to celebrate your love',
    'features.qr.title': 'Personalized QR',
    'features.qr.desc': 'Unique code that opens your love page.',
    'features.card.title': 'Printable card',
    'features.card.desc': 'Design ready to print or share digitally.',
    'features.photos.title': 'Photo gallery',
    'features.photos.desc': 'Upload the photos that tell your story.',
    'features.music.title': 'Integrated music',
    'features.music.desc': 'The song that defines your relationship.',
    'features.letter.title': 'Personalized letter',
    'features.letter.desc': 'Words of love that last forever.',
    'features.counter.title': 'Love counter',
    'features.counter.desc': 'Every second together counting in real time.',
    'features.private.title': 'Private page',
    'features.private.desc': 'Only those with the link can see it.',
    'features.share.title': 'Shareable by link',
    'features.share.desc': 'Send via WhatsApp, email or print.',
    'features.instant.title': 'Instant gift',
    'features.instant.desc': 'Your page ready in minutes.',
    
    // Emotional
    'emotional.text': 'A simple gesture. A QR. A memory forever.',
    'emotional.cta': 'Create this moment',
    
    // Social Proof
    'social.badge': 'Real stories',
    'social.title': 'Couples celebrating their love',
    'social.subtitle': 'Testimonials from those who already gifted their story',
    'social.testimonial1.text': 'I gave her the card and when she scanned the QR... she cried with emotion! Best anniversary gift.',
    'social.testimonial1.name': 'Maria & Carlos',
    'social.testimonial1.location': 'Mexico',
    'social.testimonial2.text': 'Super easy to create. The music, photos, counter... it turned out beautiful. 100% recommended.',
    'social.testimonial2.name': 'Valentina & Andrew',
    'social.testimonial2.location': 'Colombia',
    'social.testimonial3.text': 'My husband opens it every day. The card is on his desk. A gift that lasts.',
    'social.testimonial3.name': 'Lucy & Diego',
    'social.testimonial3.location': 'Argentina',
    
    // Trust Badges
    'trust.payment': 'Secure payment',
    'trust.ssl': 'SSL encrypted',
    'trust.privacy': 'Privacy guaranteed',
    'trust.nospam': 'No spam',
    
    // Pricing
    'pricing.badge': '🎁 Valentine\'s Promotion',
    'pricing.title': 'Valentine\'s Promotion',
    'pricing.price': '$3 USD',
    'pricing.forever': 'forever',
    'pricing.micro': 'One-time payment. No monthly fees. Lifetime access.',
    'pricing.benefit1': 'Printable or digital card with QR',
    'pricing.benefit2': 'Personalized private page',
    'pricing.benefit3': 'Photos + integrated music',
    'pricing.benefit4': 'Personalized love letter',
    'pricing.benefit5': 'Time together counter',
    'pricing.benefit6': 'Lifetime access',
    
    // Gift Summary
    'summary.title': 'Your gift includes:',
    'summary.subtitle': 'What happens after payment?',
    'summary.step1': 'Your QR code is generated instantly',
    'summary.step2': 'Download your card ready to gift',
    'summary.step3': 'Your private page is activated forever',
    
    // Final CTA
    'final.title': 'Make the person you love smile',
    'final.highlight': 'today.',
    'final.subtitle': 'Takes less than 3 minutes.',
    'final.cta': 'Create my card now',
    
    // Footer
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms',
    'footer.contact': 'Contact',
    'footer.rights': 'All rights reserved.',
    
    // Scroll
    'scroll.discover': 'Discover more',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Countries where English should be the default
const englishCountries = ['US', 'CA', 'GB', 'AU', 'NZ', 'IE'];

function detectLanguage(): Language {
  // Check localStorage first
  const stored = localStorage.getItem('preferred-language') as Language | null;
  if (stored && (stored === 'es' || stored === 'en')) {
    return stored;
  }
  
  // Check browser language
  const browserLang = navigator.language || (navigator as any).userLanguage || '';
  if (browserLang.startsWith('en')) {
    return 'en';
  }
  
  // Default to Spanish for Latin America focus
  return 'es';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => detectLanguage());
  
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('preferred-language', lang);
  };
  
  const t = (key: string): string => {
    const langTranslations = translations[language];
    return (langTranslations as Record<string, string>)[key] || key;
  };
  
  useEffect(() => {
    // Set document language attribute
    document.documentElement.lang = language;
  }, [language]);
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
