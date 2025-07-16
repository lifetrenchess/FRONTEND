import React, { useState } from 'react';
import { getCurrentUser } from '@/lib/auth';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import { BookingHistory } from '@/components/dashboard/user';
import { UserProfile } from '@/components/dashboard/user';
import { 
  Home, 
  Calendar, 
  User
} from 'lucide-react';

const UserDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const user = getCurrentUser();

  const menuItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: Home,
      description: 'Dashboard overview and quick actions'
    },
    {
      id: 'bookings',
      label: 'Booking History',
      icon: Calendar,
      description: 'View your travel bookings'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      description: 'Manage your profile'
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
        return <DashboardOverview user={userData} />;
      case 'bookings':
        return <BookingHistory />;
      case 'profile':
        return <UserProfile />;
      default:
        return <DashboardOverview user={userData} />;
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

export default UserDashboard; 