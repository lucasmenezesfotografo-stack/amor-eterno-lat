import { useMemo, useState } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Loader2, X, AlertCircle } from "lucide-react";

/**
 * ⚠️ Stripe só pode ser inicializado se a key existir
 */
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as
  | string
  | undefined;

const stripePromise: Promise<Stripe | null> | null = stripePublicKey
  ? loadStripe(stripePublicKey)
  : null;

/* ------------------------------------------------------------------ */
/* ------------------------- CHECKOUT FORM --------------------------- */
/* ------------------------------------------------------------------ */

function CheckoutForm({
  onClose,
  onPaid,
}: {
  onClose: () => void;
  onPaid: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements) return;

    setLoading(true);

    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    setLoading(false);

    if (result.error) {
      alert(result.error.message);
      return;
    }

    onPaid();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center">
      <div className="w-full max-w-md bg-background rounded-2xl p-5 border border-border shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Pagar e ativar (1 ano)</h3>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <PaymentElement />

        <Button
          className="w-full mt-4"
          onClick={handlePay}
          disabled={!stripe || loading}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Pagar agora"
          )}
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ---------------------- STRIPE MODAL ROOT -------------------------- */
/* ------------------------------------------------------------------ */

export default function StripePaymentModal({
  open,
  clientSecret,
  onClose,
  onPaid,
}: {
  open: boolean;
  clientSecret: string | null;
  onClose: () => void;
  onPaid: () => void;
}) {
  /**
   * 🚫 Se não tiver key do Stripe → NÃO renderiza nada
   */
  if (!stripePromise) {
    console.error(
      "VITE_STRIPE_PUBLISHABLE_KEY não está definida no ambiente"
    );

    return open ? (
      <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center">
        <div className="bg-background p-6 rounded-xl text-center max-w-sm">
          <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-3" />
          <p className="text-sm">
            Pagamentos indisponíveis no momento.
          </p>
          <Button className="mt-4" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    ) : null;
  }

  const options = useMemo(() => {
    if (!clientSecret) return null;
    return { clientSecret };
  }, [clientSecret]);

  if (!open || !options) return null;

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm onClose={onClose} onPaid={onPaid} />
    </Elements>
  );
}
