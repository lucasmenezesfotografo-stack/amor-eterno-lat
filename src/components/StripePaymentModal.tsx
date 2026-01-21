import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useMemo } from "react";

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripeKey) {
  throw new Error("VITE_STRIPE_PUBLISHABLE_KEY não definida");
}

const stripePromise = loadStripe(stripeKey);

export function StripePaymentModal({
  open,
  clientSecret,
  onClose,
}: {
  open: boolean;
  clientSecret: string | null;
  onClose: () => void;
}) {
  // 🔒 cria options UMA VEZ por clientSecret
  const options = useMemo(() => {
    if (!clientSecret) return undefined;
    return { clientSecret };
  }, [clientSecret]);

  if (!open || !options) return null;

  return (
    <div className="modal">
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm onClose={onClose} />
      </Elements>
    </div>
  );
}
