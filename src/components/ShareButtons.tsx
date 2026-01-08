import { motion } from "framer-motion";
import { Share2, MessageCircle, Facebook, Twitter, Link, Check, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonsProps {
  url: string;
  title?: string;
  description?: string;
}

const ShareButtons = ({ url, title = "Mira nuestra página de amor", description = "Te comparto algo especial ❤️" }: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const shareData = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title}\n${description}\n${url}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`${title} ❤️`)}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "¡Enlace copiado!",
        description: "Ya puedes compartirlo donde quieras",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Error",
        description: "No se pudo copiar el enlace",
        variant: "destructive",
      });
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
      } catch (err) {
        // User cancelled or error
      }
    }
  };

  const socialButtons = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      url: shareData.whatsapp,
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: shareData.facebook,
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: shareData.twitter,
      color: "bg-sky-500 hover:bg-sky-600",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground mb-4">
        <Share2 className="w-4 h-4" />
        <span>Compartir en redes</span>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {socialButtons.map((social) => (
          <motion.a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium transition-all ${social.color}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <social.icon className="w-4 h-4" />
            {social.name}
          </motion.a>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {/* Copy Link */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-500" />
              ¡Copiado!
            </>
          ) : (
            <>
              <Link className="w-4 h-4" />
              Copiar enlace
            </>
          )}
        </Button>

        {/* Native Share (mobile) */}
        {typeof navigator !== "undefined" && navigator.share && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleNativeShare}
            className="gap-2"
          >
            <Share2 className="w-4 h-4" />
            Más opciones
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default ShareButtons;
