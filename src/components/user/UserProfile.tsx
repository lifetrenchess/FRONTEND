import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, Shield } from 'lucide-react';
import { getCurrentUser, User as UserType } from '@/lib/userApi';
import { getCurrentUserFromStorage } from '@/lib/auth';

const UserProfile = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (err) {
        // Fallback to localStorage if API fails
        const storedUser = getCurrentUserFromStorage();
        if (storedUser) {
          setUser(storedUser);
        } else {
          setError('Failed to load user profile');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#01E8B2]"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            <p>{error || 'User profile not found'}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrator';
      case 'TRAVEL_AGENT':
        return 'Travel Agent';
      case 'USER':
        return 'Customer';
      default:
        return role;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-[#01E8B2]" />
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500">Full Name</label>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900">{user.userName}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500">Email</label>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900">{user.userEmail}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500">Contact Number</label>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900">{user.userContactNumber}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500">Role</label>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
              <Shield className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900">{getRoleDisplayName(user.userRole || 'USER')}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" className="flex-1">
            Edit Profile
          </Button>
          <Button variant="outline" className="flex-1">
            Change Password
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile; 