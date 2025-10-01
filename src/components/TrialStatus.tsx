import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CreditCard, Crown } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TrialStatusProps {
  profile: any;
}

const TrialStatus = ({ profile }: TrialStatusProps) => {
  const [daysRemaining, setDaysRemaining] = useState<number>(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

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

  if (isSubscribed) {
    return (
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-3 border-2 border-transparent bg-clip-padding relative" style={{ 
        backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(142, 70%, 75%), hsl(172, 60%, 75%))', 
        backgroundOrigin: 'border-box', 
        backgroundClip: 'padding-box, border-box',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
      }}>
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-green-500/15 rounded-full flex items-center justify-center">
              <Crown className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-green-700">Premium Member</p>
            <p className="text-xs text-green-600">Unlimited access</p>
          </div>
        </div>
      </div>
    );
  }

  if (daysRemaining === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-3 border-2 border-transparent bg-clip-padding relative" style={{ 
        backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(0, 70%, 75%), hsl(20, 60%, 75%))', 
        backgroundOrigin: 'border-box', 
        backgroundClip: 'padding-box, border-box',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
      }}>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-red-700">Your trial has expired</p>
          <Button 
            onClick={handleUpgrade} 
            disabled={loading}
            className="w-full h-8 text-xs gap-2"
          >
            <CreditCard className="w-3 h-3" />
            {loading ? "Loading..." : "Upgrade for $2.99/month"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-3 border-2 border-transparent bg-clip-padding relative" style={{ 
      backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', 
      backgroundOrigin: 'border-box', 
      backgroundClip: 'padding-box, border-box',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
    }}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">Free Trial</p>
            <p className="text-xs text-muted-foreground">
              {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining
            </p>
          </div>
          <div className="w-10 h-10 bg-primary/15 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-primary">{daysRemaining}</span>
          </div>
        </div>
        <Button 
          onClick={handleUpgrade} 
          disabled={loading}
          variant="outline"
          className="w-full h-8 text-xs gap-2"
        >
          <CreditCard className="w-3 h-3" />
          {loading ? "Loading..." : "Upgrade for $2.99/month"}
        </Button>
      </div>
    </div>
  );
};

export default TrialStatus;
