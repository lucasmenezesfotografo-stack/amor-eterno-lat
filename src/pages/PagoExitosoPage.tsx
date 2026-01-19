import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Heart, Loader2, AlertCircle, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PagoExitosoPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isActivating, setIsActivating] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get("session_id");
  const slug = searchParams.get("slug");
  const giftPageId = searchParams.get("gift_page_id");

  useEffect(() => {
    const activatePage = async () => {
      if (!sessionId || !giftPageId) {
        setError("Faltan parámetros de pago");
        setIsActivating(false);
        return;
      }

      try {
        const { data, error: fnError } = await supabase.functions.invoke("activate-gift-page", {
          body: { sessionId, giftPageId },
        });

        if (fnError) throw fnError;
        if (data?.error) throw new Error(data.error);

        setIsSuccess(true);
        toast({
          title: "¡Pago exitoso!",
          description: "Tu página de amor está activa por 1 año.",
        });
      } catch (err) {
        console.error("Error activating page:", err);
        setError("Error al activar la página. Por favor contacta soporte.");
      } finally {
        setIsActivating(false);
      }
    };

    activatePage();
  }, [sessionId, giftPageId, toast]);

  if (isActivating) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Activando tu página de amor...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 max-w-md text-center"
        >
          <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-semibold mb-4">Error en la activación</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button asChild>
            <Link to="/crear">Volver a intentar</Link>
          </Button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 max-w-md text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mx-auto mb-6"
        >
          <Check className="w-10 h-10 text-primary-foreground" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-2xl font-semibold mb-2">¡Pago Exitoso!</h1>
          <p className="text-muted-foreground mb-2">
            Tu página de amor está activa
          </p>
          <p className="text-sm text-primary font-medium mb-6">
            Válida por 1 año
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-3"
        >
          {slug && (
            <Button asChild variant="default" size="lg">
              <Link to={`/regalo/${slug}`}>
                <Heart className="w-5 h-5 fill-current" />
                Ver mi página de amor
              </Link>
            </Button>
          )}
          
          <Button asChild variant="outline" size="lg">
            <Link to="/crear">
              Crear otra página
            </Link>
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-xs text-muted-foreground mt-6"
        >
          Recibirás un recordatorio antes de que expire tu suscripción
        </motion.p>
      </motion.div>
    </main>
  );
};

export default PagoExitosoPage;
