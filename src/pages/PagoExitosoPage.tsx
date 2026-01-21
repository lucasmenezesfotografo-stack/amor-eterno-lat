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

      // 🛡️ Proteção contra refresh / dupla ativação
      if (sessionStorage.getItem("payment_processed") === giftPageId) {
        setLoading(false);
        navigate(`/crear?gift_page_id=${giftPageId}`);
        return;
      }

      try {
        // 1️⃣ Ativa a página via Edge Function
        const { error: fnError } = await supabase.functions.invoke(
          "activate-gift-page",
          {
            body: { sessionId, giftPageId },
          }
        );

        if (fnError) throw fnError;

        // 2️⃣ Marca como processado (evita duplicidade)
        sessionStorage.setItem("payment_processed", giftPageId);

        toast({
          title: "¡Pago exitoso!",
          description: "Tu página está activa por 1 año 💖",
        });

        // 3️⃣ Redireciona para o editor
        setTimeout(() => {
          navigate(`/crear?gift_page_id=${giftPageId}`);
        }, 800);

      } catch (err) {
        console.error("Error activando página:", err);
        setError("Error al activar la página");
      } finally {
        setLoading(false);
      }
    };

    activateAndRedirect();
  }, [sessionId, giftPageId, navigate, toast]);

  // ⏳ Loading
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </main>
    );
  }

  // ❌ Erro
  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-6 text-center max-w-sm">
          <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-4" />
          <p className="mb-4">{error}</p>
          <Button onClick={() => navigate("/crear")}>
            Volver
          </Button>
        </div>
      </main>
    );
  }

  // ✅ Sucesso intermediário (quase não aparece)
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
