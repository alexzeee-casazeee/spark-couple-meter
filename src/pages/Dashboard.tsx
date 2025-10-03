import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import sparkMeterLogo from "@/assets/spark-meter-logo.png";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Heart, LogOut, TrendingUp, Save, UserCircle, Bell, List, MessageCircle, Mail, UserPlus, Quote, Flame, Smile, MessageSquare, Moon, Sparkles, Leaf } from "lucide-react";
import { format } from "date-fns";
import VoiceInput from "@/components/VoiceInput";
import CustomDimensionsManager from "@/components/CustomDimensionsManager";
import { Input } from "@/components/ui/input";
import QuoteOfTheDay from "@/components/QuoteOfTheDay";
import TrialStatus from "@/components/TrialStatus";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { OliveBranchDialog } from "@/components/OliveBranchDialog";
import { Badge } from "@/components/ui/badge";
import InvitationDialog from "@/components/InvitationDialog";
import CombinedTrialOliveBranch from "@/components/CombinedTrialOliveBranch";

interface DashboardProps {
  demoMode?: boolean;
  onDemoInteraction?: () => void;
}

const Dashboard = ({ demoMode = false, onDemoInteraction }: DashboardProps = {}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [couple, setCouple] = useState<any>(null);
  const [todayEntry, setTodayEntry] = useState<any>(null);
  const [partnerProfile, setPartnerProfile] = useState<any>(null);
  const [partnerEntry, setPartnerEntry] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'self' | 'partner'>('self');
  
  // Remind dialog state - removed, using inline card instead
  
  // Celebration dialog state
  const [celebrationOpen, setCelebrationOpen] = useState(false);
  
  // Olive Branch state
  const [oliveBranchOpen, setOliveBranchOpen] = useState(false);
  const [oliveBranchMessages, setOliveBranchMessages] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Slider states
  const [horniness, setHorniness] = useState([50]);
  const [generalFeeling, setGeneralFeeling] = useState([50]);
  const [communicationDesire, setCommunicationDesire] = useState([50]);
  const [sleepQuality, setSleepQuality] = useState([50]);
  const [emotionalState, setEmotionalState] = useState([50]);
  
  // Custom dimensions
  const [customDimensions, setCustomDimensions] = useState<any[]>([]);
  const [customValues, setCustomValues] = useState<Record<string, number>>({});
  const [partnerCustomValues, setPartnerCustomValues] = useState<Record<string, number>>({});
  
  // Auto-save timer
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Invitation dialog state
  const [invitationDialogOpen, setInvitationDialogOpen] = useState(false);
  
  // Trial and subscription state
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  
  // Quote position state
  const [quoteAtBottom, setQuoteAtBottom] = useState(() => {
    const saved = localStorage.getItem('quoteAtBottom');
    return saved === 'true';
  });

  // Ensure partner custom dimension values load after both partner entry and dimensions are ready
  useEffect(() => {
    const loadPartnerCustoms = async () => {
      if (partnerEntry && customDimensions.length > 0) {
        const { data: partnerCustomEntriesData } = await supabase
          .from("custom_dimension_entries")
          .select("dimension_id, value")
          .eq("entry_id", partnerEntry.id);

        if (partnerCustomEntriesData) {
          const values: Record<string, number> = {};
          partnerCustomEntriesData.forEach((entry) => {
            values[entry.dimension_id] = entry.value || 50;
          });
          setPartnerCustomValues(values);
        }
      }
    };
    loadPartnerCustoms();
  }, [partnerEntry, customDimensions]);

  useEffect(() => {
    if (demoMode) {
      // In demo mode, skip auth and set loading to false
      setLoading(false);
      return;
    }
    checkAuth();
  }, [demoMode]);

  // Re-check subscription when window gains focus (e.g., after returning from Stripe)
  useEffect(() => {
    const handleFocus = () => {
      if (profile) {
        checkSubscriptionStatus();
      }
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [profile]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    // Get profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", session.user.id)
      .single();

      if (profileData) {
      setProfile(profileData);
      
      // Check if part of a couple
      const { data: coupleData } = await supabase
        .from("couples")
        .select("*")
        .or(`husband_id.eq.${profileData.id},wife_id.eq.${profileData.id}`)
        .eq("is_active", true)
        .maybeSingle();
      
      setCouple(coupleData);
      
      // Load custom dimensions if in a couple
      if (coupleData) {
        await loadCustomDimensions(coupleData.id, profileData.id);
      }
      
      // Get partner profile if in a couple
      if (coupleData) {
        const partnerId = coupleData.husband_id === profileData.id 
          ? coupleData.wife_id 
          : coupleData.husband_id;
        
        const { data: partnerData, error: partnerError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", partnerId)
          .maybeSingle();
        
        if (partnerError) {
          console.error("Error loading partner profile:", partnerError);
        }
        
        setPartnerProfile(partnerData);
        
        // Get partner's today's latest entry
        const today = format(new Date(), "yyyy-MM-dd");
        const { data: partnerEntryData } = await supabase
          .from("daily_entries")
          .select("*")
          .eq("user_id", partnerId)
          .eq("entry_date", today)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        
        setPartnerEntry(partnerEntryData);
        
        // Load partner's custom dimension values
        if (partnerEntryData && customDimensions.length > 0) {
          const { data: partnerCustomEntriesData } = await supabase
            .from("custom_dimension_entries")
            .select("dimension_id, value")
            .eq("entry_id", partnerEntryData.id);

          if (partnerCustomEntriesData) {
            const values: Record<string, number> = {};
            partnerCustomEntriesData.forEach((entry) => {
              values[entry.dimension_id] = entry.value || 50;
            });
            setPartnerCustomValues(values);
          }
        }
      }
      
      // Get today's latest entry
      const today = format(new Date(), "yyyy-MM-dd");
      const { data: entryData } = await supabase
        .from("daily_entries")
        .select("*")
        .eq("user_id", profileData.id)
        .eq("entry_date", today)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (entryData) {
        setTodayEntry(entryData);
      }
      
      // Always reset to baseline when opening dashboard
      setHorniness([50]);
      setGeneralFeeling([50]);
      setCommunicationDesire([50]);
      setSleepQuality([50]);
      setEmotionalState([50]);
    }
    
    setLoading(false);
  };

  const loadCustomDimensions = async (coupleId: string, profileId: string) => {
    // Load custom dimensions
    const { data: dimensionsData } = await supabase
      .from("custom_dimensions")
      .select("*")
      .eq("couple_id", coupleId)
      .order("created_at", { ascending: true });

    if (dimensionsData) {
      setCustomDimensions(dimensionsData);

      // Get today's entry to load custom values
      const today = format(new Date(), "yyyy-MM-dd");
      const { data: entryData } = await supabase
        .from("daily_entries")
        .select("id")
        .eq("user_id", profileId)
        .eq("entry_date", today)
        .maybeSingle();

      // Always initialize all custom values to baseline (50)
      const initialValues: Record<string, number> = {};
      dimensionsData.forEach((dim) => {
        initialValues[dim.id] = 50;
      });
      setCustomValues(initialValues);
    }
  };

  const handleSaveEntry = async (silent = false) => {
    if (demoMode && onDemoInteraction) {
      onDemoInteraction();
      return;
    }
    if (!profile) return;

    const today = format(new Date(), "yyyy-MM-dd");
    const entryData = {
      user_id: profile.id,
      entry_date: today,
      horniness_level: horniness[0],
      general_feeling: generalFeeling[0],
      communication_desire: communicationDesire[0],
      sleep_quality: sleepQuality[0],
      emotional_state: emotionalState[0],
    };

    // Insert as a new entry each time (no upsert, to allow multiple entries per day)
    const { data: savedEntry, error } = await supabase
      .from("daily_entries")
      .insert(entryData)
      .select()
      .single();

    if (error) {
      console.error("Error saving entry:", error);
    } else {
      // Save custom dimension entries
      if (savedEntry && customDimensions.length > 0) {
        const customEntries = customDimensions.map((dim) => ({
          entry_id: savedEntry.id,
          dimension_id: dim.id,
          value: customValues[dim.id] || 50,
        }));

        await supabase
          .from("custom_dimension_entries")
          .insert(customEntries);
      }
      
      // Reset all meters to baseline
      setHorniness([50]);
      setGeneralFeeling([50]);
      setCommunicationDesire([50]);
      setSleepQuality([50]);
      setEmotionalState([50]);
      
      // Reset custom dimension values
      const resetCustomValues: Record<string, number> = {};
      customDimensions.forEach((dim) => {
        resetCustomValues[dim.id] = 50;
      });
      setCustomValues(resetCustomValues);
      
      // Show celebration modal
      if (!silent) {
        setCelebrationOpen(true);
        // Trigger confetti
        const confetti = (await import('canvas-confetti')).default;
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        
        // Auto-close after 3 seconds
        setTimeout(() => {
          setCelebrationOpen(false);
        }, 3000);
      }
      
      // Reload today's entry after saving
      await checkAuth();
    }
  };

  // Load Olive Branch messages
  const loadOliveBranchMessages = async () => {
    if (!profile || !couple) return;

    const { data } = await supabase
      .from("olive_branch_messages")
      .select("*")
      .eq("couple_id", couple.id)
      .eq("recipient_id", profile.id)
      .eq("is_read", false)
      .order("created_at", { ascending: false });

    if (data) {
      setOliveBranchMessages(data);
      setUnreadCount(data.length);
    }
  };

  // Check subscription and trial status
  const checkSubscriptionStatus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.error('Error checking subscription:', error);
        return;
      }
      
      setIsSubscribed(data?.subscribed || false);
      
      // Check if trial is expired
      if (profile?.trial_start_date) {
        const trialStart = new Date(profile.trial_start_date);
        const today = new Date();
        const diffTime = today.getTime() - trialStart.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const isExpired = diffDays >= 30;
        setIsTrialExpired(isExpired);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    await supabase
      .from("olive_branch_messages")
      .update({ is_read: true })
      .eq("id", messageId);

    await loadOliveBranchMessages();
  };

  // Set up realtime subscription for Olive Branch messages
  useEffect(() => {
    if (!profile || !couple) return;

    loadOliveBranchMessages();

    const channel = supabase
      .channel('olive_branch_updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'olive_branch_messages',
          filter: `recipient_id=eq.${profile.id}`
        },
        () => {
          loadOliveBranchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile, couple]);

  // Remove auto-save functionality since we're allowing multiple entries per day
  // Users must explicitly click save to record each entry

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleVoiceInput = (values: {
    horniness_level: number;
    general_feeling: number;
    communication_desire?: number;
    sleep_quality: number;
    emotional_state: number;
    custom_dimensions?: Record<string, number>;
  }) => {
    if (demoMode && onDemoInteraction) {
      onDemoInteraction();
      return;
    }
    setHorniness([values.horniness_level]);
    setGeneralFeeling([values.general_feeling]);
    setCommunicationDesire([values.communication_desire || 50]);
    setSleepQuality([values.sleep_quality]);
    setEmotionalState([values.emotional_state]);
    
    // Update custom dimension values
    if (values.custom_dimensions) {
      setCustomValues(prev => ({
        ...prev,
        ...values.custom_dimensions
      }));
    }
  };

  const handleSaveAndReset = async () => {
    if (demoMode && onDemoInteraction) {
      onDemoInteraction();
      return;
    }
    // Check if trial is expired and user is not subscribed
    if (isTrialExpired && !isSubscribed) {
      setUpgradeDialogOpen(true);
      return;
    }
    await handleSaveEntry(false); // Save with toast notification
  };

  // Wrapper for slider changes in demo mode
  const handleSliderChange = (setter: (value: number[]) => void) => {
    return (value: number[]) => {
      if (demoMode && onDemoInteraction) {
        onDemoInteraction();
        return;
      }
      setter(value);
    };
  };
  
  const handleUpgrade = async () => {
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
    }
  };

  const handlePokePartner = async () => {
    if (!couple || !profile || !partnerProfile) return;

    const { error } = await supabase
      .from("pokes")
      .insert({
        couple_id: couple.id,
        poker_id: profile.id,
        poked_id: partnerProfile.id,
      });

    if (error) {
      console.error("Error sending poke:", error);
    }
  };

  const handleRemindPartner = async (method: 'email' | 'imessage' | 'notification') => {
    if (!couple || !profile || !partnerProfile) return;

    if (method === 'email') {
      try {
        const { data, error } = await supabase.functions.invoke('send-reminder-email', {
          body: {
            partnerUserId: partnerProfile.user_id,
            senderName: profile.display_name,
            partnerName: partnerProfile.display_name,
          },
        });

        if (error) throw error;

        toast({
          title: t("dashboard.remind.success.title"),
          description: t("dashboard.remind.success.description").replace('{name}', partnerProfile.display_name),
        });
      } catch (error) {
        console.error("Error sending reminder:", error);
        toast({
          title: "Error",
          description: "Failed to send reminder. Please try again.",
          variant: "destructive",
        });
      }
    } else if (method === 'imessage') {
      // For iMessage, we'll open the SMS/iMessage app
      const message = encodeURIComponent(
        `Hey ${partnerProfile.display_name}! Just checking in - would love to see how you're doing today on Spark Meter 💕`
      );
      window.location.href = `sms:&body=${message}`;
      
      toast({
        title: t("dashboard.remind.success.title"),
        description: t("dashboard.remind.success.description").replace('{name}', partnerProfile.display_name),
      });
    } else if (method === 'notification') {
      // Send a poke as a notification
      await handlePokePartner();
      toast({
        title: t("dashboard.remind.success.title"),
        description: t("dashboard.remind.success.description").replace('{name}', partnerProfile.display_name),
      });
    }
  };
  
  const handleQuotePositionChange = (isAtBottom: boolean) => {
    setQuoteAtBottom(isAtBottom);
    localStorage.setItem('quoteAtBottom', isAtBottom.toString());
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary">{t("dashboard.loading")}</div>
      </div>
    );
  }

  return (
    <div className={demoMode ? "pb-4 bg-white" : "min-h-screen pb-12 bg-white"}>
      {/* Header - Compact */}
      {!demoMode && (
      <header className="p-2 shadow-glow" style={{ background: "var(--gradient-primary)" }}>
        <div className="container mx-auto flex justify-between items-center px-2">
          <div className="flex items-center gap-2">
            <img src={sparkMeterLogo} alt="Spark Meter" className="w-6 h-6 object-contain drop-shadow-md" />
            <h1 className="text-base font-bold text-white leading-tight">{t("dashboard.appName")}</h1>
          </div>
          <div className="flex gap-1.5">
            {couple && (
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setInvitationDialogOpen(true)} 
                className="bg-white/10 border-white/20 hover:bg-white/20 h-7 w-7 relative"
              >
                <Heart className="w-3.5 h-3.5 text-white" />
                <UserPlus className="w-2 h-2 text-white absolute top-0.5 right-0.5" />
              </Button>
            )}
            <Button variant="outline" size="icon" onClick={() => navigate("/account")} className="bg-white/10 border-white/20 hover:bg-white/20 h-7 w-7">
              <UserCircle className="w-3.5 h-3.5 text-white" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleLogout} className="bg-white/10 border-white/20 hover:bg-white/20 h-7 w-7">
              <LogOut className="w-3.5 h-3.5 text-white" />
            </Button>
          </div>
        </div>
      </header>
      )}

      <div className="container mx-auto px-1 py-1 max-w-4xl space-y-1">
        {/* Invitation Prompt - Only show if no partner */}
        {!demoMode && !couple && profile && (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 border-2 border-transparent bg-clip-padding relative" style={{ 
            backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 85%), hsl(280, 60%, 85%))', 
            backgroundOrigin: 'border-box', 
            backgroundClip: 'padding-box, border-box',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)'
          }}>
            <div>
              <h3 className="font-semibold text-xl mb-3 text-primary">
                {t("dashboard.invite.prompt.title")}
              </h3>
              <p className="text-base font-medium text-foreground mb-4 leading-relaxed">
                {t("dashboard.invite.prompt.description")}
              </p>
              <Button 
                onClick={() => setInvitationDialogOpen(true)}
                className="w-full gap-2 text-base py-6 shadow-lg"
                style={{ 
                  background: 'var(--gradient-primary)',
                }}
              >
                <UserPlus className="h-5 w-5" />
                Invite Your Partner
              </Button>
            </div>
          </div>
        )}

        {/* Combined Trial Status */}
        {!demoMode && couple && profile && partnerProfile && (
          <CombinedTrialOliveBranch 
            profile={profile}
            couple={couple}
            partnerProfile={partnerProfile}
          />
        )}

        {/* Quote of the Day - Top Position */}
        {!demoMode && !quoteAtBottom && (
          <div className="animate-fade-in">
            <QuoteOfTheDay 
              isAtBottom={false}
              onPositionChange={handleQuotePositionChange}
            />
          </div>
        )}


        {/* Celebration Modal */}
        <Dialog open={celebrationOpen} onOpenChange={setCelebrationOpen}>
          <DialogContent className="sm:max-w-md text-center">
            <DialogHeader>
              <DialogTitle className="text-2xl text-center">
                {t("dashboard.celebration.title")}
              </DialogTitle>
              <DialogDescription className="text-base pt-4">
                {t("dashboard.celebration.description").replace('{name}', partnerProfile?.display_name || '')}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        {/* Upgrade Dialog */}
        <Dialog open={upgradeDialogOpen} onOpenChange={setUpgradeDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl">Your Free Trial Has Ended</DialogTitle>
              <DialogDescription className="text-center pt-4">
                Upgrade to continue tracking your relationship and accessing all features.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4">
              <div className="bg-primary/5 rounded-lg p-4 space-y-2">
                <p className="text-sm font-semibold text-foreground">Spark Meter Premium</p>
                <p className="text-2xl font-bold text-primary">$2.99/month</p>
                <ul className="text-sm text-muted-foreground space-y-1 mt-3">
                  <li>✓ Unlimited daily check-ins</li>
                  <li>✓ Track trends and patterns</li>
                  <li>✓ Partner visibility</li>
                  <li>✓ Custom dimensions</li>
                </ul>
              </div>
              <Button
                onClick={handleUpgrade}
                className="w-full h-12 text-base"
                style={{ background: 'var(--gradient-primary)' }}
              >
                Upgrade Now
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Cancel anytime. No long-term commitment.
              </p>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Mode Toggle */}
        {couple && partnerProfile && (
          <div className="mb-2">
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'self' ? 'default' : 'outline'}
                onClick={() => setViewMode('self')}
                className="flex-1 h-10 text-sm"
              >
                {t("dashboard.view.myLevels")}
              </Button>
              <Button
                variant={viewMode === 'partner' ? 'default' : 'outline'}
                onClick={() => setViewMode('partner')}
                className="flex-1 h-10 text-sm"
              >
                <span className="truncate">
                  {t("dashboard.view.partnerLevels").replace('{name}', partnerProfile.display_name)}
                </span>
              </Button>
            </div>
            
            {/* Prominent Reminder Card - Only show in partner view when they haven't checked in */}
            {viewMode === 'partner' && !partnerEntry && (
              <Card className="mt-4 border-0 shadow-lg overflow-hidden" style={{
                background: "linear-gradient(135deg, rgba(255, 180, 200, 0.15) 0%, rgba(255, 220, 180, 0.15) 100%)",
              }}>
                <CardContent className="p-6 space-y-4">
                  {/* Status Message */}
                  <div className="text-center space-y-2">
                    <Bell className="w-12 h-12 mx-auto text-primary opacity-80" />
                    <h3 className="text-lg font-bold text-foreground">
                      {partnerProfile.display_name} hasn't checked in today yet
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Send them a gentle reminder to check in
                    </p>
                  </div>

                  {/* Direct Action Buttons */}
                  <div className="space-y-2">
                    <Button
                      className="w-full justify-start gap-3 h-14 font-semibold text-base shadow-md"
                      style={{
                        background: "linear-gradient(135deg, rgba(100, 200, 150, 0.9) 0%, rgba(150, 255, 200, 0.9) 100%)",
                      }}
                      onClick={() => handleRemindPartner('email')}
                    >
                      <Mail className="w-5 h-5" />
                      <span>Send Email Reminder</span>
                    </Button>
                    <Button
                      className="w-full justify-start gap-3 h-14 font-semibold text-base shadow-md"
                      style={{
                        background: "linear-gradient(135deg, rgba(100, 150, 255, 0.9) 0%, rgba(150, 200, 255, 0.9) 100%)",
                      }}
                      onClick={() => handleRemindPartner('imessage')}
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>Send Text/iMessage</span>
                    </Button>
                    
                    {/* Less prominent notification option */}
                    <Button
                      variant="ghost"
                      className="w-full justify-center gap-2 h-10 text-sm text-muted-foreground hover:text-foreground"
                      onClick={() => handleRemindPartner('notification')}
                    >
                      <Bell className="w-4 h-4" />
                      <span>Or send a gentle in-app notification</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Upgrade Dialog */}
        <Dialog open={upgradeDialogOpen} onOpenChange={setUpgradeDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl">Your Free Trial Has Ended</DialogTitle>
              <DialogDescription className="text-center pt-4">
                Upgrade to continue tracking your relationship and accessing all features.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4">
              <div className="bg-primary/5 rounded-lg p-4 space-y-2">
                <p className="text-sm font-semibold text-foreground">Spark Meter Premium</p>
                <p className="text-2xl font-bold text-primary">$2.99/month</p>
                <ul className="text-sm text-muted-foreground space-y-1 mt-3">
                  <li>✓ Unlimited daily check-ins</li>
                  <li>✓ Track trends and patterns</li>
                  <li>✓ Partner visibility</li>
                  <li>✓ Custom dimensions</li>
                </ul>
              </div>
              <Button
                onClick={handleUpgrade}
                className="w-full h-12 text-base"
                style={{ background: 'var(--gradient-primary)' }}
              >
                Upgrade Now
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Cancel anytime. No long-term commitment.
              </p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Olive Branch Messages */}
        {oliveBranchMessages.length > 0 && (
          <div className="mb-2 space-y-2">
            {oliveBranchMessages.map((msg) => (
              <div
                key={msg.id}
                className="flex items-start gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
              >
                <div className="mt-0.5">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                  </svg>
                </div>
                <div className="flex-1 text-xs">
                  <p className="font-semibold text-green-800 dark:text-green-200 mb-1">
                    🫒 Olive Branch from {partnerProfile?.display_name}
                  </p>
                  <p className="text-green-700 dark:text-green-300">{msg.message}</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => markMessageAsRead(msg.id)}
                    className="mt-1 h-6 text-xs text-green-600 hover:text-green-700"
                  >
                    Mark as read
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Today's Check-In - Individual Gradient Cards */}
        <div className="space-y-2">
          {viewMode === 'partner' && !partnerEntry ? (
            <div className="text-center py-4 text-muted-foreground bg-white/90 rounded-2xl">
              <p className="text-sm">{t("dashboard.partner.noCheckinYet").replace('{name}', partnerProfile?.display_name || '')}</p>
            </div>
          ) : (
            <>
              {/* Desire for Intimacy */}
              <div className="p-3 rounded-2xl relative overflow-hidden" style={{
                background: 'linear-gradient(135deg, rgba(200, 150, 255, 0.5) 0%, rgba(150, 200, 255, 0.5) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{
                      background: 'linear-gradient(135deg, rgba(200, 150, 255, 0.5), rgba(150, 200, 255, 0.5))'
                    }}>
                      <Flame className="w-3 h-3 text-white" />
                    </div>
                    <Label className="text-xs font-semibold text-foreground">{t("dashboard.checkin.intimacy")}</Label>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-semibold">
                    {viewMode === 'self' ? `${horniness[0]}%` : `${partnerEntry?.horniness_level || 50}%`}
                  </p>
                </div>
                <Slider
                  value={viewMode === 'self' ? horniness : [partnerEntry?.horniness_level || 50]}
                  onValueChange={viewMode === 'self' ? handleSliderChange(setHorniness) : undefined}
                  max={100}
                  step={1}
                  className="w-full"
                  disabled={viewMode === 'partner'}
                />
              </div>

              {/* Desire for Touch */}
              <div className="p-3 rounded-2xl relative overflow-hidden" style={{
                background: 'linear-gradient(135deg, rgba(255, 200, 150, 0.5) 0%, rgba(255, 150, 200, 0.5) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{
                      background: 'linear-gradient(135deg, rgba(255, 200, 150, 0.5), rgba(255, 150, 200, 0.5))'
                    }}>
                      <Heart className="w-3 h-3 text-white" fill="white" />
                    </div>
                    <Label className="text-xs font-semibold text-foreground">{t("dashboard.checkin.feeling")}</Label>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-semibold">
                    {viewMode === 'self' ? `${generalFeeling[0]}%` : `${partnerEntry?.general_feeling || 50}%`}
                  </p>
                </div>
                <Slider
                  value={viewMode === 'self' ? generalFeeling : [partnerEntry?.general_feeling || 50]}
                  onValueChange={viewMode === 'self' ? handleSliderChange(setGeneralFeeling) : undefined}
                  max={100}
                  step={1}
                  className="w-full"
                  disabled={viewMode === 'partner'}
                />
              </div>

              {/* Communication Desire */}
              <div className="p-3 rounded-2xl relative overflow-hidden" style={{
                background: 'linear-gradient(135deg, rgba(150, 255, 200, 0.5) 0%, rgba(150, 200, 255, 0.5) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{
                      background: 'linear-gradient(135deg, rgba(150, 255, 200, 0.5), rgba(150, 200, 255, 0.5))'
                    }}>
                      <MessageSquare className="w-3 h-3 text-white" />
                    </div>
                    <Label className="text-xs font-semibold text-foreground">{t("dashboard.checkin.communication")}</Label>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-semibold">
                    {viewMode === 'self' ? `${communicationDesire[0]}%` : `${partnerEntry?.communication_desire || 50}%`}
                  </p>
                </div>
                <Slider
                  value={viewMode === 'self' ? communicationDesire : [partnerEntry?.communication_desire || 50]}
                  onValueChange={viewMode === 'self' ? handleSliderChange(setCommunicationDesire) : undefined}
                  max={100}
                  step={1}
                  className="w-full"
                  disabled={viewMode === 'partner'}
                />
              </div>

              {/* Sleep Quality */}
              <div className="p-3 rounded-2xl relative overflow-hidden" style={{
                background: 'linear-gradient(135deg, rgba(180, 200, 255, 0.5) 0%, rgba(200, 180, 255, 0.5) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{
                      background: 'linear-gradient(135deg, rgba(180, 200, 255, 0.5), rgba(200, 180, 255, 0.5))'
                    }}>
                      <Moon className="w-3 h-3 text-white" />
                    </div>
                    <Label className="text-xs font-semibold text-foreground">{t("dashboard.checkin.sleep")}</Label>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-semibold">
                    {viewMode === 'self' ? `${sleepQuality[0]}%` : `${partnerEntry?.sleep_quality || 50}%`}
                  </p>
                </div>
                <Slider
                  value={viewMode === 'self' ? sleepQuality : [partnerEntry?.sleep_quality || 50]}
                  onValueChange={viewMode === 'self' ? handleSliderChange(setSleepQuality) : undefined}
                  max={100}
                  step={1}
                  className="w-full"
                  disabled={viewMode === 'partner'}
                />
              </div>

              {/* Emotional State */}
              <div className="p-3 rounded-2xl relative overflow-hidden" style={{
                background: 'linear-gradient(135deg, rgba(150, 255, 255, 0.5) 0%, rgba(200, 200, 255, 0.5) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{
                      background: 'linear-gradient(135deg, rgba(150, 255, 255, 0.5), rgba(200, 200, 255, 0.5))'
                    }}>
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <Label className="text-xs font-semibold text-foreground">{t("dashboard.checkin.emotional")}</Label>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-semibold">
                    {viewMode === 'self' ? `${emotionalState[0]}%` : `${partnerEntry?.emotional_state || 50}%`}
                  </p>
                </div>
                <Slider
                  value={viewMode === 'self' ? emotionalState : [partnerEntry?.emotional_state || 50]}
                  onValueChange={viewMode === 'self' ? handleSliderChange(setEmotionalState) : undefined}
                  max={100}
                  step={1}
                  className="w-full"
                  disabled={viewMode === 'partner'}
                />
              </div>

              {/* Custom Dimensions */}
              {customDimensions.map((dimension, index) => {
                const gradients = [
                  'linear-gradient(135deg, rgba(255, 180, 200, 0.5) 0%, rgba(255, 220, 180, 0.5) 100%)',
                  'linear-gradient(135deg, rgba(200, 255, 180, 0.5) 0%, rgba(180, 255, 220, 0.5) 100%)',
                  'linear-gradient(135deg, rgba(255, 200, 255, 0.5) 0%, rgba(200, 220, 255, 0.5) 100%)',
                ];
                const gradient = gradients[index % gradients.length];
                
                return (
                  <div key={dimension.id} className="p-3 rounded-2xl relative overflow-hidden" style={{
                    background: gradient,
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{
                          background: gradient.replace('0.3', '0.5')
                        }}>
                          <Smile className="w-3 h-3 text-white" />
                        </div>
                        <Label className="text-xs font-semibold text-foreground">{dimension.dimension_name}</Label>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-semibold">
                        {viewMode === 'self' 
                          ? `${customValues[dimension.id] || 50}%`
                          : `${partnerCustomValues[dimension.id] || 50}%`}
                      </p>
                    </div>
                    <Slider
                      value={viewMode === 'self' 
                        ? [customValues[dimension.id] || 50] 
                        : [partnerCustomValues[dimension.id] || 50]}
                      onValueChange={viewMode === 'self' 
                        ? (value) => {
                            if (demoMode && onDemoInteraction) {
                              onDemoInteraction();
                              return;
                            }
                            setCustomValues(prev => ({ ...prev, [dimension.id]: value[0] }));
                          }
                        : undefined}
                      max={100}
                      step={1}
                      className="w-full"
                      disabled={viewMode === 'partner'}
                    />
                  </div>
                );
              })}

              {viewMode === 'self' && (
                <>
                  <div className="flex items-center gap-2 mt-2">
                    <VoiceInput 
                      onParsedValues={handleVoiceInput} 
                      customDimensions={customDimensions}
                    />
                    <Button
                      size="lg"
                      onClick={handleSaveAndReset}
                      className="flex-1 h-10 text-sm font-semibold"
                      style={{ 
                        background: "linear-gradient(135deg, rgba(180, 150, 255, 0.8) 0%, rgba(150, 200, 255, 0.8) 100%)",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)"
                      }}
                    >
                      {t("dashboard.checkin.save")}
                    </Button>
                    {!demoMode && couple && partnerProfile && (
                      <Button
                        onClick={() => setOliveBranchOpen(true)}
                        variant="outline"
                        size="icon"
                        className="relative h-10 w-10 rounded-full hover:scale-105 transition-transform flex-shrink-0"
                        style={{
                          filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.15))"
                        }}
                      >
                        <Leaf className="w-5 h-5 text-green-600" />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold shadow-lg">
                            {unreadCount}
                          </span>
                        )}
                      </Button>
                    )}
                  </div>
                  <p className="text-[9px] text-center text-muted-foreground pt-1">
                    {t("dashboard.checkin.voice.hint")}
                  </p>
                </>
              )}
            </>
          )}
        </div>
        
        {/* Quote of the Day - Bottom Position */}
        {!demoMode && quoteAtBottom && (
          <div className="animate-slide-in-right">
            <QuoteOfTheDay 
              isAtBottom={true}
              onPositionChange={handleQuotePositionChange}
            />
          </div>
        )}

        {/* Custom Dimensions Manager - Moved to bottom */}
        {!demoMode && couple && profile && (
          <CustomDimensionsManager
            coupleId={couple.id}
            profileId={profile.id}
            onDimensionsChange={() => loadCustomDimensions(couple.id, profile.id)}
          />
        )}

        {/* View Trends and Log */}
        {!demoMode && (
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="h-8 text-xs" onClick={() => navigate("/trends")}>
            <TrendingUp className="w-3 h-3 mr-2" />
            {t("dashboard.trends")}
          </Button>
          <Button variant="outline" className="h-8 text-xs" onClick={() => navigate("/log")}>
            <List className="w-3 h-3 mr-2" />
            {t("dashboard.viewLog")}
          </Button>
        </div>
        )}
      </div>

      {/* Olive Branch Dialog */}
      {couple && profile && partnerProfile && (
        <OliveBranchDialog
          open={oliveBranchOpen}
          onOpenChange={setOliveBranchOpen}
          coupleId={couple.id}
          senderId={profile.id}
          recipientId={partnerProfile.id}
          senderName={profile.display_name}
          recipientName={partnerProfile.display_name}
        />
      )}
      
      {/* Invitation Dialog */}
      {profile && (
        <InvitationDialog
          open={invitationDialogOpen}
          onOpenChange={setInvitationDialogOpen}
          profileId={profile.id}
        />
      )}
    </div>
  );
};

export default Dashboard;
