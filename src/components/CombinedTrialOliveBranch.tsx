import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CreditCard, Crown } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface CombinedTrialOliveBranchProps {
  profile: any;
  couple: any;
  partnerProfile: any;
}

const CombinedTrialOliveBranch = ({ 
  profile, 
  couple, 
  partnerProfile
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
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-500/15 rounded-full flex items-center justify-center flex-shrink-0">
            <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-green-700 truncate">{t("trial.premium")}</p>
            <p className="text-[10px] sm:text-xs text-green-600">{t("trial.unlimited")}</p>
          </div>
        </div>
      );
    }

    if (daysRemaining === 0) {
      return (
        <div className="flex flex-col gap-1.5 sm:gap-2">
          <p className="text-xs sm:text-sm font-semibold text-red-700">{t("trial.expired")}</p>
          <Button 
            onClick={handleUpgrade} 
            disabled={loading}
            size="sm"
            className="h-6 sm:h-7 text-[10px] sm:text-xs w-full"
          >
            <CreditCard className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            {loading ? t("trial.loading") : t("trial.upgrade")}
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-1.5 sm:gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary/15 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-primary">{daysRemaining}</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-foreground truncate">{t("trial.freeTrial")}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
              {daysRemaining} {daysRemaining === 1 ? t("trial.day") : t("trial.days")} {t("trial.left")}
            </p>
          </div>
        </div>
        <Button 
          onClick={handleUpgrade} 
          disabled={loading}
          variant="outline"
          size="sm"
          className="h-6 sm:h-7 text-[10px] sm:text-xs w-full"
        >
          <CreditCard className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          {loading ? t("trial.loading") : t("trial.upgrade")}
        </Button>
      </div>
    );
  };

  return (
    <div className="bg-card/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 border-2 border-border shadow-md">
      <div className="flex flex-row items-center justify-center">
        {/* Trial Status */}
        <div className="flex-1">
          {renderTrialStatus()}
        </div>
      </div>
    </div>
  );
};

export default CombinedTrialOliveBranch;
