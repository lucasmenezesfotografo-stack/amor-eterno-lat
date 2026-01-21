import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions, Appearance } from "@stripe/stripe-js";
import { useState, useEffect } from "react";
import { Loader2, X, Shield, Lock, CreditCard, CheckCircle2 } from "lucide-react";

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripeKey) {
  console.error("VITE_STRIPE_PUBLISHABLE_KEY not defined");
}

const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

// Premium dark appearance inspired by Stripe/Apple
const premiumAppearance: Appearance = {
  theme: "night",
  variables: {
    // Colors
    colorPrimary: "#a855f7",
    colorBackground: "#0c0c0f",
    colorText: "#ffffff",
    colorTextSecondary: "#a1a1aa",
    colorTextPlaceholder: "#71717a",
    colorDanger: "#ef4444",
    colorSuccess: "#22c55e",
    
    // Typography
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSizeBase: "16px",
    fontWeightNormal: "400",
    fontWeightMedium: "500",
    fontWeightBold: "600",
    
    // Spacing & Layout
    spacingUnit: "4px",
    borderRadius: "14px",
    
    // Focus ring
    focusBoxShadow: "0 0 0 3px rgba(168, 85, 247, 0.25)",
    focusOutline: "none",
  },
  rules: {
    ".Tab": {
      border: "1px solid #27272a",
      borderRadius: "14px",
      backgroundColor: "#18181b",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
      transition: "all 0.2s ease",
    },
    ".Tab:hover": {
      backgroundColor: "#1f1f23",
      borderColor: "#3f3f46",
    },
    ".Tab--selected": {
      backgroundColor: "#1f1f23",
      borderColor: "#a855f7",
      boxShadow: "0 0 0 1px #a855f7, 0 4px 12px rgba(168, 85, 247, 0.15)",
    },
    ".TabIcon": {
      fill: "#a1a1aa",
    },
    ".TabIcon--selected": {
      fill: "#a855f7",
    },
    ".TabLabel": {
      fontWeight: "500",
      color: "#e4e4e7",
    },
    ".TabLabel--selected": {
      color: "#ffffff",
    },
    ".Input": {
      backgroundColor: "#18181b",
      border: "1px solid #27272a",
      borderRadius: "12px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
      padding: "14px 16px",
      transition: "all 0.2s ease",
    },
    ".Input:hover": {
      borderColor: "#3f3f46",
    },
    ".Input:focus": {
      borderColor: "#a855f7",
      boxShadow: "0 0 0 3px rgba(168, 85, 247, 0.15), 0 1px 3px rgba(0, 0, 0, 0.2)",
    },
    ".Input--invalid": {
      borderColor: "#ef4444",
      boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.15)",
    },
    ".Label": {
      fontWeight: "500",
      color: "#e4e4e7",
      marginBottom: "8px",
    },
    ".Error": {
      color: "#ef4444",
      fontSize: "14px",
      marginTop: "8px",
    },
    ".CheckboxInput": {
      backgroundColor: "#18181b",
      borderColor: "#3f3f46",
      borderRadius: "6px",
    },
    ".CheckboxInput--checked": {
      backgroundColor: "#a855f7",
      borderColor: "#a855f7",
    },
  },
};

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

function CheckoutForm({ onClose, onPaid, amount, appliedPromotion }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/pago-exitoso`,
      },
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message || "Error al procesar el pago");
      setIsProcessing(false);
    } else {
      onPaid();
    }
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
        <Shield className="w-4 h-4 text-emerald-400" />
        <span className="text-sm text-emerald-400 font-medium">
          Pago seguro procesado por Stripe
        </span>
      </div>

      {/* Applied Promotion Banner */}
      {appliedPromotion && (
        <div className="flex items-center justify-between py-3 px-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-400 font-medium">
              Código aplicado: {appliedPromotion.code}
            </span>
          </div>
          <span className="text-sm text-purple-300 font-semibold">
            {appliedPromotion.percentOff
              ? `-${appliedPromotion.percentOff}%`
              : `-${formatPrice(appliedPromotion.amountOff || 0)}`}
          </span>
        </div>
      )}

      {/* Price Display */}
      <div className="text-center py-4">
        <div className="text-4xl font-bold text-white mb-1">
          {formatPrice(amount)}
        </div>
        <p className="text-zinc-400 text-sm">Pago único • Acceso de por vida</p>
      </div>

      {/* Payment Element */}
      <div className="relative">
        <PaymentElement
          onReady={() => setIsReady(true)}
          options={{
            layout: {
              type: "tabs",
              defaultCollapsed: false,
              radios: false,
              spacedAccordionItems: true,
            },
            business: {
              name: "MemoryLink",
            },
            wallets: {
              applePay: "auto",
              googlePay: "auto",
            },
          }}
        />
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0c0c0f] rounded-xl">
            <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
          </div>
        )}
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-center gap-2 py-3 px-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <span className="text-sm text-red-400">{errorMessage}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <button
          type="submit"
          disabled={!stripe || !isReady || isProcessing}
          className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 disabled:from-zinc-700 disabled:to-zinc-600 disabled:cursor-not-allowed text-white font-semibold text-lg rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Procesando...</span>
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              <span>Pagar ahora</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onClose}
          disabled={isProcessing}
          className="w-full py-3 px-6 bg-transparent hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-300 font-medium rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancelar
        </button>
      </div>

      {/* Trust Footer */}
      <div className="pt-4 border-t border-zinc-800/50">
        <div className="flex items-center justify-center gap-4 text-zinc-500 text-xs">
          <div className="flex items-center gap-1.5">
            <CreditCard className="w-4 h-4" />
            <span>Tarjetas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
            </svg>
            <span>Apple Pay</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
            </svg>
            <span>Google Pay</span>
          </div>
        </div>
        <p className="text-center text-zinc-600 text-xs mt-3">
          Aceptamos tarjetas, Apple Pay y Google Pay
        </p>
      </div>
    </form>
  );
}

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
  amount = 999,
  appliedPromotion = null,
}: StripePaymentModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (open && clientSecret) {
      // Small delay to ensure smooth animation
      const timer = setTimeout(() => setMounted(true), 50);
      return () => clearTimeout(timer);
    } else {
      setMounted(false);
    }
  }, [open, clientSecret]);

  if (!open || !clientSecret || !stripePromise) {
    return null;
  }

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: premiumAppearance,
    locale: "es",
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        mounted ? "bg-black/80 backdrop-blur-md" : "bg-black/0 backdrop-blur-none"
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className={`relative w-full max-w-md mx-4 transition-all duration-300 ${
          mounted 
            ? "opacity-100 scale-100 translate-y-0" 
            : "opacity-0 scale-95 translate-y-4"
        }`}
      >
        {/* Glow effect behind modal */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 via-pink-500/20 to-purple-600/20 rounded-2xl blur-xl opacity-75" />
        
        {/* Modal content */}
        <div className="relative bg-[#0c0c0f] border border-zinc-800/80 rounded-2xl p-6 shadow-2xl">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 rounded-lg transition-all duration-200"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500/10 rounded-xl mb-4">
              <Lock className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Completar pago
            </h2>
            <p className="text-zinc-400 text-sm mt-1">
              Activa tu página de regalo personalizada
            </p>
          </div>

          {/* Stripe Elements */}
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
