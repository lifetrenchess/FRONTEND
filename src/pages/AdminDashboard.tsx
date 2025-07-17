import React, { useState } from 'react';
import { getCurrentUser } from '@/lib/auth';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import AdminOverview from '@/components/dashboard/admin/AdminOverview';
import UserManagement from '@/components/dashboard/admin/UserManagement';
import PackageManagement from '@/components/dashboard/admin/PackageManagement';
import ReviewManagement from '@/components/dashboard/admin/ReviewManagement';
import AssistanceManagement from '@/components/dashboard/admin/AssistanceManagement';
import SystemSettings from '@/components/dashboard/admin/SystemSettings';
import { 
  Users, 
  Package, 
  MessageSquare, 
  BarChart3, 
  Settings,
  Shield,
  Star
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const user = getCurrentUser();

  const menuItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: BarChart3,
      description: 'System overview and statistics'
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Users,
      description: 'Manage system users'
    },
    {
      id: 'packages',
      label: 'Package Management',
      icon: Package,
      description: 'Manage travel packages'
    },
    {
      id: 'reviews',
      label: 'Review Management',
      icon: Star,
      description: 'Manage customer reviews'
    },
    {
      id: 'assistance',
      label: 'Assistance Management',
      icon: MessageSquare,
      description: 'Handle assistance requests'
    },
    {
      id: 'settings',
      label: 'System Settings',
      icon: Settings,
      description: 'Configure system settings'
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
        return <AdminOverview user={userData} />;
      case 'users':
        return <UserManagement />;
      case 'packages':
        return <PackageManagement />;
      case 'reviews':
        return <ReviewManagement />;
      case 'assistance':
        return <AssistanceManagement />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <AdminOverview user={userData} />;
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

export default AdminDashboard; 