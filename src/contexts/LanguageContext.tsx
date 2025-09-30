import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "ru";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Landing page
    "landing.badge": "Better Communication, Stronger Connection",
    "landing.hero.title": "Clear the Air in Your",
    "landing.hero.title.highlight": "Relationship",
    "landing.hero.description": "In many relationships, especially when it comes to intimacy and expectations, misunderstandings create distance. Spark Meter helps couples communicate honestly about their needs, desires, and emotional state.",
    "landing.cta.primary": "Get Started Free",
    "landing.cta.secondary": "Learn More",
    "landing.features.title": "How It Works",
    "landing.features.subtitle": "Simple daily check-ins that strengthen your bond",
    "landing.feature1.title": "Connect as a Couple",
    "landing.feature1.description": "Create accounts as husband or wife, then connect through a private invitation link.",
    "landing.feature2.title": "Daily Check-Ins",
    "landing.feature2.description": "Share your intimacy level, mood, sleep quality, and emotions with simple sliders or voice input.",
    "landing.feature3.title": "Smart Notifications",
    "landing.feature3.description": "Receive gentle alerts when your partner needs attention, creating opportunities for connection.",
    "landing.benefits.title": "Why Couples Love Spark Meter",
    "landing.benefits.subtitle": "Real transparency leads to real intimacy",
    "landing.benefit1.title": "Private & Safe",
    "landing.benefit1.description": "Your data is completely private. Even admins can't see your personal entries.",
    "landing.benefit2.title": "Reduces Misunderstandings",
    "landing.benefit2.description": "Clear communication about needs prevents hurt feelings and missed opportunities for intimacy.",
    "landing.benefit3.title": "Track Your Journey",
    "landing.benefit3.description": "View 30-day trends to understand patterns and strengthen your relationship over time.",
    "landing.final.title": "Start Building a More Honest Relationship Today",
    "landing.final.subtitle": "Join couples who've discovered the power of transparent communication",
    "landing.final.cta": "Create Your Account",
    "landing.footer": "© 2025 Spark Meter. Built with love for loving couples.",
    
    // Auth page
    "auth.welcome": "Welcome Back",
    "auth.create": "Create Account",
    "auth.subtitle.login": "Sign in to continue your journey",
    "auth.subtitle.signup": "Start your journey to better communication",
    "auth.displayName": "Display Name",
    "auth.displayName.placeholder": "Your name",
    "auth.role": "I am a",
    "auth.role.husband": "Husband",
    "auth.role.wife": "Wife",
    "auth.email": "Email",
    "auth.email.placeholder": "you@example.com",
    "auth.password": "Password",
    "auth.password.placeholder": "••••••••",
    "auth.button.signin": "Sign In",
    "auth.button.signup": "Create Account",
    "auth.button.loading": "Please wait...",
    "auth.switch.signup": "Don't have an account? Sign up",
    "auth.switch.login": "Already have an account? Sign in",
    "auth.toast.welcome": "Welcome back!",
    "auth.toast.redirect": "Redirecting to your dashboard...",
    "auth.toast.created": "Account created!",
    "auth.toast.welcome.new": "Welcome to Spark Meter. Setting up your profile...",
    
    // Dashboard
    "dashboard.welcome": "Welcome",
    "dashboard.invite.title": "Connect with Your Partner",
    "dashboard.invite.description": "Create an invitation link to connect with your partner",
    "dashboard.invite.button": "Generate Invitation Link",
    "dashboard.invite.expires": "This link expires in 7 days. Send it to your partner to connect your accounts.",
    "dashboard.checkin.title": "Today's Check-In",
    "dashboard.checkin.intimacy": "Intimacy Level",
    "dashboard.checkin.feeling": "General Feeling",
    "dashboard.checkin.sleep": "Sleep Quality",
    "dashboard.checkin.emotional": "Emotional State",
    "dashboard.checkin.low": "Low",
    "dashboard.checkin.high": "High",
    "dashboard.checkin.bad": "Bad",
    "dashboard.checkin.great": "Great",
    "dashboard.checkin.poor": "Poor",
    "dashboard.checkin.save": "Save Check-In",
    "dashboard.checkin.voice.hint": "Tap the microphone and speak naturally about how you're feeling",
    "dashboard.trends": "View 30-Day Trends",
    "dashboard.toast.saved": "Saved!",
    "dashboard.toast.saved.description": "Your daily check-in has been recorded.",
    "dashboard.toast.invite.created": "Invitation created!",
    "dashboard.toast.invite.share": "Share this link with your partner",
    "dashboard.toast.copied": "Copied!",
    "dashboard.toast.copied.description": "Invitation link copied to clipboard",
    
    // Voice input
    "voice.listening": "Listening...",
    "voice.listening.description": "Speak now to record your feelings",
    "voice.processing": "Processing...",
    "voice.saved": "Voice input saved!",
    "voice.saved.description": "Your feelings have been recorded.",
    "voice.error": "Failed to recognize speech. Please try again.",
    "voice.not.supported": "Speech recognition is not supported in your browser.",
    
    // Invite acceptance
    "invite.title": "You're Invited!",
    "invite.description": "{name} has invited you to connect on Spark Meter",
    "invite.info": "By accepting, you'll be able to share your daily feelings and see when your partner needs connection.",
    "invite.decline": "Decline",
    "invite.accept": "Accept & Connect",
    "invite.connecting": "Connecting...",
    "invite.toast.signin": "Please sign in",
    "invite.toast.signin.description": "You need to be signed in to accept an invitation",
    "invite.toast.invalid": "Invalid invitation",
    "invite.toast.invalid.description": "This invitation link is invalid or has expired",
    "invite.toast.expired": "Invitation expired",
    "invite.toast.expired.description": "This invitation link has expired",
    "invite.toast.incompatible": "Incompatible roles",
    "invite.toast.incompatible.description": "You and your partner must have different roles (husband/wife)",
    "invite.toast.connected": "Connected!",
    "invite.toast.connected.description": "You are now connected with {name}",
  },
  ru: {
    // Landing page
    "landing.badge": "Лучшее общение, крепкие отношения",
    "landing.hero.title": "Откройтесь друг другу в ваших",
    "landing.hero.title.highlight": "Отношениях",
    "landing.hero.description": "Во многих отношениях, особенно когда речь идет об интимности и ожиданиях, недопонимание создает дистанцию. Spark Meter помогает парам честно общаться о своих потребностях, желаниях и эмоциональном состоянии.",
    "landing.cta.primary": "Начать бесплатно",
    "landing.cta.secondary": "Узнать больше",
    "landing.features.title": "Как это работает",
    "landing.features.subtitle": "Простые ежедневные отметки, которые укрепляют вашу связь",
    "landing.feature1.title": "Объединитесь как пара",
    "landing.feature1.description": "Создайте учетные записи как муж или жена, затем подключитесь через личную ссылку-приглашение.",
    "landing.feature2.title": "Ежедневные отметки",
    "landing.feature2.description": "Делитесь уровнем интимности, настроением, качеством сна и эмоциями с помощью простых слайдеров или голосового ввода.",
    "landing.feature3.title": "Умные уведомления",
    "landing.feature3.description": "Получайте деликатные уведомления, когда вашему партнеру нужно внимание, создавая возможности для связи.",
    "landing.benefits.title": "Почему пары любят Spark Meter",
    "landing.benefits.subtitle": "Настоящая прозрачность ведет к настоящей близости",
    "landing.benefit1.title": "Приватно и безопасно",
    "landing.benefit1.description": "Ваши данные полностью конфиденциальны. Даже администраторы не могут видеть ваши личные записи.",
    "landing.benefit2.title": "Уменьшает недопонимание",
    "landing.benefit2.description": "Четкое общение о потребностях предотвращает обиды и упущенные возможности для близости.",
    "landing.benefit3.title": "Следите за своим путем",
    "landing.benefit3.description": "Просматривайте 30-дневные тренды, чтобы понимать паттерны и укреплять отношения со временем.",
    "landing.final.title": "Начните строить более честные отношения сегодня",
    "landing.final.subtitle": "Присоединяйтесь к парам, которые открыли силу прозрачного общения",
    "landing.final.cta": "Создать аккаунт",
    "landing.footer": "© 2025 Spark Meter. Создано с любовью для любящих пар.",
    
    // Auth page
    "auth.welcome": "С возвращением",
    "auth.create": "Создать аккаунт",
    "auth.subtitle.login": "Войдите, чтобы продолжить свой путь",
    "auth.subtitle.signup": "Начните свой путь к лучшему общению",
    "auth.displayName": "Имя для отображения",
    "auth.displayName.placeholder": "Ваше имя",
    "auth.role": "Я",
    "auth.role.husband": "Муж",
    "auth.role.wife": "Жена",
    "auth.email": "Электронная почта",
    "auth.email.placeholder": "you@example.com",
    "auth.password": "Пароль",
    "auth.password.placeholder": "••••••••",
    "auth.button.signin": "Войти",
    "auth.button.signup": "Создать аккаунт",
    "auth.button.loading": "Пожалуйста, подождите...",
    "auth.switch.signup": "Нет аккаунта? Зарегистрируйтесь",
    "auth.switch.login": "Уже есть аккаунт? Войти",
    "auth.toast.welcome": "С возвращением!",
    "auth.toast.redirect": "Перенаправление на панель управления...",
    "auth.toast.created": "Аккаунт создан!",
    "auth.toast.welcome.new": "Добро пожаловать в Spark Meter. Настраиваем ваш профиль...",
    
    // Dashboard
    "dashboard.welcome": "Добро пожаловать",
    "dashboard.invite.title": "Подключите партнера",
    "dashboard.invite.description": "Создайте ссылку-приглашение для подключения партнера",
    "dashboard.invite.button": "Создать ссылку-приглашение",
    "dashboard.invite.expires": "Ссылка действительна 7 дней. Отправьте ее партнеру для подключения.",
    "dashboard.checkin.title": "Сегодняшняя отметка",
    "dashboard.checkin.intimacy": "Уровень интимности",
    "dashboard.checkin.feeling": "Общее самочувствие",
    "dashboard.checkin.sleep": "Качество сна",
    "dashboard.checkin.emotional": "Эмоциональное состояние",
    "dashboard.checkin.low": "Низко",
    "dashboard.checkin.high": "Высоко",
    "dashboard.checkin.bad": "Плохо",
    "dashboard.checkin.great": "Отлично",
    "dashboard.checkin.poor": "Плохое",
    "dashboard.checkin.save": "Сохранить отметку",
    "dashboard.checkin.voice.hint": "Нажмите на микрофон и расскажите естественно о своих ощущениях",
    "dashboard.trends": "Просмотр трендов за 30 дней",
    "dashboard.toast.saved": "Сохранено!",
    "dashboard.toast.saved.description": "Ваша ежедневная отметка записана.",
    "dashboard.toast.invite.created": "Приглашение создано!",
    "dashboard.toast.invite.share": "Поделитесь этой ссылкой с партнером",
    "dashboard.toast.copied": "Скопировано!",
    "dashboard.toast.copied.description": "Ссылка-приглашение скопирована в буфер обмена",
    
    // Voice input
    "voice.listening": "Слушаю...",
    "voice.listening.description": "Говорите сейчас, чтобы записать свои ощущения",
    "voice.processing": "Обработка...",
    "voice.saved": "Голосовой ввод сохранен!",
    "voice.saved.description": "Ваши ощущения записаны.",
    "voice.error": "Не удалось распознать речь. Попробуйте еще раз.",
    "voice.not.supported": "Распознавание речи не поддерживается в вашем браузере.",
    
    // Invite acceptance
    "invite.title": "Вас пригласили!",
    "invite.description": "{name} пригласил(а) вас подключиться к Spark Meter",
    "invite.info": "Приняв приглашение, вы сможете делиться своими ежедневными чувствами и видеть, когда вашему партнеру нужна связь.",
    "invite.decline": "Отклонить",
    "invite.accept": "Принять и подключиться",
    "invite.connecting": "Подключение...",
    "invite.toast.signin": "Пожалуйста, войдите",
    "invite.toast.signin.description": "Вам нужно войти, чтобы принять приглашение",
    "invite.toast.invalid": "Неверное приглашение",
    "invite.toast.invalid.description": "Эта ссылка-приглашение недействительна или истекла",
    "invite.toast.expired": "Приглашение истекло",
    "invite.toast.expired.description": "Срок действия этой ссылки истек",
    "invite.toast.incompatible": "Несовместимые роли",
    "invite.toast.incompatible.description": "У вас и вашего партнера должны быть разные роли (муж/жена)",
    "invite.toast.connected": "Подключено!",
    "invite.toast.connected.description": "Вы теперь подключены с {name}",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
