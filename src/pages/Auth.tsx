import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<"husband" | "wife">("husband");
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

        if (error) throw error;
        
        navigate("/dashboard");
      } else {
        console.log('Starting signup with:', { email, displayName, role });
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName,
              role: role,
            },
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });

        console.log('Signup response:', { data, error });

        if (error) throw error;

        if (data.user) {
          console.log('User created successfully:', data.user.id);
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
    <div className="min-h-screen flex flex-col bg-gradient-soft px-4">
      {/* Header with Language Switcher */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <LanguageSwitcher />
        </div>
      </header>

      {/* Auth Card */}
      <div className="flex-1 flex items-center justify-center pt-20">
        <Card className="w-full max-w-md shadow-glow border-border/50">
          <CardHeader className="space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-romantic rounded-full flex items-center justify-center shadow-glow">
                <Heart className="w-8 h-8 text-white" fill="white" />
              </div>
            </div>
            <CardTitle className="text-3xl text-center">
              {isLogin ? t("auth.welcome") : t("auth.create")}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin ? t("auth.subtitle.login") : t("auth.subtitle.signup")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="displayName">{t("auth.displayName")}</Label>
                    <Input
                      id="displayName"
                      type="text"
                      placeholder={t("auth.displayName.placeholder")}
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("auth.role")}</Label>
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant={role === "husband" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setRole("husband")}
                      >
                        {t("auth.role.husband")}
                      </Button>
                      <Button
                        type="button"
                        variant={role === "wife" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setRole("wife")}
                      >
                        {t("auth.role.wife")}
                      </Button>
                    </div>
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">{t("auth.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("auth.email.placeholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("auth.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t("auth.password.placeholder")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t("auth.button.loading") : (isLogin ? t("auth.button.signin") : t("auth.button.signup"))}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-primary hover:underline"
              >
                {isLogin ? t("auth.switch.signup") : t("auth.switch.login")}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
