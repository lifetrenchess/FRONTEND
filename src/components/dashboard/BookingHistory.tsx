import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  DollarSign,
  Eye,
  Download,
  Star,
  RefreshCw,
  AlertCircle,
  Package
} from 'lucide-react';
import { toast } from 'sonner';
import { getBookingsByUser, BookingResponse } from '@/lib/bookingApi';
import { getCurrentUserFromStorage } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';

interface UserData {
  fullName: string;
  email: string;
  isAuthenticated: boolean;
}

interface BookingHistoryProps {
  user: UserData | null;
}

// Extended booking interface for display
interface DisplayBooking extends BookingResponse {
  destination?: string;
  packageTitle?: string;
  image?: string;
  type?: string;
  totalTravelers?: number;
  totalAmount?: number;
}

const BookingHistory = ({ user }: BookingHistoryProps) => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<DisplayBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');

  // Fetch user bookings on component mount
  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user from storage
      const currentUser = getCurrentUserFromStorage();
      if (!currentUser || !currentUser.userId) {
        throw new Error('User not authenticated');
      }

      // Fetch bookings for the current user
      const userBookings = await getBookingsByUser(currentUser.userId);
      
      // Transform bookings for display
      const displayBookings: DisplayBooking[] = userBookings.map(booking => ({
        ...booking,
        destination: getDestinationFromPackageId(booking.packageId), // Placeholder - would need package service integration
        packageTitle: getPackageTitleFromPackageId(booking.packageId), // Placeholder
        image: getImageFromPackageId(booking.packageId), // Placeholder
        type: 'Package Tour', // Default type
        totalTravelers: booking.adults + booking.children + booking.infants,
        totalAmount: calculateTotalAmount(booking) // Calculate total amount
      }));

      setBookings(displayBookings);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch bookings';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  // Placeholder functions for package data - in a real implementation, 
  // you would fetch package details from the package service
  const getDestinationFromPackageId = (packageId: number): string => {
    // This would typically fetch from package service
    const destinations = ['Bali, Indonesia', 'Paris, France', 'Tokyo, Japan', 'New York, USA', 'London, UK'];
    return destinations[packageId % destinations.length] || 'Unknown Destination';
  };

  const getPackageTitleFromPackageId = (packageId: number): string => {
    const titles = ['Adventure Package', 'City Explorer', 'Cultural Journey', 'Luxury Escape', 'Budget Travel'];
    return titles[packageId % titles.length] || 'Travel Package';
  };

  const getImageFromPackageId = (packageId: number): string => {
    const images = [
      'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400',
      'https://images.unsplash.com/photo-1502602898534-47d6c5c0b0b3?w=400',
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400',
      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400',
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400'
    ];
    return images[packageId % images.length] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400';
  };

  // Calculate total amount for a booking (placeholder - would need package pricing)
  const calculateTotalAmount = (booking: BookingResponse): number => {
    // This would typically fetch package price from package service
    // For now, using a placeholder calculation
    const basePricePerAdult = 1500; // Placeholder base price
    const basePricePerChild = 750;  // Placeholder child price
    const basePricePerInfant = 0;   // Infants are free
    
    const packagePrice = (booking.adults * basePricePerAdult) + 
                        (booking.children * basePricePerChild) + 
                        (booking.infants * basePricePerInfant);
    
    // Add insurance cost if applicable
    let insuranceCost = 0;
    if (booking.hasInsurance && booking.insurancePlan) {
      const insurancePrices = { 1: 599, 2: 899, 3: 1000 };
      const planPrice = insurancePrices[booking.insurancePlan as keyof typeof insurancePrices] || 0;
      insuranceCost = planPrice * (booking.adults + booking.children);
    }
    
    // Add taxes and fees
    const taxesFees = 50;
    
    return packagePrice + insuranceCost + taxesFees;
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-700';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeFilter === 'all') return true;
    return booking.status.toLowerCase() === activeFilter.toLowerCase();
  });

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Booking History</h1>
            <p className="text-gray-600">View and manage your travel bookings</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Loading your bookings...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Booking History</h1>
            <p className="text-gray-600">View and manage your travel bookings</p>
          </div>
        </div>
        
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load bookings</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={fetchUserBookings} variant="outline" className="mr-2">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button onClick={() => navigate('/packages')} className="bg-palette-teal hover:bg-palette-teal/90 text-white">
              Browse Packages
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Booking History</h1>
          <p className="text-gray-600">View and manage your travel bookings</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={fetchUserBookings} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button 
            onClick={() => navigate('/packages')} 
            className="bg-palette-teal hover:bg-palette-teal/90 text-white"
          >
            <Calendar className="w-4 h-4 mr-2" />
            New Booking
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
        {['all', 'confirmed', 'pending', 'completed', 'cancelled'].map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(filter)}
            className={activeFilter === filter ? 'bg-palette-teal hover:bg-palette-teal/90' : ''}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
            {filter !== 'all' && (
              <span className="ml-2 bg-white/20 px-1.5 py-0.5 rounded-full text-xs">
                {bookings.filter(b => b.status.toLowerCase() === filter).length}
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <Card key={booking.bookingId} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
                {/* Image */}
                <img 
                  src={booking.image} 
                  alt={booking.destination}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                
                {/* Booking Details */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{booking.destination}</h3>
                      <p className="text-sm text-gray-500">{booking.packageTitle}</p>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {formatDateRange(booking.startDate, booking.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{booking.totalTravelers} travelers</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">₹{booking.totalAmount || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">BK-{booking.bookingId}</span>
                    </div>
                  </div>

                  {/* Insurance Info */}
                  {booking.hasInsurance && (
                    <div className="flex items-center space-x-2 text-sm text-blue-600">
                      <Package className="w-4 h-4" />
                      <span>Travel Insurance Included</span>
                    </div>
                  )}
                </div>
                
                {/* Actions */}
                <div className="flex flex-col space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-palette-teal border-palette-teal hover:bg-palette-teal hover:text-white"
                    onClick={() => navigate(`/booking/${booking.bookingId}`)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-palette-orange border-palette-orange hover:bg-palette-orange hover:text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  {booking.status.toUpperCase() === 'COMPLETED' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-yellow-600 border-yellow-600 hover:bg-yellow-600 hover:text-white"
                      onClick={() => navigate('/reviews')}
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Review
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredBookings.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {bookings.length === 0 ? 'No bookings found' : 'No bookings match your filter'}
            </h3>
            <p className="text-gray-500 mb-4">
              {bookings.length === 0 
                ? 'Start planning your next adventure!' 
                : 'Try adjusting your filter or view all bookings.'
              }
            </p>
            <div className="flex justify-center space-x-2">
              {bookings.length === 0 && (
                <Button 
                  onClick={() => navigate('/packages')} 
                  className="bg-palette-teal hover:bg-palette-teal/90 text-white"
                >
                  Browse Destinations
                </Button>
              )}
              {bookings.length > 0 && (
                <Button 
                  onClick={() => setActiveFilter('all')} 
                  variant="outline"
                >
                  View All Bookings
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BookingHistory; 