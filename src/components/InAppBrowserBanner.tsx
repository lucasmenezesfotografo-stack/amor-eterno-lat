import { useState, useEffect } from "react";
import { ExternalLink, Copy, X } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";

function detectInAppBrowser(): string | null {
  const ua = navigator.userAgent || "";
  if (/tiktok/i.test(ua) || /BytedanceWebview/i.test(ua) || /musical_ly/i.test(ua)) return "TikTok";
  if (/Instagram/i.test(ua) && !/Chrome/i.test(ua)) return "Instagram";
  if (/FBAN|FBAV/i.test(ua)) return "Facebook";
  if (/Snapchat/i.test(ua)) return "Snapchat";
  if (/Twitter/i.test(ua) || /TwitterAndroid/i.test(ua)) return "Twitter";
  return null;
}

export function useIsInAppBrowser() {
  const [browser, setBrowser] = useState<string | null>(null);
  useEffect(() => {
    setBrowser(detectInAppBrowser());
  }, []);
  return browser;
}

const InAppBrowserBanner = () => {
  const browser = useIsInAppBrowser();
  const [dismissed, setDismissed] = useState(false);
  const { language } = useLanguage();
  const { toast } = useToast();

  if (!browser || dismissed) return null;

  const isES = language === "es";
  const url = window.location.href;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: isES ? "¡Enlace copiado!" : "Link copied!",
        description: isES ? "Pégalo en Chrome o Safari" : "Paste it in Chrome or Safari",
      });
    } catch {
      // Fallback
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      toast({
        title: isES ? "¡Enlace copiado!" : "Link copied!",
      });
    }
  };

  const handleOpenExternal = () => {
    // Try intent-based opening for Android
    const isAndroid = /android/i.test(navigator.userAgent);
    if (isAndroid) {
      window.location.href = `intent://${url.replace(/^https?:\/\//, "")}#Intent;scheme=https;end`;
    } else {
      // iOS: suggest copy + open Safari
      window.open(url, "_system");
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-amber-50 border-b border-amber-200 px-4 py-3 shadow-sm">
      <div className="max-w-lg mx-auto flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-amber-900 font-medium">
            {isES
              ? `El navegador de ${browser} puede bloquear envío de fotos.`
              : `${browser}'s browser may block photo uploads.`}
          </p>
          <p className="text-xs text-amber-700 mt-0.5">
            {isES
              ? "Abre en Chrome o Safari para mejor experiencia."
              : "Open in Chrome or Safari for the best experience."}
          </p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleOpenExternal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {isES ? "Abrir en navegador" : "Open in browser"}
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white text-amber-800 border border-amber-300 hover:bg-amber-50 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              {isES ? "Copiar link" : "Copy link"}
            </button>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-amber-500 hover:text-amber-700 transition-colors shrink-0"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default InAppBrowserBanner;
