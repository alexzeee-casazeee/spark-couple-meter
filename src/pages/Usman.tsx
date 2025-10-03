import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { JoinForm } from "@/components/JoinForm";
import { LoginForm } from "@/components/LoginForm";
import { Heart, Users, LineChart, Sparkles, MessageCircle, TrendingUp, Calendar, Activity, Target } from "lucide-react";
import Dashboard from "./Dashboard";
import { AuthModal } from "@/components/AuthModal";
import logoIcon from "@/assets/logo-icon.png";

const New = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="container mx-auto px-3 py-[10px] flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <img src={logoIcon} alt="Spark Meter" className="w-7 h-7 object-contain" />
          <span className="text-lg font-bold text-primary">
            Spark Meter
          </span>
        </div>
        <LanguageSwitcher />
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-3 py-2 text-center">
        <div className="max-w-4xl mx-auto space-y-2 animate-fade-in">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/60 backdrop-blur-sm rounded-full border border-white/40">
            <Heart className="w-3 h-3 text-primary" />
            <span className="text-xs font-medium text-primary">{t("new.hero.badge")}</span>
          </div>

          <h1 className="text-2xl md:text-5xl font-bold leading-tight text-foreground">
            {t("new.hero.title.leading")} {" "}
            <span className="text-primary">{t("new.hero.title.highlight")}</span>
          </h1>
          
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("new.hero.description")}
          </p>
          
          <p className="text-xs md:text-base text-muted-foreground max-w-2xl mx-auto italic">
            {t("new.hero.tagline")}
          </p>

          <p className="text-sm md:text-lg text-foreground max-w-2xl mx-auto font-medium pt-2">
            {t("new.hero.paragraph")}
          </p>
          
          <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl p-4 border-2 border-primary border-b-8 bg-clip-padding relative mt-4" style={{
            backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', 
            backgroundOrigin: 'border-box', 
            backgroundClip: 'padding-box, border-box',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
          }}>
            {showLoginForm ? <LoginForm /> : <JoinForm />}
            
            <div className="mt-3 flex flex-col sm:flex-row gap-1.5 justify-center items-center w-full">
              <Button
                size="sm"
                variant="outline"
                className="border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground h-10 px-4 py-2 flex items-center gap-2 w-full sm:w-auto"
                onClick={() => navigate("/learn-more")}
              >
                {t("new.cta.howItWorks")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground h-10 px-4 py-2 flex items-center gap-2 w-full sm:w-auto"
                onClick={() => setShowLoginForm(!showLoginForm)}
              >
                {showLoginForm ? t("auth.button.signup") : t("auth.button.signin")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Matters Section */}
      <section className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        <div className="max-w-6xl mx-auto bg-white/70 backdrop-blur-sm p-[6px] rounded-3xl border-2 border-primary border-b-8" style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
          <div className="text-center mb-6 px-[5px] md:px-6 pt-[5px] md:pt-6">
            <h2 className="text-3xl font-bold mb-3 text-primary">{t("new.why.title")}</h2>
          </div>
          
          <div className="space-y-4 px-[5px] md:px-6 pb-[5px] md:pb-6">
            <div className="bg-white/80 p-5 rounded-2xl border-2 border-primary border-l-8" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/15 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-primary">{t("new.why.card1.title")}</h3>
                  <p className="text-base text-black">{t("new.why.card1.desc")}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 p-5 rounded-2xl border-2 border-primary border-l-8" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/15 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-primary">{t("new.why.card2.title")}</h3>
                  <p className="text-base text-black">{t("new.why.card2.desc")}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 p-5 rounded-2xl border-2 border-accent border-l-8" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent/15 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-accent">{t("new.why.card3.title")}</h3>
                  <p className="text-base text-black">{t("new.why.card3.desc")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        <div className="max-w-3xl mx-auto w-full">
          <div className="rounded-2xl shadow-2xl border-2 border-primary border-b-8 overflow-hidden bg-canva-gradient">
            <Dashboard 
              demoMode={true} 
              onDemoInteraction={() => {
                console.log('Demo interaction triggered');
                setShowDemoModal(true);
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3">
            {t("new.demo.caption")}
          </p>
        </div>
      </section>

      {/* Demo Modal */}
      <AuthModal open={showDemoModal} onOpenChange={setShowDemoModal} />

      {/* How It Works Section */}
      <section className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        <div className="max-w-6xl mx-auto bg-white/70 backdrop-blur-sm p-[6px] rounded-3xl border-2 border-primary border-b-8" style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
          <div className="text-center mb-6 px-[5px] md:px-6 pt-[5px] md:pt-6">
            <h2 className="text-3xl font-bold mb-3 text-primary">{t("landing.features.title")}</h2>
            <p className="text-base text-muted-foreground">{t("new.how.subtitle")}</p>
          </div>
          
          <div className="space-y-4 px-[5px] md:px-6 pb-[5px] md:pb-6">
            <div className="bg-white/80 p-5 rounded-2xl border-2 border-primary border-l-8" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/15 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-primary">{t("new.how.card1.title")}</h3>
                  <p className="text-base text-black">{t("new.how.card1.desc")}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 p-5 rounded-2xl border-2 border-primary border-l-8" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/15 rounded-xl flex items-center justify-center flex-shrink-0">
                  <LineChart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-primary">{t("new.how.card2.title")}</h3>
                  <p className="text-base text-black">{t("new.how.card2.desc")}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 p-5 rounded-2xl border-2 border-accent border-l-8" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent/15 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-accent">{t("new.how.card3.title")}</h3>
                  <p className="text-base text-black">{t("new.how.card3.desc")}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 p-5 rounded-2xl border-2 border-primary border-l-8" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/15 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-primary">{t("new.how.card4.title")}</h3>
                  <p className="text-base text-black">{t("new.how.card4.desc")}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 p-5 rounded-2xl border-2 border-primary border-l-8" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/15 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-primary">{t("new.how.card5.title")}</h3>
                  <p className="text-base text-black">{t("new.how.card5.desc")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Get Section */}
      <section className="container mx-auto px-3 md:px-4 py-4 md:py-12">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl p-8 md:p-12 border-2 border-primary border-b-8 bg-clip-padding relative" style={{ 
          backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', 
          backgroundOrigin: 'border-box', 
          backgroundClip: 'padding-box, border-box',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
        }}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20 mb-4">
              <Heart className="w-4 h-4 text-primary fill-primary" />
              <span className="text-sm font-semibold text-primary">{t("new.benefits.badge")}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">{t("new.benefits.title")}</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-primary text-sm">✓</span>
              </div>
              <p className="text-base text-black">{t("new.benefits.item1")}</p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-primary text-sm">✓</span>
              </div>
              <p className="text-base text-black">{t("new.benefits.item2")}</p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-primary text-sm">✓</span>
              </div>
              <p className="text-base text-black">{t("new.benefits.item3")}</p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-primary text-sm">✓</span>
              </div>
              <p className="text-base text-black">{t("new.benefits.item4")}</p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-primary text-sm">✓</span>
              </div>
              <p className="text-base text-black">{t("new.benefits.item5")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3 text-primary">{t("new.testimonials.title")}</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/80 p-6 rounded-2xl border-2 border-primary border-b-8 bg-clip-padding relative" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
              <p className="text-sm text-muted-foreground italic mb-3">
                {t("new.testimonials.quote1")}
              </p>
              <p className="text-sm font-semibold text-primary">{t("new.testimonials.author1")}</p>
            </div>

            <div className="bg-white/80 p-6 rounded-2xl border-2 border-primary border-b-8 bg-clip-padding relative" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
              <p className="text-sm text-muted-foreground italic mb-3">
                {t("new.testimonials.quote2")}
              </p>
              <p className="text-sm font-semibold text-primary">{t("new.testimonials.author2")}</p>
            </div>

            <div className="bg-white/80 p-6 rounded-2xl border-2 border-accent border-b-8 bg-clip-padding relative" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(162, 85%, 35%), hsl(162, 70%, 40%))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
              <p className="text-sm text-muted-foreground italic mb-3">
                {t("new.testimonials.quote3")}
              </p>
              <p className="text-sm font-semibold text-accent">{t("new.testimonials.author3")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-sm p-6 md:p-8 rounded-3xl border-2 border-primary border-b-8" style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3 text-primary">{t("new.faq.title")}</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold mb-2 text-primary">{t("new.faq.q1")}</h3>
              <p className="text-base text-muted-foreground">
                {t("new.faq.a1")}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2 text-primary">{t("new.faq.q2")}</h3>
              <p className="text-base text-muted-foreground">
                {t("new.faq.a2")}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2 text-primary">{t("new.faq.q3")}</h3>
              <p className="text-base text-muted-foreground">
                {t("new.faq.a3")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-3 md:px-4 py-4 md:py-12">
        <div className="max-w-4xl mx-auto text-center space-y-4 bg-white/70 backdrop-blur-sm p-8 rounded-3xl border-2 border-transparent border-b-8 bg-clip-padding relative" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 65%), hsl(280, 60%, 65%))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
          <h2 className="text-3xl md:text-4xl font-bold text-primary">
            {t("new.final.title")}
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto mb-4">
            {t("new.final.description")}
          </p>
          
          <div className="pt-2">
            {showLoginForm ? <LoginForm /> : <JoinForm />}
            
            <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center items-center">
              <Button
                size="default"
                variant="outline"
                className="border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground h-10 px-4 py-2 flex items-center gap-2 w-full sm:w-auto"
                onClick={() => navigate("/learn-more")}
              >
                {t("new.cta.howItWorks")}
              </Button>
              <Button
                size="default"
                variant="outline"
                className="border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground h-10 px-4 py-2 flex items-center gap-2 w-full sm:w-auto"
                onClick={() => setShowLoginForm(!showLoginForm)}
              >
                {showLoginForm ? t("auth.button.signup") : t("auth.button.signin")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground border-t border-border/50">
        <p>{t("new.footer")}</p>
      </footer>
    </div>
  );
};

export default New;
