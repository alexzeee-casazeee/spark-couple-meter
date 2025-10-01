import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, MicOff, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface OliveBranchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupleId: string;
  senderId: string;
  recipientId: string;
  senderName: string;
  recipientName: string;
}

export function OliveBranchDialog({
  open,
  onOpenChange,
  coupleId,
  senderId,
  recipientId,
  senderName,
  recipientName,
}: OliveBranchDialogProps) {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Speak your message for your partner",
      });
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Error",
        description: "Failed to start recording. Please check microphone permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    
    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = reader.result?.toString().split(',')[1];
        
        if (!base64Audio) {
          throw new Error("Failed to convert audio");
        }

        const { data, error } = await supabase.functions.invoke('parse-voice-input', {
          body: { audio: base64Audio }
        });

        if (error) throw error;

        if (data?.text) {
          setMessage(data.text);
          toast({
            title: "Transcription complete",
            description: "You can edit the message before sending",
          });
        }
      };
    } catch (error) {
      console.error("Error transcribing audio:", error);
      toast({
        title: "Error",
        description: "Failed to transcribe audio. Please try typing instead.",
        variant: "destructive",
      });
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleSend = async () => {
    if (!message.trim()) {
      toast({
        title: "Empty message",
        description: "Please record or type a message first",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      const { error } = await supabase
        .from("olive_branch_messages")
        .insert({
          couple_id: coupleId,
          sender_id: senderId,
          recipient_id: recipientId,
          message: message.trim(),
        });

      if (error) throw error;

      toast({
        title: "Message sent! 🫒",
        description: `Your Olive Branch has been extended to ${recipientName}`,
      });

      setMessage("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Extend an Olive Branch 🫒</DialogTitle>
          <DialogDescription>
            Send a heartfelt message to {recipientName}. Record your voice or type a message.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex justify-center gap-4">
            {!isRecording ? (
              <Button
                onClick={startRecording}
                disabled={isTranscribing || isSending}
                className="gap-2"
                variant="outline"
              >
                <Mic className="w-5 h-5" />
                Record Voice Message
              </Button>
            ) : (
              <Button
                onClick={stopRecording}
                className="gap-2 bg-red-500 hover:bg-red-600"
              >
                <MicOff className="w-5 h-5" />
                Stop Recording
              </Button>
            )}
          </div>

          {isTranscribing && (
            <div className="text-center text-sm text-muted-foreground">
              Transcribing your message...
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Your Message</label>
            <Textarea
              placeholder={`Type or record a message for ${recipientName}...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isTranscribing || isRecording || isSending}
              rows={6}
              className="resize-none"
            />
          </div>

          <Button
            onClick={handleSend}
            disabled={!message.trim() || isTranscribing || isRecording || isSending}
            className="w-full gap-2"
          >
            <Send className="w-4 h-4" />
            {isSending ? "Sending..." : "Send Olive Branch"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}