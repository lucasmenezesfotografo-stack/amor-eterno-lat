import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not set");

    const { giftPageId, slug, email, promotionCode } = await req.json();

    if (!giftPageId || !slug) {
      throw new Error("giftPageId and slug are required");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2025-08-27.basil",
    });

    // ✅ PREÇO BASE CORRETO → US$ 5.00
    let amountInCents = 500;
    let appliedPromotion = null;

    if (promotionCode?.trim()) {
      const promoList = await stripe.promotionCodes.list({
        code: promotionCode.trim(),
        active: true,
        limit: 1,
      });

      if (promoList.data.length) {
        const coupon = promoList.data[0].coupon;

        if (coupon.percent_off) {
          amountInCents = Math.round(
            amountInCents * (1 - coupon.percent_off / 100)
          );
        } else if (coupon.amount_off) {
          amountInCents = Math.max(0, amountInCents - coupon.amount_off);
        }

        appliedPromotion = {
          code: promotionCode,
          couponId: coupon.id,
        };
      }
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      receipt_email: email ?? undefined,
      metadata: {
        giftPageId,
        slug,
        promotionCode: promotionCode ?? "",
      },
    });

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        amount: amountInCents,
        appliedPromotion,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: corsHeaders }
    );
  }
});
