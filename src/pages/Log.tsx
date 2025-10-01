import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Heart } from "lucide-react";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

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
      
      let dimensionsData: any[] = [];
      
      // Get couple info to load custom dimensions
      const { data: coupleData } = await supabase
        .from("couples")
        .select("*")
        .or(`husband_id.eq.${profileData.id},wife_id.eq.${profileData.id}`)
        .eq("is_active", true)
        .maybeSingle();
      
      // Load custom dimensions if in a couple
      if (coupleData) {
        const { data: dims } = await supabase
          .from("custom_dimensions")
          .select("*")
          .eq("couple_id", coupleData.id)
          .order("created_at", { ascending: true });
        
        dimensionsData = dims || [];
        setCustomDimensions(dimensionsData);
        
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
          dimensionsData || []
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

  // Group entries by date
  const currentEntries = viewMode === 'self' ? entries : partnerEntries;
  const groupedEntries = currentEntries.reduce((groups, entry) => {
    const date = entry.entry_date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(entry);
    return groups;
  }, {} as Record<string, LogEntry[]>);

  // Prepare chart data - average values per day
  const chartData = Object.entries(groupedEntries)
    .slice(0, 30) // Last 30 days
    .reverse()
    .map(([date, dayEntries]) => {
      const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
      return {
        date: format(new Date(date), "MMM d"),
        intimacy: Math.round(avg(dayEntries.map(e => e.horniness_level))),
        feeling: Math.round(avg(dayEntries.map(e => e.general_feeling))),
        sleep: Math.round(avg(dayEntries.map(e => e.sleep_quality))),
        emotional: Math.round(avg(dayEntries.map(e => e.emotional_state))),
      };
    });

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

        {/* Trend Chart */}
        {currentEntries.length > 0 && (
          <Card className="shadow-soft">
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-sm">30-Day Trend</CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis 
                    domain={[0, 100]}
                    tick={{ fontSize: 10 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '11px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="intimacy" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Intimacy"
                    dot={{ r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="feeling" 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    name="Feeling"
                    dot={{ r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sleep" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Sleep"
                    dot={{ r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="emotional" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    name="Emotional"
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {currentEntries.length === 0 ? (
          <Card className="shadow-soft">
            <CardContent className="pt-6 pb-6 text-center text-muted-foreground">
              <p>No entries yet. Start tracking your levels!</p>
            </CardContent>
          </Card>
        ) : (
          Object.entries(groupedEntries).map(([date, dayEntries]) => (
            <Card key={date} className="shadow-soft">
              <CardHeader className="pb-2 pt-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Heart className="w-3.5 h-3.5 text-primary" />
                  <span>{format(new Date(date), "EEEE, MMM d, yyyy")}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pb-3">
                {dayEntries.map((entry) => (
                  <div key={entry.id} className="border-l-2 border-primary/30 pl-3 pb-2 last:pb-0">
                    <div className="text-[10px] text-muted-foreground mb-1.5">
                      {format(new Date(entry.created_at), "h:mm a")}
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 text-xs">
                      <div className="bg-muted/50 rounded p-1.5">
                        <div className="font-semibold text-[10px] mb-0.5">{t("dashboard.checkin.intimacy")}</div>
                        <div className="text-primary font-bold text-sm">{entry.horniness_level}%</div>
                      </div>
                      <div className="bg-muted/50 rounded p-1.5">
                        <div className="font-semibold text-[10px] mb-0.5">{t("dashboard.checkin.feeling")}</div>
                        <div className="text-primary font-bold text-sm">{entry.general_feeling}%</div>
                      </div>
                      <div className="bg-muted/50 rounded p-1.5">
                        <div className="font-semibold text-[10px] mb-0.5">{t("dashboard.checkin.sleep")}</div>
                        <div className="text-primary font-bold text-sm">{entry.sleep_quality}%</div>
                      </div>
                      <div className="bg-muted/50 rounded p-1.5">
                        <div className="font-semibold text-[10px] mb-0.5">{t("dashboard.checkin.emotional")}</div>
                        <div className="text-primary font-bold text-sm">{entry.emotional_state}%</div>
                      </div>
                      {entry.custom_dimensions?.map((dim, idx) => (
                        <div key={idx} className="bg-muted/50 rounded p-1.5">
                          <div className="font-semibold text-[10px] mb-0.5">{dim.dimension_name}</div>
                          <div className="text-primary font-bold text-sm">{dim.value}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Log;
