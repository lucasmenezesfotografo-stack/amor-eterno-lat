import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  es: {
    // Navigation
    'nav.example': 'Ver ejemplo',
    'nav.create': 'Crear mi tarjeta',
    
    // Hero Section
    'hero.badge': 'Miles de historias de amor creadas 💕',
    'hero.headline': 'Regala una historia de amor que se abre con un QR.',
    'hero.subheadline': 'Diseña una tarjeta personalizada que revela una página única para tu pareja.',
    'hero.cta.primary': 'Crear mi tarjeta',
    'hero.cta.secondary': 'Ver ejemplo',
    'hero.trust.secure': 'Pago seguro',
    'hero.trust.time': 'Menos de 3 min',
    'hero.trust.price': '$3 USD para siempre',
    
    // Visual Steps
    'visual.step1': 'Entrega la tarjeta.',
    'visual.step2': 'Escanea el QR.',
    'visual.step3': 'Descubre la historia.',
    
    // How it works
    'how.badge': 'Simple y mágico',
    'how.title': '¿Cómo funciona?',
    'how.subtitle': 'En 3 simples pasos creas un regalo inolvidable.',
    'how.step1.title': 'Crea la página',
    'how.step1.desc': 'Sube fotos, elige música, escribe tu carta de amor.',
    'how.step2.title': 'Genera el QR',
    'how.step2.desc': 'Obtienes un código QR único y una tarjeta para imprimir.',
    'how.step3.title': 'Regala el momento',
    'how.step3.desc': 'Tu pareja escanea el QR y descubre la sorpresa.',
    
    // Features
    'features.badge': 'Todo incluido',
    'features.title': 'Un regalo completo',
    'features.subtitle': 'Cada detalle pensado para hacer este momento especial.',
    'features.qr.title': 'QR personalizado',
    'features.qr.desc': 'Código único que abre tu página de amor.',
    'features.card.title': 'Tarjeta imprimible',
    'features.card.desc': 'Descarga y regala físicamente o digitalmente.',
    'features.photos.title': 'Fotos y recuerdos',
    'features.photos.desc': 'Galería de momentos especiales.',
    'features.music.title': 'Música integrada',
    'features.music.desc': 'La canción que define su historia.',
    'features.letter.title': 'Carta de amor',
    'features.letter.desc': 'Escribe o genera con IA.',
    'features.counter.title': 'Contador del amor',
    'features.counter.desc': 'Tiempo juntos actualizado en tiempo real.',
    'features.private.title': 'Página privada',
    'features.private.desc': 'Solo accesible con el enlace QR.',
    'features.share.title': 'Compartible',
    'features.share.desc': 'Comparte en redes sociales.',
    'features.instant.title': 'Acceso instantáneo',
    'features.instant.desc': 'Activo inmediatamente después del pago.',
    
    // Emotional
    'emotional.text': 'Un simple gesto. Un QR. Un recuerdo para siempre.',
    'emotional.cta': 'Crear mi regalo ahora',
    
    // Social Proof
    'social.badge': 'Historias reales',
    'social.title': 'Personas enamorando todos los días',
    'social.subtitle': 'Miles de parejas ya crearon su página de amor.',
    'social.testimonial1.text': 'Mi novia lloró de emoción cuando escaneó el QR. El mejor regalo que le he dado.',
    'social.testimonial1.name': 'Carlos & María',
    'social.testimonial1.location': 'México',
    'social.testimonial2.text': 'Sorprendí a mi esposo en nuestro aniversario. La música comenzó a sonar y fue mágico.',
    'social.testimonial2.name': 'Ana & Pedro',
    'social.testimonial2.location': 'Colombia',
    'social.testimonial3.text': 'Pensé que sería difícil pero en 5 minutos tenía todo listo. Súper fácil y hermoso.',
    'social.testimonial3.name': 'Lucía & Diego',
    'social.testimonial3.location': 'Argentina',
    
    // Trust badges
    'trust.payment': 'Pago seguro',
    'trust.ssl': 'Conexión SSL',
    'trust.privacy': 'Privacidad',
    'trust.nospam': 'Sin spam',
    
    // Pricing
    'pricing.badge': 'Promoción San Valentín',
    'pricing.title': 'Todo esto por solo',
    'pricing.price': '$3 USD',
    'pricing.forever': 'para siempre',
    'pricing.micro': 'Pago único. Sin mensualidades. Acceso permanente.',
    'pricing.benefit1': 'Tarjeta imprimible o digital con QR',
    'pricing.benefit2': 'Página privada personalizada',
    'pricing.benefit3': 'Fotos + música integrada',
    'pricing.benefit4': 'Carta de amor personalizada',
    'pricing.benefit5': 'Contador del tiempo juntos',
    'pricing.benefit6': 'Acceso permanente',
    
    // Summary
    'summary.title': 'Tu regalo incluye:',
    'summary.subtitle': '¿Qué sucede después del pago?',
    'summary.step1': 'Se genera tu código QR automáticamente',
    'summary.step2': 'Descargas tu tarjeta lista para regalar',
    'summary.step3': 'Tu página queda activa para siempre',
    
    // Final CTA
    'final.title': 'Haz sonreír a',
    'final.highlight': 'la persona que amas hoy.',
    'final.subtitle': 'Toma menos de 3 minutos.',
    'final.cta': 'Crear mi tarjeta ahora',
    
    // Footer
    'footer.terms': 'Términos',
    'footer.privacy': 'Privacidad',
    'footer.contact': 'Contacto',
    'footer.copyright': '© 2025 Memory Link. Hecho con',
    'footer.rights': 'Todos los derechos reservados.',
    
    // Scroll
    'scroll.discover': 'Descubre más',
    
    // ============ REGALO PAGE ============
    'regalo.loading': 'Cargando tu regalo...',
    'regalo.notfound.title': 'Página no encontrada',
    'regalo.notfound.desc': 'Este regalo no existe o el enlace ha expirado.',
    'regalo.notfound.cta': 'Crear mi regalo',
    'regalo.together.since': 'Juntos desde',
    'regalo.time.title': 'Tiempo juntos',
    'regalo.time.subtitle': 'Cada segundo cuenta cuando estás enamorado',
    'regalo.letter.title': 'Carta de Amor',
    'regalo.letter.subtitle': 'Palabras del corazón',
    'regalo.qr.title': 'Descarga el QR Code',
    'regalo.qr.subtitle': 'Comparte este regalo especial',
    'regalo.qr.download': 'Descargar mi QR Code',
    'regalo.footer': 'Hecho con',
    'regalo.share.title': 'Compartir en redes',
    'regalo.share.copied': '¡Enlace copiado!',
    'regalo.share.copied.desc': 'Ya puedes compartirlo donde quieras',
    'regalo.share.copy': 'Copiar enlace',
    'regalo.share.more': 'Más opciones',
    
    // Counter labels
    'counter.years': 'Años',
    'counter.months': 'Meses',
    'counter.days': 'Días',
    'counter.hours': 'Horas',
    'counter.min': 'Min',
    
    // Music Overlay
    'music.title': 'Este regalo tiene música',
    'music.subtitle': 'Toca el botón para escuchar la canción elegida especialmente para ti',
    'music.play': '🎵 Reproducir Música',
    'music.skip': 'Continuar sin música',
    'music.youtube': 'La música se reproduce mediante YouTube',
    
    // ============ DEMO PAGE ============
    'demo.banner': '¡Esta es una demostración!',
    'demo.banner.short': 'Demo',
    'demo.cta': 'Crear la mía',
    'demo.cta.short': 'Crear',
    'demo.cta.price': 'Crear la mía por $3',
    'demo.share.title': 'Comparte el amor',
    'demo.share.download': 'Descargar QR Code',
    'demo.like.title': '¿Te gustó? Crea la tuya',
    'demo.time.badge': 'Tiempo de amor',
    'demo.time.title': 'Nuestra historia en números',
    'demo.time.subtitle': 'Cada segundo cuenta cuando estás enamorado',
    
    // ============ CREAR PAGE ============
    'crear.step1.title': 'Nombres',
    'crear.step1.desc': '¿Quiénes son ustedes?',
    'crear.step2.title': 'Foto y Música',
    'crear.step2.desc': 'Elige una foto y una canción',
    'crear.step3.title': 'Carta',
    'crear.step3.desc': 'Escribe o genera con IA',
    
    'crear.form.yourname': 'Tu nombre',
    'crear.form.yourname.placeholder': 'Ej: María',
    'crear.form.partnername': 'Nombre de tu amor',
    'crear.form.partnername.placeholder': 'Ej: Juan',
    'crear.form.date': 'Fecha de inicio de la relación',
    'crear.form.date.placeholder': 'Selecciona la fecha especial...',
    'crear.form.date.started': 'Su historia de amor comenzó',
    
    'crear.photo.title': 'Foto de portada',
    'crear.photo.upload': 'Haz clic para subir tu foto',
    'crear.photo.formats': 'JPG, PNG o WEBP (máx. 5MB)',
    'crear.photo.uploading': 'Subiendo foto...',
    'crear.photo.uploaded': 'Foto subida',
    'crear.photo.change': 'Cambiar',
    'crear.photo.position': 'Posición de los nombres',
    'crear.photo.position.top': 'Arriba',
    'crear.photo.position.center': 'Centro',
    'crear.photo.position.bottom': 'Abajo',
    
    'crear.ai.generate': 'Generar carta mágica con IA',
    'crear.ai.generating': 'Generando carta mágica...',
    'crear.letter.title': 'Tu carta de amor',
    'crear.letter.placeholder': 'Escribe tu carta aquí o usa la IA para generar...',
    'crear.letter.chars': 'caracteres',
    
    'crear.generate.title': 'Activa tu página de regalo',
    'crear.generate.subtitle': 'Acceso completo',
    'crear.payment.button': 'Pagar',
    'crear.payment.preparing': 'Preparando pago...',
    'crear.payment.secure': 'Pago seguro con Stripe • Apple Pay • Google Pay',
    'crear.payment.or': 'o',
    'crear.code.title': '¿Tienes un código de activación?',
    'crear.code.placeholder': 'Código de influencer',
    'crear.code.info': 'Los códigos de activación son para influencers y colaboradores.',
    'crear.cancel': 'Cancelar',
    
    'crear.qr.generate': 'Generar QR Code',
    'crear.qr.download': 'Descargar QR Code',
    'crear.qr.view': 'Ver página',
    'crear.qr.preparing': 'Preparando...',
    'crear.qr.title': 'Tu QR Code',
    
    'crear.nav.prev': 'Anterior',
    'crear.nav.next': 'Próximo',
    
    // Toasts
    'toast.photo.success.title': '¡Foto subida!',
    'toast.photo.success.desc': 'Tu foto de portada está lista.',
    'toast.photo.error.title': 'Error al subir',
    'toast.photo.error.desc': 'No se pudo subir la foto. Intenta de nuevo.',
    'toast.photo.invalid': 'Por favor selecciona un archivo de imagen válido.',
    'toast.photo.size': 'La imagen debe ser menor a 5MB.',
    'toast.fields.incomplete': 'Campos incompletos',
    'toast.fields.incomplete.desc': 'Por favor completa los nombres y la fecha.',
    'toast.code.empty': 'Código vacío',
    'toast.code.empty.desc': 'Por favor ingresa un código de activación.',
    'toast.code.success': '¡Código activado!',
    'toast.code.success.desc': 'Tu página está activa por 1 año.',
    'toast.code.invalid': 'Código inválido',
    'toast.code.invalid.desc': 'El código no es válido.',
    'toast.code.error': 'Error',
    'toast.code.error.desc': 'No se pudo validar el código. Intenta de nuevo.',
    'toast.payment.success': '¡Pago exitoso!',
    'toast.payment.success.desc': 'Tu página está activa 💖',
    'toast.payment.cancelled': 'Pago cancelado',
    'toast.payment.cancelled.desc': 'Puedes intentar de nuevo cuando quieras.',
    'toast.payment.error': 'Error',
    'toast.payment.error.desc': 'No se pudo iniciar el pago. Intenta de nuevo.',
    'toast.share.error.title': 'Error',
    'toast.share.error.desc': 'No se pudo copiar el enlace',
    
    // ============ PAGO EXITOSO ============
    'pago.verifying': 'Verificando pago...',
    'pago.success.title': '¡Pago Exitoso!',
    'pago.success.desc': 'Tu página de regalo está activa por 1 año. ¡Comparte el amor! 💖',
    'pago.success.cta': 'Ver mi página',
    'pago.thanks.title': '¡Gracias!',
    'pago.thanks.desc': 'Estamos procesando tu pago. Recibirás una confirmación pronto.',
    'pago.thanks.cta': 'Volver a crear',
    
    // ============ STRIPE MODAL ============
    'stripe.title': 'Completar pago',
    'stripe.secure': 'Pago 100% seguro',
    'stripe.processing': 'Procesando...',
    'stripe.pay': 'Pagar ahora',
    'stripe.methods': 'Aceptamos tarjetas, Apple Pay y Google Pay',
    'stripe.powered': 'Pago seguro procesado por Stripe',
    'stripe.promo.title': 'Código de promoción',
    'stripe.promo.placeholder': 'Ingresa tu código',
    'stripe.promo.apply': 'Aplicar',
    'stripe.promo.applied': '¡Aplicado!',
    'stripe.promo.discount': 'Descuento aplicado',
  },
  en: {
    // Navigation
    'nav.example': 'See example',
    'nav.create': 'Create my card',
    
    // Hero Section
    'hero.badge': 'Thousands of love stories created 💕',
    'hero.headline': 'Gift a love story that opens with a QR code.',
    'hero.subheadline': 'Design a personalized card that reveals a unique page for your partner.',
    'hero.cta.primary': 'Create my card',
    'hero.cta.secondary': 'See example',
    'hero.trust.secure': 'Secure payment',
    'hero.trust.time': 'Less than 3 min',
    'hero.trust.price': '$3 USD forever',
    
    // Visual Steps
    'visual.step1': 'Give the card.',
    'visual.step2': 'Scan the QR.',
    'visual.step3': 'Discover the story.',
    
    // How it works
    'how.badge': 'Simple and magical',
    'how.title': 'How does it work?',
    'how.subtitle': 'In 3 simple steps you create an unforgettable gift.',
    'how.step1.title': 'Create the page',
    'how.step1.desc': 'Upload photos, choose music, write your love letter.',
    'how.step2.title': 'Generate the QR',
    'how.step2.desc': 'Get a unique QR code and a card to print.',
    'how.step3.title': 'Gift the moment',
    'how.step3.desc': 'Your partner scans the QR and discovers the surprise.',
    
    // Features
    'features.badge': 'All included',
    'features.title': 'A complete gift',
    'features.subtitle': 'Every detail designed to make this moment special.',
    'features.qr.title': 'Custom QR',
    'features.qr.desc': 'Unique code that opens your love page.',
    'features.card.title': 'Printable card',
    'features.card.desc': 'Download and gift physically or digitally.',
    'features.photos.title': 'Photos & memories',
    'features.photos.desc': 'Gallery of special moments.',
    'features.music.title': 'Integrated music',
    'features.music.desc': 'The song that defines your story.',
    'features.letter.title': 'Love letter',
    'features.letter.desc': 'Write or generate with AI.',
    'features.counter.title': 'Love counter',
    'features.counter.desc': 'Time together updated in real-time.',
    'features.private.title': 'Private page',
    'features.private.desc': 'Only accessible with the QR link.',
    'features.share.title': 'Shareable',
    'features.share.desc': 'Share on social media.',
    'features.instant.title': 'Instant access',
    'features.instant.desc': 'Active immediately after payment.',
    
    // Emotional
    'emotional.text': 'A simple gesture. A QR. A memory forever.',
    'emotional.cta': 'Create my gift now',
    
    // Social Proof
    'social.badge': 'Real stories',
    'social.title': 'People falling in love every day',
    'social.subtitle': 'Thousands of couples have created their love page.',
    'social.testimonial1.text': 'My girlfriend cried with emotion when she scanned the QR. The best gift I have ever given her.',
    'social.testimonial1.name': 'Carlos & María',
    'social.testimonial1.location': 'Mexico',
    'social.testimonial2.text': 'I surprised my husband on our anniversary. The music started playing and it was magical.',
    'social.testimonial2.name': 'Ana & Pedro',
    'social.testimonial2.location': 'Colombia',
    'social.testimonial3.text': 'I thought it would be hard but in 5 minutes I had everything ready. Super easy and beautiful.',
    'social.testimonial3.name': 'Lucía & Diego',
    'social.testimonial3.location': 'Argentina',
    
    // Trust badges
    'trust.payment': 'Secure payment',
    'trust.ssl': 'SSL connection',
    'trust.privacy': 'Privacy',
    'trust.nospam': 'No spam',
    
    // Pricing
    'pricing.badge': "Valentine's Promotion",
    'pricing.title': 'All this for only',
    'pricing.price': '$3 USD',
    'pricing.forever': 'forever',
    'pricing.micro': 'One-time payment. No monthly fees. Lifetime access.',
    'pricing.benefit1': 'Printable or digital card with QR',
    'pricing.benefit2': 'Personalized private page',
    'pricing.benefit3': 'Photos + integrated music',
    'pricing.benefit4': 'Personalized love letter',
    'pricing.benefit5': 'Time together counter',
    'pricing.benefit6': 'Lifetime access',
    
    // Summary
    'summary.title': 'Your gift includes:',
    'summary.subtitle': 'What happens after payment?',
    'summary.step1': 'Your QR code is generated instantly',
    'summary.step2': 'Download your card ready to gift',
    'summary.step3': 'Your page is activated forever',
    
    // Final CTA
    'final.title': 'Make',
    'final.highlight': 'the person you love smile today.',
    'final.subtitle': 'Takes less than 3 minutes.',
    'final.cta': 'Create my card now',
    
    // Footer
    'footer.terms': 'Terms',
    'footer.privacy': 'Privacy',
    'footer.contact': 'Contact',
    'footer.copyright': '© 2025 Memory Link. Made with',
    'footer.rights': 'All rights reserved.',
    
    // Scroll
    'scroll.discover': 'Discover more',
    
    // ============ REGALO PAGE ============
    'regalo.loading': 'Loading your gift...',
    'regalo.notfound.title': 'Page not found',
    'regalo.notfound.desc': 'This gift does not exist or the link has expired.',
    'regalo.notfound.cta': 'Create my gift',
    'regalo.together.since': 'Together since',
    'regalo.time.title': 'Time together',
    'regalo.time.subtitle': 'Every second counts when you are in love',
    'regalo.letter.title': 'Love Letter',
    'regalo.letter.subtitle': 'Words from the heart',
    'regalo.qr.title': 'Download the QR Code',
    'regalo.qr.subtitle': 'Share this special gift',
    'regalo.qr.download': 'Download my QR Code',
    'regalo.footer': 'Made with',
    'regalo.share.title': 'Share on social media',
    'regalo.share.copied': 'Link copied!',
    'regalo.share.copied.desc': 'You can share it anywhere',
    'regalo.share.copy': 'Copy link',
    'regalo.share.more': 'More options',
    
    // Counter labels
    'counter.years': 'Years',
    'counter.months': 'Months',
    'counter.days': 'Days',
    'counter.hours': 'Hours',
    'counter.min': 'Min',
    
    // Music Overlay
    'music.title': 'This gift has music',
    'music.subtitle': 'Tap the button to listen to the song chosen specially for you',
    'music.play': '🎵 Play Music',
    'music.skip': 'Continue without music',
    'music.youtube': 'Music plays through YouTube',
    
    // ============ DEMO PAGE ============
    'demo.banner': 'This is a demo!',
    'demo.banner.short': 'Demo',
    'demo.cta': 'Create mine',
    'demo.cta.short': 'Create',
    'demo.cta.price': 'Create mine for $3',
    'demo.share.title': 'Share the love',
    'demo.share.download': 'Download QR Code',
    'demo.like.title': 'Like it? Create yours',
    'demo.time.badge': 'Love time',
    'demo.time.title': 'Our story in numbers',
    'demo.time.subtitle': 'Every second counts when you are in love',
    
    // ============ CREAR PAGE ============
    'crear.step1.title': 'Names',
    'crear.step1.desc': 'Who are you?',
    'crear.step2.title': 'Photo & Music',
    'crear.step2.desc': 'Choose a photo and a song',
    'crear.step3.title': 'Letter',
    'crear.step3.desc': 'Write or generate with AI',
    
    'crear.form.yourname': 'Your name',
    'crear.form.yourname.placeholder': 'E.g.: Mary',
    'crear.form.partnername': "Your love's name",
    'crear.form.partnername.placeholder': 'E.g.: John',
    'crear.form.date': 'Relationship start date',
    'crear.form.date.placeholder': 'Select the special date...',
    'crear.form.date.started': 'Your love story began',
    
    'crear.photo.title': 'Cover photo',
    'crear.photo.upload': 'Click to upload your photo',
    'crear.photo.formats': 'JPG, PNG or WEBP (max. 5MB)',
    'crear.photo.uploading': 'Uploading photo...',
    'crear.photo.uploaded': 'Photo uploaded',
    'crear.photo.change': 'Change',
    'crear.photo.position': 'Names position',
    'crear.photo.position.top': 'Top',
    'crear.photo.position.center': 'Center',
    'crear.photo.position.bottom': 'Bottom',
    
    'crear.ai.generate': 'Generate magic letter with AI',
    'crear.ai.generating': 'Generating magic letter...',
    'crear.letter.title': 'Your love letter',
    'crear.letter.placeholder': 'Write your letter here or use AI to generate...',
    'crear.letter.chars': 'characters',
    
    'crear.generate.title': 'Activate your gift page',
    'crear.generate.subtitle': 'Full access',
    'crear.payment.button': 'Pay',
    'crear.payment.preparing': 'Preparing payment...',
    'crear.payment.secure': 'Secure payment with Stripe • Apple Pay • Google Pay',
    'crear.payment.or': 'or',
    'crear.code.title': 'Have an activation code?',
    'crear.code.placeholder': 'Influencer code',
    'crear.code.info': 'Activation codes are for influencers and collaborators.',
    'crear.cancel': 'Cancel',
    
    'crear.qr.generate': 'Generate QR Code',
    'crear.qr.download': 'Download QR Code',
    'crear.qr.view': 'View page',
    'crear.qr.preparing': 'Preparing...',
    'crear.qr.title': 'Your QR Code',
    
    'crear.nav.prev': 'Previous',
    'crear.nav.next': 'Next',
    
    // Toasts
    'toast.photo.success.title': 'Photo uploaded!',
    'toast.photo.success.desc': 'Your cover photo is ready.',
    'toast.photo.error.title': 'Upload error',
    'toast.photo.error.desc': 'Could not upload the photo. Try again.',
    'toast.photo.invalid': 'Please select a valid image file.',
    'toast.photo.size': 'Image must be smaller than 5MB.',
    'toast.fields.incomplete': 'Incomplete fields',
    'toast.fields.incomplete.desc': 'Please complete the names and date.',
    'toast.code.empty': 'Empty code',
    'toast.code.empty.desc': 'Please enter an activation code.',
    'toast.code.success': 'Code activated!',
    'toast.code.success.desc': 'Your page is active for 1 year.',
    'toast.code.invalid': 'Invalid code',
    'toast.code.invalid.desc': 'The code is not valid.',
    'toast.code.error': 'Error',
    'toast.code.error.desc': 'Could not validate the code. Try again.',
    'toast.payment.success': 'Payment successful!',
    'toast.payment.success.desc': 'Your page is active 💖',
    'toast.payment.cancelled': 'Payment cancelled',
    'toast.payment.cancelled.desc': 'You can try again whenever you want.',
    'toast.payment.error': 'Error',
    'toast.payment.error.desc': 'Could not start payment. Try again.',
    'toast.share.error.title': 'Error',
    'toast.share.error.desc': 'Could not copy the link',
    
    // ============ PAGO EXITOSO ============
    'pago.verifying': 'Verifying payment...',
    'pago.success.title': 'Payment Successful!',
    'pago.success.desc': 'Your gift page is active for 1 year. Share the love! 💖',
    'pago.success.cta': 'View my page',
    'pago.thanks.title': 'Thank you!',
    'pago.thanks.desc': 'We are processing your payment. You will receive a confirmation soon.',
    'pago.thanks.cta': 'Go back to create',
    
    // ============ STRIPE MODAL ============
    'stripe.title': 'Complete payment',
    'stripe.secure': '100% secure payment',
    'stripe.processing': 'Processing...',
    'stripe.pay': 'Pay now',
    'stripe.methods': 'We accept cards, Apple Pay and Google Pay',
    'stripe.powered': 'Secure payment processed by Stripe',
    'stripe.promo.title': 'Promo code',
    'stripe.promo.placeholder': 'Enter your code',
    'stripe.promo.apply': 'Apply',
    'stripe.promo.applied': 'Applied!',
    'stripe.promo.discount': 'Discount applied',
  }
};

