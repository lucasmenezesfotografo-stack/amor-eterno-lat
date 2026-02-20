import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@17.7.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      return new Response(JSON.stringify({ error: "Missing Stripe key" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { giftPageId, paymentIntentId } = await req.json();

    if (!giftPageId || !paymentIntentId) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing giftPageId or paymentIntentId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("[verify-payment-intent] Verifying", { giftPageId, paymentIntentId });

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (
      paymentIntent.status === "succeeded" &&
      paymentIntent.metadata?.giftPageId === giftPageId
    ) {
      // Update gift_pages
      const { error: updateError } = await supabase
        .from("gift_pages")
        .update({
          is_active: true,
          paid_at: new Date().toISOString(),
          stripe_payment_intent_id: paymentIntentId,
        })
        .eq("id", giftPageId);

      if (updateError) {
        console.error("[verify-payment-intent] DB update error:", updateError);
        return new Response(
          JSON.stringify({ ok: false, error: "Database update failed" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Also upsert subscription record
      await supabase.from("gift_page_subscriptions").upsert({
        gift_page_id: giftPageId,
        status: "active",
        stripe_session_id: paymentIntentId,
        paid_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      });

      console.log("[verify-payment-intent] Success for", giftPageId);
      return new Response(
        JSON.stringify({ ok: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.warn("[verify-payment-intent] Not succeeded or metadata mismatch", {
      status: paymentIntent.status,
      metaGiftPageId: paymentIntent.metadata?.giftPageId,
      providedGiftPageId: giftPageId,
    });

    return new Response(
      JSON.stringify({ ok: false, message: "Payment not verified" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("[verify-payment-intent] Error:", err);
    return new Response(
      JSON.stringify({ ok: false, error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
