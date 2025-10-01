import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, MessageSquare, TrendingUp, Shield, Heart, Users, Lightbulb } from "lucide-react";
import { useEffect, useState } from "react";
import { AuthModal } from "@/components/AuthModal";

const LearnMore = () => {
  const navigate = useNavigate();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    // Smooth scroll to hash on load
    if (window.location.hash) {
      const element = document.querySelector(window.location.hash);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-canva-bg)' }}>
      {/* Header */}
      <header className="border-b border-white/40 bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-1.5 py-2">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Spark
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="py-6 px-1.5">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60">
            <Heart className="w-8 h-8 text-primary-foreground" fill="currentColor" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Clear the air. Connect deeply.
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Regular check-ins keep you aligned on wants, needs, and expectations, even when life is busy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => setAuthModalOpen(true)}
              className="text-lg px-8 border-2 border-transparent bg-clip-padding relative shadow-lg"
              style={{ 
                background: 'var(--gradient-primary)',
                backgroundImage: 'linear-gradient(135deg, hsl(280, 60%, 70%), hsl(190, 70%, 75%)), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box'
              }}
            >
              Start a check-in
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("how-it-works")}
              className="text-lg px-8 bg-white/70 backdrop-blur-sm border-2 border-transparent bg-clip-padding relative shadow-lg"
              style={{ 
                backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box'
              }}
            >
              See how it works
            </Button>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-6 px-2 md:px-1.5">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold mb-8 text-center text-primary">The Problem: Busy lives, silent drift</h2>
          
          <div className="space-y-4 text-lg text-muted-foreground mb-2 bg-white/70 backdrop-blur-sm p-5 rounded-3xl border-2 border-transparent bg-clip-padding relative" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
            <p>
              We all get busy. Work, kids, logistics, screens. Real conversations get pushed to later. Feelings, needs, and expectations stay unspoken. Small misunderstandings pile up. Disconnection creeps in quietly.
            </p>
            <p>
              Research is blunt about it. Negative communication goes with lower satisfaction, positive communication goes with higher satisfaction. The pattern is consistent across studies.
            </p>
            <p>
              Money conflict is another common flashpoint. In a large study, 36.7 percent of participants reported financial problems as a major contributor to divorce. Clear communication about pressures and priorities matters.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm border-2 border-transparent bg-clip-padding relative rounded-3xl p-5 space-y-4" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
            <blockquote className="text-lg italic border-l-4 border-primary pl-4">
              "Negative communication is reliably linked to lower relationship satisfaction. Positive communication is linked to higher satisfaction."
            </blockquote>
            <blockquote className="text-lg italic border-l-4 border-primary pl-4">
              "Financial conflict is a frequent contributor to divorce, reported by 36.7 percent of participants in a large study."
            </blockquote>
          </div>
        </div>
      </section>

      {/* Why Check-ins Matter */}
      <section id="checkins" className="py-6 px-1.5">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-8 text-center text-primary">Why Regular Check-ins Matter</h2>
          
          <p className="text-lg text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
            A check-in is a short, intentional space to say what is true, to listen, and to realign. It prevents small hurts from fermenting into resentment. It keeps expectations current as life changes.
          </p>

          <div className="bg-white/70 backdrop-blur-sm border-2 border-transparent bg-clip-padding relative rounded-3xl p-5" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
            <div className="grid md:grid-cols-2 gap-1.5 mb-2">
            <div className="flex gap-4 p-5 rounded-2xl bg-white/80 border-2 border-transparent bg-clip-padding relative" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
              <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Prevent buildup, surface issues early</h3>
                <p className="text-sm text-muted-foreground">Catch small problems before they become big ones</p>
              </div>
            </div>
            <div className="flex gap-4 p-5 rounded-2xl bg-white/80 border-2 border-transparent bg-clip-padding relative" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
              <Users className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Increase understanding and empathy</h3>
                <p className="text-sm text-muted-foreground">See things from your partner's perspective</p>
              </div>
            </div>
            <div className="flex gap-4 p-5 rounded-2xl bg-white/80 border-2 border-transparent bg-clip-padding relative" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
              <Lightbulb className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Keep expectations clear as life changes</h3>
                <p className="text-sm text-muted-foreground">Stay aligned through transitions</p>
              </div>
            </div>
            <div className="flex gap-4 p-5 rounded-2xl bg-white/80 border-2 border-transparent bg-clip-padding relative" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
              <MessageSquare className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Create a predictable, safe space to talk</h3>
                <p className="text-sm text-muted-foreground">Know when and how to share</p>
              </div>
            </div>
            <div className="flex gap-4 p-5 rounded-2xl bg-white/80 border-2 border-transparent bg-clip-padding relative md:col-span-2" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
              <Heart className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Strengthen trust and intimacy over time</h3>
                <p className="text-sm text-muted-foreground">Build deeper connection through consistency</p>
              </div>
            </div>
          </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 text-center">
              <p className="text-muted-foreground">
                Structured relationship "checkups" have RCT support for improving intimacy and relationship health.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How Spark Helps */}
      <section id="how-it-works" className="py-6 px-1.5">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-8 text-center text-primary">How Spark Helps</h2>
          
          <p className="text-lg text-muted-foreground mb-8 text-center">
            Spark removes the friction.
          </p>

          <div className="grid md:grid-cols-3 gap-1.5 mb-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border-2 border-transparent bg-clip-padding relative" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
              <TrendingUp className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">Custom Dimensions</h3>
              <p className="text-muted-foreground">Track what matters to you: Desire for Intimacy, Touch, Communication, and more.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border-2 border-transparent bg-clip-padding relative" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
              <MessageSquare className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">Daily Check-ins</h3>
              <p className="text-muted-foreground">Each partner reports on their levels independently, creating honest visibility.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border-2 border-transparent bg-clip-padding relative" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
              <Heart className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">Olive Branch</h3>
              <p className="text-muted-foreground">AI-assisted messages to reach out when words are hard to find.</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground text-center mb-6">
            Private by default. Built to reduce blame, increase understanding.
          </p>

          <div className="text-center">
            <Button 
              size="lg" 
              onClick={() => setAuthModalOpen(true)}
              className="shadow-lg"
              style={{ background: 'var(--gradient-primary)' }}
            >
              Try a 2-minute check-in
            </Button>
          </div>

          <p className="text-muted-foreground text-center mt-6">
            Start small. Stay consistent. Watch the tone of the relationship change.
          </p>
        </div>
      </section>

      {/* Framework Section */}
      <section id="framework" className="py-6 px-1.5">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold mb-8 text-center text-primary">What to Say, Even When You Feel Stuck</h2>
          
          <div className="bg-white/70 backdrop-blur-sm border-2 border-transparent bg-clip-padding relative rounded-3xl p-5 space-y-4" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
            <ol className="space-y-4 list-decimal list-inside text-lg">
              <li>Start with one appreciation.</li>
              <li>Use "I feel, I need, I want."</li>
              <li>Listen first. Reflect back what you heard.</li>
              <li>If emotions spike, pause and resume later.</li>
              <li>End with one tiny action each of you will take before the next check-in.</li>
            </ol>
          </div>

          <p className="text-sm text-muted-foreground text-center mt-6">
            This mirrors best-practice guidance used by therapists for productive communication.
          </p>
        </div>
      </section>

      {/* Proof Section */}
      <section id="proof" className="py-6 px-1.5">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold mb-8 text-center text-primary">Proof and Research</h2>
          
          <div className="space-y-1.5">
            <div className="bg-white/70 backdrop-blur-sm border-2 border-transparent bg-clip-padding relative rounded-2xl p-5" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
              <p className="text-muted-foreground">
                Positive communication and lower negativity are linked with higher relationship quality over time.
              </p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm border-2 border-transparent bg-clip-padding relative rounded-2xl p-5" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
              <p className="text-muted-foreground">
                Within couples, more negative interactions go with lower satisfaction, more positive with higher satisfaction.
              </p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm border-2 border-transparent bg-clip-padding relative rounded-2xl p-5" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
              <p className="text-muted-foreground">
                Annual relationship checkups improve intimacy and relationship health in trials.
              </p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm border-2 border-transparent bg-clip-padding relative rounded-2xl p-5" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
              <p className="text-muted-foreground">
                Avoid the Four Horsemen: criticism, defensiveness, contempt, stonewalling.
              </p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm border-2 border-transparent bg-clip-padding relative rounded-2xl p-5" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
              <p className="text-muted-foreground">
                Financial conflict is common. Bring it into the open and plan together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stories Section */}
      <section id="stories" className="py-6 px-1.5">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-8 text-center text-primary">Real-life Snapshots</h2>
          
          <div className="grid md:grid-cols-3 gap-1.5">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border-2 border-transparent bg-clip-padding relative" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
              <p className="text-muted-foreground">
                A couple used weekly check-ins to catch brewing resentment about household tasks. What started as vague frustration became a clear plan: rotate dishes, hire help for deep cleaning. Two months later, both reported feeling lighter and more appreciated.
              </p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border-2 border-transparent bg-clip-padding relative" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
              <p className="text-muted-foreground">
                After a job change, one partner felt disconnected but could not name why. A short Spark check-in surfaced the real issue: different expectations about evening routines. They agreed on three nights together, two nights solo. Connection restored without a big fight.
              </p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border-2 border-transparent bg-clip-padding relative" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
              <p className="text-muted-foreground">
                New parents struggled to talk about anything except logistics. Five-minute micro check-ins let them share appreciation and one small need each week. Over time, they rebuilt emotional intimacy without needing long date nights they could not schedule.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-6 px-1.5">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold mb-8 text-center text-primary">FAQ</h2>
          
          <div className="space-y-6 bg-white/70 backdrop-blur-sm rounded-3xl p-2.5 border-2 border-transparent bg-clip-padding relative" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
            <div>
              <h3 className="font-semibold text-lg mb-2">"We do not have time."</h3>
              <p className="text-muted-foreground">
                5 minutes is enough to keep connection alive, consistency matters more than length.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">"What if one of us is nervous to share?"</h3>
              <p className="text-muted-foreground">
                Start with appreciation, then one small need.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">"What if we argue?"</h3>
              <p className="text-muted-foreground">
                Use the framework, pause if heated, restart later.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">"How often?"</h3>
              <p className="text-muted-foreground">
                Do one quick micro check-in midweek, one deeper check-in weekly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="cta" className="py-6 px-1.5">
        <div className="container mx-auto max-w-2xl text-center space-y-4 bg-white/70 backdrop-blur-sm p-2.5 rounded-3xl border-2 border-transparent bg-clip-padding relative" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
          <h2 className="text-4xl font-bold mb-4 text-primary">Start your first check-in now.</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Takes 2 minutes. Real progress.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/auth")} 
            className="text-lg px-8 shadow-lg"
            style={{ background: 'var(--gradient-primary)' }}
          >
            Start a check-in
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Takes 2 minutes. No credit card.
          </p>
        </div>
      </section>

      {/* Sources Section */}
      <section id="sources" className="py-6 px-1.5 border-t border-white/40">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold mb-6 text-primary">Sources</h2>
          
          <div className="space-y-3 text-sm">
            <p>
              <a 
                href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8242788/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Johnson MD et al. "Within-Couple Associations Between Communication and Relationship Satisfaction." Frontiers in Psychology, 2021.
              </a>
            </p>
            <p>
              <a 
                href="https://onlinelibrary.wiley.com/doi/abs/10.1111/jomf.12839" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Kanter JB et al. "Does couple communication predict later relationship quality? A meta-analysis." Journal of Marriage and Family, 2022.
              </a>
            </p>
            <p>
              <a 
                href="https://pubmed.ncbi.nlm.nih.gov/24364596/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Cordova JV et al. "The Marriage Checkup: a randomized controlled trial." Journal of Consulting and Clinical Psychology, 2014.
              </a>
            </p>
            <p>
              <a 
                href="https://www.arammu.com/wp-content/uploads/2019/11/Trillingsgaard-et-al.-2021-RCT-The-Marriage-Checkup-in-Denmark.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Trillingsgaard T et al. "RCT of the Marriage Checkup in Denmark." PDF summary.
              </a>
            </p>
            <p>
              <a 
                href="https://www.gottman.com/blog/the-four-horsemen-recognizing-criticism-contempt-defensiveness-and-stonewalling/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                The Gottman Institute. "The Four Horsemen."
              </a>
            </p>
            <p>
              <a 
                href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4012696/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Scott SB et al. "Reasons for Divorce and Recollections of Premarital Interaction." Couple and Family Psychology, 2013.
              </a>
            </p>
            <p>
              <a 
                href="https://www.psychologytoday.com/us/blog/communication-success/202008/10-tips-effective-couples-communication" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Preston Ni. "Tips for Effective Couples Communication." Psychology Today.
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-1.5">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 Spark Couple Meter. Built to help couples stay connected.</p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
};

export default LearnMore;