const STORAGE_KEY = 'memorylink-language';

function detectLanguage(): Language {
  // Check localStorage first for user preference
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'es' || stored === 'en') {
    return stored;
  }
  
  // Detect from browser language
  const browserLang = navigator.language || (navigator as any).userLanguage || '';
  
  // English-speaking countries detection
  if (browserLang.startsWith('en')) {
    return 'en';
  }
  
  // Default to Spanish for LatAm
  return 'es';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => detectLanguage());

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Language Toggle Component for header
export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();
  
  return (
    <div className="flex items-center gap-1 bg-card/60 backdrop-blur-sm rounded-full px-1 py-0.5 border border-border/50">
      <button
        onClick={() => setLanguage('es')}
        className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all ${
          language === 'es' 
            ? 'bg-primary text-primary-foreground' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        ES
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all ${
          language === 'en' 
            ? 'bg-primary text-primary-foreground' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        EN
      </button>
    </div>
  );
};

// Subtle Footer Language Toggle for /regalo/:id pages
export const FooterLanguageToggle = () => {
  const { language, setLanguage } = useLanguage();
  
  return (
    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/60">
      <button
        onClick={() => setLanguage('es')}
        className={`transition-colors hover:text-muted-foreground ${
          language === 'es' ? 'text-muted-foreground' : ''
        }`}
      >
        Español
      </button>
      <span>|</span>
      <button
        onClick={() => setLanguage('en')}
        className={`transition-colors hover:text-muted-foreground ${
          language === 'en' ? 'text-muted-foreground' : ''
        }`}
      >
        English
      </button>
    </div>
  );
};
