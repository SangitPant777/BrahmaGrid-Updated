import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BrahmaGap from "./pages/BrahmaGap";
import CraftYourSoA from "./pages/CraftYourSoA";
import RiskRegister from "./pages/RiskRegister";
import MinutesByBrahma from "./pages/MinutesByBrahma";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/brahma-gap" element={<BrahmaGap />} />
          <Route path="/craft-soa" element={<CraftYourSoA />} />
          <Route path="/risk-register" element={<RiskRegister />} />
          <Route path="/minutes" element={<MinutesByBrahma />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
