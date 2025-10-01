import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Quote, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuoteData {
  id: string;
  message: string;
  source: string;
}

interface QuoteOfTheDayProps {
  isAtBottom: boolean;
  onPositionChange: (isAtBottom: boolean) => void;
}

const QuoteOfTheDay = ({ isAtBottom, onPositionChange }: QuoteOfTheDayProps) => {
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    loadRandomQuote();
  }, []);

  const loadRandomQuote = async () => {
    try {
      // Get a random quote
      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .limit(100);

      if (error) throw error;

      if (data && data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length);
        setQuote(data[randomIndex]);
      }
    } catch (error) {
      console.error("Error loading quote:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !quote) {
    return null;
  }

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 border-2 border-transparent bg-clip-padding relative animate-fade-in" style={{ 
      backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', 
      backgroundOrigin: 'border-box', 
      backgroundClip: 'padding-box, border-box',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
    }}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex gap-3 flex-1">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-primary/15 rounded-full flex items-center justify-center">
              <Quote className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-primary">Quote of the Day</h3>
          </div>
        </div>
        <div className="flex gap-1">
          {isAtBottom && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onPositionChange(false)}
              className="h-8 w-8 -mt-1"
              title="Move to top"
            >
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (!isAtBottom) {
                // When at top, down arrow moves to bottom
                onPositionChange(true);
              } else {
                // When at bottom, just toggle expand/collapse
                setIsExpanded(!isExpanded);
              }
            }}
            className="h-8 w-8 -mt-1"
            title={!isAtBottom ? "Move to bottom" : (isExpanded ? "Collapse" : "Expand")}
          >
            {!isAtBottom ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : isExpanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="pl-13">
          <p className="text-base font-medium text-foreground leading-relaxed mb-2 italic">
            "{quote.message}"
          </p>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              — {quote.source}
            </p>
            <Button
              variant="link"
              onClick={loadRandomQuote}
              className="text-xs h-auto p-0 text-primary"
            >
              Another
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuoteOfTheDay;
