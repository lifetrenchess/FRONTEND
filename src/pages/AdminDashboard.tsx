import React, { useState, useEffect } from 'react';
import { Home, Users, Package, FileText, BarChart3, CreditCard, BookOpen, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import AdminOverview from '@/components/dashboard/admin/AdminOverview';
import UserManagement from '@/components/dashboard/admin/UserManagement';
import PackageManagement from '@/components/dashboard/admin/PackageManagement';
import Analytics from '@/components/dashboard/admin/Analytics';
import Payments from '@/components/dashboard/admin/SystemSettings';

interface UserData {
  fullName: string;
  email: string;
  isAuthenticated: boolean;
  role?: string;
}

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
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
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      description: 'System summary'
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      description: 'Registered users'
    },
    {
      id: 'packages',
      label: 'Packages',
      icon: Package,
      description: 'Manage packages'
    },
    {
      id: 'bookings',
      label: 'Bookings',
      icon: BookOpen,
      description: 'All bookings'
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: CreditCard,
      description: 'Payment records'
    }
  ];

  const quickActions = (
    <>
      <Button variant="outline" size="sm" className="w-full justify-start space-x-2 text-palette-teal border-palette-teal hover:bg-palette-teal hover:text-white">
        <Users className="w-4 h-4" />
        <span>Manage Users</span>
      </Button>
      <Button variant="outline" size="sm" className="w-full justify-start space-x-2 text-palette-orange border-palette-orange hover:bg-palette-orange hover:text-white">
        <BookOpen className="w-4 h-4" />
        <span>View Bookings</span>
      </Button>
      <Button variant="outline" size="sm" className="w-full justify-start space-x-2 text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white">
        <Package className="w-4 h-4" />
        <span>Manage Packages</span>
      </Button>
      <Button variant="outline" size="sm" className="w-full justify-start space-x-2 text-gray-700 border-gray-300 hover:bg-gray-200">
        <FileText className="w-4 h-4" />
        <span>Generate Reports</span>
      </Button>
    </>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdminOverview user={currentUser} />;
      case 'users':
        return <UserManagement user={currentUser} />;
      case 'packages':
        return <PackageManagement user={currentUser} />;
      case 'bookings':
        return <Analytics />;
      case 'payments':
        return <Payments />;
      default:
        return <AdminOverview user={currentUser} />;
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

export default AdminDashboard; 