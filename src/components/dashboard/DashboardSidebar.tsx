import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  User, 
  Calendar, 
  Settings, 
  Bell, 
  MapPin, 
  CreditCard,
  X,
  ArrowLeft
} from 'lucide-react';

interface UserData {
  fullName: string;
  email: string;
  isAuthenticated: boolean;
}

interface DashboardSidebarProps {
  activeSection: string;
  setActiveSection: (section: any) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user: UserData | null;
}

const DashboardSidebar = ({ 
  activeSection, 
  setActiveSection, 
  isOpen, 
  setIsOpen,
  user
}: DashboardSidebarProps) => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

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
    // Preferences and Notifications removed
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Close button for mobile */}
          <div className="flex justify-end p-4 lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 pb-4">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    className={`
                      w-full justify-start space-x-3 h-12
                      ${isActive 
                        ? 'bg-palette-teal text-white hover:bg-palette-teal/90' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-palette-teal'
                      }
                    `}
                    onClick={() => {
                      setActiveSection(item.id);
                      setIsOpen(false);
                    }}
                  >
                    <Icon className="w-5 h-5" />
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{item.label}</span>
                      <span className="text-xs opacity-75">{item.description}</span>
                    </div>
                  </Button>
                );
              })}
              {/* Back to Home Button placed after Bookings */}
              <Button
                variant="outline"
                className="w-full justify-start space-x-3 h-12 text-palette-orange border-palette-orange hover:bg-palette-orange hover:text-white mt-2"
                onClick={handleBackToHome}
              >
                <ArrowLeft className="w-5 h-5" />
                <div className="flex flex-col items-start">
                  <span className="font-medium">Back to Home</span>
                  <span className="text-xs opacity-75">Return to main site</span>
                </div>
              </Button>
            </div>
          </nav>

          {/* Quick Actions */}
          <div className="p-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
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
            </div>
          </div>

          {/* Back to Home Button moved to bottom */}
          {/* The old bottom Back to Home button is removed */}
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar; 