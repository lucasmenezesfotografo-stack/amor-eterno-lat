import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Heart, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PagoExitosoPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isActivating, setIsActivating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get("session_id");
  const giftPageId = searchParams.get("gift_page_id");

  useEffect(() => {
    const activatePage = async () => {
      if (!sessionId || !giftPageId) {
        setError("Faltan parámetros de pago");
        setIsActivating(false);
        return;
      }

      try {
        const { data, error: fnError } = await supabase.functions.invoke(
          "activate-gift-page",
          {
            body: { sessionId, giftPageId },
          }
        );

        if (fnError) throw fnError;
        if (data?.error) throw new Error(data.error);

        toast({
          title: "¡Pago exitoso!",
          description: "Tu página de amor está activa por 1 año 💖",
        });

        // ✅ REDIRECCIÓN AUTOMÁTICA AL MISMO FLUJO DEL CÓDIGO DE ACTIVACIÓN
        setTimeout(() => {
          navigate("/crear", {
            state: { activated: true },
          });
        }, 1200);

      } catch (err) {
        console.error("Error activating page:", err);
        setError("Error al activar la página. Por favor contacta soporte.");
      } finally {
        setIsActivating(false);
      }
    };

    activatePage();
  }, [sessionId, giftPageId, navigate, toast]);

  if (isActivating) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">
            Activando tu página de amor...
          </p>
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

          <h1 className="text-2xl font-semibold mb-4">
            Error en la activación
          </h1>

          <p className="text-muted-foreground mb-6">
            {error}
          </p>

          <Button asChild>
            <Link to="/crear">Volver a intentar</Link>
          </Button>
        </motion.div>
      </main>
    );
  }

  // ⚠️ Este retorno casi nunca se verá porque redirige automáticamente
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 max-w-md text-center"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-primary-foreground" />
        </div>

        <h1 className="text-2xl font-semibold mb-2">
          ¡Pago Exitoso!
        </h1>

        <p className="text-muted-foreground mb-6">
          Redirigiendo a tu página…
        </p>

        <Button asChild variant="outline">
          <Link to="/crear">
            Ir manualmente
          </Link>
        </Button>
      </motion.div>
    </main>
  );
};

export default PagoExitosoPage;
