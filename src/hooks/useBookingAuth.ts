import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserData {
  fullName: string;
  email: string;
  isAuthenticated: boolean;
  role: string;
}

interface UseBookingAuthReturn {
  handleBookNow: (packageId?: number) => void;
  showLoginDialog: boolean;
  setShowLoginDialog: (show: boolean) => void;
  onAuthSuccess: (userData: UserData) => void;
}

export const useBookingAuth = (): UseBookingAuthReturn => {
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [pendingPackageId, setPendingPackageId] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleBookNow = (packageId?: number) => {
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    const token = localStorage.getItem('token');

    if (currentUser && token) {
      // User is logged in, proceed with booking
      const userData = JSON.parse(currentUser);
      if (userData.isAuthenticated) {
        // Redirect to booking page or general bookings
        if (packageId) {
          navigate(`/booking/${packageId}`);
        } else {
          navigate('/bookings');
        }
        return;
      }
    }

    // User is not logged in, show login dialog
    if (packageId) {
      setPendingPackageId(packageId);
    }
    setShowLoginDialog(true);
  };

  const onAuthSuccess = (userData: UserData) => {
    setShowLoginDialog(false);
    
    // After successful login, redirect based on pending booking or home page
    if (pendingPackageId) {
      // If there was a pending package booking, redirect to booking page
      navigate(`/booking/${pendingPackageId}`);
      setPendingPackageId(null);
    } else {
      // Otherwise redirect to home page instead of dashboard
      navigate('/');
    }
  };

  return {
    handleBookNow,
    showLoginDialog,
    setShowLoginDialog,
    onAuthSuccess
  };
}; 