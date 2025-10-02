import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface VoiceInputProps {
  onParsedValues?: (values: {
    horniness_level: number;
    general_feeling: number;
    sleep_quality: number;
    emotional_state: number;
    custom_dimensions?: Record<string, number>;
  }) => void;
  onTranscript?: (text: string) => void;
  customDimensions?: Array<{ id: string; dimension_name: string }>;
}

const VoiceInput = ({ onParsedValues, onTranscript, customDimensions = [] }: VoiceInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<any>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        
        // If onTranscript callback exists, call it immediately
        if (onTranscript) {
          onTranscript(text);
        }
        
        // If onParsedValues callback exists, parse the text for metrics
        if (onParsedValues) {
          handleTranscript(text);
        }
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const handleTranscript = async (text: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('parse-voice-input', {
        body: { 
          text,
          customDimensions: customDimensions.map(d => d.dimension_name)
        }
      });

      if (error) throw error;

      if (data && onParsedValues) {
        // Map custom dimension names back to IDs
        const customDimensionValues: Record<string, number> = {};
        if (data.custom_dimensions) {
          Object.entries(data.custom_dimensions).forEach(([name, value]) => {
            const dimension = customDimensions.find(d => d.dimension_name.toLowerCase() === name.toLowerCase());
            if (dimension) {
              customDimensionValues[dimension.id] = value as number;
            }
          });
        }
        
        onParsedValues({
          ...data,
          custom_dimensions: customDimensionValues
        });
      }
    } catch (error: any) {
      console.error('Error parsing voice input:', error);
    }
  };

  const toggleListening = () => {
    if (!recognition) {
      console.log("Speech recognition not supported");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <Button
      size="lg"
      onClick={toggleListening}
      className={`rounded-full transition-all duration-300 ${isListening ? 'animate-pulse scale-110' : 'hover:scale-105'} h-12 w-12 border-0 shadow-lg`}
      style={{ 
        background: isListening 
          ? "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-glow)) 100%)"
          : "linear-gradient(135deg, #FF6B6B 0%, #FF8E53 50%, #FFA07A 100%)",
        boxShadow: isListening 
          ? "0 8px 24px rgba(255, 107, 107, 0.4)"
          : "0 6px 20px rgba(255, 138, 83, 0.3)"
      }}
    >
      {isListening ? <PhoneOff className="w-6 h-6 text-white" /> : <Phone className="w-6 h-6 text-white" />}
    </Button>
  );
};

export default VoiceInput;
