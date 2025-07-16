import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllUsers } from '@/lib/userApi';
import { fetchAllPackages } from '@/lib/packagesApi';
import { getAllBookings } from '@/lib/bookingApi';
import { UserResponse } from '@/lib/userApi';
import { TravelPackageDto } from '@/lib/packagesApi';
import { BookingResponse } from '@/lib/bookingApi';

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
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPackages: 0,
    totalBookings: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [users, packages, bookings] = await Promise.all([
          getAllUsers(),
          fetchAllPackages(),
          getAllBookings()
        ]);

        // Calculate revenue from completed bookings
        const revenue = bookings
          .filter(b => b.status === 'COMPLETED' || b.status === 'CONFIRMED')
          .reduce((sum, booking) => {
            // Find the package to get the price
            const packageData = packages.find(p => p.packageId === booking.packageId);
            return sum + (packageData?.price || 0);
          }, 0);

        setStats({
          totalUsers: users.length,
          totalPackages: packages.length,
          totalBookings: bookings.length,
          revenue: revenue
        });
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
        // Keep default values if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-palette-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin overview...</p>
        </div>
      </div>
    );
  }

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
            <div className="text-3xl font-bold">₹{stats.revenue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview; 