import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Lock } from "lucide-react";

export const LoginForm = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error(t("auth.fillAllFields"));
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success(t("auth.success.login"));
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || t("auth.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-primary mb-1">
          {t("auth.button.signin")}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t("auth.login.subtitle")}
        </p>
      </div>
      
      <form onSubmit={handleLogin} className="space-y-3">
        <div className="space-y-2">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder={t("auth.email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-9 h-10 bg-white border-2"
              required
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="password"
              placeholder={t("auth.password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-9 h-10 bg-white border-2"
              required
              minLength={6}
            />
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full text-base h-11 shadow-lg"
          style={{ background: 'var(--gradient-primary)' }}
          disabled={loading}
        >
          {loading ? t("auth.button.loading") : t("auth.button.signin")}
        </Button>
      </form>
    </div>
  );
};
