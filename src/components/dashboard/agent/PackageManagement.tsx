import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UserData {
  fullName: string;
  email: string;
  isAuthenticated: boolean;
  role?: string;
}

interface PackageManagementProps {
  user: UserData | null;
}

const PackageManagement = ({ user }: PackageManagementProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Package Management</h1>
        <p className="text-gray-600">Manage your travel packages and offerings.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Package Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Package management functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PackageManagement; 