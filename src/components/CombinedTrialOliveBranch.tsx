import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CreditCard, Crown, Heart } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface CombinedTrialOliveBranchProps {
  profile: any;
  couple: any;
  partnerProfile: any;
  onOpenOliveBranch: () => void;
  unreadCount: number;
}

const CombinedTrialOliveBranch = ({ 
  profile, 
  couple, 
  partnerProfile, 
  onOpenOliveBranch,
  unreadCount 
}: CombinedTrialOliveBranchProps) => {
  const [daysRemaining, setDaysRemaining] = useState<number>(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    calculateDaysRemaining();
    checkSubscription();
  }, [profile]);

  const calculateDaysRemaining = () => {
    if (!profile?.trial_start_date) return;
    
    const trialStart = new Date(profile.trial_start_date);
    const today = new Date();
    const diffTime = today.getTime() - trialStart.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const remaining = Math.max(0, 30 - diffDays);
    
    setDaysRemaining(remaining);
  };

  const checkSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) throw error;
      
      setIsSubscribed(data?.subscribed || false);
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout');
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderTrialStatus = () => {
    if (isSubscribed) {
      return (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500/15 rounded-full flex items-center justify-center flex-shrink-0">
            <Crown className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-green-700">Premium</p>
            <p className="text-xs text-green-600">Unlimited</p>
          </div>
        </div>
      );
    }

    if (daysRemaining === 0) {
      return (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-red-700">Trial Expired</p>
          <Button 
            onClick={handleUpgrade} 
            disabled={loading}
            size="sm"
            className="h-7 text-xs"
          >
            <CreditCard className="w-3 h-3" />
            {loading ? "Loading..." : "Upgrade $2.99/mo"}
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/15 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-primary">{daysRemaining}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Free Trial</p>
            <p className="text-xs text-muted-foreground">
              {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} left
            </p>
          </div>
        </div>
        <Button 
          onClick={handleUpgrade} 
          disabled={loading}
          variant="outline"
          size="sm"
          className="h-7 text-xs"
        >
          <CreditCard className="w-3 h-3" />
          {loading ? "Loading..." : "Upgrade $2.99/mo"}
        </Button>
      </div>
    );
  };

  return (
    <div className="bg-card/80 backdrop-blur-md rounded-2xl p-4 border-2 border-border shadow-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Trial Status - Left Side */}
        <div className="flex-1">
          {renderTrialStatus()}
        </div>

        {/* Vertical Separator */}
        {couple && partnerProfile && (
          <div className="hidden sm:block h-16 w-px bg-border" />
        )}

        {/* Olive Branch - Right Side */}
        {couple && partnerProfile && (
          <div className="flex items-center gap-2">
            <Button
              onClick={onOpenOliveBranch}
              variant="outline"
              size="sm"
              className="relative h-9 gap-2"
            >
              <Heart className="w-4 h-4" />
              <span className="text-sm">{t('oliveBranch')}</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CombinedTrialOliveBranch;
