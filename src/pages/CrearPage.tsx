import { StripePaymentModal } from "@/components/StripePaymentModal";
import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Heart, ArrowLeft, ArrowRight, Upload, Music, FileText, QrCode, Check, Download, AlertCircle, Sparkles, Loader2, ImagePlus, X, CreditCard, MoveVertical, Camera, Gift, Ticket, Shield } from "lucide-react";
import MemoryUploader, { Memory } from "@/components/MemoryUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";
import SpotifyEmbed from "@/components/SpotifyEmbed";
import SoundtrackSelector, { romanticTracks, extractYoutubeVideoId, isValidYoutubeUrl } from "@/components/SoundtrackSelector";
import DatePickerWithYearMonth from "@/components/DatePickerWithYearMonth";
import PersonalizedCard from "@/components/PersonalizedCard";
import QuickRegister from "@/components/QuickRegister";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

// Validate Spotify URL
const validateSpotifyUrl = (url: string): { isValid: boolean; type?: string; id?: string } => {
  if (!url || url.trim() === "") return { isValid: false };
  const patterns = [
    /spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/,
    /spotify\.com\/embed\/(track|album|playlist)\/([a-zA-Z0-9]+)/,
    /spotify:(track|album|playlist):([a-zA-Z0-9]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return { isValid: true, type: match[1], id: match[2] };
  }
  return { isValid: false };
};

// Generate unique slug
const generateSlug = (person1: string, person2: string) => {
  const names = `${person1}-${person2}`.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-");
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `${names}-${timestamp}-${random}`;
};

const steps = [
  { id: 1, title: "Nombres", icon: Heart, description: "¿Quiénes son ustedes?" },
  { id: 2, title: "Foto y Música", icon: Upload, description: "Elige una foto y una canción" },
  { id: 3, title: "Carta", icon: FileText, description: "Escribe o genera con IA" },
];


const CrearPage = () => {
  const [paymentAmount, setPaymentAmount] = useState<number>(300);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const giftPageIdFromUrl = searchParams.get("gift_page_id");
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
 const [currentStep, setCurrentStep] = useState(1);


  const [formData, setFormData] = useState({
    person1: "",
    person2: "",
    startDate: undefined as Date | undefined,
    photoUrl: "",
    photoFile: null as File | null,
    selectedSong: null as number | null,
    spotifyUrl: "",
    loveLetter: "",
    selectedSoundtrack: null as string | null,
    soundtrackName: null as string | null,
    soundtrackArtist: null as string | null,
    youtubeVideoId: null as string | null,
    soundtrackAlbumCover: null as string | null,
    customYoutubeUrl: "",
    namesPosition: "center" as "top" | "center" | "bottom",
    memories: [] as Memory[],
  });
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSlug, setSavedSlug] = useState<string | null>(null);
  const [savedGiftPageId, setSavedGiftPageId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [isGeneratingLetter, setIsGeneratingLetter] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [isRestoring, setIsRestoring] = useState(!!giftPageIdFromUrl);

  const qrRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Payment and activation states
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
 
  
  const [activationCode, setActivationCode] = useState("");
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [isRedirectingToPayment, setIsRedirectingToPayment] = useState(false);

  // Check authentication status
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsCheckingAuth(false);
        
        // Pre-fill person1 with user's name if available
        if (session?.user?.user_metadata?.display_name && !formData.person1) {
          setFormData(prev => ({
            ...prev,
            person1: session.user.user_metadata.display_name,
          }));
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsCheckingAuth(false);
      
      if (session?.user?.user_metadata?.display_name && !formData.person1) {
        setFormData(prev => ({
          ...prev,
          person1: session.user.user_metadata.display_name,
        }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check for cancelled payment
  useEffect(() => {
    if (searchParams.get("cancelled") === "true") {
      toast({
        title: "Pago cancelado",
        description: "Puedes intentar de nuevo cuando quieras.",
        variant: "destructive",
      });
    }
  }, [searchParams, toast]);

 useEffect(() => {
  if (!giftPageIdFromUrl) {
    setIsRestoring(false);
    return;
  }

  const restorePaidPage = async () => {
    try {
      // 1️⃣ verifica se a página está ativa
      const { data: subscription } = await supabase
        .from("gift_page_subscriptions")
        .select("status")
        .eq("gift_page_id", giftPageIdFromUrl)
        .eq("status", "active")
        .maybeSingle();

      if (!subscription) {
        setIsRestoring(false);
        return;
      }

      // 2️⃣ busca a gift page REAL
      const { data: giftPage, error } = await supabase
        .from("gift_pages")
        .select("*")
        .eq("id", giftPageIdFromUrl)
        .single();

      if (error || !giftPage) {
        setIsRestoring(false);
        return;
      }

      // 3️⃣ restaura estado completo
      setFormData({
        person1: giftPage.your_name || "",
        person2: giftPage.partner_name || "",
        startDate: giftPage.start_date
          ? new Date(giftPage.start_date)
          : undefined,
        photoUrl: giftPage.cover_photo_url || "",
        photoFile: null,
        selectedSong: null,
        spotifyUrl: giftPage.spotify_link || "",
        loveLetter: giftPage.love_letter || "",
        selectedSoundtrack: null,
        soundtrackName: giftPage.soundtrack_name || null,
        soundtrackArtist: null,
        youtubeVideoId: giftPage.youtube_video_id || null,
        soundtrackAlbumCover: null,
        customYoutubeUrl: "",
        namesPosition: (giftPage.names_position as "top" | "center" | "bottom") || "center",
        memories: (Array.isArray(giftPage.memories) ? giftPage.memories : []) as unknown as Memory[],
      });

      setSavedGiftPageId(giftPage.id);
      setSavedSlug(giftPage.slug);
      setQrGenerated(true);
      setShowPaymentOptions(false);
      setCurrentStep(3);

      toast({
        title: "¡Pago exitoso!",
        description: "Tu página está activa 💖",
      });

    } catch (err) {
      console.error("Error restoring paid page:", err);
    } finally {
      // 🔴 ESSA LINHA É O QUE ESTAVA FALTANDO
      setIsRestoring(false);
    }
  };

  restorePaidPage();
}, [giftPageIdFromUrl]);



  const spotifyValidation = useMemo(() => validateSpotifyUrl(formData.spotifyUrl), [formData.spotifyUrl]);

  const regaloUrl = savedSlug ? `${window.location.origin}/regalo/${savedSlug}` : "";

  const handleAuthSuccess = () => {
    // User just registered, auth state change will update the user
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Save gift page to database (without activating it)
  const saveGiftPage = async (): Promise<{ id: string; slug: string } | null> => {
  // 🔒 SE JÁ EXISTE, NÃO CRIA DE NOVO
  if (savedGiftPageId && savedSlug) {
    return { id: savedGiftPageId, slug: savedSlug };
  }

  if (!formData.person1 || !formData.person2 || !formData.startDate) {
    toast({
      title: "Campos incompletos",
      description: "Por favor completa los nombres y la fecha.",
      variant: "destructive",
    });
    return null;
  }

  const slug = generateSlug(formData.person1, formData.person2);

  let finalYoutubeVideoId = formData.youtubeVideoId;
  if (formData.customYoutubeUrl && isValidYoutubeUrl(formData.customYoutubeUrl)) {
    finalYoutubeVideoId = extractYoutubeVideoId(formData.customYoutubeUrl);
  }

  const selectedTrack = formData.selectedSoundtrack
    ? romanticTracks.find(t => t.id === formData.selectedSoundtrack)
    : null;

  const { data, error } = await supabase
    .from("gift_pages")
    .insert({
      slug,
      your_name: formData.person1,
      partner_name: formData.person2,
      start_date: format(formData.startDate, "yyyy-MM-dd"),
      cover_photo_url: formData.photoUrl || null,
      love_letter: formData.loveLetter || null,
      soundtrack_name: formData.soundtrackName || selectedTrack?.name || null,
      youtube_video_id: finalYoutubeVideoId || null,
      spotify_link: formData.spotifyUrl || null,
      user_id: user?.id || null,
      names_position: formData.namesPosition,
      memories: formData.memories.length > 0
        ? JSON.parse(JSON.stringify(formData.memories))
        : null,
      is_active: false,
    })
    .select("id, slug")
    .single();

  if (error) throw error;

  // 🔒 GUARDA NO ESTADO
  setSavedGiftPageId(data.id);
  setSavedSlug(data.slug);

  return data;
};

  // Handle payment with Stripe
  
  const handlePayment = async () => {
    setIsSaving(true);

    try {
      // 1. Save the gift page first
      const giftPage = await saveGiftPage();
      if (!giftPage) return;

      // 2. Call edge function with optional promotion code
      const { data, error } = await supabase.functions.invoke(
        'create-payment-intent',
        {
          body: {
            giftPageId: giftPage.id,
            slug: giftPage.slug,
            email: user?.email,
          },
        }
      );

      if (error) throw error;

      // 3. Store payment data
      setClientSecret(data.clientSecret);
setPaymentAmount(data.amount); // 🔥 ISSO AQUI É O CORAÇÃO
setPaymentModalOpen(true);
      

      // 4. Open premium modal
      setPaymentModalOpen(true);

    } catch (err) {
      console.error("Payment error:", err);
      toast({
        title: "Error",
        description: "No se pudo iniciar el pago. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

 



  // Handle activation code validation
  const handleActivationCode = async () => {
    if (!activationCode.trim()) {
      toast({
        title: "Código vacío",
        description: "Por favor ingresa un código de activación.",
        variant: "destructive",
      });
      return;
    }

    setIsValidatingCode(true);
    setIsSaving(true);

    try {
      // First save the gift page if not already saved
      let giftPageId = savedGiftPageId;
      let slug = savedSlug;
      
      if (!giftPageId) {
        const giftPage = await saveGiftPage();
        if (!giftPage) {
          setIsValidatingCode(false);
          return;
        }
        giftPageId = giftPage.id;
        slug = giftPage.slug;
        setSavedGiftPageId(giftPage.id);
        setSavedSlug(giftPage.slug);
      }

      // Validate the activation code
      const { data, error } = await supabase.functions.invoke("validate-activation-code", {
        body: { code: activationCode, giftPageId },
      });

      if (error) throw error;
      
      if (data?.valid) {
        setQrGenerated(true);
        setShowPaymentOptions(false);
        toast({
          title: "¡Código activado!",
          description: data.message || "Tu página está activa por 1 año.",
        });
      } else {
        toast({
          title: "Código inválido",
          description: data?.error || "El código no es válido.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error validating code:", error);
      toast({
        title: "Error",
        description: "No se pudo validar el código. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsValidatingCode(false);
      setIsSaving(false);
    }
  };

  // Legacy handleGenerate - now shows payment options
  const handleGenerate = async () => {
    if (!formData.person1 || !formData.person2 || !formData.startDate) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa los nombres y la fecha.",
        variant: "destructive",
      });
      return;
    }
    
    setShowPaymentOptions(true);
  };

  // Handle photo upload
  const handlePhotoSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo de imagen válido.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "La imagen debe ser menor a 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingPhoto(true);

    try {
      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("gift-photos")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("gift-photos")
        .getPublicUrl(filePath);

      setFormData((prev) => ({
        ...prev,
        photoUrl: urlData.publicUrl,
        photoFile: file,
      }));

      toast({
        title: "¡Foto subida!",
        description: "Tu foto de portada está lista.",
      });
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast({
        title: "Error al subir",
        description: "No se pudo subir la foto. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingPhoto(false);
    }
  }, [toast]);

  const handleRemovePhoto = () => {
    setFormData((prev) => ({
      ...prev,
      photoUrl: "",
      photoFile: null,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownloadQR = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = 400;
      canvas.height = 400;
      if (ctx) {
        ctx.fillStyle = "#1a1a1a";
        ctx.beginPath();
        ctx.roundRect(0, 0, 400, 400, 20);
        ctx.fill();
        ctx.drawImage(img, 50, 50, 300, 300);
        ctx.fillStyle = "#e11d48";
        ctx.font = "bold 18px 'Inter', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`${formData.person1} ❤ ${formData.person2}`, 200, 385);
      }
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `forever-love-${formData.person1}-${formData.person2}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleGenerateAILetter = () => {
    setIsGeneratingLetter(true);
    const formattedDate = formData.startDate 
      ? format(formData.startDate, "d 'de' MMMM 'de' yyyy", { locale: es })
      : "en que nos conocimos";
    
    const letterTemplates = [
      `Mi amor ${formData.person2},\n\nDesde el día ${formattedDate}, mi vida cobró un nuevo significado.\n\nCada momento a tu lado es un regalo que guardo en el corazón. Tú me haces querer ser una mejor persona cada día, y contigo descubrí el verdadero significado del amor.\n\nGracias por elegir construir esta historia conmigo. Prometo seguir amándote con la misma intensidad de siempre.\n\nCon todo mi amor,\n${formData.person1}`,
      `${formData.person2}, mi gran amor,\n\nLas palabras parecen pequeñas para describir lo que siento por ti. Desde ${formattedDate}, cada día es una nueva aventura.\n\nEres mi paz en medio del caos, mi sonrisa en las mañanas difíciles, y mi certeza de que el amor verdadero existe.\n\nQue podamos construir mil memorias más juntos.\n\nTe amo infinitamente,\n${formData.person1}`,
    ];

    const randomLetter = letterTemplates[Math.floor(Math.random() * letterTemplates.length)];
    
    // Simulate typing effect
    let index = 0;
    const interval = setInterval(() => {
      setGeneratedText(randomLetter.slice(0, index));
      index++;
      if (index > randomLetter.length) {
        clearInterval(interval);
        setFormData({ ...formData, loveLetter: randomLetter });
        setIsGeneratingLetter(false);
      }
    }, 20);
  };

  // Loading state
  if (isCheckingAuth) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </main>
    );
  }

  // 🔒 Bloqueia render até auth + restore terminar
if (isCheckingAuth || isRestoring) {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </main>
  );
}

  // Show registration if not authenticated
  
  if (!user) {
    return (
      <main className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary fill-primary" />
              <span className="font-semibold">Memory Link</span>
            </Link>
          </div>
        </header>

        <section className="py-12 px-4">
          <QuickRegister onSuccess={handleAuthSuccess} />
        </section>
      </main>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tu nombre
              </label>
              <Input
                placeholder="Ej: María"
                value={formData.person1}
                onChange={(e) => setFormData({ ...formData, person1: e.target.value })}
                className="input-premium"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nombre de tu amor
              </label>
              <Input
                placeholder="Ej: Juan"
                value={formData.person2}
                onChange={(e) => setFormData({ ...formData, person2: e.target.value })}
                className="input-premium"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Fecha de inicio de la relación
              </label>
              <DatePickerWithYearMonth
                date={formData.startDate}
                onDateChange={(date) => setFormData({ ...formData, startDate: date })}
                placeholder="Selecciona la fecha especial..."
                disabled={(date) => date > new Date()}
                fromYear={1970}
                toYear={new Date().getFullYear()}
              />
              
              {formData.startDate && (
                <motion.div
                  className="mt-4 p-4 rounded-xl bg-primary/10 border border-primary/20"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Heart className="w-6 h-6 text-primary fill-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Su historia de amor comenzó</p>
                      <p className="text-lg font-semibold text-foreground">
                        {format(formData.startDate, "d 'de' MMMM, yyyy", { locale: es })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Foto de portada
              </label>
              
              {formData.photoUrl ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative rounded-2xl overflow-hidden aspect-video bg-secondary"
                >
                  <img
                    src={formData.photoUrl}
                    alt="Foto de portada"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  
                  {/* Names Position Preview */}
                  <div className={cn(
                    "absolute inset-0 flex flex-col px-4",
                    formData.namesPosition === "top" ? "justify-start pt-4" :
                    formData.namesPosition === "bottom" ? "justify-end pb-12" :
                    "justify-center"
                  )}>
                    <div className="text-center">
                      <p className="text-lg sm:text-xl font-display font-semibold text-white drop-shadow-lg">
                        {formData.person1 || "Tu"} & {formData.person2 || "Tu amor"}
                      </p>
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-foreground">Foto subida</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRemovePhoto}
                      className="bg-background/80 hover:bg-background"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cambiar
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer",
                    isUploadingPhoto
                      ? "border-primary/50 bg-primary/5"
                      : "border-border bg-secondary/30 hover:border-primary/50 hover:bg-secondary/50"
                  )}
                >
                  {isUploadingPhoto ? (
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-10 h-10 text-primary animate-spin" />
                      <p className="text-foreground font-medium">Subiendo foto...</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <ImagePlus className="w-8 h-8 text-primary" />
                      </div>
                      <p className="text-foreground font-medium mb-1">
                        Haz clic para subir tu foto
                      </p>
                      <p className="text-sm text-muted-foreground">
                        JPG, PNG o WEBP (máx. 5MB)
                      </p>
                    </>
                  )}
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
              />

              {/* Names Position Selector */}
              {formData.photoUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 rounded-xl bg-secondary/50 border border-border"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <MoveVertical className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Posición de los nombres</span>
                  </div>
                  <div className="flex gap-2">
                    {[
                      { value: "top", label: "Arriba" },
                      { value: "center", label: "Centro" },
                      { value: "bottom", label: "Abajo" },
                    ].map((position) => (
                      <button
                        key={position.value}
                        onClick={() => setFormData({ ...formData, namesPosition: position.value as "top" | "center" | "bottom" })}
                        className={cn(
                          "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all",
                          formData.namesPosition === position.value
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary hover:bg-secondary/80 text-foreground"
                        )}
                      >
                        {position.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Memories Section */}
            <div className="pt-6 border-t border-border">
              <MemoryUploader
                memories={formData.memories}
                onMemoriesChange={(memories) => setFormData({ ...formData, memories })}
                maxMemories={4}
              />
            </div>

            {/* Soundtrack Selection */}
            <div className="pt-6 border-t border-border">
              <SoundtrackSelector
                selectedTrack={formData.selectedSoundtrack}
                customYoutubeUrl={formData.customYoutubeUrl}
                onSelect={(trackId, trackData) => {
                  setFormData({ 
                    ...formData, 
                    selectedSoundtrack: trackId, 
                    soundtrackName: trackData?.name || null,
                    soundtrackArtist: trackData?.artist || null,
                    youtubeVideoId: trackData?.youtubeVideoId || null,
                    soundtrackAlbumCover: trackData?.albumCover || null,
                    spotifyUrl: "", 
                    selectedSong: null 
                  });
                }}
                onCustomUrlChange={(url) => {
                  setFormData({
                    ...formData,
                    customYoutubeUrl: url,
                  });
                }}
              />
            </div>

          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* AI Generate Button */}
            <div className="flex justify-center mb-6">
              <Button
                variant="outline"
                onClick={handleGenerateAILetter}
                disabled={isGeneratingLetter || !formData.person1 || !formData.person2}
                className="gap-2"
              >
                {isGeneratingLetter ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generando carta mágica...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generar carta mágica con IA
                  </>
                )}
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tu carta de amor
              </label>
              <Textarea
                placeholder="Escribe tu carta aquí o usa la IA para generar..."
                value={isGeneratingLetter ? generatedText : formData.loveLetter}
                onChange={(e) => setFormData({ ...formData, loveLetter: e.target.value })}
                className="min-h-[300px] text-base bg-secondary border-border rounded-xl resize-none"
                disabled={isGeneratingLetter}
              />
              <p className="mt-3 text-sm text-muted-foreground">
                {formData.loveLetter.length} caracteres
              </p>
            </div>

            {/* Generate QR Section */}
            {formData.loveLetter && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-8 border-t border-border"
              >
                <div className="text-center">
                  <motion.div
                    ref={qrRef}
                    className="w-56 h-56 mx-auto bg-card border border-border rounded-2xl flex items-center justify-center mb-6 p-4"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                  {qrGenerated ? (
                      <QRCodeSVG
                        value={regaloUrl}
                        size={180}
                        level="H"
                        includeMargin={false}
                        fgColor="#e11d48"
                        bgColor="transparent"
                      />
                    ) : (
                      <div className="text-center">
                        <QrCode className="w-16 h-16 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Tu QR Code</p>
                      </div>
                    )}
                  </motion.div>
                  
                  {qrGenerated && (
                    <motion.p
                      className="text-xs text-muted-foreground mb-4 break-all px-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {regaloUrl}
                    </motion.p>
                  )}
                  
                  {/* Payment Options Panel */}
                  {showPaymentOptions && !qrGenerated && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-6 mb-6 text-left shadow-2xl"
                    >
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500/10 rounded-xl mb-3">
                          <Gift className="w-6 h-6 text-purple-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Activa tu página de regalo</h3>
                        <p className="text-sm text-zinc-400 mt-1">Acceso completo</p>
                      </div>

                      
                      
                      {/* Payment Button */}
                      <Button 
  size="lg"
  className="w-full mb-4 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold py-6 text-lg shadow-lg shadow-purple-500/25"
  onClick={handlePayment}
  disabled={isSaving}
>
  {isSaving ? (
    <>
      <Loader2 className="w-5 h-5 animate-spin" />
      Preparando pago...
    </>
  ) : (
    <>
      <CreditCard className="w-5 h-5" />
      Pagar ${(paymentAmount / 100).toFixed(2)} USD
    </>
  )}
</Button>

                      <div className="flex items-center justify-center gap-2 text-zinc-500 text-xs mb-4">
                        <Shield className="w-3 h-3" />
                        <span>Pago seguro con Stripe • Apple Pay • Google Pay</span>
                      </div>
                      
                      <div className="flex items-center gap-4 my-4">
                        <div className="flex-1 h-px bg-zinc-800" />
                        <span className="text-sm text-zinc-500">o</span>
                        <div className="flex-1 h-px bg-zinc-800" />
                      </div>
                      
                      {/* Activation Code Input */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                          <Ticket className="w-4 h-4 text-purple-400" />
                          ¿Tienes un código de activación?
                        </label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Código de influencer"
                            value={activationCode}
                            onChange={(e) => setActivationCode(e.target.value.toUpperCase())}
                            className="flex-1 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 uppercase"
                            disabled={isValidatingCode}
                          />
                          <Button 
                            variant="outline"
                            onClick={handleActivationCode}
                            disabled={isValidatingCode || !activationCode.trim()}
                            className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                          >
                            {isValidatingCode ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-zinc-500">
                          Los códigos de activación son para influencers y colaboradores.
                        </p>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full mt-4 text-zinc-400 hover:text-white hover:bg-zinc-800"
                        onClick={() => setShowPaymentOptions(false)}
                      >
                        Cancelar
                      </Button>
                    </motion.div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {!qrGenerated && !showPaymentOptions ? (
                      <Button variant="default" size="lg" onClick={handleGenerate} disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Preparando...
                          </>
                        ) : (
                          <>
                            <QrCode className="w-5 h-5" />
                            Generar QR Code
                          </>
                        )}
                      </Button>
                    ) : qrGenerated ? (
                      <>
                        <Button variant="default" size="lg" onClick={handleDownloadQR}>
                          <Download className="w-5 h-5" />
                          Descargar QR Code
                        </Button>
                        <Link to={`/regalo/${savedSlug}`}>
                          <Button variant="outline" size="lg">
                            Ver página
                          </Button>
                        </Link>
                      </>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Personalized Card Section */}
            {qrGenerated && savedSlug && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="pt-8 border-t border-border"
              >
                <PersonalizedCard
                  person1={formData.person1}
                  person2={formData.person2}
                  qrUrl={regaloUrl}
                  photoUrl={formData.photoUrl}
                  startDate={formData.startDate}
                />
              </motion.div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary fill-primary" />
            <span className="font-semibold">Memory Link</span>
          </Link>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="border-b border-border bg-card/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center items-center gap-4 md:gap-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <motion.div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                      currentStep >= step.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    )}
                    whileHover={{ scale: 1.05 }}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </motion.div>
                  <span className={cn(
                    "text-xs mt-2 hidden md:block",
                    currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "w-12 md:w-24 h-0.5 mx-2 md:mx-4",
                    currentStep > step.id ? "bg-primary" : "bg-border"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                  {steps[currentStep - 1].title}
                </h1>
                <p className="text-muted-foreground">{steps[currentStep - 1].description}</p>
              </div>

              <div className="glass-card p-6 md:p-8">
                {renderStepContent()}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={currentStep === 1 ? "invisible" : ""}
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </Button>

            {currentStep < steps.length && (
              <Button variant="default" onClick={handleNext}>
                Próximo
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </section>
      {paymentModalOpen && clientSecret && (
        <StripePaymentModal
          open={paymentModalOpen}
          clientSecret={clientSecret}
          onClose={() => setPaymentModalOpen(false)}
          onPaid={() => {
            setPaymentModalOpen(false);
            setQrGenerated(true);
            setShowPaymentOptions(false);
            toast({
              title: "¡Pago exitoso!",
              description: "Tu página está activa por 1 año 💖",
            });
          }}
          amount={paymentAmount}
        />
      )}

  
    </main>
  );
};

export default CrearPage;
