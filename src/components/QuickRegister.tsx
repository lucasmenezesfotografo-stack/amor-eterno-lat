import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Loader2, User, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/use-language";

interface QuickRegisterProps {
  onSuccess: () => void;
}

// Generate a unique email from name
const generateEmail = (name: string) => {
  const sanitized = name.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
  const random = Math.random().toString(36).substring(2, 10);
  return `${sanitized}-${random}@memoryl.ink`;
};

const QuickRegister = ({ onSuccess }: QuickRegisterProps) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: t('register.toast.name.title'),
        description: t('register.toast.name.desc'),
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: t('register.toast.password.title'),
        description: t('register.toast.password.desc'),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const email = generateEmail(formData.name);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/criar`,
          data: {
            display_name: formData.name,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        toast({
          title: t('register.toast.success.title'),
          description: t('register.toast.success.desc'),
        });
        onSuccess();
        return;
      }

      if (data.user) {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password: formData.password,
        });

        if (signInError) {
          throw signInError;
        }

        if (signInData.session) {
          toast({
            title: t('register.toast.success.title'),
            description: t('register.toast.success.desc'),
          });
          onSuccess();
          return;
        }
      }

      toast({
        title: t('register.toast.unexpected.title'),
        description: t('register.toast.unexpected.desc'),
        variant: "destructive",
      });
    } catch (error: any) {
      console.error("Error creating account:", error);
      
      let errorMessage = t('register.error.generic');
      
      if (error.message?.includes("already registered")) {
        errorMessage = t('register.error.taken');
      } else if (error.message?.includes("password")) {
        errorMessage = t('register.error.password');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: t('register.toast.error.title'),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <motion.div
          className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <Heart className="w-8 h-8 text-primary fill-primary" />
        </motion.div>
        
        <h1 className="text-2xl md:text-3xl font-semibold mb-3">
          {t('register.title')}
        </h1>
        
        <p className="text-muted-foreground">
          {t('register.desc')}
        </p>
      </div>

      <div className="glass-card p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('register.name.label')}
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('register.name.placeholder')}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-premium pl-12"
                disabled={isLoading}
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('register.password.label')}
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder={t('register.password.placeholder')}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-premium pl-12 pr-12"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {t('register.password.hint')}
            </p>
          </div>

          <Button
            type="submit"
            variant="default"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t('register.loading')}
              </>
            ) : (
              <>
                {t('register.submit')}
                <Heart className="w-5 h-5 fill-current" />
              </>
            )}
          </Button>
        </form>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-6">
        {t('register.footer')}
      </p>
    </motion.div>
  );
};

export default QuickRegister;
