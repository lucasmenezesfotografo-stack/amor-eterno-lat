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
    if (!stripeKey) throw new Error("Missing STRIPE_SECRET_KEY");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const daysBack = 90;
    const sinceTimestamp = Math.floor((Date.now() - daysBack * 24 * 60 * 60 * 1000) / 1000);

    let updated = 0;
    let noGiftPageId = 0;
    let notFound = 0;
    let hasMore = true;
    let startingAfter: string | undefined;

    console.log(`[reconcile-payments] Scanning last ${daysBack} days...`);

    while (hasMore) {
      const params: any = {
        limit: 100,
        created: { gte: sinceTimestamp },
      };
      if (startingAfter) params.starting_after = startingAfter;

      const paymentIntents = await stripe.paymentIntents.list(params);

      for (const pi of paymentIntents.data) {
        if (pi.status !== "succeeded") continue;

        const giftPageId = pi.metadata?.giftPageId;
        if (!giftPageId) {
          noGiftPageId++;
          continue;
        }

        // Check if already active
        const { data: page } = await supabase
          .from("gift_pages")
          .select("id, is_active")
          .eq("id", giftPageId)
          .maybeSingle();

        if (!page) {
          notFound++;
          continue;
        }

        if (!page.is_active) {
          await supabase
            .from("gift_pages")
            .update({
              is_active: true,
              paid_at: new Date(pi.created * 1000).toISOString(),
              stripe_payment_intent_id: pi.id,
            })
            .eq("id", giftPageId);

          // Upsert subscription
          await supabase.from("gift_page_subscriptions").upsert({
            gift_page_id: giftPageId,
            status: "active",
            stripe_session_id: pi.id,
            paid_at: new Date(pi.created * 1000).toISOString(),
            expires_at: new Date(pi.created * 1000 + 365 * 24 * 60 * 60 * 1000).toISOString(),
          });

          updated++;
        }
      }

      hasMore = paymentIntents.has_more;
      if (paymentIntents.data.length > 0) {
        startingAfter = paymentIntents.data[paymentIntents.data.length - 1].id;
      }
    }

    const report = { updated, noGiftPageId, notFound };
    console.log("[reconcile-payments] Done", report);

    return new Response(JSON.stringify(report), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("[reconcile-payments] Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
