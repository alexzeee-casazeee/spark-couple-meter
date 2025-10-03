import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, User, Lock } from "lucide-react";

export const JoinForm = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !displayName || !password) {
      toast.error(t("auth.fillAllFields"));
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            display_name: displayName,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        toast.success(t("auth.success"));
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.message || t("auth.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-2">
        <h3 className="text-base md:text-xl font-bold text-primary mb-0.5">
          {t("landing.joinForm.title")}
        </h3>
        <p className="text-xs md:text-sm text-muted-foreground">
          {t("landing.joinForm.subtitle")}
        </p>
      </div>
      
      <form onSubmit={handleJoin} className="space-y-2">
        <div className="space-y-1.5">
          <div className="relative">
            <User className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("auth.displayName")}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="pl-8 h-9 text-sm bg-white border-2"
              required
            />
          </div>
          
          <div className="relative">
            <Mail className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              type="email"
              placeholder={t("auth.email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-8 h-9 text-sm bg-white border-2"
              required
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              type="password"
              placeholder={t("auth.password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-8 h-9 text-sm bg-white border-2"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          size="default"
          className="w-full text-sm h-9 shadow-lg hover:scale-[1.02] hover:shadow-xl transition-all duration-200"
          style={{ background: 'var(--gradient-primary)' }}
          disabled={loading}
        >
          {loading ? t("auth.signingUp") : t("landing.cta.primary")}
        </Button>
        
        <p className="text-[10px] text-center text-muted-foreground pt-0.5">
          {t("landing.pricing")}
        </p>
      </form>
    </div>
  );
};
