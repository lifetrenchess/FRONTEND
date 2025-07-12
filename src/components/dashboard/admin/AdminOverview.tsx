import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UserData {
  fullName: string;
  email: string;
  isAuthenticated: boolean;
  role?: string;
}

interface AdminOverviewProps {
  user: UserData | null;
}

const AdminOverview = ({ user }: AdminOverviewProps) => {
  // These would be fetched from backend in real app
  const stats = {
    totalUsers: 1234,
    totalPackages: 567,
    totalBookings: 890,
    revenue: 123456
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalPackages.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalBookings.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${stats.revenue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview; 