import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@12.0.0";
import { createClient } from "jsr:@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
  apiVersion: "2024-11-20",
});

const cryptoProvider = Stripe.createSubtleCryptoProvider();

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") as string,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string
);

Deno.serve(async (request) => {
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
    return new Response(err.message, { status: 400 });
  }

  // ✅ quando pagamento deu certo
  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as Stripe.PaymentIntent;
    const giftPageId = pi.metadata?.giftPageId;

    if (giftPageId) {
      // 1) marca assinatura ativa
      await supabaseAdmin
        .from("gift_page_subscriptions")
        .upsert({
          gift_page_id: giftPageId,
          status: "active",
          stripe_payment_intent_id: pi.id,
        });

      // 2) marca a gift_page como ativa (se você usa essa coluna)
      await supabaseAdmin
        .from("gift_pages")
        .update({ is_active: true })
        .eq("id", giftPageId);
    }
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
});
