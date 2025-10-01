import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";

interface CustomDimensionsManagerProps {
  coupleId: string | null;
  profileId: string;
  onDimensionsChange?: () => void;
}

const CustomDimensionsManager = ({ coupleId, profileId, onDimensionsChange }: CustomDimensionsManagerProps) => {
  const [dimensions, setDimensions] = useState<any[]>([]);
  const [newDimensionName, setNewDimensionName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (coupleId) {
      loadDimensions();
    }
  }, [coupleId]);

  const loadDimensions = async () => {
    if (!coupleId) return;

    const { data, error } = await supabase
      .from("custom_dimensions")
      .select("*")
      .eq("couple_id", coupleId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error loading dimensions:", error);
    } else {
      setDimensions(data || []);
    }
  };

  const handleAddDimension = async () => {
    if (!newDimensionName.trim() || !coupleId) return;

    setLoading(true);
    const { error } = await supabase
      .from("custom_dimensions")
      .insert({
        couple_id: coupleId,
        dimension_name: newDimensionName.trim(),
        created_by_id: profileId,
      });

    if (error) {
      console.error("Error adding dimension:", error);
    } else {
      setNewDimensionName("");
      loadDimensions();
      onDimensionsChange?.();
    }
    setLoading(false);
  };

  const handleDeleteDimension = async (dimensionId: string) => {
    const { error } = await supabase
      .from("custom_dimensions")
      .delete()
      .eq("id", dimensionId);

    if (error) {
      console.error("Error deleting dimension:", error);
    } else {
      loadDimensions();
      onDimensionsChange?.();
    }
  };

  if (!coupleId) return null;

  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-3">
        <Button 
          variant="default" 
          className="w-full"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Your Own Meter
        </Button>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="e.g., Stress Level, Energy..."
            value={newDimensionName}
            onChange={(e) => setNewDimensionName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddDimension()}
            disabled={loading}
          />
          <Button
            onClick={handleAddDimension}
            disabled={loading || !newDimensionName.trim()}
            size="icon"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {dimensions.length > 0 && (
          <div className="space-y-2">
            {dimensions.map((dim) => (
              <div
                key={dim.id}
                className="flex items-center justify-between p-2 bg-muted rounded-lg"
              >
                <span className="text-sm font-medium">{dim.dimension_name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleDeleteDimension(dim.id)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      )}
    </Card>
  );
};

export default CustomDimensionsManager;
