import { useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

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

    // ✅ pagamento ok
    onPaid();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 flex items-end sm:items-center justify-center">
      <div className="w-full sm:max-w-md bg-background rounded-t-2xl sm:rounded-2xl p-5 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Pagar e ativar (1 ano)</h3>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <PaymentElement />

        <Button className="w-full mt-4" onClick={handlePay} disabled={!stripe || loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Pagar agora"}
        </Button>
      </div>
    </div>
  );
}

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
