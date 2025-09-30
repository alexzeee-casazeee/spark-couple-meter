import { Button } from "@/components/ui/button";
import { Heart, Users, TrendingUp, Shield, Bell, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Landing = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      {/* Header with Language Switcher */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <LanguageSwitcher />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-romantic opacity-10" />
        <div className="container mx-auto px-4 py-10 relative">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <Heart className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">{t("landing.badge")}</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              {t("landing.hero.title")}
              <span className="bg-gradient-romantic bg-clip-text text-transparent"> {t("landing.hero.title.highlight")}</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("landing.hero.description")}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                className="text-lg px-8 shadow-glow hover:shadow-glow transition-all"
                onClick={() => navigate("/auth")}
              >
                {t("landing.cta.primary")}
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                {t("landing.cta.secondary")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 bg-gradient-soft">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t("landing.features.title")}</h2>
            <p className="text-xl text-muted-foreground">{t("landing.features.subtitle")}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-card p-8 rounded-2xl shadow-soft hover:shadow-glow transition-all border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t("landing.feature1.title")}</h3>
              <p className="text-muted-foreground">
                {t("landing.feature1.description")}
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl shadow-soft hover:shadow-glow transition-all border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t("landing.feature2.title")}</h3>
              <p className="text-muted-foreground">
                {t("landing.feature2.description")}
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl shadow-soft hover:shadow-glow transition-all border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Bell className="w-6 h-6 text-primary" />
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
              <h2 className="text-4xl font-bold mb-4">{t("landing.benefits.title")}</h2>
              <p className="text-xl text-muted-foreground">{t("landing.benefits.subtitle")}</p>
            </div>
            
            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{t("landing.benefit1.title")}</h3>
                  <p className="text-muted-foreground">{t("landing.benefit1.description")}</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{t("landing.benefit2.title")}</h3>
                  <p className="text-muted-foreground">{t("landing.benefit2.description")}</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
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
      <section className="py-20 bg-gradient-romantic relative overflow-hidden">
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              {t("landing.final.title")}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t("landing.final.subtitle")}
            </p>
            <Button 
              size="lg" 
              className="text-lg px-12 shadow-glow"
              onClick={() => navigate("/auth")}
            >
              {t("landing.final.cta")}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
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
