import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Copy, Link2, Check } from "lucide-react";

interface InvitationManagerProps {
  profileId: string;
  onCoupleCreated: () => void;
}

const InvitationManager = ({ profileId, onCoupleCreated }: InvitationManagerProps) => {
  const [inviteLink, setInviteLink] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateInvitation = async () => {
    try {
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

      const { error } = await supabase
        .from('invitations')
        .insert({
          sender_id: profileId,
          token: token,
          expires_at: expiresAt.toISOString(),
        });

      if (error) throw error;

      const link = `${window.location.origin}/invite/${token}`;
      setInviteLink(link);
      
      toast({
        title: "Invitation created!",
        description: "Share this link with your partner",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Invitation link copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-primary/20 shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="w-5 h-5 text-primary" />
          Connect with Your Partner
        </CardTitle>
        <CardDescription>
          Create an invitation link to connect with your partner
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!inviteLink ? (
          <Button onClick={generateInvitation} className="w-full">
            Generate Invitation Link
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={inviteLink}
                readOnly
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={copyToClipboard}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              This link expires in 7 days. Send it to your partner to connect your accounts.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvitationManager;
