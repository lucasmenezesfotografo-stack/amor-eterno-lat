import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

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
  if (!open || !clientSecret) return null;

  return (
    <div className="modal">
      <Elements
        stripe={stripePromise}
        options={{ clientSecret }}
      >
        <CheckoutForm onClose={onClose} />
      </Elements>
    </div>
  );
}
