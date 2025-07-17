import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAllBookings, BookingResponse } from '@/lib/bookingApi';
import { fetchAllPackages, TravelPackageDto } from '@/lib/packagesApi';
import { getAllUsers } from '@/lib/userApi';
import { Calendar, TrendingUp, TrendingDown, IndianRupee, Users, Package, CheckCircle, Clock, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface BookingAnalytics {
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  averageBookingValue: number;
  topDestinations: { destination: string; count: number }[];
  monthlyTrends: { month: string; bookings: number; revenue: number }[];
}

const Analytics = () => {
  const [analytics, setAnalytics] = useState<BookingAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [bookings, packages, users] = await Promise.all([
        getAllBookings(),
        fetchAllPackages(),
        getAllUsers()
      ]);

      // Calculate analytics
      const totalBookings = bookings.length;
      const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PAID').length;
      const pendingBookings = bookings.filter(b => b.status === 'PENDING').length;
      const cancelledBookings = bookings.filter(b => b.status === 'CANCELLED').length;

      // Calculate revenue
      const totalRevenue = bookings
        .filter(b => b.status === 'CONFIRMED' || b.status === 'PAID')
        .reduce((sum, booking) => {
          const packageData = packages.find(p => p.packageId === booking.packageId);
          return sum + (packageData?.price || 0);
        }, 0);

      const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

      // Top destinations
      const destinationCounts: { [key: string]: number } = {};
      bookings.forEach(booking => {
        const packageData = packages.find(p => p.packageId === booking.packageId);
        if (packageData) {
          destinationCounts[packageData.destination] = (destinationCounts[packageData.destination] || 0) + 1;
        }
      });

      const topDestinations = Object.entries(destinationCounts)
        .map(([destination, count]) => ({ destination, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Monthly trends (simplified - last 6 months)
      const monthlyTrends = [];
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        
        const monthBookings = bookings.filter(b => {
          const bookingDate = new Date(b.createdAt || b.startDate);
          return bookingDate.getMonth() === date.getMonth() && 
                 bookingDate.getFullYear() === date.getFullYear();
        });

        const monthRevenue = monthBookings
          .filter(b => b.status === 'CONFIRMED' || b.status === 'PAID')
          .reduce((sum, booking) => {
            const packageData = packages.find(p => p.packageId === booking.packageId);
            return sum + (packageData?.price || 0);
          }, 0);

        monthlyTrends.push({
          month: monthName,
          bookings: monthBookings.length,
          revenue: monthRevenue
        });
      }

      setAnalytics({
        totalBookings,
        confirmedBookings,
        pendingBookings,
        cancelledBookings,
        totalRevenue,
        averageBookingValue,
        topDestinations,
        monthlyTrends
      });

    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
      case 'PAID':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Confirmed</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'CANCELLED':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-palette-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Booking Analytics</h2>
          <p className="text-gray-600">Comprehensive insights into booking performance and trends</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant={timeRange === 'week' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setTimeRange('week')}
          >
            Week
          </Button>
          <Button 
            variant={timeRange === 'month' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setTimeRange('month')}
          >
            Month
          </Button>
          <Button 
            variant={timeRange === 'year' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setTimeRange('year')}
          >
            Year
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.confirmedBookings} confirmed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{analytics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Avg: ₹{analytics.averageBookingValue.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{analytics.pendingBookings}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.cancelledBookings} cancelled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.totalBookings > 0 ? Math.round((analytics.confirmedBookings / analytics.totalBookings) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Confirmed vs Total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Destinations */}
      <Card>
        <CardHeader>
          <CardTitle>Top Destinations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.topDestinations.map((dest, index) => (
              <div key={dest.destination} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-palette-teal text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{dest.destination}</p>
                    <p className="text-sm text-gray-500">{dest.count} bookings</p>
                  </div>
                </div>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-palette-teal h-2 rounded-full" 
                    style={{ 
                      width: `${(dest.count / Math.max(...analytics.topDestinations.map(d => d.count))) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.monthlyTrends.map((trend) => (
              <div key={trend.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{trend.month}</p>
                  <p className="text-sm text-gray-500">{trend.bookings} bookings</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{trend.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics; 