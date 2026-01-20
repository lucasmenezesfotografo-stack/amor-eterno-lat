import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PagoExitosoPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get("session_id");
  const giftPageId = searchParams.get("gift_page_id");

  useEffect(() => {
    const activateAndRedirect = async () => {
      if (!sessionId || !giftPageId) {
        setError("Parámetros de pago inválidos");
        setLoading(false);
        return;
      }

      try {
        // 1️⃣ Ativa a página
        const { error: fnError } = await supabase.functions.invoke(
          "activate-gift-page",
          {
            body: { sessionId, giftPageId },
          }
        );

        if (fnError) throw fnError;

        // 2️⃣ Busca o slug da página
        const { data: page, error: pageError } = await supabase
          .from("gift_pages")
          .select("slug")
          .eq("id", giftPageId)
          .single();

        if (pageError || !page?.slug) {
          throw new Error("No se pudo obtener la página");
        }

        toast({
          title: "¡Pago exitoso!",
          description: "Tu página está activa por 1 año 💖",
        });

        // 3️⃣ REDIRECIONA PARA O EDITOR CORRETO
        setTimeout(() => {
          navigate(`/crear?gift_page_id=${giftPageId}`);
        }, 800);

      } catch (err) {
        console.error(err);
        setError("Error al activar la página");
      } finally {
        setLoading(false);
      }
    };

    activateAndRedirect();
  }, [sessionId, giftPageId, navigate, toast]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-6 text-center">
          <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-4" />
          <p>{error}</p>
          <Button onClick={() => navigate("/crear")} className="mt-4">
            Volver
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card p-6 text-center"
      >
        <Check className="w-12 h-12 text-primary mx-auto mb-4" />
        <p>Redirigiendo a tu página…</p>
      </motion.div>
    </main>
  );
};

export default PagoExitosoPage;
