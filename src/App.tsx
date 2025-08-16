import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import { DashboardLayout } from "./components/DashboardLayout";
import { DashboardHome } from "./components/dashboard/DashboardHome";
import { DocumentsModule } from "./components/dashboard/DocumentsModule";
import { TasksModule } from "./components/dashboard/TasksModule";
import { ReviewModule } from "./components/dashboard/ReviewModule";
import { CalendarModule } from "./components/dashboard/CalendarModule";
import { FlashcardsModule } from "./components/dashboard/FlashcardsModule";
import { AnalyticsModule } from "./components/dashboard/AnalyticsModule";
import { PomodoroModule } from "./components/dashboard/PomodoroModule";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="documents" element={<DocumentsModule />} />
              <Route path="tasks" element={<TasksModule />} />
              <Route path="flashcards" element={<FlashcardsModule />} />
              <Route path="focus" element={<PomodoroModule />} />
              <Route path="analytics" element={<AnalyticsModule />} />
              <Route path="review" element={<ReviewModule />} />
              <Route path="calendar" element={<CalendarModule />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
