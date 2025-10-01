import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";
import Trends from "./pages/Trends";
import Log from "./pages/Log";
import LearnMore from "./pages/LearnMore";
import AcceptInvite from "./pages/AcceptInvite";
import NotFound from "./pages/NotFound";
import LogoPreview from "./pages/LogoPreview";
import QuotesManager from "./pages/QuotesManager";
import Accounts from "./pages/Accounts";

const queryClient = new QueryClient();

const App = () => (
  <LanguageProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/account" element={<Account />} />
            <Route path="/quotes" element={<QuotesManager />} />
            <Route path="/trends" element={<Trends />} />
            <Route path="/log" element={<Log />} />
            <Route path="/learn-more" element={<LearnMore />} />
            <Route path="/logo-preview" element={<LogoPreview />} />
            <Route path="/invite/:token" element={<AcceptInvite />} />
            <Route path="/admin/accounts" element={<Accounts />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </LanguageProvider>
);

export default App;
