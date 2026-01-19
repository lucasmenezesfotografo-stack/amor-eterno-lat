import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

/**
 * ✅ CORS COMPLETO E CORRETO
 */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // ✅ PRE-FLIGHT (OBRIGATÓRIO PARA BROWSER)
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY not set");
    }

    const { giftPageId, slug, email } = await req.json();

    if (!giftPageId || !slug) {
      throw new Error("giftPageId and slug are required");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2025-08-27.basil",
    });

    const origin =
      req.headers.get("origin") ??
      "https://memoryl.ink";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email ?? undefined,
      line_items: [
        {
          price: "price_1Snl4iCGNOUldBA3nCM16qGk",
          quantity: 1,
        },
      ],
      success_url: `${origin}/pago-exitoso?session_id={CHECKOUT_SESSION_ID}&slug=${slug}&gift_page_id=${giftPageId}`,
      cancel_url: `${origin}/crear?cancelled=true`,
      metadata: {
        gift_page_id: giftPageId,
        slug,
      },
      payment_intent_data: {
        metadata: {
          gift_page_id: giftPageId,
          slug,
        },
      },
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: String(error) }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
