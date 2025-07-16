import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User, Edit, Save, X } from 'lucide-react';
import { getCurrentUser, updateUserProfile, UserResponse, UserProfileDto } from '@/lib/userApi';
import { toast } from 'sonner';

interface UserData {
  fullName: string;
  email: string;
  isAuthenticated: boolean;
  role?: string;
}

interface AgentProfileProps {
  user: UserData | null;
}

const AgentProfile = ({ user }: AgentProfileProps) => {
  const [profile, setProfile] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userContactNumber: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const userProfile = await getCurrentUser();
      setProfile(userProfile);
      setFormData({
        userName: userProfile.userName || '',
        userEmail: userProfile.userEmail || '',
        userContactNumber: userProfile.userContactNumber || ''
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    try {
      setSaving(true);
      
      const updateData: UserProfileDto = {
        userName: formData.userName,
        userEmail: formData.userEmail,
        userContactNumber: formData.userContactNumber
      };

      const updatedProfile = await updateUserProfile(profile.userId, updateData);
      setProfile(updatedProfile);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
      
      // Update localStorage with new user data
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      currentUser.fullName = updatedProfile.userName;
      currentUser.email = updatedProfile.userEmail;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        userName: profile.userName || '',
        userEmail: profile.userEmail || '',
        userContactNumber: profile.userContactNumber || ''
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-palette-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Agent Profile</h1>
        <p className="text-gray-600">Manage your agent profile and settings.</p>
      </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} className="bg-palette-teal hover:bg-palette-teal/90">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5 text-palette-teal" />
              <span>Profile Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="userName">Full Name</Label>
              {isEditing ? (
                <Input
                  id="userName"
                  value={formData.userName}
                  onChange={(e) => setFormData(prev => ({ ...prev, userName: e.target.value }))}
                  placeholder="Enter your full name"
                />
              ) : (
                <p className="text-gray-900 font-medium">{profile?.userName || 'Not provided'}</p>
              )}
            </div>

            <div>
              <Label htmlFor="userEmail">Email Address</Label>
              {isEditing ? (
                <Input
                  id="userEmail"
                  type="email"
                  value={formData.userEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, userEmail: e.target.value }))}
                  placeholder="Enter your email address"
                />
              ) : (
                <p className="text-gray-900 font-medium">{profile?.userEmail || 'Not provided'}</p>
              )}
            </div>

            <div>
              <Label htmlFor="userContactNumber">Contact Number</Label>
              {isEditing ? (
                <Input
                  id="userContactNumber"
                  value={formData.userContactNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, userContactNumber: e.target.value }))}
                  placeholder="Enter your contact number"
                />
              ) : (
                <p className="text-gray-900 font-medium">{profile?.userContactNumber || 'Not provided'}</p>
              )}
            </div>

            <div>
              <Label>Role</Label>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-palette-orange text-white">
                  {profile?.userRole || 'TRAVEL_AGENT'}
                </Badge>
                <span className="text-sm text-gray-500">(Cannot be changed)</span>
              </div>
            </div>

            {isEditing && (
              <div className="flex space-x-2 pt-4">
                <Button onClick={handleSave} disabled={saving} className="bg-palette-teal hover:bg-palette-teal/90">
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Information */}
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5 text-palette-orange" />
              <span>Account Information</span>
            </CardTitle>
        </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>User ID</Label>
              <p className="text-gray-900 font-medium">{profile?.userId || 'N/A'}</p>
            </div>



            <div>
              <Label>Account Created</Label>
              <p className="text-gray-900 font-medium">
                {profile?.userCreatedAt ? new Date(profile.userCreatedAt).toLocaleDateString() : 'Unknown'}
              </p>
            </div>

            <div>
              <Label>Last Updated</Label>
              <p className="text-gray-900 font-medium">
                {profile?.userUpdatedAt ? new Date(profile.userUpdatedAt).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default AgentProfile; 