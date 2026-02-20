import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const now = new Date().toISOString();

    console.log("[cleanup-expired-drafts] Looking for expired inactive pages...");

    // Find expired inactive pages (NOT active ones!)
    const { data: expiredPages, error: selectError } = await supabase
      .from("gift_pages")
      .select("id, cover_photo_url, memories")
      .eq("is_active", false)
      .lt("expires_at", now);

    if (selectError) throw selectError;

    if (!expiredPages || expiredPages.length === 0) {
      return new Response(
        JSON.stringify({ message: "No expired drafts", deleted: 0 }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[cleanup-expired-drafts] Found ${expiredPages.length} expired drafts`);

    let deletedCount = 0;
    let storageFilesDeleted = 0;

    for (const page of expiredPages) {
      const pageId = page.id;

      // Delete storage files: uploads/{pageId}/ prefix
      try {
        const { data: uploadFiles } = await supabase.storage
          .from("gift-photos")
          .list(`uploads/${pageId}`);

        if (uploadFiles && uploadFiles.length > 0) {
          const paths = uploadFiles.map((f: any) => `uploads/${pageId}/${f.name}`);
          await supabase.storage.from("gift-photos").remove(paths);
          storageFilesDeleted += paths.length;
        }
      } catch (e) {
        console.warn(`[cleanup] Storage error uploads/${pageId}:`, e);
      }

      // Delete storage files: memories/{pageId}/ prefix
      try {
        const { data: memoryFiles } = await supabase.storage
          .from("gift-photos")
          .list(`memories/${pageId}`);

        if (memoryFiles && memoryFiles.length > 0) {
          const paths = memoryFiles.map((f: any) => `memories/${pageId}/${f.name}`);
          await supabase.storage.from("gift-photos").remove(paths);
          storageFilesDeleted += paths.length;
        }
      } catch (e) {
        console.warn(`[cleanup] Storage error memories/${pageId}:`, e);
      }

      // Also try to clean up old-style paths (uploads/filename without pageId folder)
      if (page.cover_photo_url) {
        try {
          const url = new URL(page.cover_photo_url);
          const pathMatch = url.pathname.match(/\/gift-photos\/(.+)$/);
          if (pathMatch) {
            await supabase.storage.from("gift-photos").remove([pathMatch[1]]);
            storageFilesDeleted++;
          }
        } catch (_) { /* ignore */ }
      }

      // Clean memory image URLs
      if (page.memories && Array.isArray(page.memories)) {
        for (const mem of page.memories as any[]) {
          if (mem?.imageUrl) {
            try {
              const url = new URL(mem.imageUrl);
              const pathMatch = url.pathname.match(/\/gift-photos\/(.+)$/);
              if (pathMatch) {
                await supabase.storage.from("gift-photos").remove([pathMatch[1]]);
                storageFilesDeleted++;
              }
            } catch (_) { /* ignore */ }
          }
        }
      }

      // Delete subscription records if any
      await supabase
        .from("gift_page_subscriptions")
        .delete()
        .eq("gift_page_id", pageId);

      // Delete activation code usage if any
      await supabase
        .from("activation_code_usage")
        .delete()
        .eq("gift_page_id", pageId);

      // Delete the gift page
      const { error: deleteError } = await supabase
        .from("gift_pages")
        .delete()
        .eq("id", pageId)
        .eq("is_active", false); // Safety: never delete active pages

      if (!deleteError) {
        deletedCount++;
      } else {
        console.error(`[cleanup] Failed to delete page ${pageId}:`, deleteError);
      }
    }

    const report = { deleted: deletedCount, storageFilesDeleted };
    console.log("[cleanup-expired-drafts] Done", report);

    return new Response(JSON.stringify(report), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("[cleanup-expired-drafts] Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
