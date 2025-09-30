import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Heart, Loader2 } from "lucide-react";

const AcceptInvite = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [signingUp, setSigningUp] = useState(false);
  const [invitation, setInvitation] = useState<any>(null);
  const [senderProfile, setSenderProfile] = useState<any>(null);
  
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
        toast({
          title: "Invalid invitation",
          description: "This invitation link is invalid or has been used",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      // Check if expired
      if (new Date(inviteData.expires_at) < new Date()) {
        toast({
          title: "Invitation expired",
          description: "This invitation link has expired",
          variant: "destructive",
        });
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
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      navigate("/");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSigningUp(true);

    try {
      // Determine role (opposite of sender)
      const role = senderProfile.role === 'husband' ? 'wife' : 'husband';

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

      if (error) throw error;
      if (!data.user) throw new Error("Failed to create account");

      // Wait for profile to be created by trigger
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Get the new user's profile
      const { data: myProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', data.user.id)
        .single();

      if (!myProfile) throw new Error("Profile not found");

      // Mark invitation as used
      await supabase
        .from('invitations')
        .update({
          used_at: new Date().toISOString(),
          used_by_id: myProfile.id,
        })
        .eq('id', invitation.id);

      // Create couple record
      const coupleData = role === 'husband' 
        ? { husband_id: myProfile.id, wife_id: senderProfile.id }
        : { husband_id: senderProfile.id, wife_id: myProfile.id };

      await supabase.from('couples').insert(coupleData);

      toast({
        title: "Account created!",
        description: `You're now connected with ${senderProfile.display_name}`,
      });

      navigate("/dashboard");
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
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
    <div className="min-h-screen bg-gradient-soft px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Welcome Message */}
        <Card className="border-primary/20 shadow-glow">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Heart className="w-16 h-16 text-primary fill-primary" />
            </div>
            <CardTitle className="text-3xl mb-2">
              Your {partnerRole}, {senderProfile?.display_name} invited you to LifeMeter
            </CardTitle>
            <CardDescription className="text-base">
              All information here is private and just for you. Create your account below to get started.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Dashboard Preview */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Preview: Your Daily Check-In</CardTitle>
            <CardDescription className="text-xs">
              This is what you'll see after signing up
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 opacity-60 pointer-events-none">
              <Label className="text-sm font-semibold">Intimacy Level</Label>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-10">Low</span>
                <Slider value={[50]} max={100} className="flex-1" disabled />
                <span className="text-xs text-muted-foreground w-10 text-right">High</span>
              </div>
              <p className="text-xs text-center text-primary font-medium">50%</p>
            </div>

            <div className="space-y-2 opacity-60 pointer-events-none">
              <Label className="text-sm font-semibold">General Feeling</Label>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-10">Bad</span>
                <Slider value={[50]} max={100} className="flex-1" disabled />
                <span className="text-xs text-muted-foreground w-10 text-right">Great</span>
              </div>
              <p className="text-xs text-center text-primary font-medium">50%</p>
            </div>

            <div className="space-y-2 opacity-60 pointer-events-none">
              <Label className="text-sm font-semibold">Sleep Quality</Label>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-10">Poor</span>
                <Slider value={[50]} max={100} className="flex-1" disabled />
                <span className="text-xs text-muted-foreground w-10 text-right">Great</span>
              </div>
              <p className="text-xs text-center text-primary font-medium">50%</p>
            </div>
          </CardContent>
        </Card>

        {/* Signup Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create Your Account</CardTitle>
            <CardDescription>
              You'll be automatically connected with {senderProfile?.display_name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Your Name</Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Your name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={signingUp}>
                {signingUp ? "Creating Account..." : "Create Account & Connect"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Download Info */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <p className="text-sm text-center text-muted-foreground">
              After creating your account, you can access LifeMeter from any device by bookmarking this page or adding it to your home screen.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AcceptInvite;
