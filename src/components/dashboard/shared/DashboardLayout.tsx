import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';

interface UserData {
  fullName: string;
  email: string;
  isAuthenticated: boolean;
  role?: string;
}

interface DashboardLayoutProps {
  user: UserData | null;
  children: React.ReactNode;
  menuItems: Array<{
    id: string;
    label: string;
    icon: React.ComponentType<any>;
    description: string;
  }>;
  quickActions?: React.ReactNode;
  onSectionChange: (section: string) => void;
  activeSection: string;
}

const DashboardLayout = ({ 
  user, 
  children, 
  menuItems, 
  quickActions,
  onSectionChange,
  activeSection 
}: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication on component mount
    if (user) {
      if (user.isAuthenticated) {
        setIsLoading(false);
      } else {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-palette-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-palette-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to home page
  }

  return (
    <div className="min-h-screen bg-palette-cream">
      <DashboardHeader 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen}
        user={user}
      />
      
      <div className="flex">
        <DashboardSidebar 
          activeSection={activeSection}
          setActiveSection={onSectionChange}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          user={user}
          menuItems={menuItems}
          quickActions={quickActions}
        />
        
        <main className="flex-1 p-6 lg:p-8 lg:ml-80">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 