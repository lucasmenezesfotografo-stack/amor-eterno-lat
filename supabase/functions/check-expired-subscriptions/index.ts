import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-EXPIRED-SUBSCRIPTIONS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started - checking for expired subscriptions");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const now = new Date().toISOString();

    // Find all expired subscriptions that are still active
    const { data: expiredSubs, error: findError } = await supabase
      .from("gift_page_subscriptions")
      .select("id, gift_page_id")
      .eq("status", "active")
      .lt("expires_at", now);

    if (findError) {
      logStep("Error finding expired subscriptions", { error: findError });
      throw findError;
    }

    logStep("Found expired subscriptions", { count: expiredSubs?.length || 0 });

    if (!expiredSubs || expiredSubs.length === 0) {
      return new Response(JSON.stringify({ 
        message: "No expired subscriptions found",
        processed: 0 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Update subscription status to expired
    const { error: updateSubError } = await supabase
      .from("gift_page_subscriptions")
      .update({ status: "expired" })
      .in("id", expiredSubs.map(s => s.id));

    if (updateSubError) {
      logStep("Error updating subscription status", { error: updateSubError });
      throw updateSubError;
    }

    // Deactivate the gift pages
    const giftPageIds = expiredSubs.map(s => s.gift_page_id);
    const { error: updatePageError } = await supabase
      .from("gift_pages")
      .update({ is_active: false })
      .in("id", giftPageIds);

    if (updatePageError) {
      logStep("Error deactivating gift pages", { error: updatePageError });
      throw updatePageError;
    }

    logStep("Processed expired subscriptions", { 
      count: expiredSubs.length,
      giftPageIds 
    });

    return new Response(JSON.stringify({ 
      message: "Expired subscriptions processed",
      processed: expiredSubs.length,
      deactivatedPages: giftPageIds
    }), {
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
