import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string
);

type CheckoutFormProps = {
  clientSecret: string;
  children?: React.ReactNode;
};

export default function CheckoutForm({
  clientSecret,
  children,
}: CheckoutFormProps) {
  if (!clientSecret) {
    return null;
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: { theme: "night" },
      }}
    >
      {children}
    </Elements>
  );
}