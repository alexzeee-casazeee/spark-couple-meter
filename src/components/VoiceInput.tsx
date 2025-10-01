import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface VoiceInputProps {
  onParsedValues: (values: {
    horniness_level: number;
    general_feeling: number;
    sleep_quality: number;
    emotional_state: number;
  }) => void;
}

const VoiceInput = ({ onParsedValues }: VoiceInputProps) => {
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
        handleTranscript(text);
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
        body: { text }
      });

      if (error) throw error;

      if (data) {
        onParsedValues(data);
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
      variant={isListening ? "default" : "outline"}
      size="lg"
      onClick={toggleListening}
      className={`rounded-full border-0 transition-all duration-200 ${isListening ? 'animate-pulse' : 'hover:scale-105'}`}
      style={{ 
        background: isListening ? "var(--gradient-romantic)" : "var(--gradient-orange)",
        boxShadow: "var(--shadow-float)"
      }}
      onMouseEnter={(e) => {
        if (!isListening) {
          e.currentTarget.style.boxShadow = "var(--shadow-float-hover)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "var(--shadow-float)";
      }}
    >
      {isListening ? <PhoneOff className="w-6 h-6 text-white" /> : <Phone className="w-6 h-6 text-white" />}
    </Button>
  );
};

export default VoiceInput;
