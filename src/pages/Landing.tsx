import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { AuthModal } from "@/components/AuthModal";
import { Heart, Users, LineChart, Sparkles, MessageCircle, TrendingUp, Shield, Bell } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-canva-bg)' }}>
      {/* Header */}
      <header className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl" style={{ background: 'var(--gradient-primary)' }}>
            <Sparkles className="w-5 h-5 text-white m-1.5" />
          </div>
          <span className="text-xl font-bold text-primary">
            Spark
          </span>
        </div>
        <LanguageSwitcher />
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-4xl mx-auto space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/60 backdrop-blur-sm rounded-full border border-white/40">
            <Heart className="w-3 h-3 text-primary" />
            <span className="text-xs font-medium text-primary">{t("landing.badge")}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-foreground">
            {t("landing.hero.title")}
            <span className="text-primary"> {t("landing.hero.title.highlight")}</span>
          </h1>
          
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("landing.hero.description")}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
            <Button
              size="lg"
              className="text-base px-6 py-5 shadow-lg"
              style={{ background: 'var(--gradient-primary)' }}
              onClick={() => setAuthModalOpen(true)}
            >
              {t("landing.cta.primary")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-6 py-5 bg-white/70 backdrop-blur-sm border-white/40 hover:bg-white/90"
              onClick={() => navigate("/learn-more")}
            >
              {t("landing.cta.secondary")}
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white/70 backdrop-blur-sm p-8 rounded-3xl border border-white/40" style={{ boxShadow: 'var(--shadow-float)' }}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3 text-primary">How It Works</h2>
            <p className="text-base text-muted-foreground">Simple daily check-ins that strengthen your bond</p>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white/80 p-5 rounded-2xl border border-primary/10">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-primary">Connect as Partners</h3>
              <p className="text-sm text-muted-foreground">
                Create your account and connect through a private invitation link.
              </p>
            </div>

            <div className="bg-white/80 p-5 rounded-2xl border border-secondary/10">
              <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Daily Check-ins</h3>
              <p className="text-sm text-muted-foreground">
                Share your intimacy level, mood, sleep quality, and emotions with simple sliders or voice input.
              </p>
            </div>

            <div className="bg-white/80 p-5 rounded-2xl border border-accent/10">
              <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mb-4">
                <LineChart className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Track & Grow Together</h3>
              <p className="text-sm text-muted-foreground">
                View trends, celebrate wins, and understand each other better over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3 text-primary">{t("landing.features.title")}</h2>
          <p className="text-base text-muted-foreground">{t("landing.features.subtitle")}</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-white/40 hover:shadow-float-hover transition-all hover:scale-105" style={{ boxShadow: 'var(--shadow-float)' }}>
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-primary">
              {t("landing.feature1.title")}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("landing.feature1.description")}
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-white/40 hover:shadow-float-hover transition-all hover:scale-105" style={{ boxShadow: 'var(--shadow-float)' }}>
            <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-secondary-foreground">
              {t("landing.feature2.title")}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("landing.feature2.description")}
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-white/40 hover:shadow-float-hover transition-all hover:scale-105" style={{ boxShadow: 'var(--shadow-float)' }}>
            <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center mb-4">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-accent-foreground">
              {t("landing.feature3.title")}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("landing.feature3.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3 text-primary">{t("landing.benefits.title")}</h2>
            <p className="text-base text-muted-foreground">{t("landing.benefits.subtitle")}</p>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white/70 backdrop-blur-sm p-5 rounded-2xl border border-white/40" style={{ boxShadow: 'var(--shadow-float)' }}>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-1 text-foreground">{t("landing.benefit1.title")}</h3>
                  <p className="text-sm text-muted-foreground">{t("landing.benefit1.description")}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm p-5 rounded-2xl border border-white/40" style={{ boxShadow: 'var(--shadow-float)' }}>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-1 text-foreground">{t("landing.benefit2.title")}</h3>
                  <p className="text-sm text-muted-foreground">{t("landing.benefit2.description")}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm p-5 rounded-2xl border border-white/40" style={{ boxShadow: 'var(--shadow-float)' }}>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-1 text-foreground">{t("landing.benefit3.title")}</h3>
                  <p className="text-sm text-muted-foreground">{t("landing.benefit3.description")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-4 bg-white/70 backdrop-blur-sm p-8 rounded-3xl border border-white/40" style={{ boxShadow: 'var(--shadow-float)' }}>
          <h2 className="text-3xl md:text-4xl font-bold text-primary">
            {t("landing.final.title")}
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            {t("landing.final.subtitle")}
          </p>
          <Button
            size="lg"
            className="text-base px-6 py-5 shadow-lg"
            style={{ background: 'var(--gradient-primary)' }}
            onClick={() => setAuthModalOpen(true)}
          >
            {t("landing.final.cta")}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground border-t border-border/50">
        <p>{t("landing.footer")}</p>
      </footer>

      {/* Auth Modal */}
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
};

export default Landing;
