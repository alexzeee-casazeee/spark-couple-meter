import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CreditCard, Crown, Leaf } from "lucide-react";
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
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-500/15 rounded-full flex items-center justify-center flex-shrink-0">
            <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-green-700 truncate">Premium</p>
            <p className="text-[10px] sm:text-xs text-green-600">Unlimited</p>
          </div>
        </div>
      );
    }

    if (daysRemaining === 0) {
      return (
        <div className="flex flex-col gap-1.5 sm:gap-2">
          <p className="text-xs sm:text-sm font-semibold text-red-700">Trial Expired</p>
          <Button 
            onClick={handleUpgrade} 
            disabled={loading}
            size="sm"
            className="h-6 sm:h-7 text-[10px] sm:text-xs w-full"
          >
            <CreditCard className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            {loading ? "Loading..." : "Upgrade $2.99/mo"}
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
            <p className="text-xs sm:text-sm font-semibold text-foreground truncate">Free Trial</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
              {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} left
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
          {loading ? "Loading..." : "Upgrade $2.99/mo"}
        </Button>
      </div>
    );
  };

  return (
    <div className="bg-card/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 border-2 border-border shadow-md">
      <div className="flex flex-row items-center justify-between gap-2 sm:gap-4">
        {/* Trial Status - Left Side */}
        <div className="flex-1 min-w-0">
          {renderTrialStatus()}
        </div>

        {/* Vertical Separator */}
        {couple && partnerProfile && (
          <div className="h-12 sm:h-16 w-px bg-border flex-shrink-0" />
        )}

        {/* Olive Branch - Right Side */}
        {couple && partnerProfile && (
          <div className="flex items-center flex-shrink-0">
            <Button
              onClick={onOpenOliveBranch}
              variant="outline"
              size="sm"
              className="relative h-12 w-12 sm:h-14 sm:w-14 p-0 rounded-full hover:scale-105 transition-transform"
              style={{
                filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.15)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))"
              }}
            >
              <Leaf className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg">
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
