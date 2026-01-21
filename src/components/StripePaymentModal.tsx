import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripeKey) {
  console.error("VITE_STRIPE_PUBLISHABLE_KEY not defined");
}

const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

type CheckoutFormProps = {
  onClose: () => void;
  onPaid: () => void;
};

function CheckoutForm({ onClose, onPaid }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    });

    if (error) {
      setErrorMessage(error.message || "Error al procesar el pago");
      setIsProcessing(false);
    } else {
      onPaid();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {errorMessage && (
        <p className="text-red-500 text-sm">{errorMessage}</p>
      )}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isProcessing}
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Procesando...
            </>
          ) : (
            "Pagar"
          )}
        </Button>
      </div>
    </form>
  );
}

type StripePaymentModalProps = {
  open: boolean;
  clientSecret: string;
  onClose: () => void;
  onPaid: () => void;
};

export function StripePaymentModal({
  open,
  clientSecret,
  onClose,
  onPaid,
}: StripePaymentModalProps) {
  if (!open || !clientSecret || !stripePromise) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-background border border-border rounded-xl p-6 w-full max-w-md mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold mb-4">Completar Pago</h2>
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: { theme: "night" },
          }}
        >
          <CheckoutForm onClose={onClose} onPaid={onPaid} />
        </Elements>
      </div>
    </div>
  );
}
