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
          
          <div className="flex flex-col gap-2 justify-center items-center pt-2">
            <div className="flex flex-row gap-3 justify-center items-center">
              <Button
                size="lg"
                className="text-base px-6 py-5 shadow-lg border-2 border-transparent bg-clip-padding relative"
                style={{ 
                  background: 'var(--gradient-primary)',
                  backgroundImage: 'linear-gradient(135deg, hsl(280, 60%, 70%), hsl(190, 70%, 75%)), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))',
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box, border-box'
                }}
                onClick={() => setAuthModalOpen(true)}
              >
                {t("landing.cta.primary")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-6 py-5 bg-white/70 backdrop-blur-sm border-2 border-transparent bg-clip-padding relative shadow-lg"
                style={{ 
                  backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))',
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box, border-box'
                }}
                onClick={() => navigate("/learn-more")}
              >
                {t("landing.cta.secondary")}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">Free for 30 Days. Then $2.99/mo</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-[5px] md:px-4 py-8">
        <div className="max-w-6xl mx-auto bg-white/70 backdrop-blur-sm p-[6px] rounded-3xl border border-white/40" style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
          <div className="text-center mb-6 px-[5px] md:px-6 pt-[5px] md:pt-6">
            <h2 className="text-3xl font-bold mb-3 text-primary">How It Works</h2>
            <p className="text-base text-muted-foreground">Simple daily check-ins that strengthen your bond</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 px-[5px] md:px-6 pb-[5px] md:pb-6">
            <div className="bg-white/80 p-5 rounded-2xl border-2 border-transparent bg-clip-padding relative" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-primary">Connect as Partners</h3>
              <p className="text-sm text-muted-foreground">
                Create your account and connect through a private invitation link.
              </p>
            </div>

            <div className="bg-white/80 p-5 rounded-2xl border-2 border-transparent bg-clip-padding relative" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
              <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Daily Check-ins</h3>
              <p className="text-sm text-muted-foreground">
                Share your intimacy level, mood, sleep quality, and emotions with simple sliders or voice input.
              </p>
            </div>

            <div className="bg-white/80 p-5 rounded-2xl border-2 border-transparent bg-clip-padding relative" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
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

      {/* Benefits Section */}
      <section className="container mx-auto px-[5px] md:px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl p-8 md:p-12 border-2 border-transparent bg-clip-padding relative" style={{ 
          backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', 
          backgroundOrigin: 'border-box', 
          backgroundClip: 'padding-box, border-box',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
        }}>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20 mb-4">
              <Heart className="w-4 h-4 text-primary fill-primary" />
              <span className="text-sm font-semibold text-primary">Why Choose Spark Meter</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">{t("landing.benefits.title")}</h2>
            <p className="text-lg text-muted-foreground">{t("landing.benefits.subtitle")}</p>
          </div>
          
          <div className="space-y-5">
            <div className="bg-white p-6 rounded-2xl" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
              <div className="flex gap-5 items-start">
                <div className="w-14 h-14 bg-primary/15 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-primary">{t("landing.benefit1.title")}</h3>
                  <p className="text-base text-muted-foreground">{t("landing.benefit1.description")}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
              <div className="flex gap-5 items-start">
                <div className="w-14 h-14 bg-secondary/15 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-7 h-7 text-secondary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-secondary">{t("landing.benefit2.title")}</h3>
                  <p className="text-base text-muted-foreground">{t("landing.benefit2.description")}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
              <div className="flex gap-5 items-start">
                <div className="w-14 h-14 bg-accent/15 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-7 h-7 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-accent">{t("landing.benefit3.title")}</h3>
                  <p className="text-base text-muted-foreground">{t("landing.benefit3.description")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-4 bg-white/70 backdrop-blur-sm p-8 rounded-3xl border-2 border-transparent bg-clip-padding relative" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
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
