import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY
);

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
