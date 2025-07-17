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
import { getBookingsByUser, BookingResponse } from '@/lib/bookingApi';
import { useBookingAuth } from '@/hooks/useBookingAuth';
import Login from '@/components/Login';

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
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const { handleBookNow, showLoginDialog, setShowLoginDialog, onAuthSuccess } = useBookingAuth();

  // Get current user ID from localStorage
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const userId = currentUser.userId || 1;

  useEffect(() => {
    // Fetch packages
    fetchAllPackages()
      .then((data) => {
        setPackages(data.slice(0, 3)); // Show first 3 packages
        setPackagesLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load packages:', err);
        setPackagesLoading(false);
      });

    // Fetch user bookings
    getBookingsByUser(userId)
      .then((data) => {
        setBookings(data);
        setBookingsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load bookings:', err);
        setBookingsLoading(false);
      });
  }, [userId]);

  // Calculate stats from real data
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED').length;
  const pendingBookings = bookings.filter(b => b.status === 'PENDING').length;
  const completedBookings = bookings.filter(b => b.status === 'COMPLETED').length;
  
  // Calculate unique destinations visited
  const visitedDestinations = new Set(
    bookings
      .filter(b => b.status === 'COMPLETED')
      .map(b => {
        const packageData = packages.find(p => p.packageId === b.packageId);
        return packageData?.destination || 'Unknown';
      })
  ).size;

  // Calculate total spent
  const totalSpent = bookings
    .filter(b => b.status === 'COMPLETED' || b.status === 'CONFIRMED')
    .reduce((sum, b) => {
      const packageData = packages.find(p => p.packageId === b.packageId);
      return sum + (packageData?.price || 0);
    }, 0);

  // Get upcoming trips (confirmed bookings with future dates)
  const upcomingTrips = bookings
    .filter(b => b.status === 'CONFIRMED' && new Date(b.startDate) > new Date())
    .slice(0, 1) // Show only the next upcoming trip
    .map(b => {
      const packageData = packages.find(p => p.packageId === b.packageId);
      const startDate = new Date(b.startDate);
      const daysLeft = Math.ceil((startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        destination: packageData?.destination || 'Unknown Destination',
        date: startDate.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }),
        daysLeft: Math.max(0, daysLeft),
        image: packageData?.mainImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'
      };
    });

  // Get recent bookings (last 3)
  const recentBookings = bookings
    .slice(0, 3)
    .map(b => {
      const packageData = packages.find(p => p.packageId === b.packageId);
      const startDate = new Date(b.startDate);
      const endDate = new Date(b.endDate);
      
      return {
        id: b.bookingId,
        destination: packageData?.destination || 'Unknown Destination',
        date: `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
        status: b.status,
        amount: `₹${packageData?.price?.toLocaleString() || '0'}`,
        image: packageData?.mainImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'
      };
    });

  // Get wishlisted packages from localStorage
  const getWishlist = () => {
    const stored = localStorage.getItem('wishlist');
    return stored ? JSON.parse(stored) as number[] : [];
  };
  const wishlistedIds = getWishlist();
  const wishlistedPackages = packages.filter(pkg => wishlistedIds.includes(pkg.packageId));

  const stats = [
    {
      title: 'Total Bookings',
      value: totalBookings.toString(),
      change: `+${pendingBookings} pending`,
      icon: Calendar,
      color: 'text-palette-teal'
    },
    {
      title: 'Visited Countries',
      value: visitedDestinations.toString(),
      change: `${confirmedBookings} confirmed`,
      icon: MapPin,
      color: 'text-palette-orange'
    },
    {
      title: 'Total Spent',
      value: `₹${totalSpent.toLocaleString()}`,
      change: `${completedBookings} completed`,
      icon: Star,
      color: 'text-yellow-500'
    },
    {
      title: 'Upcoming Trips',
      value: upcomingTrips.length.toString(),
      change: `${upcomingTrips.length > 0 ? `${upcomingTrips[0].daysLeft} days left` : 'No upcoming trips'}`,
      icon: Plane,
      color: 'text-blue-500'
    }
  ];

  return (
    <>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-palette-teal to-palette-orange rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.fullName?.split(' ')[0] || 'Traveler'}! 👋</h1>
          <p className="text-palette-cream/90">
            Ready for your next adventure? You have {upcomingTrips.length} upcoming trip{upcomingTrips.length !== 1 ? 's' : ''}.
          </p>
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
              <Button variant="outline" className="w-full mt-4 text-palette-teal border-palette-teal hover:bg-palette-teal hover:text-white" onClick={() => navigate('/dashboard?tab=bookings')}>
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
            <Button variant="outline" className="w-full mt-4 text-palette-teal border-palette-teal hover:bg-palette-teal hover:text-white" onClick={() => navigate('/packages')}>
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
              <Button className="h-20 flex flex-col space-y-2 bg-gradient-to-br from-palette-teal to-palette-teal/80 hover:from-palette-teal/90 hover:to-palette-teal text-white" onClick={() => navigate('/')}> 
                <MapPin className="w-6 h-6" />
                <span className="text-sm">New Booking</span>
              </Button>
              <Button className="h-20 flex flex-col space-y-2 bg-gradient-to-br from-palette-orange to-palette-orange/80 hover:from-palette-orange/90 hover:to-palette-orange text-white" onClick={() => navigate('/wishlist')}>
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

        {/* Wishlisted Packages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-palette-orange" />
              <span>Wishlisted Packages</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {wishlistedPackages.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No wishlisted packages</h3>
                <p className="text-gray-500">Add packages to your wishlist to see them here!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {wishlistedPackages.map(pkg => (
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            <Button variant="outline" className="w-full mt-4 text-palette-orange border-palette-orange hover:bg-palette-orange hover:text-white" onClick={() => navigate('/wishlist')}>
              View Wishlist
            </Button>
          </CardContent>
        </Card>
      </div>
      {/* Login Dialog for Booking Authentication */}
      {showLoginDialog && (
        <Login isOpen={showLoginDialog} onClose={() => setShowLoginDialog(false)} onAuthSuccess={onAuthSuccess} />
      )}
    </>
  );
};

export default DashboardOverview; 