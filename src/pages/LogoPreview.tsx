import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LogoPreview = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const generateLogo = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-logo', {
        body: {
          prompt: "Create a modern, minimalist logo for a couples communication app called 'Spark Meter'. The logo should feature two stylized hearts facing each other, with each heart blowing a kiss (represented by small hearts or sparkles) towards the other heart. Use a romantic color palette with warm gradients (coral, pink, rose gold tones). The design should be clean, simple, and work well at small sizes like a favicon. The hearts should have a contemporary, slightly abstract style. Transparent background. High quality, vector-style illustration. The overall feel should be loving, playful, and modern."
        }
      });

      if (error) throw error;

      if (data?.imageUrl) {
        setLogoUrl(data.imageUrl);
        toast({
          title: "Logo generated!",
          description: "Review the logo below. If you like it, let me know and I'll apply it to your site.",
        });
      }
    } catch (error) {
      console.error("Error generating logo:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate logo",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-center">Spark Meter Logo Preview</h1>
        <p className="text-muted-foreground text-center mb-8">
          Generate and review your custom logo
        </p>

        <Card className="p-8">
          {!logoUrl ? (
            <div className="text-center">
              <p className="text-lg mb-6">
                Click the button below to generate your logo featuring two hearts blowing kisses to each other.
              </p>
              <Button
                onClick={generateLogo}
                disabled={isGenerating}
                size="lg"
                className="min-w-[200px]"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Logo"
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-4">Your Generated Logo</h2>
                <p className="text-muted-foreground mb-6">
                  Here's your custom Spark Meter logo. Review it and let me know if you'd like to apply it to your site!
                </p>
              </div>

              <div className="bg-muted rounded-lg p-8 flex items-center justify-center min-h-[400px]">
                <img
                  src={logoUrl}
                  alt="Spark Meter Logo"
                  className="max-w-full max-h-[500px] object-contain"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-6 bg-white dark:bg-gray-900">
                  <h3 className="font-semibold mb-3">Light Background Preview</h3>
                  <div className="flex items-center justify-center h-32">
                    <img src={logoUrl} alt="Logo on light" className="h-20" />
                  </div>
                </Card>

                <Card className="p-6 bg-gray-900 dark:bg-white">
                  <h3 className="font-semibold mb-3 text-white dark:text-gray-900">Dark Background Preview</h3>
                  <div className="flex items-center justify-center h-32">
                    <img src={logoUrl} alt="Logo on dark" className="h-20" />
                  </div>
                </Card>
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={generateLogo} variant="outline">
                  Generate Another
                </Button>
                <Button onClick={() => window.location.href = "/"}>
                  Back to Home
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default LogoPreview;
