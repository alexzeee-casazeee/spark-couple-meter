import { Button } from "@/components/ui/button";
import { Heart, Users, TrendingUp, Shield, Bell, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-romantic opacity-10" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <Heart className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Better Communication, Stronger Connection</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Clear the Air in Your
              <span className="bg-gradient-romantic bg-clip-text text-transparent"> Relationship</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              In many relationships, especially when it comes to intimacy and expectations, misunderstandings create distance. 
              HornyMeter helps couples communicate honestly about their needs, desires, and emotional state.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                className="text-lg px-8 shadow-glow hover:shadow-glow transition-all"
                onClick={() => navigate("/auth")}
              >
                Get Started Free
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-soft">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Simple daily check-ins that strengthen your bond</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-card p-8 rounded-2xl shadow-soft hover:shadow-glow transition-all border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Connect as a Couple</h3>
              <p className="text-muted-foreground">
                Create accounts as husband or wife, then connect through a private invitation link.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl shadow-soft hover:shadow-glow transition-all border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Daily Check-Ins</h3>
              <p className="text-muted-foreground">
                Share your intimacy level, mood, sleep quality, and emotions with simple sliders or voice input.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl shadow-soft hover:shadow-glow transition-all border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Bell className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Notifications</h3>
              <p className="text-muted-foreground">
                Receive gentle alerts when your partner needs attention, creating opportunities for connection.
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
              <h2 className="text-4xl font-bold mb-4">Why Couples Love HornyMeter</h2>
              <p className="text-xl text-muted-foreground">Real transparency leads to real intimacy</p>
            </div>
            
            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Private & Safe</h3>
                  <p className="text-muted-foreground">Your data is completely private. Even admins can't see your personal entries.</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Reduces Misunderstandings</h3>
                  <p className="text-muted-foreground">Clear communication about needs prevents hurt feelings and missed opportunities for intimacy.</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Track Your Journey</h3>
                  <p className="text-muted-foreground">View 30-day trends to understand patterns and strengthen your relationship over time.</p>
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
              Start Building a More Honest Relationship Today
            </h2>
            <p className="text-xl text-muted-foreground">
              Join couples who've discovered the power of transparent communication
            </p>
            <Button 
              size="lg" 
              className="text-lg px-12 shadow-glow"
              onClick={() => navigate("/auth")}
            >
              Create Your Account
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 HornyMeter. Built with love for loving couples.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
