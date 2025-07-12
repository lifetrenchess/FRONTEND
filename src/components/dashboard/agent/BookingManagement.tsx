import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Calendar, Users, CreditCard, Search, Filter, RefreshCw, Eye, Edit, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { getApiUrl } from '@/lib/apiConfig';

interface Booking {
  bookingId: number;
  userId: number;
  packageId: number;
  startDate: string;
  endDate: string;
  status: string;
  travelers: {
    adults: number;
    children: number;
    infants: number;
    contact: {
      fullName: string;
      email: string;
      phoneNumber: string;
    };
    names: string[];
  };
  hasInsurance: boolean;
  totalAmount?: number;
  packageDetails?: {
    title: string;
    destination: string;
    duration: string;
  };
  paymentStatus?: string;
  createdAt?: string;
}

const BookingManagement = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // View states
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [viewingDetails, setViewingDetails] = useState(false);

  // Load all bookings
  const loadBookings = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(getApiUrl('BOOKING_SERVICE', '/bookings'));
      
      if (!response.ok) {
        throw new Error('Failed to load bookings');
      }
      
      const data: Booking[] = await response.json();
      setBookings(data);
      setFilteredBookings(data);
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  // Filter bookings
  useEffect(() => {
    let filtered = bookings;
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }
    
    // Filter by payment status
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(booking => booking.paymentStatus === paymentFilter);
    }
    
    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(booking => 
        booking.bookingId.toString().includes(term) ||
        booking.travelers.contact.fullName.toLowerCase().includes(term) ||
        booking.travelers.contact.email.toLowerCase().includes(term) ||
        (booking.packageDetails?.title && booking.packageDetails.title.toLowerCase().includes(term))
      );
    }
    
    setFilteredBookings(filtered);
  }, [bookings, statusFilter, paymentFilter, searchTerm]);

  // Load bookings on component mount
  useEffect(() => {
    loadBookings();
  }, []);

  // Update booking status
  const updateBookingStatus = async (bookingId: number, newStatus: string) => {
    try {
      const response = await fetch(getApiUrl('BOOKING_SERVICE', `/bookings/${bookingId}/status`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update booking status');
      }

      const updatedBooking: Booking = await response.json();
      
      // Update the bookings list
      setBookings(prev => 
        prev.map(booking => 
          booking.bookingId === updatedBooking.bookingId ? updatedBooking : booking
        )
      );
      
      toast.success(`Booking status updated to ${newStatus}`);
    } catch (err: any) {
      toast.error(`Failed to update status: ${err.message}`);
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'CONFIRMED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800',
      'COMPLETED': 'bg-blue-100 text-blue-800'
    };
    return <Badge variant="secondary" className={colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>{status}</Badge>;
  };

  // Get payment status badge
  const getPaymentBadge = (paymentStatus: string) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'PAID': 'bg-green-100 text-green-800',
      'FAILED': 'bg-red-100 text-red-800',
      'REFUNDED': 'bg-gray-100 text-gray-800'
    };
    return <Badge variant="secondary" className={colors[paymentStatus as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>{paymentStatus}</Badge>;
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Calculate total travelers
  const getTotalTravelers = (booking: Booking) => {
    return booking.travelers.adults + booking.travelers.children + booking.travelers.infants;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading bookings...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Calendar className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadBookings} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Booking Management</h2>
          <p className="text-gray-600">Manage and track all customer bookings</p>
        </div>
        <Button onClick={loadBookings} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold">{bookings.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">
                  {bookings.filter(b => b.status === 'CONFIRMED').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {bookings.filter(b => b.status === 'PENDING').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">
                  {bookings.filter(b => b.status === 'CANCELLED').length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by booking ID, name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status-filter">Booking Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="payment-filter">Payment Status</Label>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Payments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  <SelectItem value="REFUNDED">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Bookings ({filteredBookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredBookings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No bookings found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <Card key={booking.bookingId} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="font-medium text-gray-900">
                            Booking #{booking.bookingId}
                          </span>
                          {getStatusBadge(booking.status)}
                          {booking.paymentStatus && getPaymentBadge(booking.paymentStatus)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-gray-600">Customer</p>
                            <p className="font-medium">{booking.travelers.contact.fullName}</p>
                            <p className="text-sm text-gray-500">{booking.travelers.contact.email}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Travel Dates</p>
                            <p className="font-medium">
                              {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>
                            <Users className="w-4 h-4 inline mr-1" />
                            {getTotalTravelers(booking)} Travelers
                          </span>
                          {booking.hasInsurance && (
                            <span className="text-green-600">
                              <CreditCard className="w-4 h-4 inline mr-1" />
                              Insurance Included
                            </span>
                          )}
                          {booking.totalAmount && (
                            <span className="font-medium">
                              ${booking.totalAmount.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setViewingDetails(true);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        
                        {booking.status === 'PENDING' && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Confirm
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Booking</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to confirm booking #{booking.bookingId}? This will change the status to CONFIRMED.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => updateBookingStatus(booking.bookingId, 'CONFIRMED')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Confirm Booking
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                        
                        {booking.status === 'PENDING' && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white">
                                <XCircle className="w-4 h-4 mr-2" />
                                Cancel
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to cancel booking #{booking.bookingId}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => updateBookingStatus(booking.bookingId, 'CANCELLED')}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Cancel Booking
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Booking Details Modal */}
      {selectedBooking && viewingDetails && (
        <AlertDialog open={viewingDetails} onOpenChange={setViewingDetails}>
          <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <AlertDialogHeader>
              <AlertDialogTitle>Booking Details - #{selectedBooking.bookingId}</AlertDialogTitle>
            </AlertDialogHeader>
            
            <div className="space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-600">Full Name</Label>
                      <p className="font-medium">{selectedBooking.travelers.contact.fullName}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Email</Label>
                      <p className="font-medium">{selectedBooking.travelers.contact.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Phone</Label>
                      <p className="font-medium">{selectedBooking.travelers.contact.phoneNumber}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Booking Status</Label>
                      <div className="mt-1">{getStatusBadge(selectedBooking.status)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Travel Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Travel Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-600">Start Date</Label>
                      <p className="font-medium">{formatDate(selectedBooking.startDate)}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">End Date</Label>
                      <p className="font-medium">{formatDate(selectedBooking.endDate)}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Adults</Label>
                      <p className="font-medium">{selectedBooking.travelers.adults}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Children</Label>
                      <p className="font-medium">{selectedBooking.travelers.children}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Infants</Label>
                      <p className="font-medium">{selectedBooking.travelers.infants}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Insurance</Label>
                      <p className="font-medium">{selectedBooking.hasInsurance ? 'Included' : 'Not Included'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Traveler Names */}
              {selectedBooking.travelers.names.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Traveler Names</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedBooking.travelers.names.map((name, index) => (
                        <div key={index}>
                          <Label className="text-sm text-gray-600">Traveler {index + 1}</Label>
                          <p className="font-medium">{name}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Financial Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Financial Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedBooking.totalAmount && (
                      <div>
                        <Label className="text-sm text-gray-600">Total Amount</Label>
                        <p className="font-medium text-lg">${selectedBooking.totalAmount.toLocaleString()}</p>
                      </div>
                    )}
                    {selectedBooking.paymentStatus && (
                      <div>
                        <Label className="text-sm text-gray-600">Payment Status</Label>
                        <div className="mt-1">{getPaymentBadge(selectedBooking.paymentStatus)}</div>
                      </div>
                    )}
                    {selectedBooking.createdAt && (
                      <div>
                        <Label className="text-sm text-gray-600">Created At</Label>
                        <p className="font-medium">{new Date(selectedBooking.createdAt).toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                setSelectedBooking(null);
                setViewingDetails(false);
              }}>
                Close
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default BookingManagement; 