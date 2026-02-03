import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/hooks/use-language";
import Index from "./pages/Index";
import RegaloPage from "./pages/RegaloPage";
import CrearPage from "./pages/CrearPage";
import DemoPage from "./pages/DemoPage";
import PagoExitosoPage from "./pages/PagoExitosoPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/regalo/:id" element={<RegaloPage />} />
            <Route path="/demo" element={<DemoPage />} />
            <Route path="/crear" element={<CrearPage />} />
            <Route path="/criar" element={<CrearPage />} />
            <Route path="/pago-exitoso" element={<PagoExitosoPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
