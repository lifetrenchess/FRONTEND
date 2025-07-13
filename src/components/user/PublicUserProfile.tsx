import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, Shield, Calendar, MapPin } from 'lucide-react';
import { getUserById, UserResponse } from '@/lib/userApi';

interface PublicUserProfileProps {
  userId: number;
  showContact?: boolean;
}

const PublicUserProfile = ({ userId, showContact = false }: PublicUserProfileProps) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await getUserById(userId);
        setUser(userData);
      } catch (err: any) {
        setError(err.message || 'Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

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

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'TRAVEL_AGENT':
        return 'bg-blue-100 text-blue-800';
      case 'USER':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#01E8B2]"></div>
          </div>
        </CardContent>
      </Card>
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

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-[#01E8B2] flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-lg font-semibold">{user.userName}</div>
            <Badge className={getRoleBadgeColor(user.userRole)}>
              {getRoleDisplayName(user.userRole)}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail className="w-4 h-4" />
          <span>{user.userEmail}</span>
        </div>
        
        {showContact && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4" />
            <span>{user.userContactNumber}</span>
          </div>
        )}
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Member since {new Date(user.userCreatedAt).toLocaleDateString()}</span>
        </div>
        
        {user.userRole === 'TRAVEL_AGENT' && (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <MapPin className="w-4 h-4" />
            <span>Travel Agent</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PublicUserProfile; 