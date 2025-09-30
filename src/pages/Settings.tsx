import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Heart, ArrowLeft } from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  
  // Form states
  const [frequency, setFrequency] = useState<string>("once");
  const [time1, setTime1] = useState("20:00");
  const [time2, setTime2] = useState("12:00");
  const [time3, setTime3] = useState("08:00");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
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
      setFrequency(profileData.notification_frequency || "once");
      setTime1(profileData.notification_time || "20:00");
      setTime2(profileData.notification_time_2 || "12:00");
      setTime3(profileData.notification_time_3 || "08:00");
    }
    
    setLoading(false);
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);

    try {
      const updateData: any = {
        notification_frequency: frequency,
        notification_time: time1,
      };

      if (frequency === "twice" || frequency === "three_times") {
        updateData.notification_time_2 = time2;
      }
      if (frequency === "three_times") {
        updateData.notification_time_3 = time3;
      }

      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", profile.id);

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "Your notification preferences have been updated",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
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
    <div className="min-h-screen pb-20" style={{ background: "var(--gradient-splash)" }}>
      {/* Header */}
      <header className="bg-gradient-romantic p-3 shadow-glow">
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
            <h1 className="text-lg font-bold text-white">Settings</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              Choose how often you'd like to be reminded to check in
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Notification Frequency</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="once">Once daily</SelectItem>
                  <SelectItem value="twice">Twice daily</SelectItem>
                  <SelectItem value="three_times">Three times daily</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="time1">
                  {frequency === "once" ? "Notification Time" : "First Notification"}
                </Label>
                <Input
                  id="time1"
                  type="time"
                  value={time1}
                  onChange={(e) => setTime1(e.target.value)}
                />
              </div>

              {(frequency === "twice" || frequency === "three_times") && (
                <div className="space-y-2">
                  <Label htmlFor="time2">Second Notification</Label>
                  <Input
                    id="time2"
                    type="time"
                    value={time2}
                    onChange={(e) => setTime2(e.target.value)}
                  />
                </div>
              )}

              {frequency === "three_times" && (
                <div className="space-y-2">
                  <Label htmlFor="time3">Third Notification</Label>
                  <Input
                    id="time3"
                    type="time"
                    value={time3}
                    onChange={(e) => setTime3(e.target.value)}
                  />
                </div>
              )}
            </div>

            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving ? "Saving..." : "Save Settings"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
