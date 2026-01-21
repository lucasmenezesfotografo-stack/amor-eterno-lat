import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
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

    const { giftPageId, slug, email, promotionCode } = await req.json();

    if (!giftPageId || !slug) {
      throw new Error("giftPageId and slug are required");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2025-08-27.basil",
    });

    // Base amount in cents (e.g., $9.99 = 999)
    let amountInCents = 999;
    let appliedPromotion = null;

    // Validate promotion code if provided
    if (promotionCode && promotionCode.trim()) {
      try {
        const promotionCodes = await stripe.promotionCodes.list({
          code: promotionCode.trim(),
          active: true,
          limit: 1,
        });

        if (promotionCodes.data.length > 0) {
          const promo = promotionCodes.data[0];
          const coupon = promo.coupon;

          if (coupon.percent_off) {
            amountInCents = Math.round(amountInCents * (1 - coupon.percent_off / 100));
            appliedPromotion = {
              code: promotionCode,
              percentOff: coupon.percent_off,
              amountOff: null,
            };
          } else if (coupon.amount_off) {
            amountInCents = Math.max(0, amountInCents - coupon.amount_off);
            appliedPromotion = {
              code: promotionCode,
              percentOff: null,
              amountOff: coupon.amount_off,
            };
          }
        }
      } catch (promoError) {
        console.log("Promotion code validation failed:", promoError);
        // Continue without discount
      }
    }

    // Create PaymentIntent for embedded checkout
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      receipt_email: email ?? undefined,
      metadata: {
        gift_page_id: giftPageId,
        slug,
        promotion_code: promotionCode ?? "",
      },
    });

    console.log(`PaymentIntent created: ${paymentIntent.id} for gift_page_id: ${giftPageId}`);

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: amountInCents,
        appliedPromotion,
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
    console.error("Error creating PaymentIntent:", error);
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
