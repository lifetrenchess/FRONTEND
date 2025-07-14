import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  MapPin, 
  Star, 
  TrendingUp, 
  Clock, 
  Plane,
  Heart,
  Award,
  Package
} from 'lucide-react';
import { fetchAllPackages, TravelPackageDto } from '@/lib/packagesApi';
import { useBookingAuth } from '@/hooks/useBookingAuth';
import LoginDialog from '@/components/auth/LoginDialog';

interface UserData {
  fullName: string;
  email: string;
  isAuthenticated: boolean;
}

interface DashboardOverviewProps {
  user: UserData | null;
}

const DashboardOverview = ({ user }: DashboardOverviewProps) => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<TravelPackageDto[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const { handleBookNow, showLoginDialog, setShowLoginDialog, onAuthSuccess } = useBookingAuth();

  useEffect(() => {
    fetchAllPackages()
      .then((data) => {
        setPackages(data.slice(0, 3)); // Show first 3 packages
        setPackagesLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load packages:', err);
        setPackagesLoading(false);
      });
  }, []);
  const stats = [
    {
      title: 'Total Bookings',
      value: '12',
      change: '+2 this month',
      icon: Calendar,
      color: 'text-palette-teal'
    },
    {
      title: 'Visited Countries',
      value: '8',
      change: '+1 this year',
      icon: MapPin,
      color: 'text-palette-orange'
    },
    {
      title: 'Loyalty Points',
      value: '2,450',
      change: '+150 this week',
      icon: Star,
      color: 'text-yellow-500'
    },
    {
      title: 'Travel Miles',
      value: '15,230',
      change: '+1,200 this month',
      icon: Plane,
      color: 'text-blue-500'
    }
  ];

  const recentBookings = [
    {
      id: 1,
      destination: 'Bali, Indonesia',
      date: 'Dec 15-22, 2024',
      status: 'Confirmed',
      amount: '$1,299',
      image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400'
    },
    {
      id: 2,
      destination: 'Paris, France',
      date: 'Jan 10-17, 2025',
      status: 'Pending',
      amount: '$2,199',
      image: 'https://images.unsplash.com/photo-1502602898534-47d6c5c0b0b3?w=400'
    },
    {
      id: 3,
      destination: 'Tokyo, Japan',
      date: 'Feb 5-12, 2025',
      status: 'Confirmed',
      amount: '$1,899',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400'
    }
  ];

  const upcomingTrips = [
    {
      destination: 'Bali, Indonesia',
      date: 'Dec 15, 2024',
      daysLeft: 5,
      image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400'
    }
  ];

  return (
    <>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-palette-teal to-palette-orange rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.fullName?.split(' ')[0] || 'Traveler'}! 👋</h1>
          <p className="text-palette-cream/90">Ready for your next adventure? You have 1 upcoming trip.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-palette-teal" />
                <span>Recent Bookings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center space-x-4 p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                    <img 
                      src={booking.image} 
                      alt={booking.destination}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{booking.destination}</h4>
                      <p className="text-sm text-gray-500">{booking.date}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          booking.status === 'Confirmed' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {booking.status}
                        </span>
                        <span className="text-sm font-medium text-palette-teal">{booking.amount}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 text-palette-teal border-palette-teal hover:bg-palette-teal hover:text-white">
                View All Bookings
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Trip */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-palette-orange" />
                <span>Upcoming Trip</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingTrips.length > 0 ? (
                <div className="space-y-4">
                  {upcomingTrips.map((trip, index) => (
                    <div key={index} className="relative overflow-hidden rounded-lg">
                      <img 
                        src={trip.image} 
                        alt={trip.destination}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <h4 className="font-semibold text-lg">{trip.destination}</h4>
                        <p className="text-sm opacity-90">{trip.date}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{trip.daysLeft} days left</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button className="w-full bg-palette-orange hover:bg-palette-orange/90 text-white">
                    View Trip Details
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Plane className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming trips</h3>
                  <p className="text-gray-500 mb-4">Start planning your next adventure!</p>
                  <Button className="bg-palette-teal hover:bg-palette-teal/90 text-white">
                    Browse Destinations
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Featured Packages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-palette-teal" />
              <span>Featured Packages</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {packagesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-palette-teal mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading packages...</p>
              </div>
            ) : packages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {packages.map((pkg) => (
                  <Card key={pkg.packageId} className="group cursor-pointer hover:shadow-lg transition-all duration-300 rounded-lg p-2" onClick={() => navigate(`/packages/${pkg.packageId}`)}>
                    <div className="relative overflow-hidden rounded-lg">
                      <img 
                        src={pkg.mainImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'} 
                        alt={pkg.title}
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-3 text-white">
                        <h4 className="font-semibold text-sm">{pkg.title}</h4>
                        <p className="text-xs opacity-90">₹{pkg.price?.toLocaleString()}</p>
                      </div>
                    </div>
                    <CardContent>
                      <div className="flex items-center space-x-2 mt-2">
                        <MapPin className="w-4 h-4 text-palette-teal" />
                        <span className="text-xs text-gray-700">{pkg.destination}</span>
                        <Clock className="w-4 h-4 text-palette-orange ml-2" />
                        <span className="text-xs text-gray-700">{pkg.duration} days</span>
                      </div>
                      {pkg.includeService && (
                        <div className="mt-2 p-1 bg-green-50 border border-green-100 rounded flex items-center space-x-1">
                          <Package className="w-3 h-3 text-green-600" />
                          <span className="text-xs text-green-700 font-medium">Includes: {pkg.includeService}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        {pkg.flights && pkg.flights.length > 0 && (
                          <span className="flex items-center text-xs text-blue-700">
                            <Plane className="w-3 h-3 mr-1" />{pkg.flights.length} flights
                          </span>
                        )}
                        {pkg.hotels && pkg.hotels.length > 0 && (
                          <span className="flex items-center text-xs text-orange-700">
                            <Award className="w-3 h-3 mr-1" />{pkg.hotels.length} hotels
                          </span>
                        )}
                        {pkg.sightseeingList && pkg.sightseeingList.length > 0 && (
                          <span className="flex items-center text-xs text-purple-700">
                            <Star className="w-3 h-3 mr-1" />{pkg.sightseeingList.length} sightseeing
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No packages available</h3>
                <p className="text-gray-500">Check back later for exciting travel packages!</p>
              </div>
            )}
            <Button variant="outline" className="w-full mt-4 text-palette-teal border-palette-teal hover:bg-palette-teal hover:text-white">
              View All Packages
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-palette-teal" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-20 flex flex-col space-y-2 bg-gradient-to-br from-palette-teal to-palette-teal/80 hover:from-palette-teal/90 hover:to-palette-teal text-white">
                <MapPin className="w-6 h-6" />
                <span className="text-sm">New Booking</span>
              </Button>
              <Button className="h-20 flex flex-col space-y-2 bg-gradient-to-br from-palette-orange to-palette-orange/80 hover:from-palette-orange/90 hover:to-palette-orange text-white">
                <Heart className="w-6 h-6" />
                <span className="text-sm">Wishlist</span>
              </Button>
              <Button className="h-20 flex flex-col space-y-2 bg-gradient-to-br from-palette-peach to-palette-peach/80 hover:from-palette-peach/90 hover:to-palette-peach text-white">
                <Star className="w-6 h-6" />
                <span className="text-sm">Rewards</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Login Dialog for Booking Authentication */}
      {showLoginDialog && (
        <LoginDialog onAuthSuccess={onAuthSuccess}>
          <div style={{ display: 'none' }} />
        </LoginDialog>
      )}
    </>
  );
};

export default DashboardOverview; 