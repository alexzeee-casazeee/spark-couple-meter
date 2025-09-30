import { Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-3">
      <Heart className="w-8 h-8 text-primary fill-primary" />
      <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
        <Button
          variant={language === "en" ? "default" : "ghost"}
          size="sm"
          onClick={() => setLanguage("en")}
          className="text-xs h-7 px-3"
        >
          EN
        </Button>
        <Button
          variant={language === "ru" ? "default" : "ghost"}
          size="sm"
          onClick={() => setLanguage("ru")}
          className="text-xs h-7 px-3"
        >
          RU
        </Button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
