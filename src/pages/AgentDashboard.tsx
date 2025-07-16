import React, { useState } from 'react';
import { getCurrentUser } from '@/lib/auth';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import AgentOverview from '@/components/dashboard/agent/AgentOverview';
import PackageManagement from '@/components/dashboard/agent/PackageManagement';
import BookingManagement from '@/components/dashboard/agent/BookingManagement';
import ReviewManagement from '@/components/dashboard/agent/ReviewManagement';
import CustomerManagement from '@/components/dashboard/agent/CustomerManagement';
import AgentProfile from '@/components/dashboard/agent/AgentProfile';
import CustomerInquiries from '@/components/dashboard/agent/CustomerInquiries';
import { 
  Package, 
  Calendar, 
  Star, 
  Users, 
  User, 
  MessageSquare,
  BarChart3
} from 'lucide-react';

const AgentDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const user = getCurrentUser();

  const menuItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: BarChart3,
      description: 'Dashboard overview and statistics'
    },
    {
      id: 'packages',
      label: 'Package Management',
      icon: Package,
      description: 'Manage travel packages'
    },
    {
      id: 'bookings',
      label: 'Booking Management',
      icon: Calendar,
      description: 'Handle customer bookings'
    },
    {
      id: 'reviews',
      label: 'Review Management',
      icon: Star,
      description: 'Manage customer reviews'
    },
    {
      id: 'customers',
      label: 'Customer Management',
      icon: Users,
      description: 'Manage customer information'
    },
    {
      id: 'inquiries',
      label: 'Customer Inquiries',
      icon: MessageSquare,
      description: 'Handle customer inquiries'
    },
    {
      id: 'profile',
      label: 'Agent Profile',
      icon: User,
      description: 'Update your profile'
    }
  ];

  // Convert UserInfo to UserData format expected by dashboard components
  const userData = user ? {
    fullName: user.fullName,
    email: user.email,
    isAuthenticated: true,
    role: user.role
  } : null;

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <AgentOverview user={userData} />;
      case 'packages':
        return <PackageManagement />;
      case 'bookings':
        return <BookingManagement />;
      case 'reviews':
        return <ReviewManagement />;
      case 'customers':
        return <CustomerManagement />;
      case 'inquiries':
        return <CustomerInquiries user={userData} />;
      case 'profile':
        return <AgentProfile user={userData} />;
      default:
        return <AgentOverview user={userData} />;
    }
  };

  return (
    <DashboardLayout
      user={userData}
      menuItems={menuItems}
      onSectionChange={setActiveSection}
      activeSection={activeSection}
    >
      {renderSection()}
    </DashboardLayout>
  );
};

export default AgentDashboard; 