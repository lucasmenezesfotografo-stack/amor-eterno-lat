import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.25.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
  apiVersion: "2023-10-16",
});

const cryptoProvider = Stripe.createSubtleCryptoProvider();

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") as string,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string
);

serve(async (request) => {
  const signature = request.headers.get("Stripe-Signature");
  const body = await request.text();

  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      Deno.env.get("STRIPE_WEBHOOK_SIGNING_SECRET")!,
      undefined,
      cryptoProvider
    );
  } catch (err: any) {
    console.error("[stripe-webhook] Signature verification failed:", err.message);
    return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 400 });
  }

  console.log("[stripe-webhook] Processing event:", event.type);

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as Stripe.PaymentIntent;
    const giftPageId = pi.metadata?.giftPageId;

    if (!giftPageId) {
      console.error("[stripe-webhook] No giftPageId in metadata");
      return new Response(JSON.stringify({ ok: true, warning: "No giftPageId" }), { status: 200 });
    }

    // Update gift_pages
    const { error: updateError } = await supabaseAdmin
      .from("gift_pages")
      .update({
        is_active: true,
        paid_at: new Date().toISOString(),
        stripe_payment_intent_id: pi.id,
      })
      .eq("id", giftPageId);

    if (updateError) {
      console.error("[stripe-webhook] DB update error:", updateError);
    }

    // Upsert subscription
    await supabaseAdmin
      .from("gift_page_subscriptions")
      .upsert({
        gift_page_id: giftPageId,
        status: "active",
        stripe_session_id: pi.id,
        paid_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      });

    console.log("[stripe-webhook] Activated page:", giftPageId);
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
});
