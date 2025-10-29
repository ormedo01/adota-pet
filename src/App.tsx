import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Pets from "./pages/Pets";
import PetDetail from "./pages/PetDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdoptionForm from "./pages/AdoptionForm";
import AdopterDashboard from "./pages/AdopterDashboard";
import ONGDashboard from "./pages/ONGDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/pets" element={<Pets />} />
            <Route path="/pets/:id" element={<PetDetail />} />
            <Route path="/pets/:id/adopt" element={<AdoptionForm />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/adopter-dashboard" 
              element={
                <ProtectedRoute requiredType="adopter">
                  <AdopterDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ong-dashboard" 
              element={
                <ProtectedRoute requiredType="ong">
                  <ONGDashboard />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
