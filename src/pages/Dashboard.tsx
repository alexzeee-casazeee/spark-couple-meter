import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Heart, LogOut, TrendingUp, Settings, Save, UserCircle, Bell, List } from "lucide-react";
import { format } from "date-fns";
import VoiceInput from "@/components/VoiceInput";
import InvitationManager from "@/components/InvitationManager";
import CustomDimensionsManager from "@/components/CustomDimensionsManager";
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
  
  // Custom dimensions
  const [customDimensions, setCustomDimensions] = useState<any[]>([]);
  const [customValues, setCustomValues] = useState<Record<string, number>>({});
  const [partnerCustomValues, setPartnerCustomValues] = useState<Record<string, number>>({});
  
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
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
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

      if (!silent) {
        toast({
          title: t("dashboard.toast.saved"),
          description: t("dashboard.toast.saved.description"),
        });
      }
      
      // Reload today's entry after saving
      await checkAuth();
    }
  };

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
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Poke sent! 👉",
        description: `${partnerProfile.display_name} will be reminded to check in.`,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12" style={{ background: "var(--gradient-splash)" }}>
      {/* Header - Compact */}
      <header className="bg-gradient-romantic p-3 shadow-glow">
        <div className="container mx-auto flex justify-between items-center px-2">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-white" fill="white" />
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">Spark Meter</h1>
              <p className="text-white/80 text-xs leading-tight">{t("dashboard.welcome")}, {profile?.display_name}</p>
            </div>
          </div>
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" size="icon" onClick={() => navigate("/account")} className="bg-white/10 border-white/20 hover:bg-white/20 h-8 w-8">
              <UserCircle className="w-4 h-4 text-white" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => navigate("/settings")} className="bg-white/10 border-white/20 hover:bg-white/20 h-8 w-8">
              <Settings className="w-4 h-4 text-white" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleLogout} className="bg-white/10 border-white/20 hover:bg-white/20 h-8 w-8">
              <LogOut className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-1 py-2 max-w-4xl space-y-2">
        {/* Connection Status */}
        {!couple && profile && (
          <InvitationManager 
            profileId={profile.id} 
            onCoupleCreated={checkAuth}
          />
        )}

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
                  My Levels
                </Button>
                <Button
                  variant={viewMode === 'partner' ? 'default' : 'outline'}
                  onClick={() => setViewMode('partner')}
                  className="flex-1 h-8 text-xs"
                >
                  See {partnerProfile.display_name}&apos;s Levels
                </Button>
              </div>
              
              {/* Poke button when partner hasn't checked in */}
              {!partnerEntry && viewMode === 'partner' && (
                <div className="mt-2 text-center">
                  <p className="text-xs text-muted-foreground mb-1.5">
                    {partnerProfile.display_name} hasn&apos;t checked in today
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePokePartner}
                    className="gap-2 h-7 text-xs"
                  >
                    <Bell className="w-3 h-3" />
                    Send Poke Reminder
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Today's Check-In */}
        <Card className="shadow-soft border-2 border-l-4 border-primary/30" style={{ background: "var(--gradient-subtle)" }}>
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Heart className="w-3.5 h-3.5 text-primary" />
              {viewMode === 'self' ? t("dashboard.checkin.title") : `${partnerProfile?.display_name}'s Levels`}
              <span className="ml-auto text-[10px] font-normal text-muted-foreground">
                {format(new Date(), "MMM d, yyyy")}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 pb-3">
            {viewMode === 'partner' && !partnerEntry ? (
              <div className="text-center py-6 text-muted-foreground">
                <p className="text-sm">{partnerProfile?.display_name} hasn&apos;t checked in today yet</p>
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
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={handleSaveAndReset}
                        className="rounded-full border-0 transition-all duration-200 hover:scale-105 h-12 w-12"
                        style={{ 
                          background: "var(--gradient-green)",
                          boxShadow: "var(--shadow-float)"
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
          </CardContent>
        </Card>

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
            View Log
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
