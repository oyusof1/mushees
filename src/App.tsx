import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ClerkProvider } from '@clerk/clerk-react';
import { SupabaseMushroomProvider } from '@/contexts/SupabaseMushroomContext';
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { Analytics } from '@vercel/analytics/react';
import { CLERK_PUBLISHABLE_KEY } from '@/lib/clerk';
import './App.css';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Analytics />
             <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
         <SupabaseMushroomProvider>
           <Router>
             <Routes>
               <Route path="/" element={<Index />} />
               <Route path="/admin" element={<Admin />} />
               <Route path="*" element={<NotFound />} />
             </Routes>
           </Router>
         </SupabaseMushroomProvider>
       </ClerkProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
