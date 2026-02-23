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
    'hero.headline': '🎁 El regalo que hará que tu novia se emocione (solo $3 USD)',
    'hero.subheadline': 'Sube sus fotos, agrega sus nombres y la fecha en que comenzó su historia. Creamos una página romántica que calcula en tiempo real cuánto llevan juntos.',
    'hero.cta.primary': 'Crear mi regalo ahora 💖 (solo $3)',
    'hero.cta.secondary': 'Ver ejemplo',
    'hero.trust.secure': '🔒 Pago seguro con Stripe · Acepta tarjetas internacionales',
    'hero.trust.time': 'Menos de 3 min',
    'hero.trust.price': '$3 USD para siempre',
    'hero.urgency': 'Precio promocional por tiempo limitado',
    
    // Benefits Section
    'benefits.1': '💞 Calcula automáticamente el tiempo que llevan juntos',
    'benefits.2': '📸 Personaliza con fotos especiales',
    'benefits.3': '💌 Agrega una carta romántica',
    'benefits.4': '🎶 Incluye una canción significativa',
    
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
    'social.title': 'Parejas que ya lo sorprendieron ❤️',
    'social.subtitle': 'Miles de parejas ya crearon su página de amor.',
    'social.testimonial1.text': 'Lo hice para nuestro aniversario y le encantó 😭',
    'social.testimonial1.name': 'Carlos M.',
    'social.testimonial1.location': 'México',
    'social.testimonial2.text': 'Es simple, rápido y súper romántico.',
    'social.testimonial2.name': 'Valeria R.',
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
    'final.title': 'No esperes más para',
    'final.highlight': 'sorprenderla.',
    'final.subtitle': 'Toma menos de 3 minutos.',
    'final.cta': 'Quiero mi página romántica 💘',
    
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
    
    // ============ PERSONALIZED CARD ============
    'card.header.title': 'Elige tu diseño de tarjeta',
    'card.header.subtitle': 'Personaliza y descarga tu tarjeta para imprimir',
    'card.layout.label': 'Estilo de tarjeta',
    'card.layout.classic': 'Clásico',
    'card.layout.minimal': 'Minimalista',
    'card.layout.horizontal': 'Horizontal',
    'card.layout.photofocus': 'Con Foto',
    'card.font.romantic': 'Fuente romántica',
    'card.font.names': 'Fuente para nombres',
    'card.accent.label': 'Color de acento',
    'card.message.label': 'Mensaje personalizado (opcional)',
    'card.message.placeholder': 'Ej: Te amo con todo mi corazón...',
    'card.toggle.photo': 'Foto',
    'card.toggle.date': 'Fecha',
    'card.selected': 'Estilo seleccionado:',
    'card.download': 'Descargar Tarjeta (JPG)',
    'card.qr.scan': 'Escanea aquí',
    'card.qr.discover': '¡Escanea y descubre!',
    'card.qr.story': 'Escanea el código QR para ver nuestra historia de amor',
    'card.qr.see': 'Escanea para ver nuestra historia',
    'card.signature': 'Con todo nuestro amor,',
    'card.default.message': 'Nuestros corazones están llenos de amor y gratitud. Gracias por ser parte de nuestra historia.',
    
    // ============ MEMORY UPLOADER ============
    'memories.title': 'Recuerdos Especiales',
    'memories.subtitle': 'Agrega hasta 4 fotos con pequeños mensajes para guardar momentos importantes de su historia.',
    'memories.add': 'Agregar recuerdo',
    'memories.of': 'de',
    'memories.photos': 'fotos',
    'memories.empty': 'Aún no has agregado recuerdos. ¡Sube tu primera foto para comenzar!',
    'memories.name.label': 'Nombre del momento',
    'memories.name.placeholder': 'Ej: Nuestra primera cita',
    'memories.desc.label': 'Descripción (opcional)',
    'memories.desc.placeholder': 'Escribe un mensaje corto...',
    'memories.uploading': 'Subiendo foto...',
    'memories.uploaded.title': '¡Foto subida!',
    'memories.uploaded.desc': 'Ahora puedes personalizar el nombre del recuerdo.',
    'memories.limit.title': 'Límite alcanzado',
    'memories.limit.desc': 'Solo puedes agregar',
    'memories.limit.suffix': 'recuerdos.',
    'memories.invalid.title': 'Archivo no válido',
    'memories.invalid.desc': 'Por favor selecciona un archivo de imagen.',
    'memories.size.title': 'Archivo muy grande',
    'memories.size.desc': 'La imagen debe ser menor a 5MB.',
    'memories.error.title': 'Error al subir',
    'memories.error.desc': 'No se pudo subir la foto. Intenta de nuevo.',
    'memories.default.title': 'Recuerdo especial',
    
    // ============ SOUNDTRACK SELECTOR ============
    'soundtrack.title': 'Elige tu Canción',
    'soundtrack.subtitle': 'La música se reproduce mediante YouTube',
    'soundtrack.custom.label': '¿Quieres otra canción? Pega aquí el enlace de YouTube',
    'soundtrack.custom.placeholder': 'https://www.youtube.com/watch?v=...',
    'soundtrack.custom.error': 'Por favor, ingresa un enlace válido de YouTube',
    'soundtrack.custom.name': 'Canción personalizada',
    'soundtrack.custom.priority': 'Esta canción tendrá prioridad',
  },
  en: {
    // Navigation
    'nav.example': 'See example',
    'nav.create': 'Create my card',
    
    // Hero Section
    'hero.badge': 'Thousands of love stories created 💕',
    'hero.headline': '🎁 The gift that will make your girlfriend emotional (only $3 USD)',
    'hero.subheadline': 'Upload your photos, add your names and your anniversary date. We create a romantic page that calculates in real time how long you\'ve been together.',
    'hero.cta.primary': 'Create my romantic gift 💖 (only $3)',
    'hero.cta.secondary': 'See example',
    'hero.trust.secure': '🔒 Secure payment via Stripe · International cards accepted',
    'hero.trust.time': 'Less than 3 min',
    'hero.trust.price': '$3 USD forever',
    'hero.urgency': 'Limited-time promotional price',
    
    // Benefits Section
    'benefits.1': '💞 Automatically calculates your time together',
    'benefits.2': '📸 Personalize with special photos',
    'benefits.3': '💌 Add a romantic letter',
    'benefits.4': '🎶 Include a meaningful song',
    
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
    'social.title': 'Couples who already surprised their partners ❤️',
    'social.subtitle': 'Thousands of couples have created their love page.',
    'social.testimonial1.text': 'I made this for our anniversary and she loved it 😭',
    'social.testimonial1.name': 'Daniel R.',
    'social.testimonial1.location': 'USA',
    'social.testimonial2.text': "It's simple, fast and incredibly romantic.",
    'social.testimonial2.name': 'Amanda S.',
    'social.testimonial2.location': 'Canada',
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
    'final.title': "Don't wait to",
    'final.highlight': 'surprise her.',
    'final.subtitle': 'Takes less than 3 minutes.',
    'final.cta': 'I want my romantic page 💘',
    
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
    
    // ============ PERSONALIZED CARD ============
    'card.header.title': 'Choose your card design',
    'card.header.subtitle': 'Customize and download your card to print',
    'card.layout.label': 'Card style',
    'card.layout.classic': 'Classic',
    'card.layout.minimal': 'Minimalist',
    'card.layout.horizontal': 'Horizontal',
    'card.layout.photofocus': 'With Photo',
    'card.font.romantic': 'Romantic font',
    'card.font.names': 'Font for names',
    'card.accent.label': 'Accent color',
    'card.message.label': 'Custom message (optional)',
    'card.message.placeholder': 'E.g.: I love you with all my heart...',
    'card.toggle.photo': 'Photo',
    'card.toggle.date': 'Date',
    'card.selected': 'Selected style:',
    'card.download': 'Download Card (JPG)',
    'card.qr.scan': 'Scan here',
    'card.qr.discover': 'Scan and discover!',
    'card.qr.story': 'Scan the QR code to see our love story',
    'card.qr.see': 'Scan to see our story',
    'card.signature': 'With all our love,',
    'card.default.message': 'Our hearts are full of love and gratitude. Thank you for being part of our story.',
    
    // ============ MEMORY UPLOADER ============
    'memories.title': 'Special Memories',
    'memories.subtitle': 'Add up to 4 photos with short messages to save important moments of your story.',
    'memories.add': 'Add memory',
    'memories.of': 'of',
    'memories.photos': 'photos',
    'memories.empty': "You haven't added any memories yet. Upload your first photo to start!",
    'memories.name.label': 'Moment name',
    'memories.name.placeholder': 'E.g.: Our first date',
    'memories.desc.label': 'Description (optional)',
    'memories.desc.placeholder': 'Write a short message...',
    'memories.uploading': 'Uploading photo...',
    'memories.uploaded.title': 'Photo uploaded!',
    'memories.uploaded.desc': 'Now you can customize the memory name.',
    'memories.limit.title': 'Limit reached',
    'memories.limit.desc': 'You can only add',
    'memories.limit.suffix': 'memories.',
    'memories.invalid.title': 'Invalid file',
    'memories.invalid.desc': 'Please select a valid image file.',
    'memories.size.title': 'File too large',
    'memories.size.desc': 'Image must be smaller than 5MB.',
    'memories.error.title': 'Upload error',
    'memories.error.desc': 'Could not upload the photo. Try again.',
    'memories.default.title': 'Special memory',
    
    // ============ SOUNDTRACK SELECTOR ============
    'soundtrack.title': 'Choose your Song',
    'soundtrack.subtitle': 'Music plays through YouTube',
    'soundtrack.custom.label': 'Want another song? Paste the YouTube link here',
    'soundtrack.custom.placeholder': 'https://www.youtube.com/watch?v=...',
    'soundtrack.custom.error': 'Please enter a valid YouTube link',
    'soundtrack.custom.name': 'Custom song',
    'soundtrack.custom.priority': 'This song will have priority',
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
