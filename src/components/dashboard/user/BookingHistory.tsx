import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, Package } from 'lucide-react';
import { getBookingsByUser, BookingResponse } from '@/lib/bookingApi';
import { fetchAllPackages, TravelPackageDto } from '@/lib/packagesApi';

interface Booking {
  id: number;
  packageName: string;
  bookingDate: string;
  travelDate: string;
  status: string;
  price: number;
  destination: string;
}

const BookingHistory = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Get current user ID from localStorage
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const userId = currentUser.userId || 1;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        
        // Fetch bookings and packages in parallel
        const [bookingsData, packagesData] = await Promise.all([
          getBookingsByUser(userId),
          fetchAllPackages()
        ]);

        // Transform booking data to match the interface
        const transformedBookings: Booking[] = bookingsData.map(booking => {
          const packageData = packagesData.find(p => p.packageId === booking.packageId);
          const startDate = new Date(booking.startDate);
          const endDate = new Date(booking.endDate);
          
          return {
            id: booking.bookingId,
            packageName: packageData?.title || 'Unknown Package',
            bookingDate: booking.createdAt || new Date().toISOString().split('T')[0],
            travelDate: startDate.toISOString().split('T')[0],
            status: booking.status,
            price: packageData?.price || 0,
            destination: packageData?.destination || 'Unknown Destination'
          };
        });

        setBookings(transformedBookings);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Booking History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#01E8B2]"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#01E8B2]" />
          Booking History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No bookings found.</p>
            <p className="text-sm text-gray-400 mt-2">Start exploring our packages to make your first booking!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{booking.packageName}</h3>
                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{booking.destination}</span>
                    </div>
                  </div>
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-gray-500">Booked on</p>
                      <p className="font-medium">{formatDate(booking.bookingDate)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-gray-500">Travel date</p>
                      <p className="font-medium">{formatDate(booking.travelDate)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-gray-500">Price</p>
                      <p className="font-medium text-[#964734]">₹{booking.price}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <button className="text-[#01E8B2] hover:underline text-sm">
                    View Details
                  </button>
                  {booking.status === 'PENDING' && (
                    <>
                      <button className="text-red-500 hover:underline text-sm">
                        Cancel Booking
                      </button>
                    </>
                  )}
                  {booking.status === 'COMPLETED' && (
                    <button className="text-[#01E8B2] hover:underline text-sm">
                      Write Review
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingHistory; 