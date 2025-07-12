import React, { useState } from 'react';
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
  Star
} from 'lucide-react';

interface UserData {
  fullName: string;
  email: string;
  isAuthenticated: boolean;
}

interface BookingHistoryProps {
  user: UserData | null;
}

const BookingHistory = ({ user }: BookingHistoryProps) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const bookings = [
    {
      id: 1,
      destination: 'Bali, Indonesia',
      date: 'Dec 15-22, 2024',
      status: 'Confirmed',
      amount: '$1,299',
      image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400',
      bookingId: 'BK-2024-001',
      travelers: 2,
      type: 'Package Tour'
    },
    {
      id: 2,
      destination: 'Paris, France',
      date: 'Jan 10-17, 2025',
      status: 'Pending',
      amount: '$2,199',
      image: 'https://images.unsplash.com/photo-1502602898534-47d6c5c0b0b3?w=400',
      bookingId: 'BK-2024-002',
      travelers: 1,
      type: 'Flight + Hotel'
    },
    {
      id: 3,
      destination: 'Tokyo, Japan',
      date: 'Feb 5-12, 2025',
      status: 'Confirmed',
      amount: '$1,899',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400',
      bookingId: 'BK-2024-003',
      travelers: 3,
      type: 'Package Tour'
    },
    {
      id: 4,
      destination: 'New York, USA',
      date: 'Mar 20-27, 2024',
      status: 'Completed',
      amount: '$1,599',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400',
      bookingId: 'BK-2024-004',
      travelers: 2,
      type: 'Flight + Hotel'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-700';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'Completed':
        return 'bg-blue-100 text-blue-700';
      case 'Cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeFilter === 'all') return true;
    return booking.status.toLowerCase() === activeFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Booking History</h1>
          <p className="text-gray-600">View and manage your travel bookings</p>
        </div>
        <Button className="bg-palette-teal hover:bg-palette-teal/90 text-white">
          <Calendar className="w-4 h-4 mr-2" />
          New Booking
        </Button>
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
          </Button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <Card key={booking.id} className="hover:shadow-lg transition-shadow">
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
                      <p className="text-sm text-gray-500">{booking.type}</p>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{booking.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{booking.travelers} travelers</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{booking.amount}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{booking.bookingId}</span>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex flex-col space-y-2">
                  <Button variant="outline" size="sm" className="text-palette-teal border-palette-teal hover:bg-palette-teal hover:text-white">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="text-palette-orange border-palette-orange hover:bg-palette-orange hover:text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  {booking.status === 'Completed' && (
                    <Button variant="outline" size="sm" className="text-yellow-600 border-yellow-600 hover:bg-yellow-600 hover:text-white">
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-500 mb-4">Start planning your next adventure!</p>
            <Button className="bg-palette-teal hover:bg-palette-teal/90 text-white">
              Browse Destinations
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BookingHistory; 