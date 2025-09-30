import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Heart, LogOut, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import VoiceInput from "@/components/VoiceInput";
import InvitationManager from "@/components/InvitationManager";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [couple, setCouple] = useState<any>(null);
  const [todayEntry, setTodayEntry] = useState<any>(null);
  
  // Slider states
  const [horniness, setHorniness] = useState([50]);
  const [generalFeeling, setGeneralFeeling] = useState([50]);
  const [sleepQuality, setSleepQuality] = useState([50]);
  const [emotionalState, setEmotionalState] = useState([50]);

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

  const handleSaveEntry = async () => {
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
    } else {
      toast({
        title: "Saved!",
        description: "Your daily check-in has been recorded.",
      });
      checkAuth(); // Refresh data
    }
  };

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
    
    // Auto-save after voice input
    setTimeout(() => {
      handleSaveEntry();
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-romantic p-6 shadow-glow">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-white" fill="white" />
            <div>
              <h1 className="text-2xl font-bold text-white">HornyMeter</h1>
              <p className="text-white/80 text-sm">Welcome, {profile?.display_name}</p>
            </div>
          </div>
          <Button variant="outline" size="icon" onClick={handleLogout} className="bg-white/10 border-white/20 hover:bg-white/20">
            <LogOut className="w-5 h-5 text-white" />
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
        {/* Connection Status */}
        {!couple && profile && (
          <InvitationManager 
            profileId={profile.id} 
            onCoupleCreated={checkAuth}
          />
        )}

        {/* Today's Check-In */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              Today's Check-In
              <span className="ml-auto text-sm font-normal text-muted-foreground">
                {format(new Date(), "MMM d, yyyy")}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-3">
              <Label className="text-base font-semibold">Intimacy Level</Label>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-12">Low</span>
                <Slider
                  value={horniness}
                  onValueChange={setHorniness}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground w-12 text-right">High</span>
              </div>
              <p className="text-sm text-center text-primary font-medium">{horniness[0]}%</p>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">General Feeling</Label>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-12">Bad</span>
                <Slider
                  value={generalFeeling}
                  onValueChange={setGeneralFeeling}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground w-12 text-right">Great</span>
              </div>
              <p className="text-sm text-center text-primary font-medium">{generalFeeling[0]}%</p>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">Sleep Quality</Label>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-12">Poor</span>
                <Slider
                  value={sleepQuality}
                  onValueChange={setSleepQuality}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground w-12 text-right">Great</span>
              </div>
              <p className="text-sm text-center text-primary font-medium">{sleepQuality[0]}%</p>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">Emotional State</Label>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-12">Low</span>
                <Slider
                  value={emotionalState}
                  onValueChange={setEmotionalState}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground w-12 text-right">High</span>
              </div>
              <p className="text-sm text-center text-primary font-medium">{emotionalState[0]}%</p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button className="flex-1" onClick={handleSaveEntry}>
                Save Check-In
              </Button>
              <VoiceInput onParsedValues={handleVoiceInput} />
            </div>
            <p className="text-xs text-center text-muted-foreground pt-2">
              Tap the microphone and speak naturally about how you're feeling
            </p>
          </CardContent>
        </Card>

        {/* View Trends */}
        <Button variant="outline" className="w-full" onClick={() => navigate("/trends")}>
          <TrendingUp className="w-5 h-5 mr-2" />
          View 30-Day Trends
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
