
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AventraLogo from './AventraLogo';
import AuthButtons from './auth/AuthButtons';
import { Button } from '@/components/ui/button';
import { Menu, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useBookingAuth } from '@/hooks/useBookingAuth';
import LoginDialog from '@/components/auth/LoginDialog';

interface UserData {
  fullName: string;
  email: string;
  isAuthenticated: boolean;
  role?: string;
}

const Header = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const { handleBookNow, showLoginDialog, setShowLoginDialog, onAuthSuccess } = useBookingAuth();

  useEffect(() => {
    // Check for authenticated user on component mount
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const handleAuthSuccess = (userData: UserData) => {
    setCurrentUser(userData);
    // Ensure role is set for the booking auth hook
    const userDataWithRole = {
      ...userData,
      role: userData.role || 'USER'
    };
    onAuthSuccess(userDataWithRole);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    navigate('/');
  };

  const handleDashboardClick = () => {
    // Navigate to role-specific dashboard
    switch (currentUser?.role) {
      case 'ADMIN':
        navigate('/admin');
        break;
      case 'TRAVEL_AGENT':
        navigate('/agent');
        break;
      case 'USER':
      default:
    navigate('/dashboard');
        break;
    }
  };

  const getDashboardButtonText = () => {
    switch (currentUser?.role) {
      case 'ADMIN':
        return 'Admin Dashboard';
      case 'TRAVEL_AGENT':
        return 'Agent Dashboard';
      case 'USER':
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="bg-palette-cream shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <AventraLogo size={120} />
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#destinations" className="text-gray-700 hover:text-palette-teal transition-colors">
              Destinations
            </a>
            <a href="#packages" className="text-gray-700 hover:text-palette-teal transition-colors">
              Packages
            </a>
            <a href="#about" className="text-gray-700 hover:text-palette-teal transition-colors">
              About
            </a>
            <a href="#contact" className="text-gray-700 hover:text-palette-teal transition-colors">
              Contact
            </a>
            <a href="/assistance" className="text-gray-700 hover:text-palette-teal transition-colors">
              Support
            </a>
            <a href="/reviews" className="text-gray-700 hover:text-palette-teal transition-colors">
              Reviews
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            {currentUser ? (
              // Authenticated user view
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleDashboardClick}
                  className="hidden md:flex text-palette-teal hover:bg-palette-teal hover:text-white"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  {getDashboardButtonText()}
                </Button>
                <div className="hidden md:flex items-center space-x-2 text-sm text-gray-700">
                  <User className="w-4 h-4" />
                  <span>Welcome, {currentUser.fullName}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-palette-orange hover:bg-palette-orange hover:text-white"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              // Non-authenticated user view
              <AuthButtons onAuthSuccess={handleAuthSuccess} />
            )}
            
            <Button 
              className="bg-palette-orange hover:bg-palette-orange/90 text-white"
              onClick={() => handleBookNow()}
            >
              Book Now
            </Button>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Login Dialog for Booking Authentication */}
      {showLoginDialog && (
        <LoginDialog onAuthSuccess={onAuthSuccess}>
          <div style={{ display: 'none' }} />
        </LoginDialog>
      )}
    </header>
  );
};

export default Header;
