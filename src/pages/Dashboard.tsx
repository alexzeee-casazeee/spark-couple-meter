import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Heart, LogOut, TrendingUp, Settings, Save } from "lucide-react";
import { format } from "date-fns";
import VoiceInput from "@/components/VoiceInput";
import InvitationManager from "@/components/InvitationManager";
import { useLanguage } from "@/contexts/LanguageContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [couple, setCouple] = useState<any>(null);
  const [todayEntry, setTodayEntry] = useState<any>(null);
  const [partnerProfile, setPartnerProfile] = useState<any>(null);
  const [partnerEntry, setPartnerEntry] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'self' | 'partner'>('self');
  
  // Slider states
  const [horniness, setHorniness] = useState([50]);
  const [generalFeeling, setGeneralFeeling] = useState([50]);
  const [sleepQuality, setSleepQuality] = useState([50]);
  const [emotionalState, setEmotionalState] = useState([50]);
  
  // Auto-save timer
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

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
        .single();
      
      setCouple(coupleData);
      
      // Get partner profile if in a couple
      if (coupleData) {
        const partnerId = coupleData.husband_id === profileData.id 
          ? coupleData.wife_id 
          : coupleData.husband_id;
        
        const { data: partnerData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", partnerId)
          .single();
        
        setPartnerProfile(partnerData);
        
        // Get partner's today's entry
        const today = format(new Date(), "yyyy-MM-dd");
        const { data: partnerEntryData } = await supabase
          .from("daily_entries")
          .select("*")
          .eq("user_id", partnerId)
          .eq("entry_date", today)
          .maybeSingle();
        
        setPartnerEntry(partnerEntryData);
      }
      
      // Get today's entry
      const today = format(new Date(), "yyyy-MM-dd");
      const { data: entryData } = await supabase
        .from("daily_entries")
        .select("*")
        .eq("user_id", profileData.id)
        .eq("entry_date", today)
        .maybeSingle();
      
      if (entryData) {
        setTodayEntry(entryData);
        setHorniness([entryData.horniness_level || 50]);
        setGeneralFeeling([entryData.general_feeling || 50]);
        setSleepQuality([entryData.sleep_quality || 50]);
        setEmotionalState([entryData.emotional_state || 50]);
      }
    }
    
    setLoading(false);
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

    const { error } = await supabase
      .from("daily_entries")
      .upsert(entryData, {
        onConflict: "user_id,entry_date",
      });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else if (!silent) {
      toast({
        title: t("dashboard.toast.saved"),
        description: t("dashboard.toast.saved.description"),
      });
    }
  };

  // Debounced auto-save
  const debouncedSave = useCallback(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    saveTimerRef.current = setTimeout(() => {
      handleSaveEntry(true); // Silent save
    }, 1000);
  }, [horniness, generalFeeling, sleepQuality, emotionalState, profile]);

  // Auto-save when sliders change
  useEffect(() => {
    if (profile && !loading) {
      debouncedSave();
    }
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [horniness, generalFeeling, sleepQuality, emotionalState]);

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
    // Auto-save will trigger automatically via useEffect
  };

  const handleSaveAndReset = async () => {
    await handleSaveEntry(false); // Save with toast notification
    // Reset to baseline values
    setHorniness([50]);
    setGeneralFeeling([50]);
    setSleepQuality([50]);
    setEmotionalState([50]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20" style={{ background: "var(--gradient-splash)" }}>
      {/* Header */}
      <header className="bg-gradient-romantic p-3 shadow-glow">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-white" fill="white" />
            <div>
              <h1 className="text-lg font-bold text-white">HornyMeter</h1>
              <p className="text-white/80 text-xs">{t("dashboard.welcome")}, {profile?.display_name}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => navigate("/settings")} className="bg-white/10 border-white/20 hover:bg-white/20 h-8 w-8">
              <Settings className="w-4 h-4 text-white" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleLogout} className="bg-white/10 border-white/20 hover:bg-white/20 h-8 w-8">
              <LogOut className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 max-w-4xl space-y-4">
        {/* Connection Status */}
        {!couple && profile && (
          <InvitationManager 
            profileId={profile.id} 
            onCoupleCreated={checkAuth}
          />
        )}

        {/* View Mode Toggle */}
        {couple && partnerProfile && (
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'self' ? 'default' : 'outline'}
              onClick={() => setViewMode('self')}
              className="flex-1"
              size="sm"
            >
              My Levels
            </Button>
            <Button
              variant={viewMode === 'partner' ? 'default' : 'outline'}
              onClick={() => setViewMode('partner')}
              className="flex-1"
              size="sm"
            >
              See {partnerProfile.display_name}&apos;s Levels
            </Button>
          </div>
        )}

        {/* Today's Check-In */}
        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Heart className="w-4 h-4 text-primary" />
              {viewMode === 'self' ? t("dashboard.checkin.title") : `${partnerProfile?.display_name}'s Levels`}
              <span className="ml-auto text-xs font-normal text-muted-foreground">
                {format(new Date(), "MMM d, yyyy")}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {viewMode === 'partner' && !partnerEntry ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>{partnerProfile?.display_name} hasn&apos;t checked in today yet</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">{t("dashboard.checkin.intimacy")}</Label>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-10">{t("dashboard.checkin.low")}</span>
                    <Slider
                      value={viewMode === 'self' ? horniness : [partnerEntry?.horniness_level || 50]}
                      onValueChange={viewMode === 'self' ? setHorniness : undefined}
                      max={100}
                      step={1}
                      className="flex-1"
                      disabled={viewMode === 'partner'}
                    />
                    <span className="text-xs text-muted-foreground w-10 text-right">{t("dashboard.checkin.high")}</span>
                  </div>
                  <p className="text-xs text-center text-primary font-medium">
                    {viewMode === 'self' ? horniness[0] : partnerEntry?.horniness_level || 50}%
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">{t("dashboard.checkin.feeling")}</Label>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-10">{t("dashboard.checkin.bad")}</span>
                    <Slider
                      value={viewMode === 'self' ? generalFeeling : [partnerEntry?.general_feeling || 50]}
                      onValueChange={viewMode === 'self' ? setGeneralFeeling : undefined}
                      max={100}
                      step={1}
                      className="flex-1"
                      disabled={viewMode === 'partner'}
                    />
                    <span className="text-xs text-muted-foreground w-10 text-right">{t("dashboard.checkin.great")}</span>
                  </div>
                  <p className="text-xs text-center text-primary font-medium">
                    {viewMode === 'self' ? generalFeeling[0] : partnerEntry?.general_feeling || 50}%
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">{t("dashboard.checkin.sleep")}</Label>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-10">{t("dashboard.checkin.poor")}</span>
                    <Slider
                      value={viewMode === 'self' ? sleepQuality : [partnerEntry?.sleep_quality || 50]}
                      onValueChange={viewMode === 'self' ? setSleepQuality : undefined}
                      max={100}
                      step={1}
                      className="flex-1"
                      disabled={viewMode === 'partner'}
                    />
                    <span className="text-xs text-muted-foreground w-10 text-right">{t("dashboard.checkin.great")}</span>
                  </div>
                  <p className="text-xs text-center text-primary font-medium">
                    {viewMode === 'self' ? sleepQuality[0] : partnerEntry?.sleep_quality || 50}%
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">{t("dashboard.checkin.emotional")}</Label>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-10">{t("dashboard.checkin.low")}</span>
                    <Slider
                      value={viewMode === 'self' ? emotionalState : [partnerEntry?.emotional_state || 50]}
                      onValueChange={viewMode === 'self' ? setEmotionalState : undefined}
                      max={100}
                      step={1}
                      className="flex-1"
                      disabled={viewMode === 'partner'}
                    />
                    <span className="text-xs text-muted-foreground w-10 text-right">{t("dashboard.checkin.high")}</span>
                  </div>
                  <p className="text-xs text-center text-primary font-medium">
                    {viewMode === 'self' ? emotionalState[0] : partnerEntry?.emotional_state || 50}%
                  </p>
                </div>

                {viewMode === 'self' && (
                  <>
                    <div className="flex justify-center gap-3 pt-2">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={handleSaveAndReset}
                        className="rounded-full border-2 border-primary"
                      >
                        <Save className="w-6 h-6" />
                      </Button>
                      <VoiceInput onParsedValues={handleVoiceInput} />
                    </div>
                    <p className="text-[10px] text-center text-muted-foreground">
                      {t("dashboard.checkin.voice.hint")}
                    </p>
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* View Trends */}
        <Button variant="outline" className="w-full" size="sm" onClick={() => navigate("/trends")}>
          <TrendingUp className="w-4 h-4 mr-2" />
          {t("dashboard.trends")}
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
