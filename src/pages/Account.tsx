import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft, User, Lock, UserMinus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Account = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [disconnectDialogOpen, setDisconnectDialogOpen] = useState(false);
  const [couple, setCouple] = useState<any>(null);
  const [partnerProfile, setPartnerProfile] = useState<any>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    setEmail(session.user.email || "");

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", session.user.id)
      .single();

    if (profileData) {
      setProfile(profileData);
      setDisplayName(profileData.display_name || "");
      
      // Check if user is in a couple
      const { data: coupleData } = await supabase
        .from("couples")
        .select("*")
        .or(`husband_id.eq.${profileData.id},wife_id.eq.${profileData.id}`)
        .eq("is_active", true)
        .maybeSingle();
      
      if (coupleData) {
        setCouple(coupleData);
        
        // Get partner profile
        const partnerId = coupleData.husband_id === profileData.id 
          ? coupleData.wife_id 
          : coupleData.husband_id;
        
        const { data: partnerData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", partnerId)
          .maybeSingle();
        
        if (partnerData) {
          setPartnerProfile(partnerData);
        }
      }
    }

    setLoading(false);
  };

  const handleUpdateProfile = async () => {
    if (!profile) return;

    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName })
      .eq("id", profile.id);

    if (error) {
      console.error("Error updating profile:", error);
    }

    setSaving(false);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      console.error("Passwords don't match");
      return;
    }

    if (newPassword.length < 6) {
      console.error("Password must be at least 6 characters");
      return;
    }

    setSaving(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error("Error updating password:", error);
    } else {
      setNewPassword("");
      setConfirmPassword("");
      setPasswordDialogOpen(false);
    }

    setSaving(false);
  };

  const handleDisconnectPartner = async () => {
    if (!couple) return;

    setSaving(true);

    const { error } = await supabase
      .from("couples")
      .update({ is_active: false })
      .eq("id", couple.id);

    if (error) {
      console.error("Error disconnecting partner:", error);
      toast({
        title: "Error",
        description: "Failed to disconnect partner. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Partner Disconnected",
        description: "You have been disconnected from your partner.",
      });
      setDisconnectDialogOpen(false);
      setCouple(null);
      setPartnerProfile(null);
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20" style={{ background: "var(--gradient-splash)" }}>
      <header className="bg-gradient-romantic p-3 shadow-glow">
        <div className="container mx-auto flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold text-white">Account Settings</h1>
        </div>
      </header>

      <div className="container mx-auto px-1 py-4 max-w-2xl">
        {/* Profile Information - Compact */}
        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="w-4 h-4" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="displayName" className="text-sm">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your display name"
                className="h-9"
              />
            </div>
            
            <div className="space-y-1.5">
              <Label className="text-sm">Email Address</Label>
              <Input value={email} disabled className="h-9" />
              <p className="text-xs text-muted-foreground">
                Contact support to change your email address
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={handleUpdateProfile} disabled={saving} className="flex-1">
                Save Profile
              </Button>
              
              <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <Lock className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                      Enter your new password below. Make sure it&apos;s at least 6 characters long.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                      />
                    </div>
                    <Button
                      onClick={handleChangePassword}
                      disabled={saving || !newPassword || !confirmPassword}
                      className="w-full"
                    >
                      {saving ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Partner Management */}
        {couple && partnerProfile && (
          <Card className="shadow-soft mt-4">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <UserMinus className="w-4 h-4" />
                Partner Connection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-sm">Connected Partner</Label>
                <Input 
                  value={partnerProfile.display_name} 
                  disabled 
                  className="h-9" 
                />
              </div>

              <Dialog open={disconnectDialogOpen} onOpenChange={setDisconnectDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <UserMinus className="w-4 h-4 mr-2" />
                    Disconnect Partner
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Disconnect Partner</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to disconnect from {partnerProfile.display_name}? 
                      This will end your couple connection and you won't be able to see each other's entries anymore.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setDisconnectDialogOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDisconnectPartner}
                      disabled={saving}
                      className="flex-1"
                    >
                      {saving ? "Disconnecting..." : "Disconnect"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Account;
