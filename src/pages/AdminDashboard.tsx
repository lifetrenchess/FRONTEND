import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Users, Package, FileText, BarChart3, CreditCard, BookOpen, Settings, MessageCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import AdminOverview from '@/components/dashboard/admin/AdminOverview';
import UserManagement from '@/components/dashboard/admin/UserManagement';
import PackageManagement from '@/components/dashboard/admin/PackageManagement';
import Analytics from '@/components/dashboard/admin/Analytics';
import Payments from '@/components/dashboard/admin/SystemSettings';
import AssistanceManagement from '@/components/dashboard/admin/AssistanceManagement';
import ReviewManagement from '@/components/dashboard/agent/ReviewManagement';
import BookingManagement from '@/components/dashboard/agent/BookingManagement';
import { Card, CardHeader, CardTitle, Badge } from '@/components/ui/card';
import { isAuthenticated, getStoredCurrentUser } from '@/lib/auth';

interface UserData {
  fullName: string;
  email: string;
  isAuthenticated: boolean;
  role?: string;
}

// Add seeded titles for frontend-only badge logic
const seededTitles = [
  "Paris Adventure",
  "Tokyo Discovery",
  "New York City Explorer",
  "Bali Paradise",
  "London Royal Tour",
  "Santorini Dream",
  "Dubai Luxury",
  "Machu Picchu Trek",
  "Sydney Coastal"
];

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/');
      return;
    }
    const user = getStoredCurrentUser();
    if (user && user.isAuthenticated && user.role === 'ADMIN') {
      setCurrentUser(user);
    } else {
      navigate('/');
    }
    setIsLoading(false);
  }, [navigate]);

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
      id: 'assistance',
      label: 'Assistance',
      icon: MessageCircle,
      description: 'Customer support'
    },
    {
      id: 'reviews',
      label: 'Reviews',
      icon: Star,
      description: 'Manage reviews'
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
              <Button variant="outline" size="sm" className="w-full justify-start space-x-2 text-purple-600 border-purple-600 hover:bg-purple-600 hover:text-white">
          <MessageCircle className="w-4 h-4" />
          <span>Assistance Requests</span>
        </Button>
        <Button variant="outline" size="sm" className="w-full justify-start space-x-2 text-yellow-600 border-yellow-600 hover:bg-yellow-600 hover:text-white">
          <Star className="w-4 h-4" />
          <span>Manage Reviews</span>
        </Button>
        <Button variant="outline" size="sm" className="w-full justify-start space-x-2 text-gray-700 border-gray-300 hover:bg-gray-200">
          <FileText className="w-4 h-4" />
          <span>Generate Reports</span>
        </Button>
    </>
  );

  // Helper to check if user is admin/agent (replace with your actual auth logic)
  const getCurrentUserRole = () => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return user?.role || 'USER';
  };
  const userRole = getCurrentUserRole();

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdminOverview user={currentUser} />;
      case 'users':
        return <UserManagement />;
      case 'packages':
        return <PackageManagement />;
      case 'bookings':
        return <BookingManagement />;
      case 'assistance':
        return <AssistanceManagement />;
      case 'reviews':
        return <ReviewManagement />;
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