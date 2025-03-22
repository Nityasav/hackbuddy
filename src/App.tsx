import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { MessagingProvider } from "./context/MessagingContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Matches from "./pages/Matches";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";
import AIAgent from "./pages/AIAgent";
import ScheduleCall from "./pages/ScheduleCall";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <MessagingProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/matches" element={<Matches />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/user/:userId" element={<UserProfile />} />
              <Route path="/ai-agent" element={<AIAgent />} />
              <Route path="/schedule-call" element={<ScheduleCall />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </MessagingProvider>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
