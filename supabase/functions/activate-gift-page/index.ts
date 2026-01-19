import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ACTIVATE-GIFT-PAGE] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { sessionId, giftPageId } = await req.json();
    logStep("Request body parsed", { sessionId, giftPageId });

    if (!sessionId || !giftPageId) {
      throw new Error("sessionId and giftPageId are required");
    }

    // Verify the payment with Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    logStep("Stripe session retrieved", { 
      status: session.payment_status,
      metadata: session.metadata 
    });

    if (session.payment_status !== "paid") {
      throw new Error("Payment not completed");
    }

    // Verify gift page ID matches
    if (session.metadata?.gift_page_id !== giftPageId) {
      throw new Error("Gift page ID mismatch");
    }

    // Calculate expiration (1 year from now)
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    // Create subscription record
    const { error: subError } = await supabase
      .from("gift_page_subscriptions")
      .upsert({
        gift_page_id: giftPageId,
        stripe_session_id: sessionId,
        stripe_customer_id: session.customer as string,
        status: "active",
        paid_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
      }, { onConflict: "gift_page_id" });

    if (subError) {
      logStep("Error creating subscription", { error: subError });
      throw subError;
    }
    logStep("Subscription record created");

    // Activate the gift page
    const { error: updateError } = await supabase
      .from("gift_pages")
      .update({ is_active: true })
      .eq("id", giftPageId);

    if (updateError) {
      logStep("Error activating gift page", { error: updateError });
      throw updateError;
    }
    logStep("Gift page activated");

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
