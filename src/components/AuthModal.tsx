import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AuthModal = ({ open, onOpenChange }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          toast.error(error.message);
          throw error;
        }
        
        toast.success(t("auth.success.login"));
        onOpenChange(false);
        navigate("/dashboard");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName,
              role: "husband", // Default role for backend compatibility
            },
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });

        if (error) {
          toast.error(error.message);
          throw error;
        }

        if (data.user) {
          toast.success(t("auth.success.signup"));
          onOpenChange(false);
          navigate("/dashboard");
        } else {
          throw new Error("Failed to create account");
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6 px-[6px]">
        <div className="flex justify-center mb-6 px-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
            <Heart className="w-8 h-8 text-white" fill="white" />
          </div>
        </div>
        <form onSubmit={handleAuth} className="space-y-3 px-6">
          {!isLogin && (
            <div className="space-y-1.5">
              <Input
                id="displayName"
                type="text"
                placeholder={t("auth.displayName.placeholder")}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="border-2"
              />
            </div>
          )}
          <div className="space-y-1.5">
            <Input
              id="email"
              type="email"
              placeholder={t("auth.email.placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-2"
            />
          </div>
          <div className="space-y-1.5">
            <Input
              id="password"
              type="password"
              placeholder={t("auth.password.placeholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="border-2"
            />
          </div>
          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? t("auth.button.loading") : (isLogin ? t("auth.button.signin") : t("auth.button.signup"))}
          </Button>
        </form>
        
        <div className="text-center mt-4 px-6">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-primary hover:underline"
          >
            {isLogin ? t("auth.switch.signup") : t("auth.switch.login")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
