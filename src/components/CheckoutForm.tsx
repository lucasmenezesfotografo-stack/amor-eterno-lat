import { useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!
);

type Props = {
  clientSecret: string;
  children?: React.ReactNode;
};

const CheckoutForm = ({ clientSecret, children }: Props) => {
  useEffect(() => {
    if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
      console.error("VITE_STRIPE_PUBLISHABLE_KEY não definida");
    }
  }, []);

  if (!clientSecret) {
    return <p className="text-sm opacity-70">Inicializando pagamento…</p>;
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "night",
        },
      }}
    >
      {children}
    </Elements>
  );
};

export default CheckoutForm;
