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

const New = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);

  return (
    <div className="min-h-screen bg-canva-gradient">
      {/* Header */}
      <header className="container mx-auto px-3 py-1.5 flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-xl" style={{ background: 'var(--gradient-primary)' }}>
            <Sparkles className="w-4 h-4 text-white m-1.5" />
          </div>
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
          
          <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl p-4 border-2 border-transparent bg-clip-padding relative mt-4" style={{
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
                className="text-xs px-3 py-1.5 h-8 bg-white/70 backdrop-blur-sm border-2 border-transparent bg-clip-padding relative shadow-lg w-full sm:w-auto"
                style={{ 
                  backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))',
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box, border-box'
                }}
                onClick={() => navigate("/learn-more")}
              >
                {t("new.cta.howItWorks")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs px-3 py-1.5 h-8 bg-white/70 backdrop-blur-sm border-2 border-transparent bg-clip-padding relative shadow-lg w-full sm:w-auto"
                style={{ 
                  backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))',
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box, border-box'
                }}
                onClick={() => setShowLoginForm(!showLoginForm)}
              >
                {showLoginForm ? t("auth.button.signup") : t("auth.button.signin")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Matters Section */}
      <section className="container mx-auto px-[5px] md:px-4 py-8">
        <div className="max-w-6xl mx-auto bg-white/70 backdrop-blur-sm p-[6px] rounded-3xl border border-white/40" style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
          <div className="text-center mb-6 px-[5px] md:px-6 pt-[5px] md:pt-6">
            <h2 className="text-3xl font-bold mb-3 text-primary">{t("new.why.title")}</h2>
          </div>
          
          <div className="space-y-5 px-[5px] md:px-6 pb-[5px] md:pb-6">
            <div className="bg-white/80 p-4 rounded-2xl border-2 border-transparent bg-clip-padding relative" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-primary">{t("new.why.card1.title")}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("new.why.card1.desc")}
              </p>
            </div>

            <div className="bg-white/80 p-4 rounded-2xl border-2 border-transparent bg-clip-padding relative" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="text-base font-semibold text-foreground">{t("new.why.card2.title")}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("new.why.card2.desc")}
              </p>
            </div>

            <div className="bg-white/80 p-4 rounded-2xl border-2 border-transparent bg-clip-padding relative" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-base font-semibold text-foreground">{t("new.why.card3.title")}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("new.why.card3.desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="container mx-auto px-[5px] md:px-4 py-8">
        <div className="max-w-md mx-auto w-full">
          <div className="rounded-2xl shadow-2xl border-2 border-white/40 overflow-hidden bg-canva-gradient">
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
      <section className="container mx-auto px-[5px] md:px-4 py-8">
        <div className="max-w-6xl mx-auto bg-white/70 backdrop-blur-sm p-[6px] rounded-3xl border border-white/40" style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
          <div className="text-center mb-6 px-[5px] md:px-6 pt-[5px] md:pt-6">
            <h2 className="text-3xl font-bold mb-3 text-primary">{t("landing.features.title")}</h2>
            <p className="text-base text-muted-foreground">{t("new.how.subtitle")}</p>
          </div>
          
          <div className="space-y-4 px-[5px] md:px-6 pb-[5px] md:pb-6">
            <div className="bg-white/80 p-5 rounded-2xl" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/15 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-primary">Daily Mood & Desire Tracker</h3>
                  <p className="text-base text-black">Each partner logs their interest (high, neutral, low), emotional state, stress, etc.</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 p-5 rounded-2xl" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-secondary/15 rounded-xl flex items-center justify-center flex-shrink-0">
                  <LineChart className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-secondary">Overlay & Compare</h3>
                  <p className="text-base text-black">See "her days vs your days" — where they match, where they don't.</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 p-5 rounded-2xl" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent/15 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-accent">Communication Prompts & Tools</h3>
                  <p className="text-base text-black">Gentle prompts to start the conversation ("Hey, today I feel…", "I notice you're quiet, want to talk?").</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 p-5 rounded-2xl" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/15 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-primary">Expectation Mapping</h3>
                  <p className="text-base text-black">Set windows, signals, "no pressure" zones—so the partner doesn't feel ghosted or rejected.</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 p-5 rounded-2xl" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-secondary/15 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-secondary">Insights & Patterns</h3>
                  <p className="text-base text-black">Over weeks you'll see trends ("I'm rarely in the mood before period", "He's more reserved on work-heavy days")—which helps you plan or adjust.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Get Section */}
      <section className="container mx-auto px-[5px] md:px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl p-8 md:p-12 border-2 border-transparent bg-clip-padding relative" style={{ 
          backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', 
          backgroundOrigin: 'border-box', 
          backgroundClip: 'padding-box, border-box',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
        }}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20 mb-4">
              <Heart className="w-4 h-4 text-primary fill-primary" />
              <span className="text-sm font-semibold text-primary">Transform Your Connection</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">What You'll Get</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-primary text-sm">✓</span>
              </div>
              <p className="text-base text-black">More empathy and understanding — less guilt, less fear of disappointing</p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-primary text-sm">✓</span>
              </div>
              <p className="text-base text-black">Fewer "Why are you shutting me out?" fights</p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-primary text-sm">✓</span>
              </div>
              <p className="text-base text-black">Higher alignment around when intimacy is welcome</p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-primary text-sm">✓</span>
              </div>
              <p className="text-base text-black">Clearer conversations about desire, rest, boundaries</p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-primary text-sm">✓</span>
              </div>
              <p className="text-base text-black">A resilient intimacy habit, rooted in trust, not guilt</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-[5px] md:px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3 text-primary">What Couples Are Saying</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/80 p-6 rounded-2xl border-2 border-transparent bg-clip-padding relative" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
              <p className="text-sm text-muted-foreground italic mb-3">
                "I used to assume 'no' meant 'not into me'. Now it feels like she's just tired. We talk before we tangle."
              </p>
              <p className="text-sm font-semibold text-primary">— Mark & Julia</p>
            </div>

            <div className="bg-white/80 p-6 rounded-2xl border-2 border-transparent bg-clip-padding relative" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
              <p className="text-sm text-muted-foreground italic mb-3">
                "Some days I don't feel sexy; other days I do. He gets that now."
              </p>
              <p className="text-sm font-semibold text-secondary">— Mia</p>
            </div>

            <div className="bg-white/80 p-6 rounded-2xl border-2 border-transparent bg-clip-padding relative" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
              <p className="text-sm text-muted-foreground italic mb-3">
                "When we sync our wants and rest days, sex becomes less performance, more connection."
              </p>
              <p className="text-sm font-semibold text-accent">— Carlos & Elena</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-[5px] md:px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-sm p-6 md:p-8 rounded-3xl border border-white/40" style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3 text-primary">Common Questions</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold mb-2 text-primary">But isn't this too clinical?</h3>
              <p className="text-base text-muted-foreground">
                Not at all. The interface is warm, personal, not a hormone lab report. You control what you share.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2 text-primary">If she logs low desire, will I feel rejected?</h3>
              <p className="text-base text-muted-foreground">
                The point is to shift away from "you rejecting me" toward "we're just out of sync today." The communication tools help cushion that difference.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2 text-primary">Do we have to log every day?</h3>
              <p className="text-base text-muted-foreground">
                No. Consistency helps, but even partial use changes how you talk and understand each other.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-4 bg-white/70 backdrop-blur-sm p-8 rounded-3xl border-2 border-transparent bg-clip-padding relative" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
          <h2 className="text-3xl md:text-4xl font-bold text-primary">
            Ready to bridge invisible gaps?
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto mb-4">
            Try the app for 30 days free. See your patterns, start the conversations, transform your connection.
          </p>
          
          <div className="pt-2">
            {showLoginForm ? <LoginForm /> : <JoinForm />}
            
            <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center items-center">
              <Button
                size="default"
                variant="outline"
                className="text-sm px-4 py-2 bg-white/70 backdrop-blur-sm border-2 border-transparent bg-clip-padding relative shadow-lg w-full sm:w-auto"
                style={{ 
                  backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))',
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box, border-box'
                }}
                onClick={() => navigate("/learn-more")}
              >
                See How It Works
              </Button>
              <Button
                size="default"
                variant="outline"
                className="text-sm px-4 py-2 bg-white/70 backdrop-blur-sm border-2 border-transparent bg-clip-padding relative shadow-lg w-full sm:w-auto"
                style={{ 
                  backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))',
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box, border-box'
                }}
                onClick={() => setShowLoginForm(!showLoginForm)}
              >
                {showLoginForm ? "Sign Up" : "Login"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground border-t border-border/50">
        <p>© 2025 Spark Meter. Built with empathy for couples.</p>
      </footer>
    </div>
  );
};

export default New;
