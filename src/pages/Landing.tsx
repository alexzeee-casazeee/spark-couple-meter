import { Button } from "@/components/ui/button";
import { Heart, Users, TrendingUp, Shield, Bell, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Landing = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-splash)" }}>
      {/* Header with Language Switcher */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary" fill="currentColor" />
            <span className="text-xl font-semibold text-primary">Spark</span>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-primary/20 shadow-soft">
              <Heart className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">{t("landing.badge")}</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-primary">
              {t("landing.hero.title")}
              <span className="block text-foreground mt-2">{t("landing.hero.title.highlight")}</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("landing.hero.description")}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                className="text-lg px-8 rounded-full shadow-glow hover:shadow-glow transition-all"
                onClick={() => navigate("/auth")}
              >
                {t("landing.cta.primary")}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
              >
                {t("landing.cta.secondary")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-primary">{t("landing.features.title")}</h2>
            <p className="text-xl text-muted-foreground">{t("landing.features.subtitle")}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-soft hover:shadow-glow transition-all border border-border/50">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t("landing.feature1.title")}</h3>
              <p className="text-muted-foreground">
                {t("landing.feature1.description")}
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-soft hover:shadow-glow transition-all border border-border/50">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <TrendingUp className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t("landing.feature2.title")}</h3>
              <p className="text-muted-foreground">
                {t("landing.feature2.description")}
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-soft hover:shadow-glow transition-all border border-border/50">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <Bell className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t("landing.feature3.title")}</h3>
              <p className="text-muted-foreground">
                {t("landing.feature3.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-primary">{t("landing.benefits.title")}</h2>
              <p className="text-xl text-muted-foreground">{t("landing.benefits.subtitle")}</p>
            </div>
            
            <div className="space-y-6">
              <div className="flex gap-6 items-start bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-border/50">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{t("landing.benefit1.title")}</h3>
                  <p className="text-muted-foreground">{t("landing.benefit1.description")}</p>
                </div>
              </div>

              <div className="flex gap-6 items-start bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-border/50">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{t("landing.benefit2.title")}</h3>
                  <p className="text-muted-foreground">{t("landing.benefit2.description")}</p>
                </div>
              </div>

              <div className="flex gap-6 items-start bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-border/50">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{t("landing.benefit3.title")}</h3>
                  <p className="text-muted-foreground">{t("landing.benefit3.description")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-romantic opacity-20" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center space-y-8 bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-glow border border-border/50">
            <h2 className="text-4xl md:text-5xl font-bold text-primary">
              {t("landing.final.title")}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t("landing.final.subtitle")}
            </p>
            <Button 
              size="lg" 
              className="text-lg px-12 rounded-full shadow-glow"
              onClick={() => navigate("/auth")}
            >
              {t("landing.final.cta")}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50 bg-white/40 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>{t("landing.footer")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
