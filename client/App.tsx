import "./global.css";

import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import AdminDashboard from "./pages/AdminDashboard";
import AdvancedSearch from "./pages/AdvancedSearch";
import Analytics from "./pages/Analytics";
import Billing from "./pages/Billing";
import CheckoutPage from "./pages/CheckoutPage";
import Dashboard from "./pages/Dashboard";
import Explore from "./pages/Explore";
import Favorites from "./pages/Favorites";
import Index from "./pages/Index";
import LoadingDemo from "./pages/LoadingDemo";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import SnippetDetail from "./pages/SnippetDetail";
import Upload from "./pages/Upload";

const queryClient = new QueryClient();

// Component to handle profile redirection
const ProfileRedirect = () => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  return <Navigate to={`/profile/${user.username}`} replace />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/upload" element={<Upload />} />
    <Route path="/explore" element={<Explore />} />
    <Route path="/snippet/:id" element={<SnippetDetail />} />
    <Route path="/search" element={<AdvancedSearch />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/admin" element={<AdminDashboard />} />
    <Route path="/analytics" element={<Analytics />} />
    <Route path="/favorites" element={<Favorites />} />
    <Route path="/billing" element={<Billing />} />
    <Route path="/profile" element={<ProfileRedirect />} />
    <Route path="/profile/:username" element={<Profile />} />
    <Route path="/checkout" element={<CheckoutPage />} />
    <Route path="/loading-demo" element={<LoadingDemo />} />
    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
