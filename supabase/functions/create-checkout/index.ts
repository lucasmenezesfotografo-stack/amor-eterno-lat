import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

/**
 * ✅ CORS CORRETO (ESSENCIAL PARA FUNCIONAR NO BROWSER)
 */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  /**
   * ✅ PRE-FLIGHT CORS (OBRIGATÓRIO)
   */
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    logStep("Function started");

    /**
     * ✅ STRIPE SECRET KEY (vem do Supabase → Secrets)
     */
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    logStep("Stripe key verified");

    /**
     * ✅ Supabase client (anon key é suficiente aqui)
     */
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    /**
     * ✅ Parse body
     */
    const { giftPageId, slug, email } = await req.json();
    logStep("Request body parsed", { giftPageId, slug, email });

    if (!giftPageId || !slug) {
      throw new Error("giftPageId and slug are required");
    }

    /**
     * ✅ Stripe client
     */
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2025-08-27.basil",
    });

    /**
     * ✅ Reutiliza cliente se existir
     */
    let customerId: string | undefined;
    if (email) {
      const customers = await stripe.customers.list({
        email,
        limit: 1,
      });

      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        logStep("Existing customer found", { customerId });
      }
    }

    /**
     * ✅ Origin seguro
     */
    const origin = req.headers.get("origin") || "https://memoryl.ink";

    /**
     * ✅ Cria sessão de checkout
     */
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : email,
      line_items: [
        {
          price: "price_1Snl4iCGNOUldBA3nCM16qGk",
          quantity: 1,
        },
      ],
      mode: "payment",
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

    logStep("Checkout session created", {
      sessionId: session.id,
      url: session.url,
    });

    /**
     * ✅ RESPONSE OK
     */
    return new Response(
      JSON.stringify({
        url: session.url,
        sessionId: session.id,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);

    logStep("ERROR", { message: errorMessage });

    return new Response(
      JSON.stringify({ error: errorMessage }),
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
