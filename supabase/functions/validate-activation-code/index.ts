import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[VALIDATE-ACTIVATION-CODE] ${step}${detailsStr}`);
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

    const { code, giftPageId } = await req.json();
    logStep("Request body parsed", { code, giftPageId });

    if (!code || !giftPageId) {
      throw new Error("code and giftPageId are required");
    }

    // 🔎 Buscar código (SEM single)
    const { data: activationCodes, error: findError } = await supabase
      .from("activation_codes")
      .select("*")
      .eq("code", code.toUpperCase().trim())
      .eq("is_active", true)
      .limit(1);

    const activationCode = activationCodes?.[0];

    if (findError || !activationCode) {
      logStep("Code not found or inactive", { error: findError });
      return new Response(
        JSON.stringify({
          valid: false,
          error: "Código inválido o inactivo",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    logStep("Code found", {
      codeId: activationCode.id,
      usesRemaining: activationCode.uses_remaining,
    });

    // ⏰ Verificar expiração
    if (
      activationCode.expires_at &&
      new Date(activationCode.expires_at) < new Date()
    ) {
      logStep("Code expired");
      return new Response(
        JSON.stringify({
          valid: false,
          error: "Este código ha expirado",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // 🔢 Verificar usos restantes (se não for ilimitado)
    if (
      activationCode.uses_remaining !== null &&
      activationCode.uses_remaining <= 0
    ) {
      logStep("Code has no remaining uses");
      return new Response(
        JSON.stringify({
          valid: false,
          error: "Este código ya no tiene usos disponibles",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // 🚫 Verificar se a página já usou um código
    const { data: existingUsage } = await supabase
      .from("activation_code_usage")
      .select("id")
      .eq("gift_page_id", giftPageId)
      .maybeSingle();

    if (existingUsage) {
      logStep("Gift page already used a code");
      return new Response(
        JSON.stringify({
          valid: false,
          error: "Esta página ya tiene un código activado",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // 📝 Registrar uso do código
    const { error: usageError } = await supabase
      .from("activation_code_usage")
      .insert({
        activation_code_id: activationCode.id,
        gift_page_id: giftPageId,
      });

    if (usageError) {
      logStep("Error recording usage", { error: usageError });
      throw usageError;
    }

    // ➖ Decrementar usos se não for ilimitado
    if (activationCode.uses_remaining !== null) {
      await supabase
        .from("activation_codes")
        .update({
          uses_remaining: activationCode.uses_remaining - 1,
        })
        .eq("id", activationCode.id);
    }

    // 📅 Expiração: 1 ano
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    // 📦 Criar/atualizar assinatura gratuita
    const { error: subError } = await supabase
      .from("gift_page_subscriptions")
      .upsert(
        {
          gift_page_id: giftPageId,
          status: "active",
          paid_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
        },
        { onConflict: "gift_page_id" }
      );

    if (subError) {
      logStep("Error creating subscription", { error: subError });
      throw subError;
    }

    // ✅ Ativar página
    const { error: updateError } = await supabase
      .from("gift_pages")
      .update({ is_active: true })
      .eq("id", giftPageId);

    if (updateError) {
      logStep("Error activating gift page", { error: updateError });
      throw updateError;
    }

    logStep("Gift page activated with code", { giftPageId });

    return new Response(
      JSON.stringify({
        valid: true,
        message: "¡Código activado exitosamente!",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });

    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
