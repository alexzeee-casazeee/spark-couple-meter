import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Heart } from "lucide-react";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

interface LogEntry {
  id: string;
  entry_date: string;
  created_at: string;
  horniness_level: number;
  general_feeling: number;
  sleep_quality: number;
  emotional_state: number;
  custom_dimensions?: { dimension_name: string; value: number }[];
}

const Log = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [partnerProfile, setPartnerProfile] = useState<any>(null);
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [partnerEntries, setPartnerEntries] = useState<LogEntry[]>([]);
  const [customDimensions, setCustomDimensions] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'self' | 'partner'>('self');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
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
      
      // Get couple info to load custom dimensions
      const { data: coupleData } = await supabase
        .from("couples")
        .select("*")
        .or(`husband_id.eq.${profileData.id},wife_id.eq.${profileData.id}`)
        .eq("is_active", true)
        .maybeSingle();
      
      // Load custom dimensions if in a couple
      if (coupleData) {
        const { data: dimensionsData } = await supabase
          .from("custom_dimensions")
          .select("*")
          .eq("couple_id", coupleData.id)
          .order("created_at", { ascending: true });
        
        setCustomDimensions(dimensionsData || []);
        
        // Get partner info
        const partnerId = coupleData.husband_id === profileData.id 
          ? coupleData.wife_id 
          : coupleData.husband_id;
        
        const { data: partnerData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", partnerId)
          .maybeSingle();
        
        setPartnerProfile(partnerData);
        
        // Load partner's entries
        const { data: partnerEntriesData } = await supabase
          .from("daily_entries")
          .select("*")
          .eq("user_id", partnerId)
          .order("entry_date", { ascending: false })
          .order("created_at", { ascending: false });
        
        if (partnerEntriesData) {
          const partnerEntriesWithCustom = await loadEntriesWithCustomDimensions(
            partnerEntriesData,
            dimensionsData || []
          );
          setPartnerEntries(partnerEntriesWithCustom);
        }
      }
      
      // Get all entries for this user
      const { data: entriesData } = await supabase
        .from("daily_entries")
        .select("*")
        .eq("user_id", profileData.id)
        .order("entry_date", { ascending: false })
        .order("created_at", { ascending: false });
      
      if (entriesData) {
        const entriesWithCustom = await loadEntriesWithCustomDimensions(
          entriesData,
          customDimensions
        );
        setEntries(entriesWithCustom);
      }
    }
    
    setLoading(false);
  };

  const loadEntriesWithCustomDimensions = async (
    entriesData: any[],
    dimensions: any[]
  ): Promise<LogEntry[]> => {
    return Promise.all(
      entriesData.map(async (entry) => {
        const { data: customEntriesData } = await supabase
          .from("custom_dimension_entries")
          .select("dimension_id, value")
          .eq("entry_id", entry.id);
        
        const customDims = customEntriesData?.map((ce) => {
          const dimension = dimensions.find((d) => d.id === ce.dimension_id);
          return {
            dimension_name: dimension?.dimension_name || "Unknown",
            value: ce.value || 50,
          };
        }) || [];
        
        return {
          ...entry,
          custom_dimensions: customDims,
        };
      })
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--gradient-splash)" }}>
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12" style={{ background: "var(--gradient-splash)" }}>
      {/* Header */}
      <header className="bg-gradient-romantic p-3 shadow-glow">
        <div className="container mx-auto flex justify-between items-center px-2">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">Entry Log</h1>
              <p className="text-white/80 text-xs leading-tight">{profile?.display_name}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-2 py-3 max-w-4xl space-y-2">
        {/* View Mode Toggle */}
        {partnerProfile && (
          <Card className="shadow-soft">
            <CardContent className="pt-3 pb-3">
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'self' ? 'default' : 'outline'}
                  onClick={() => setViewMode('self')}
                  className="flex-1 h-8 text-xs"
                >
                  My Log
                </Button>
                <Button
                  variant={viewMode === 'partner' ? 'default' : 'outline'}
                  onClick={() => setViewMode('partner')}
                  className="flex-1 h-8 text-xs"
                >
                  {partnerProfile.display_name}'s Log
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {(viewMode === 'self' ? entries : partnerEntries).length === 0 ? (
          <Card className="shadow-soft">
            <CardContent className="pt-6 pb-6 text-center text-muted-foreground">
              <p>No entries yet. Start tracking your levels!</p>
            </CardContent>
          </Card>
        ) : (
          (viewMode === 'self' ? entries : partnerEntries).map((entry) => (
            <Card key={entry.id} className="shadow-soft">
              <CardHeader className="pb-2 pt-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Heart className="w-3.5 h-3.5 text-primary" />
                  <span>{format(new Date(entry.entry_date), "EEEE, MMM d, yyyy")}</span>
                  <span className="ml-auto text-[10px] font-normal text-muted-foreground">
                    {format(new Date(entry.created_at), "h:mm a")}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pb-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-muted/50 rounded p-2">
                    <div className="font-semibold mb-1">{t("dashboard.checkin.intimacy")}</div>
                    <div className="text-primary font-bold">{entry.horniness_level}%</div>
                  </div>
                  <div className="bg-muted/50 rounded p-2">
                    <div className="font-semibold mb-1">{t("dashboard.checkin.feeling")}</div>
                    <div className="text-primary font-bold">{entry.general_feeling}%</div>
                  </div>
                  <div className="bg-muted/50 rounded p-2">
                    <div className="font-semibold mb-1">{t("dashboard.checkin.sleep")}</div>
                    <div className="text-primary font-bold">{entry.sleep_quality}%</div>
                  </div>
                  <div className="bg-muted/50 rounded p-2">
                    <div className="font-semibold mb-1">{t("dashboard.checkin.emotional")}</div>
                    <div className="text-primary font-bold">{entry.emotional_state}%</div>
                  </div>
                  {entry.custom_dimensions?.map((dim, idx) => (
                    <div key={idx} className="bg-muted/50 rounded p-2">
                      <div className="font-semibold mb-1">{dim.dimension_name}</div>
                      <div className="text-primary font-bold">{dim.value}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Log;
