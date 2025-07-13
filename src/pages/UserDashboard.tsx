import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, User, Calendar, MapPin, CreditCard, MessageCircle, Star, Shield } from 'lucide-react';
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
  const navigate = useNavigate();
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
    },
    {
      id: 'support',
      label: 'Support',
      icon: MessageCircle,
      description: 'Get help & assistance'
    },
    {
      id: 'reviews',
      label: 'Reviews',
      icon: Star,
      description: 'Share your experience'
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
      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start space-x-2 text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
        onClick={() => navigate('/assistance')}
      >
        <MessageCircle className="w-4 h-4" />
        <span>Get Support</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start space-x-2 text-yellow-600 border-yellow-600 hover:bg-yellow-600 hover:text-yellow-600"
        onClick={() => navigate('/reviews')}
      >
        <Star className="w-4 h-4" />
        <span>Write Review</span>
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
      case 'support':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Customer Support</h2>
            <p className="text-gray-600 mb-6">Need help with your bookings or have questions? Our support team is here to help.</p>
            <Button 
              onClick={() => navigate('/assistance')}
              className="bg-palette-teal hover:bg-palette-teal/90"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Go to Support Center
            </Button>
          </div>
        );
      case 'reviews':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Share Your Experience</h2>
            <p className="text-gray-600 mb-6">Help other travelers by sharing your feedback about our services.</p>
            <Button 
              onClick={() => navigate('/reviews')}
              className="bg-palette-orange hover:bg-palette-orange/90"
            >
              <Star className="w-4 h-4 mr-2" />
              Write a Review
            </Button>
          </div>
        );
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