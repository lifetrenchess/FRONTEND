import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
// Removed invalid Sonner import
import { TooltipProvider } from '@/components/ui/tooltip';
import Index from '@/pages/Index';
import TestDashboard from '@/pages/TestDashboard';
import Dashboard from '@/pages/Dashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import AgentDashboard from '@/pages/AgentDashboard';
import PackageDetails from '@/pages/PackageDetails';
import AllPackages from '@/pages/AllPackages';
import BookingPage from '@/pages/BookingPage';
import PaymentPage from '@/pages/PaymentPage';
import InsurancePage from '@/pages/InsurancePage';
import ConfirmationPage from '@/pages/ConfirmationPage';
import AssistancePage from '@/pages/AssistancePage';
import ReviewPage from '@/pages/ReviewPage';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/ProtectedRoute';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      {/* Removed invalid <Sonner /> component */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/test" element={<TestDashboard />} />
          <Route path="/packages" element={<AllPackages />} />
          
          {/* Role-specific dashboards */}
          <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['TRAVEL_AGENT']} />}>
            <Route path="/agent" element={<AgentDashboard />} />
          </Route>
          
          {/* Public routes */}
          <Route path="/packages/:id" element={<PackageDetails />} />
          <Route path="/about" element={<div className="min-h-screen bg-palette-cream p-8"><h1 className="text-3xl font-bold">About Us</h1><p>Coming soon...</p></div>} />
          <Route path="/contact" element={<div className="min-h-screen bg-palette-cream p-8"><h1 className="text-3xl font-bold">Contact Us</h1><p>Coming soon...</p></div>} />
          
          {/* Protected routes for all authenticated users */}
          <Route element={<ProtectedRoute allowedRoles={['USER', 'ADMIN', 'TRAVEL_AGENT']} />}>
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
np