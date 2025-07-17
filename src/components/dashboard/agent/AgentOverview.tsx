import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Calendar, DollarSign, TrendingUp, Users } from 'lucide-react';
import { getAllBookings, BookingResponse } from '@/lib/bookingApi';
import { fetchAllPackages, TravelPackageDto } from '@/lib/packagesApi';
import { getApiUrl } from '@/lib/apiConfig';

interface UserData {
  fullName: string;
  email: string;
  isAuthenticated: boolean;
  role?: string;
}

interface AgentOverviewProps {
  user: UserData | null;
}

interface RealAgentStats {
  packagesManaged: number;
  bookings: number;
  earnings: number;
  activePackages: number;
  pendingBookings: number;
}

const AgentOverview = ({ user }: AgentOverviewProps) => {
  const [stats, setStats] = useState<RealAgentStats>({
    packagesManaged: 0,
    bookings: 0,
    earnings: 0,
    activePackages: 0,
    pendingBookings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Get current user to get agent ID
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const agentId = currentUser.userId || 1;
        
        // Fetch all data in parallel
        const [bookingsData, packagesData] = await Promise.all([
          getAllBookings(),
          fetchAllPackages()
        ]);

        // Show stats for ALL packages in the system
        const allPackages = packagesData;
        const activePackages = allPackages.filter(pkg => pkg.active).length;
        
        // Filter bookings for this agent's packages (bookings they manage)
        const agentBookings = bookingsData.filter(booking => 
          allPackages.some(pkg => pkg.packageId === booking.packageId)
        );
        const pendingBookings = agentBookings.filter(booking => booking.status === 'PENDING').length;
        
        // Calculate earnings from confirmed/completed bookings
        const earnings = agentBookings
          .filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
          .reduce((sum, booking) => {
            const packageData = allPackages.find(p => p.packageId === booking.packageId);
            return sum + (packageData?.price || 0);
          }, 0);

        setStats({
          packagesManaged: allPackages.length, // All packages in system
          bookings: agentBookings.length,
          earnings: earnings,
          activePackages: activePackages,
          pendingBookings: pendingBookings
        });
      } catch (error) {
        console.error('Failed to fetch agent stats:', error);
        // Keep default values if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-palette-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading overview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.fullName}!</h1>
        <p className="text-gray-600">Here's what's happening with all travel packages and bookings in the system.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Packages</CardTitle>
            <Package className="h-4 w-4 text-palette-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-palette-teal">{stats.packagesManaged}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activePackages} active packages
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-palette-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-palette-orange">{stats.bookings}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingBookings} pending bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{stats.earnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              From confirmed bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Packages</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.activePackages}</div>
            <p className="text-xs text-muted-foreground">
              Currently available for booking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingBookings}</div>
            <p className="text-xs text-muted-foreground">
              Require your attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity - Show real data or empty state */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.bookings === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No recent activity</p>
              <p className="text-sm text-gray-400 mt-2">Creating packages to see activity here</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">You have {stats.packagesManaged} packages managed</p>
                  <p className="text-xs text-gray-500">Current status</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{stats.activePackages} packages are currently active</p>
                  <p className="text-xs text-gray-500">Available for booking</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{stats.pendingBookings} bookings require attention</p>
                  <p className="text-xs text-gray-500">Booking management</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentOverview; 