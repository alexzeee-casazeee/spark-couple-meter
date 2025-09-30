import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Copy, Link2, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface InvitationManagerProps {
  profileId: string;
  onCoupleCreated: () => void;
}

const InvitationManager = ({ profileId, onCoupleCreated }: InvitationManagerProps) => {
  const [inviteLink, setInviteLink] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

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
        title: t("dashboard.toast.invite.created"),
        description: t("dashboard.toast.invite.share"),
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
      title: t("dashboard.toast.copied"),
      description: t("dashboard.toast.copied.description"),
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-primary/20 shadow-soft">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Link2 className="w-4 h-4 text-primary" />
          {t("dashboard.invite.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!inviteLink ? (
          <Button onClick={generateInvitation} className="w-full" size="sm">
            {t("dashboard.invite.button")}
          </Button>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={inviteLink}
                readOnly
                className="flex-1 text-xs h-8"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={copyToClipboard}
                className="h-8 w-8"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground">
              {t("dashboard.invite.expires")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvitationManager;
