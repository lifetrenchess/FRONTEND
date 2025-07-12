import React, { useState, useEffect } from 'react';
import { Home, User, Calendar, MapPin, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import UserProfile from '@/components/dashboard/UserProfile';
import BookingHistory from '@/components/dashboard/BookingHistory';

interface UserData {
  fullName: string;
  email: string;
  isAuthenticated: boolean;
  role?: string;
}

const UserDashboard = () => {
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
      id: 'profile',
      label: 'Profile',
      icon: User,
      description: 'Personal information'
    },
    {
      id: 'bookings',
      label: 'Bookings',
      icon: Calendar,
      description: 'Travel history'
    }
  ];

  const quickActions = (
    <>
      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start space-x-2 text-palette-orange border-palette-orange hover:bg-palette-orange hover:text-white"
      >
        <MapPin className="w-4 h-4" />
        <span>New Booking</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start space-x-2 text-palette-teal border-palette-teal hover:bg-palette-teal hover:text-white"
      >
        <CreditCard className="w-4 h-4" />
        <span>Payment Methods</span>
      </Button>
    </>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview user={currentUser} />;
      case 'profile':
        return <UserProfile user={currentUser} />;
      case 'bookings':
        return <BookingHistory user={currentUser} />;
      default:
        return <DashboardOverview user={currentUser} />;
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

export default UserDashboard; 