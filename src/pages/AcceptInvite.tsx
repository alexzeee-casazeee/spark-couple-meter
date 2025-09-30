import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Heart, Loader2 } from "lucide-react";

const AcceptInvite = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState<any>(null);
  const [senderProfile, setSenderProfile] = useState<any>(null);

  useEffect(() => {
    checkInvitation();
  }, [token]);

  const checkInvitation = async () => {
    try {
      // Check if user is logged in
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Please sign in",
          description: "You need to be signed in to accept an invitation",
        });
        navigate("/auth");
        return;
      }

      // Get invitation
      const { data: inviteData, error: inviteError } = await supabase
        .from('invitations')
        .select('*')
        .eq('token', token)
        .is('used_at', null)
        .single();

      if (inviteError || !inviteData) {
        toast({
          title: "Invalid invitation",
          description: "This invitation link is invalid or has expired",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      // Check if invitation is expired
      if (new Date(inviteData.expires_at) < new Date()) {
        toast({
          title: "Invitation expired",
          description: "This invitation link has expired",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      // Get sender profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', inviteData.sender_id)
        .single();

      setInvitation(inviteData);
      setSenderProfile(profileData);
      setLoading(false);
    } catch (error: any) {
      console.error('Error checking invitation:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      navigate("/dashboard");
    }
  };

  const acceptInvitation = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      // Get current user's profile
      const { data: myProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (!myProfile) throw new Error("Profile not found");

      // Check if roles are compatible (husband + wife)
      if (myProfile.role === senderProfile.role) {
        toast({
          title: "Incompatible roles",
          description: "You and your partner must have different roles (husband/wife)",
          variant: "destructive",
        });
        return;
      }

      // Mark invitation as used
      const { error: updateError } = await supabase
        .from('invitations')
        .update({
          used_at: new Date().toISOString(),
          used_by_id: myProfile.id,
        })
        .eq('id', invitation.id);

      if (updateError) throw updateError;

      // Create couple record
      const coupleData = myProfile.role === 'husband' 
        ? { husband_id: myProfile.id, wife_id: senderProfile.id }
        : { husband_id: senderProfile.id, wife_id: myProfile.id };

      const { error: coupleError } = await supabase
        .from('couples')
        .insert(coupleData);

      if (coupleError) throw coupleError;

      toast({
        title: "Connected!",
        description: `You are now connected with ${senderProfile.display_name}`,
      });

      navigate("/dashboard");
    } catch (error: any) {
      console.error('Error accepting invitation:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-soft">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-soft px-4">
      <Card className="w-full max-w-md shadow-glow border-border/50">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-romantic rounded-full flex items-center justify-center shadow-glow">
              <Heart className="w-8 h-8 text-white" fill="white" />
            </div>
          </div>
          <CardTitle className="text-3xl text-center">
            You're Invited!
          </CardTitle>
          <CardDescription className="text-center">
            {senderProfile?.display_name} has invited you to connect on HornyMeter
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-center text-muted-foreground">
              By accepting, you'll be able to share your daily feelings and see when your partner needs connection.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate("/dashboard")}
            >
              Decline
            </Button>
            <Button
              className="flex-1"
              onClick={acceptInvitation}
              disabled={loading}
            >
              {loading ? "Connecting..." : "Accept & Connect"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AcceptInvite;
