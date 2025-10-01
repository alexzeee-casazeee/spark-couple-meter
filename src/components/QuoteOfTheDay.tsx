import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Quote } from "lucide-react";

interface QuoteData {
  id: string;
  message: string;
  source: string;
}

const QuoteOfTheDay = () => {
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);

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
    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 border-2 border-transparent bg-clip-padding relative" style={{ 
      backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, hsl(180, 70%, 75%), hsl(280, 60%, 75%))', 
      backgroundOrigin: 'border-box', 
      backgroundClip: 'padding-box, border-box',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
    }}>
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-primary/15 rounded-full flex items-center justify-center">
            <Quote className="w-5 h-5 text-primary" />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-base font-medium text-foreground leading-relaxed mb-2 italic">
            "{quote.message}"
          </p>
          <p className="text-sm text-muted-foreground">
            — {quote.source}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuoteOfTheDay;
