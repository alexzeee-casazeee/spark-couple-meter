import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
      <Button
        variant={language === "en" ? "default" : "ghost"}
        size="sm"
        onClick={() => setLanguage("en")}
        className="text-[10px] h-6 px-2"
      >
        EN
      </Button>
      <Button
        variant={language === "es" ? "default" : "ghost"}
        size="sm"
        onClick={() => setLanguage("es")}
        className="text-[10px] h-6 px-2"
      >
        ES
      </Button>
      <Button
        variant={language === "ru" ? "default" : "ghost"}
        size="sm"
        onClick={() => setLanguage("ru")}
        className="text-[10px] h-6 px-2"
      >
        RU
      </Button>
    </div>
  );
};

export default LanguageSwitcher;
