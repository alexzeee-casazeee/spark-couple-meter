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
    <form onSubmit={handleJoin} className="w-full max-w-md mx-auto space-y-4">
      <div className="space-y-3">
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t("auth.displayName")}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="pl-10 h-12 bg-white border-2"
            required
          />
        </div>
        
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="email"
            placeholder={t("auth.email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 h-12 bg-white border-2"
            required
          />
        </div>
        
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="password"
            placeholder={t("auth.password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 h-12 bg-white border-2"
            required
          />
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full text-base h-12 shadow-lg"
        style={{ background: 'var(--gradient-primary)' }}
        disabled={loading}
      >
        {loading ? t("auth.signingUp") : t("landing.cta.primary")}
      </Button>
      
      <p className="text-sm text-center text-muted-foreground">
        {t("landing.pricing")}
      </p>
    </form>
  );
};
