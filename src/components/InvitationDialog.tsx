import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MessageCircle, Mail, Link2, Copy, Check, UserPlus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

interface InvitationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileId: string;
}

const InvitationDialog = ({ open, onOpenChange, profileId }: InvitationDialogProps) => {
  const { t } = useLanguage();
  const [inviteLink, setInviteLink] = useState("");
  const [copied, setCopied] = useState(false);

  const generateInvitation = async () => {
    try {
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

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
    } catch (error: any) {
      console.error("Error creating invitation:", error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInviteViaiMessage = () => {
    const inviteUrl = inviteLink || window.location.origin + '/accept-invite';
    const message = `Hi! I just signed up for Spark Meter, an app that helps couples stay connected by tracking our daily moods and intimacy levels. I'd love for you to join me! Click here to get started: ${inviteUrl}`;
    window.location.href = `sms:&body=${encodeURIComponent(message)}`;
  };

  const handleInviteViaEmail = () => {
    const inviteUrl = inviteLink || window.location.origin + '/accept-invite';
    const subject = 'Join me on Spark Meter!';
    const body = `Hi!\n\nI just signed up for Spark Meter, an app that helps couples stay connected by tracking our daily moods, intimacy levels, and emotional states.\n\nIt's a private space just for us to better understand each other and strengthen our relationship.\n\nI'd love for you to join me! Click here to get started:\n${inviteUrl}\n\nLooking forward to connecting with you!\n\nWith love`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary">
            {t("dashboard.invite.prompt.title")}
          </DialogTitle>
          <DialogDescription>
            {t("dashboard.invite.prompt.description")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 py-4">
          <Button
            onClick={handleInviteViaiMessage}
            className="w-full justify-start gap-2"
            variant="outline"
          >
            <MessageCircle className="h-4 w-4" />
            {t("dashboard.invite.viaiMessage")}
          </Button>
          <Button
            onClick={handleInviteViaEmail}
            className="w-full justify-start gap-2"
            variant="outline"
          >
            <Mail className="h-4 w-4" />
            {t("dashboard.invite.viaEmail")}
          </Button>
          
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>
          
          {!inviteLink ? (
            <Button onClick={generateInvitation} className="w-full gap-2">
              <UserPlus className="h-4 w-4" />
              Invite Your Partner
            </Button>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={inviteLink}
                  readOnly
                  className="flex-1 text-xs"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {t("dashboard.invite.expires")}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvitationDialog;
