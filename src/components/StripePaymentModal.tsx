import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  loadStripe,
  StripeElementsOptions,
  Appearance,
} from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import {
  Loader2,
  X,
  Shield,
  Lock,
  CreditCard,
  CheckCircle2,
} from "lucide-react";

/* =========================
   STRIPE INIT
========================= */

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripeKey) {
  console.error("VITE_STRIPE_PUBLISHABLE_KEY not defined");
}

const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

/* =========================
   STRIPE APPEARANCE
========================= */

const appearance: Appearance = {
  theme: "night",
  variables: {
    colorPrimary: "#a855f7",
    colorBackground: "#0c0c0f",
    colorText: "#ffffff",
    colorTextSecondary: "#a1a1aa",
    colorDanger: "#ef4444",
    borderRadius: "14px",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
};

/* =========================
   CHECKOUT FORM
========================= */

type CheckoutFormProps = {
  onClose: () => void;
  onPaid: () => void;
  amount: number;
  appliedPromotion: {
    code: string;
    percentOff: number | null;
    amountOff: number | null;
  } | null;
};

function CheckoutForm({
  onClose,
  onPaid,
  amount,
  appliedPromotion,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [processing, setProcessing] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: `${window.location.origin}/pago-exitoso`,
      },
    });

    if (result.error) {
      setError(result.error.message || "Error al procesar el pago");
      setProcessing(false);
    } else {
      onPaid();
    }
  };

  const formatPrice = (cents: number) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Security */}
      <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3">
        <Shield className="h-4 w-4 text-emerald-400" />
        <span className="text-sm text-emerald-400 font-medium">
          Pago seguro procesado por Stripe
        </span>
      </div>

      {/* Promo */}
      {appliedPromotion && (
        <div className="flex justify-between items-center rounded-xl bg-purple-500/10 border border-purple-500/20 px-4 py-3">
          <span className="text-sm text-purple-300">
            Código aplicado: <b>{appliedPromotion.code}</b>
          </span>
          <span className="text-sm text-purple-400 font-semibold">
            {appliedPromotion.percentOff
              ? `-${appliedPromotion.percentOff}%`
              : `-${formatPrice(appliedPromotion.amountOff || 0)}`}
          </span>
        </div>
      )}

      {/* Price */}
      <div className="text-center">
        <div className="text-4xl font-bold">{formatPrice(amount)}</div>
        <p className="text-zinc-400 text-sm">
          Pago único • Acceso de por vida
        </p>
      </div>

      {/* Stripe Element */}
      <div className="relative">
        <PaymentElement
          onReady={() => setReady(true)}
          options={{
            wallets: {
              applePay: "auto",
              googlePay: "auto",
            },
          }}
        />
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0c0c0f] rounded-xl">
            <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Actions */}
      <button
        type="submit"
        disabled={!stripe || !ready || processing}
        className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 py-4 font-semibold text-white disabled:opacity-50"
      >
        {processing ? "Procesando…" : "Pagar ahora"}
      </button>

      <button
        type="button"
        onClick={onClose}
        className="w-full rounded-xl border border-zinc-800 py-3 text-zinc-400 hover:text-white"
      >
        Cancelar
      </button>

      {/* Footer */}
      <div className="pt-3 border-t border-zinc-800 text-xs text-zinc-500 flex justify-center gap-4">
        <span className="flex items-center gap-1">
          <CreditCard className="h-4 w-4" /> Tarjetas
        </span>
        <span>Apple Pay</span>
        <span>Google Pay</span>
      </div>
    </form>
  );
}

/* =========================
   MODAL
========================= */

type StripePaymentModalProps = {
  open: boolean;
  clientSecret: string;
  onClose: () => void;
  onPaid: () => void;
  amount?: number;
  appliedPromotion?: {
    code: string;
    percentOff: number | null;
    amountOff: number | null;
  } | null;
};

export function StripePaymentModal({
  open,
  clientSecret,
  onClose,
  onPaid,
  amount = 500,
  appliedPromotion = null,
}: StripePaymentModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (open && clientSecret) {
      const t = setTimeout(() => setMounted(true), 50);
      return () => clearTimeout(t);
    }
    setMounted(false);
  }, [open, clientSecret]);

  if (!open || !clientSecret || !stripePromise) return null;

  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
    locale: "es",
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition ${
        mounted ? "bg-black/80 backdrop-blur-md" : "bg-black/0"
      }`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md mx-4">
        <div className="relative bg-[#0c0c0f] border border-zinc-800 rounded-2xl p-6 max-h-[90dvh] overflow-y-auto">
          {/* Close */}
          <button
            onClick={onClose}
            className="sticky top-0 ml-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <Lock className="mx-auto mb-3 h-10 w-10 text-purple-400" />
            <h2 className="text-2xl font-bold">Completar pago</h2>
            <p className="text-zinc-400 text-sm">
              Activa tu página de regalo personalizada
            </p>
          </div>

          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm
              onClose={onClose}
              onPaid={onPaid}
              amount={amount}
              appliedPromotion={appliedPromotion}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
}
