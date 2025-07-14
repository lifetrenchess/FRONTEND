import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserDashboard from './UserDashboard';

interface UserData {
  fullName: string;
  email: string;
  isAuthenticated: boolean;
  role?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication on component mount
    const user = localStorage.getItem('currentUser');
    if (user) {
      const userData = JSON.parse(user);
      if (userData.isAuthenticated) {
        setCurrentUser(userData);
        console.log('User authenticated:', userData);
      } else {
        // User exists but not authenticated
        navigate('/');
        return;
      }
    } else {
      // No user found, redirect to home
      navigate('/');
      return;
    }
    setIsLoading(false);
  }, [navigate]);

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

  if (!currentUser) {
    return null; // Will redirect to home page
  }

  // Render UserDashboard since this route is only for USER role
  return <UserDashboard />;
};

export default Dashboard; 