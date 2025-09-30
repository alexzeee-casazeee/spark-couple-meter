import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const { toast } = useToast();

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
        toast({
          title: "Error",
          description: "Failed to recognize speech. Please try again.",
          variant: "destructive",
        });
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const handleTranscript = async (text: string) => {
    try {
      toast({
        title: "Processing...",
        description: `You said: "${text}"`,
      });

      const { data, error } = await supabase.functions.invoke('parse-voice-input', {
        body: { text }
      });

      if (error) throw error;

      if (data) {
        onParsedValues(data);
        toast({
          title: "Voice input saved!",
          description: "Your feelings have been recorded.",
        });
      }
    } catch (error: any) {
      console.error('Error parsing voice input:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to process voice input",
        variant: "destructive",
      });
    }
  };

  const toggleListening = () => {
    if (!recognition) {
      toast({
        title: "Not supported",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      recognition.start();
      setIsListening(true);
      toast({
        title: "Listening...",
        description: "Speak now to record your feelings",
      });
    }
  };

  return (
    <Button
      variant={isListening ? "default" : "outline"}
      size="icon"
      onClick={toggleListening}
      className={isListening ? "animate-pulse" : ""}
    >
      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
    </Button>
  );
};

export default VoiceInput;
