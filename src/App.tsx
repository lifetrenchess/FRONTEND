import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import PackageDetails from './pages/PackageDetails';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import InsurancePage from './pages/InsurancePage';
import ConfirmationPage from './pages/ConfirmationPage';
import AssistancePage from './pages/AssistancePage';
import ReviewPage from './pages/ReviewPage';
import AdminDashboard from './pages/AdminDashboard';
import AgentDashboard from './pages/AgentDashboard';
import TestDashboard from './pages/TestDashboard';
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/test" element={<TestDashboard />} />
          <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['TRAVEL_AGENT']} />}>
            <Route path="/agent" element={<AgentDashboard />} />
          </Route>
          <Route path="/packages/:id" element={<PackageDetails />} />
          <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
            <Route path="/booking/:id" element={<BookingPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/insurance" element={<InsurancePage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
            <Route path="/assistance" element={<AssistancePage />} />
            <Route path="/reviews" element={<ReviewPage />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
