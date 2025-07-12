import React, { useState, useEffect } from 'react';
import { Home, Package, Calendar, MessageSquare, Users, Plus, TrendingUp, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import AgentOverview from '@/components/dashboard/agent/AgentOverview';
import PackageManagement from '@/components/dashboard/agent/PackageManagement';
import BookingManagement from '@/components/dashboard/agent/BookingManagement';
import CustomerInquiries from '@/components/dashboard/agent/CustomerInquiries';
import AgentProfile from '@/components/dashboard/agent/AgentProfile';

interface UserData {
  fullName: string;
  email: string;
  isAuthenticated: boolean;
  role?: string;
}

const AgentDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const userData = JSON.parse(user);
      setCurrentUser(userData);
      }
  }, []);

  const menuItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: Home,
      description: 'Dashboard summary'
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
      description: 'Manage bookings'
    },
    {
      id: 'inquiries',
      label: 'Customer Inquiries',
      icon: MessageSquare,
      description: 'Respond to inquiries'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: Users,
      description: 'Agent profile'
    }
  ];

  const quickActions = (
    <>
      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start space-x-2 text-palette-orange border-palette-orange hover:bg-palette-orange hover:text-white"
      >
        <Plus className="w-4 h-4" />
        <span>Add Package</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start space-x-2 text-palette-teal border-palette-teal hover:bg-palette-teal hover:text-white"
      >
        <TrendingUp className="w-4 h-4" />
        <span>View Analytics</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start space-x-2 text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
      >
        <Settings className="w-4 h-4" />
        <span>Settings</span>
      </Button>
    </>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return <AgentOverview user={currentUser} />;
      case 'packages':
        return <PackageManagement user={currentUser} />;
      case 'bookings':
        return <BookingManagement user={currentUser} />;
      case 'inquiries':
        return <CustomerInquiries user={currentUser} />;
      case 'profile':
        return <AgentProfile user={currentUser} />;
      default:
        return <AgentOverview user={currentUser} />;
  }
  };

  return (
    <DashboardLayout
      user={currentUser}
      menuItems={menuItems}
      quickActions={quickActions}
      onSectionChange={setActiveSection}
      activeSection={activeSection}
    >
      {renderActiveSection()}
    </DashboardLayout>
  );
};

export default AgentDashboard; 