import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, ArrowLeft, TrendingUp } from "lucide-react";
import { format, subDays } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Trends = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", session.user.id)
      .single();

    if (profileData) {
      setProfile(profileData);
      
      // Get last 30 days of entries
      const thirtyDaysAgo = format(subDays(new Date(), 30), "yyyy-MM-dd");
      const { data: entriesData } = await supabase
        .from("daily_entries")
        .select("*")
        .eq("user_id", profileData.id)
        .gte("entry_date", thirtyDaysAgo)
        .order("entry_date", { ascending: true });
      
      setEntries(entriesData || []);
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  const chartData = entries.map(entry => ({
    date: format(new Date(entry.entry_date), "MMM d"),
    intimacy: entry.horniness_level,
    feeling: entry.general_feeling,
    sleep: entry.sleep_quality,
    emotional: entry.emotional_state,
  }));

  return (
    <div className="min-h-screen pb-20 bg-canva-gradient">
      {/* Header */}
      <header className="p-3 shadow-glow" style={{ background: "var(--gradient-primary)" }}>
        <div className="container mx-auto flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/dashboard")}
            className="text-white hover:bg-white/10 h-8 w-8"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-white" fill="white" />
            <h1 className="text-lg font-bold text-white">Your Trends</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 max-w-4xl">
        {entries.length === 0 ? (
          <Card className="shadow-soft border-2 border-transparent bg-clip-padding relative" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
            <CardContent className="pt-12 pb-12 text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-10 h-10 text-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">No Trends Yet</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Your trends will show as soon as you begin entering data. Get started today!
                </p>
              </div>
              <Button onClick={() => navigate("/dashboard")} size="lg">
                Start Tracking
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <Card className="border-2 border-transparent bg-clip-padding relative" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
              <CardHeader>
                <CardTitle className="text-lg">Intimacy Level Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="intimacy" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      name="Intimacy Level"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-2 border-transparent bg-clip-padding relative" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
              <CardHeader>
                <CardTitle className="text-lg">General Feeling Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="feeling" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth={2}
                      name="General Feeling"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-2 border-transparent bg-clip-padding relative" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
              <CardHeader>
                <CardTitle className="text-lg">Sleep Quality Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sleep" 
                      stroke="hsl(280, 65%, 65%)" 
                      strokeWidth={2}
                      name="Sleep Quality"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-2 border-transparent bg-clip-padding relative" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}>
              <CardHeader>
                <CardTitle className="text-lg">Emotional State Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="emotional" 
                      stroke="hsl(190, 60%, 50%)" 
                      strokeWidth={2}
                      name="Emotional State"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Trends;
