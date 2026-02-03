import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, Loader2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage, LanguageToggle } from "@/hooks/use-language";

export default function PagoExitosoPage() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [giftPageId, setGiftPageId] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get("session_id");
      
      if (!sessionId) {
        setIsVerifying(false);
        return;
      }

      try {
        // Check if subscription was created
        const { data: subscription } = await supabase
          .from("gift_page_subscriptions")
          .select("gift_page_id, status")
          .eq("stripe_session_id", sessionId)
          .maybeSingle();

        if (subscription && subscription.status === "active") {
          setIsSuccess(true);
          setGiftPageId(subscription.gift_page_id);
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (isVerifying) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary mb-4" />
          <p className="text-muted-foreground">{t('pago.verifying')}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      {/* Language toggle in corner */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageToggle />
      </div>

      <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full text-center">
        {isSuccess ? (
          <>
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">{t('pago.success.title')}</h1>
            <p className="text-muted-foreground mb-6">
              {t('pago.success.desc')}
            </p>
            {giftPageId && (
              <Link to={`/crear?gift_page_id=${giftPageId}`}>
                <Button className="w-full">
                  <Heart className="w-4 h-4 mr-2" />
                  {t('pago.success.cta')}
                </Button>
              </Link>
            )}
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">{t('pago.thanks.title')}</h1>
            <p className="text-muted-foreground mb-6">
              {t('pago.thanks.desc')}
            </p>
            <Link to="/crear">
              <Button variant="outline" className="w-full">
                {t('pago.thanks.cta')}
              </Button>
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
