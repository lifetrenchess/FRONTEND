
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
    const token = localStorage.getItem('token');
    if (token) {
      const currentUserFromStorage = localStorage.getItem('currentUser');
      if (currentUserFromStorage) {
        try {
          const currentUserData = JSON.parse(currentUserFromStorage);
          setCurrentUser(currentUserData);
        } catch (error) {
          console.error('Error parsing currentUser:', error);
        }
      }
    } else {
      setCurrentUser(null);
    }

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === 'currentUser') {
        const newToken = localStorage.getItem('token');
        if (newToken) {
          const currentUserFromStorage = localStorage.getItem('currentUser');
          if (currentUserFromStorage) {
            try {
              const currentUserData = JSON.parse(currentUserFromStorage);
              setCurrentUser(currentUserData);
            } catch (error) {
              console.error('Error parsing currentUser from storage event:', error);
            }
          }
        } else {
          setCurrentUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleAuthSuccess = (userData: UserData) => {
    // Ensure role is set
    const userDataWithRole = {
      ...userData,
      role: userData.role || 'USER'
    };
    setCurrentUser(userDataWithRole);
    onAuthSuccess(userDataWithRole);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/');
  };

  const handleDashboardClick = () => {
    // Always get the latest user info from localStorage
    let role = null;
    const currentUserFromStorage = localStorage.getItem('currentUser');
    if (currentUserFromStorage) {
      try {
        const currentUserData = JSON.parse(currentUserFromStorage);
        role = currentUserData.role;
      } catch (error) {
        console.error('Error parsing currentUser from storage:', error);
      }
    }

    switch (role?.toUpperCase()) {
      case 'ADMIN':
        navigate('/admin');
        break;
      case 'TRAVEL_AGENT':
      case 'AGENT':
        navigate('/agent');
        break;
      case 'USER':
        navigate('/dashboard');
        break;
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
        <div className="flex justify-between items-center h-20"> {/* Increased height for larger logo */}
          <div className="flex items-center">
            <Link to="/">
            <span className="flex items-center drop-shadow-xl">
              <AventraLogo size={150} />
            </span>
            </Link>
          </div>
          
         <nav className="hidden md:flex flex-1 justify-center space-x-12">
           <Link to="/about" className="text-lg font-semibold text-gray-700 hover:text-palette-teal transition-colors px-2 py-1 rounded-md hover:bg-palette-teal/10">About</Link>
           <Link to="/contact" className="text-lg font-semibold text-gray-700 hover:text-palette-teal transition-colors px-2 py-1 rounded-md hover:bg-palette-teal/10">Contact</Link>
           <Link to="/assistance" className="text-lg font-semibold text-gray-700 hover:text-palette-teal transition-colors px-2 py-1 rounded-md hover:bg-palette-teal/10">Support</Link>
           <Link to="/reviews" className="text-lg font-semibold text-gray-700 hover:text-palette-teal transition-colors px-2 py-1 rounded-md hover:bg-palette-teal/10">Reviews</Link>
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
                <Button 
                  className="bg-palette-orange hover:bg-palette-orange/90 text-white"
                  onClick={() => navigate('/packages')}
                >
                  Book Now
                </Button>
              </>
            ) : (
              // Non-authenticated user view
              <AuthButtons onAuthSuccess={handleAuthSuccess} />
            )}
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Login Dialog for Booking Authentication */}
      {showLoginDialog && (
        <LoginDialog onAuthSuccess={(userData) => {
          onAuthSuccess(userData);
          setShowLoginDialog(false);
          navigate('/packages');
        }}>
          <div style={{ display: 'none' }} />
        </LoginDialog>
      )}
    </header>
  );
};

export default Header;
