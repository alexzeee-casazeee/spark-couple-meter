import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Heart, LogOut, TrendingUp, Save, UserCircle, Bell, List, MessageCircle, Mail, UserPlus, Quote } from "lucide-react";
import { format } from "date-fns";
import VoiceInput from "@/components/VoiceInput";
import CustomDimensionsManager from "@/components/CustomDimensionsManager";
import { Input } from "@/components/ui/input";
import QuoteOfTheDay from "@/components/QuoteOfTheDay";
import TrialStatus from "@/components/TrialStatus";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { OliveBranchDialog } from "@/components/OliveBranchDialog";
import { Badge } from "@/components/ui/badge";
import InvitationDialog from "@/components/InvitationDialog";

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [couple, setCouple] = useState<any>(null);
  const [todayEntry, setTodayEntry] = useState<any>(null);
  const [partnerProfile, setPartnerProfile] = useState<any>(null);
  const [partnerEntry, setPartnerEntry] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'self' | 'partner'>('self');
  
  // Remind dialog state
  const [remindDialogOpen, setRemindDialogOpen] = useState(false);
  
  // Celebration dialog state
  const [celebrationOpen, setCelebrationOpen] = useState(false);
  
  // Olive Branch state
  const [oliveBranchOpen, setOliveBranchOpen] = useState(false);
  const [oliveBranchMessages, setOliveBranchMessages] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Slider states
  const [horniness, setHorniness] = useState([50]);
  const [generalFeeling, setGeneralFeeling] = useState([50]);
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
    checkAuth();
  }, []);

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
        setHorniness([entryData.horniness_level || 50]);
        setGeneralFeeling([entryData.general_feeling || 50]);
        setSleepQuality([entryData.sleep_quality || 50]);
        setEmotionalState([entryData.emotional_state || 50]);
      } else {
        // Reset to baseline if no entry today
        setHorniness([50]);
        setGeneralFeeling([50]);
        setSleepQuality([50]);
        setEmotionalState([50]);
      }
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

      if (entryData) {
        // Load custom dimension values for today's entry
        const { data: customEntriesData } = await supabase
          .from("custom_dimension_entries")
          .select("dimension_id, value")
          .eq("entry_id", entryData.id);

        if (customEntriesData) {
          const values: Record<string, number> = {};
          customEntriesData.forEach((entry) => {
            values[entry.dimension_id] = entry.value || 50;
          });
          setCustomValues(values);
        }
      }

      // Initialize missing custom values to 50
      const initialValues: Record<string, number> = {};
      dimensionsData.forEach((dim) => {
        if (!customValues[dim.id]) {
          initialValues[dim.id] = 50;
        }
      });
      setCustomValues((prev) => ({ ...prev, ...initialValues }));
    }
  };

  const handleSaveEntry = async (silent = false) => {
    if (!profile) return;

    const today = format(new Date(), "yyyy-MM-dd");
    const entryData = {
      user_id: profile.id,
      entry_date: today,
      horniness_level: horniness[0],
      general_feeling: generalFeeling[0],
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

  // Mark Olive Branch message as read
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
    sleep_quality: number;
    emotional_state: number;
  }) => {
    setHorniness([values.horniness_level]);
    setGeneralFeeling([values.general_feeling]);
    setSleepQuality([values.sleep_quality]);
    setEmotionalState([values.emotional_state]);
  };

  const handleSaveAndReset = async () => {
    await handleSaveEntry(false); // Save with toast notification
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary">{t("dashboard.loading")}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12" style={{ background: "var(--gradient-canva-bg)" }}>
      {/* Header - Compact */}
      <header className="p-2 shadow-glow" style={{ background: "var(--gradient-primary)" }}>
        <div className="container mx-auto flex justify-between items-center px-2">
          <div className="flex items-center gap-1.5">
            <Heart className="w-5 h-5 text-white" fill="white" />
            <h1 className="text-base font-bold text-white leading-tight">{t("dashboard.appName")}</h1>
          </div>
          <div className="flex gap-1.5">
            <LanguageSwitcher />
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

      <div className="container mx-auto px-1 py-2 max-w-4xl space-y-2">
        {/* Invitation Prompt - Only show if no partner */}
        {!couple && profile && (
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 border-2 border-transparent bg-clip-padding relative" style={{ 
            backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', 
            backgroundOrigin: 'border-box', 
            backgroundClip: 'padding-box, border-box',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
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
                className="w-full gap-2"
              >
                <UserPlus className="h-4 w-4" />
                {t("dashboard.invite.button")}
              </Button>
            </div>
          </div>
        )}

        {/* Quote of the Day */}
        <QuoteOfTheDay />
        
        {/* Trial Status / Subscription */}
        {profile && <TrialStatus profile={profile} />}

          {/* View Mode Toggle - Moved to top */}
        {couple && partnerProfile && (
          <Card className="shadow-soft">
            <CardContent className="pt-3 pb-3">
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'self' ? 'default' : 'outline'}
                  onClick={() => setViewMode('self')}
                  className="flex-1 h-8 text-xs"
                >
                  {t("dashboard.view.myLevels")}
                </Button>
                <Button
                  variant={viewMode === 'partner' ? 'default' : 'outline'}
                  onClick={() => setViewMode('partner')}
                  className="flex-1 h-8 text-xs"
                >
                  {t("dashboard.view.partnerLevels").replace('{name}', partnerProfile.display_name)}
                </Button>
              </div>
              
              {/* Remind button when partner hasn't checked in */}
              {!partnerEntry && viewMode === 'partner' && (
                <div className="mt-2 text-center">
                  <p className="text-xs text-muted-foreground mb-1.5">
                    {t("dashboard.partner.noCheckin").replace('{name}', partnerProfile.display_name)}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRemindDialogOpen(true)}
                    className="gap-2 h-7 text-xs"
                  >
                    <Bell className="w-3 h-3" />
                    {t("dashboard.partner.remind").replace('{name}', partnerProfile.display_name)}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Remind Dialog */}
        <Dialog open={remindDialogOpen} onOpenChange={setRemindDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t("dashboard.remind.title").replace('{name}', partnerProfile?.display_name || '')}</DialogTitle>
              <DialogDescription>
                {t("dashboard.remind.description")}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 py-4">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12"
                onClick={() => {
                  // iMessage functionality will be added later
                  setRemindDialogOpen(false);
                }}
              >
                <MessageCircle className="w-5 h-5 text-blue-500" />
                <span>{t("dashboard.remind.imessage")}</span>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12"
                onClick={() => {
                  // Email functionality will be added later
                  setRemindDialogOpen(false);
                }}
              >
                <Mail className="w-5 h-5 text-green-500" />
                <span>{t("dashboard.remind.email")}</span>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12"
                onClick={() => {
                  // Notification functionality will be added later
                  setRemindDialogOpen(false);
                }}
              >
                <Bell className="w-5 h-5 text-orange-500" />
                <span>{t("dashboard.remind.notification")}</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>

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

        {/* Today's Check-In */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl border-2 border-transparent bg-clip-padding relative" style={{ 
          backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', 
          backgroundOrigin: 'border-box', 
          backgroundClip: 'padding-box, border-box',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
        }}>
          <div className="pb-2 pt-3 px-4">
            {/* Olive Branch Messages */}
            {oliveBranchMessages.length > 0 && (
              <div className="mb-3 space-y-2">
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
            
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Heart className="w-3.5 h-3.5 text-primary" />
              {viewMode === 'self' ? t("dashboard.checkin.title") : t("dashboard.view.partnerLevels").replace('{name}', partnerProfile?.display_name || '')}
              <span className="ml-auto text-[10px] font-normal text-muted-foreground">
                {format(new Date(), "MMM d, yyyy")}
              </span>
            </h3>
          </div>
          <div className="space-y-2.5 pb-3 px-4">
            {viewMode === 'partner' && !partnerEntry ? (
              <div className="text-center py-6 text-muted-foreground">
                <p className="text-sm">{t("dashboard.partner.noCheckinYet").replace('{name}', partnerProfile?.display_name || '')}</p>
              </div>
            ) : (
              <>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">{t("dashboard.checkin.intimacy")}</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground w-8">{t("dashboard.checkin.low")}</span>
                    <Slider
                      value={viewMode === 'self' ? horniness : [partnerEntry?.horniness_level || 50]}
                      onValueChange={viewMode === 'self' ? setHorniness : undefined}
                      max={100}
                      step={1}
                      className="flex-1"
                      disabled={viewMode === 'partner'}
                    />
                    <span className="text-[10px] text-muted-foreground w-8 text-right">{t("dashboard.checkin.high")}</span>
                  </div>
                  <p className="text-[10px] text-center text-primary font-medium">
                    {viewMode === 'self' ? horniness[0] : partnerEntry?.horniness_level || 50}%
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">{t("dashboard.checkin.feeling")}</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground w-8">{t("dashboard.checkin.bad")}</span>
                    <Slider
                      value={viewMode === 'self' ? generalFeeling : [partnerEntry?.general_feeling || 50]}
                      onValueChange={viewMode === 'self' ? setGeneralFeeling : undefined}
                      max={100}
                      step={1}
                      className="flex-1"
                      disabled={viewMode === 'partner'}
                    />
                    <span className="text-[10px] text-muted-foreground w-8 text-right">{t("dashboard.checkin.great")}</span>
                  </div>
                  <p className="text-[10px] text-center text-primary font-medium">
                    {viewMode === 'self' ? generalFeeling[0] : partnerEntry?.general_feeling || 50}%
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">{t("dashboard.checkin.sleep")}</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground w-8">{t("dashboard.checkin.poor")}</span>
                    <Slider
                      value={viewMode === 'self' ? sleepQuality : [partnerEntry?.sleep_quality || 50]}
                      onValueChange={viewMode === 'self' ? setSleepQuality : undefined}
                      max={100}
                      step={1}
                      className="flex-1"
                      disabled={viewMode === 'partner'}
                    />
                    <span className="text-[10px] text-muted-foreground w-8 text-right">{t("dashboard.checkin.great")}</span>
                  </div>
                  <p className="text-[10px] text-center text-primary font-medium">
                    {viewMode === 'self' ? sleepQuality[0] : partnerEntry?.sleep_quality || 50}%
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">{t("dashboard.checkin.emotional")}</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground w-8">{t("dashboard.checkin.low")}</span>
                    <Slider
                      value={viewMode === 'self' ? emotionalState : [partnerEntry?.emotional_state || 50]}
                      onValueChange={viewMode === 'self' ? setEmotionalState : undefined}
                      max={100}
                      step={1}
                      className="flex-1"
                      disabled={viewMode === 'partner'}
                    />
                    <span className="text-[10px] text-muted-foreground w-8 text-right">{t("dashboard.checkin.high")}</span>
                  </div>
                  <p className="text-[10px] text-center text-primary font-medium">
                    {viewMode === 'self' ? emotionalState[0] : partnerEntry?.emotional_state || 50}%
                  </p>
                </div>

                {/* Custom Dimensions */}
                {customDimensions.map((dimension) => (
                  <div key={dimension.id} className="space-y-1.5">
                    <Label className="text-xs font-semibold">{dimension.dimension_name}</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground w-8">{t("dashboard.checkin.low")}</span>
                    <Slider
                      value={viewMode === 'self' 
                        ? [customValues[dimension.id] || 50] 
                        : [partnerCustomValues[dimension.id] || 50]}
                      onValueChange={viewMode === 'self' 
                        ? (value) => setCustomValues(prev => ({ ...prev, [dimension.id]: value[0] }))
                        : undefined}
                      max={100}
                      step={1}
                        className="flex-1"
                        disabled={viewMode === 'partner'}
                      />
                      <span className="text-[10px] text-muted-foreground w-8 text-right">{t("dashboard.checkin.high")}</span>
                    </div>
                    <p className="text-[10px] text-center text-primary font-medium">
                      {viewMode === 'self' 
                        ? (customValues[dimension.id] || 50)
                        : (partnerCustomValues[dimension.id] || 50)}%
                    </p>
                  </div>
                ))}

                {viewMode === 'self' && (
                  <>
                    <div className="flex justify-center gap-2.5 pt-1">
                      <VoiceInput onParsedValues={handleVoiceInput} />
                      
                      {/* Olive Branch Button */}
                      {couple && partnerProfile && (
                        <Button
                          size="lg"
                          onClick={() => setOliveBranchOpen(true)}
                          className="rounded-full transition-all duration-200 hover:scale-105 h-12 w-12 relative"
                          style={{ 
                            background: "linear-gradient(135deg, hsl(120, 60%, 60%), hsl(160, 60%, 55%))",
                            boxShadow: "var(--shadow-float)",
                            border: "none"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = "var(--shadow-float-hover)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = "var(--shadow-float)";
                          }}
                        >
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                          </svg>
                          {unreadCount > 0 && (
                            <Badge 
                              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 border-2 border-white"
                            >
                              {unreadCount}
                            </Badge>
                          )}
                        </Button>
                      )}
                      
                      <Button
                        size="lg"
                        onClick={handleSaveAndReset}
                        className="rounded-full transition-all duration-200 hover:scale-105 h-12 w-12"
                        style={{ 
                          background: "var(--gradient-green)",
                          boxShadow: "var(--shadow-float)",
                          border: "none"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = "var(--shadow-float-hover)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = "var(--shadow-float)";
                        }}
                      >
                        <Save className="w-5 h-5 text-white" />
                      </Button>
                    </div>
                    <p className="text-[9px] text-center text-muted-foreground">
                      {t("dashboard.checkin.voice.hint")}
                    </p>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Custom Dimensions Manager - Moved to bottom */}
        {couple && profile && (
          <CustomDimensionsManager
            coupleId={couple.id}
            profileId={profile.id}
            onDimensionsChange={() => loadCustomDimensions(couple.id, profile.id)}
          />
        )}

        {/* View Trends and Log */}
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
        
        {/* Manage Quotes Link - visible to authenticated users */}
        <Button 
          variant="outline" 
          className="w-full h-8 text-xs" 
          onClick={() => navigate("/quotes")}
        >
          <Quote className="w-3 h-3 mr-2" />
          Manage Quotes
        </Button>
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
