import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Heart, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const AcceptInvite = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [signingUp, setSigningUp] = useState(false);
  const [invitation, setInvitation] = useState<any>(null);
  const [senderProfile, setSenderProfile] = useState<any>(null);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  
  // Daily check-in values
  const [intimacy, setIntimacy] = useState([50]);
  const [touch, setTouch] = useState([50]);
  const [communication, setCommunication] = useState([50]);
  const [sleep, setSleep] = useState([50]);
  
  // Signup form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    loadInvitation();
  }, [token]);

  const loadInvitation = async () => {
    try {
      // Get invitation without requiring auth
      const { data: inviteData, error: inviteError } = await supabase
        .from('invitations')
        .select('*')
        .eq('token', token)
        .is('used_at', null)
        .single();

      if (inviteError || !inviteData) {
        console.error("Invalid invitation");
        navigate("/");
        return;
      }

      // Check if expired
      if (new Date(inviteData.expires_at) < new Date()) {
        console.error("Invitation expired");
        navigate("/");
        return;
      }

      setInvitation(inviteData);

      // Get sender profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', inviteData.sender_id)
        .single();

      setSenderProfile(profileData);
      setLoading(false);
    } catch (error: any) {
      console.error('Error loading invitation:', error);
      navigate("/");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSigningUp(true);

    try {
      console.log('Starting signup process...');
      
      // Determine role (opposite of sender)
      const role = senderProfile.role === 'husband' ? 'wife' : 'husband';
      console.log('User role:', role);

      // Sign up
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            display_name: displayName,
            role: role
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        toast({
          title: "Signup Failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      if (!data.user) {
        const errorMsg = "Failed to create account";
        console.error(errorMsg);
        toast({
          title: "Signup Failed",
          description: errorMsg,
          variant: "destructive",
        });
        throw new Error(errorMsg);
      }

      console.log('User created:', data.user.id);
      
      toast({
        title: "Account Created!",
        description: "Setting up your profile...",
      });

      // Wait for profile to be created by trigger
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Get the new user's profile
      const { data: myProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', data.user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        toast({
          title: "Profile Error",
          description: "Could not load your profile. Please try logging in.",
          variant: "destructive",
        });
        throw profileError;
      }

      if (!myProfile) {
        const errorMsg = "Profile not found";
        console.error(errorMsg);
        toast({
          title: "Profile Error",
          description: errorMsg,
          variant: "destructive",
        });
        throw new Error(errorMsg);
      }

      console.log('Profile found:', myProfile.id);

      // Mark invitation as used
      const { error: inviteError } = await supabase
        .from('invitations')
        .update({
          used_at: new Date().toISOString(),
          used_by_id: myProfile.id,
        })
        .eq('id', invitation.id);

      if (inviteError) {
        console.error('Invitation update error:', inviteError);
      }

      // Create couple record
      const coupleData = role === 'husband' 
        ? { husband_id: myProfile.id, wife_id: senderProfile.id }
        : { husband_id: senderProfile.id, wife_id: myProfile.id };

      const { error: coupleError } = await supabase.from('couples').insert(coupleData);

      if (coupleError) {
        console.error('Couple creation error:', coupleError);
        toast({
          title: "Connection Error",
          description: "Could not connect with your partner. Please contact support.",
          variant: "destructive",
        });
        throw coupleError;
      }

      console.log('Couple created successfully');
      
      toast({
        title: "Success!",
        description: "You're now connected. Redirecting to dashboard...",
      });

      // Save initial daily check-in values
      const { error: entryError } = await supabase
        .from('daily_entries')
        .insert({
          user_id: myProfile.id,
          horniness_level: intimacy[0],
          general_feeling: touch[0],
          communication_desire: communication[0],
          sleep_quality: sleep[0],
          emotional_state: 50,
        });

      if (entryError) {
        console.error('Entry creation error:', entryError);
      }

      // Small delay before navigation
      await new Promise(resolve => setTimeout(resolve, 500));
      navigate("/dashboard");
    } catch (error: any) {
      console.error('Signup error:', error);
    } finally {
      setSigningUp(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-soft">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const partnerRole = senderProfile?.role === 'husband' ? 'Husband' : 'Wife';

  return (
    <div className="min-h-screen px-4 py-8" style={{ background: 'var(--gradient-canva-bg)' }}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Welcome Message */}
        <Card className="bg-white/80 backdrop-blur-md rounded-3xl border-2 border-transparent bg-clip-padding relative" style={{ 
          backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', 
          backgroundOrigin: 'border-box', 
          backgroundClip: 'padding-box, border-box',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
        }}>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Heart className="w-16 h-16 text-primary fill-primary" />
            </div>
            <CardTitle className="text-3xl mb-2 text-foreground">
              {t("acceptInvite.header").replace('{name}', senderProfile?.display_name || '')}
            </CardTitle>
            <CardDescription className="text-base text-foreground/70">
              {t("landing.hero.description")}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Dashboard Preview */}
        <Card className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border-2 border-transparent bg-clip-padding relative" style={{ 
          backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', 
          backgroundOrigin: 'border-box', 
          backgroundClip: 'padding-box, border-box',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
        }}>
          <CardHeader className="pb-3 px-0">
            <CardTitle className="text-lg text-foreground">{t("dashboard.checkin.title")}</CardTitle>
            <CardDescription className="text-xs text-foreground/60">
              {t("acceptInvite.checkin.subtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-0">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">{t("dashboard.checkin.intimacy")}</Label>
              <div className="flex items-center gap-3">
                <span className="text-xs text-foreground/60 w-10">{t("dashboard.checkin.low")}</span>
                <Slider value={intimacy} onValueChange={setIntimacy} max={100} className="flex-1" />
                <span className="text-xs text-foreground/60 w-10 text-right">{t("dashboard.checkin.high")}</span>
              </div>
              <p className="text-xs text-center text-primary font-medium">{intimacy[0]}%</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">{t("dashboard.checkin.feeling")}</Label>
              <div className="flex items-center gap-3">
                <span className="text-xs text-foreground/60 w-10">{t("dashboard.checkin.bad")}</span>
                <Slider value={touch} onValueChange={setTouch} max={100} className="flex-1" />
                <span className="text-xs text-foreground/60 w-10 text-right">{t("dashboard.checkin.great")}</span>
              </div>
              <p className="text-xs text-center text-primary font-medium">{touch[0]}%</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">{t("dashboard.checkin.communication")}</Label>
              <div className="flex items-center gap-3">
                <span className="text-xs text-foreground/60 w-10">{t("dashboard.checkin.low")}</span>
                <Slider value={communication} onValueChange={setCommunication} max={100} className="flex-1" />
                <span className="text-xs text-foreground/60 w-10 text-right">{t("dashboard.checkin.high")}</span>
              </div>
              <p className="text-xs text-center text-primary font-medium">{communication[0]}%</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">{t("dashboard.checkin.sleep")}</Label>
              <div className="flex items-center gap-3">
                <span className="text-xs text-foreground/60 w-10">{t("dashboard.checkin.poor")}</span>
                <Slider value={sleep} onValueChange={setSleep} max={100} className="flex-1" />
                <span className="text-xs text-foreground/60 w-10 text-right">{t("dashboard.checkin.great")}</span>
              </div>
              <p className="text-xs text-center text-primary font-medium">{sleep[0]}%</p>
            </div>

            <Button 
              onClick={() => setSignupModalOpen(true)}
              className="w-full text-lg font-semibold py-6 mt-6 shadow-xl"
              style={{ 
                background: 'var(--gradient-primary)',
                borderRadius: '1.25rem'
              }}
            >
              SAVE
            </Button>
          </CardContent>
        </Card>


        {/* Signup Modal */}
        <Dialog open={signupModalOpen} onOpenChange={setSignupModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-foreground">{t("acceptInvite.form.title")}</DialogTitle>
              <DialogDescription className="text-foreground/70">
                {t("acceptInvite.form.subtitle").replace('{name}', senderProfile?.display_name || '')}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSignup} className="space-y-4 mt-4">
              <div className="space-y-2">
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
                <Label htmlFor="password" className="text-foreground">{t("auth.password")}</Label>
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
              <Button 
                type="submit" 
                className="w-full text-lg font-semibold py-6 shadow-xl"
                style={{ 
                  background: 'var(--gradient-primary)',
                  borderRadius: '1.25rem'
                }}
                disabled={signingUp}
              >
                {signingUp ? t("auth.button.loading") : t("acceptInvite.button")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AcceptInvite;
