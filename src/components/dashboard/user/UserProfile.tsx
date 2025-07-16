import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, Shield, Edit, Save, X } from 'lucide-react';
import { getCurrentUser, updateUserProfile, UserResponse, UserProfileDto } from '@/lib/userApi';
import { toast } from 'sonner';

const UserProfile = () => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UserProfileDto>({
    userName: '',
    userEmail: '',
    userContactNumber: ''
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
        setEditForm({
          userName: userData.userName,
          userEmail: userData.userEmail,
          userContactNumber: userData.userContactNumber
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form to original values
    if (user) {
      setEditForm({
        userName: user.userName,
        userEmail: user.userEmail,
        userContactNumber: user.userContactNumber
      });
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      const updatedUser = await updateUserProfile(user.userId, editForm);
      setUser(updatedUser);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const handleInputChange = (field: keyof UserProfileDto, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
            <Label className="text-sm font-medium text-gray-500">Full Name</Label>
            {isEditing ? (
              <Input
                value={editForm.userName}
                onChange={(e) => handleInputChange('userName', e.target.value)}
                className="w-full"
              />
            ) : (
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900">{user.userName}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-500">Email</Label>
            {isEditing ? (
              <Input
                type="email"
                value={editForm.userEmail}
                onChange={(e) => handleInputChange('userEmail', e.target.value)}
                className="w-full"
              />
            ) : (
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900">{user.userEmail}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-500">Contact Number</Label>
            {isEditing ? (
              <Input
                value={editForm.userContactNumber}
                onChange={(e) => handleInputChange('userContactNumber', e.target.value)}
                className="w-full"
              />
            ) : (
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900">{user.userContactNumber}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-500">Role</Label>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
              <Shield className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900">{getRoleDisplayName(user.userRole)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          {isEditing ? (
            <>
              <Button 
                onClick={handleSaveProfile} 
                className="flex-1 bg-[#01E8B2] hover:bg-[#00d4a1]"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button 
                onClick={handleCancelEdit} 
                variant="outline" 
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </>
          ) : (
            <Button 
              onClick={handleEditClick} 
              variant="outline" 
              className="flex-1"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile; 