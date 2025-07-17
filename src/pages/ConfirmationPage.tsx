import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Calendar, Users, MapPin, CreditCard, Download, Mail, Home } from 'lucide-react';
import { toast } from 'sonner';
import { getApiUrl } from '@/lib/apiConfig';
// Add confetti import
import Confetti from 'react-confetti';

interface BookingDetails {
  bookingId: number;
  userId: number;
  packageId: number;
  startDate: string;
  endDate: string;
  status: string;
  adults: number;
  children: number;
  infants: number;
  contactFullName: string;
  contactEmail: string;
  contactPhone: string;
  travelerNames: string;
  hasInsurance: boolean;
  insurancePlan?: string;
  payment?: {
    paymentId: number;
    amount: number;
    status: string;
    paymentMethod: string;
    razorpayPaymentId: string;
  };
}

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId } = (location.state || {}) as { bookingId: number };
  
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(true);
  const [detailsVisible, setDetailsVisible] = useState(false);

  useEffect(() => {
    if (!bookingId) {
      toast.error('Booking ID not found. Redirecting to home.');
      navigate('/');
      return;
    }

    const fetchBookingDetails = async () => {
      try {
        const response = await fetch(getApiUrl('BOOKING_SERVICE', `/${bookingId}`));
        
        if (!response.ok) {
          throw new Error('Failed to fetch booking details');
        }
        
        const bookingData = await response.json();
        setBookingDetails(bookingData);
      } catch (error: any) {
        console.error('Error fetching booking details:', error);
        toast.error('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId, navigate]);

  useEffect(() => {
    setTimeout(() => setShowConfetti(false), 2500);
    setTimeout(() => setDetailsVisible(true), 400);
  }, []);

  const formatIndianRupees = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      'CONFIRMED': 'bg-green-100 text-green-800',
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    };
    return <Badge variant="secondary" className={colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>{status}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const colors = {
      'COMPLETED': 'bg-green-100 text-green-800',
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'FAILED': 'bg-red-100 text-red-800'
    };
    return <Badge variant="secondary" className={colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>{status}</Badge>;
  };

  const handleDownloadReceipt = () => {
    // Generate and download receipt
    const receiptContent = `
      AVENTRA TRAVEL - BOOKING RECEIPT
      
      Booking ID: ${bookingDetails?.bookingId}
      Date: ${new Date().toLocaleDateString()}
      
      Customer Details:
      Name: ${bookingDetails?.contactFullName}
      Email: ${bookingDetails?.contactEmail}
      Phone: ${bookingDetails?.contactPhone}
      
      Travel Details:
      Start Date: ${bookingDetails?.startDate ? formatDate(bookingDetails.startDate) : 'N/A'}
      End Date: ${bookingDetails?.endDate ? formatDate(bookingDetails.endDate) : 'N/A'}
      Travelers: ${bookingDetails?.adults || 0} Adults, ${bookingDetails?.children || 0} Children, ${bookingDetails?.infants || 0} Infants
      
      Payment Details:
      Amount: ${bookingDetails?.payment ? formatIndianRupees(bookingDetails.payment.amount) : 'N/A'}
      Payment ID: ${bookingDetails?.payment?.razorpayPaymentId || 'N/A'}
      Status: ${bookingDetails?.payment ? getPaymentStatusBadge(bookingDetails.payment.status) : 'N/A'}
      
      Insurance: ${bookingDetails?.hasInsurance ? `Yes (${bookingDetails.insurancePlan})` : 'No'}
      
      Thank you for choosing Aventra Travel!
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `booking-receipt-${bookingDetails?.bookingId}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast.success('Receipt downloaded successfully!');
  };

  const handleSendEmail = () => {
    // In a real application, this would send an email to the customer
    toast.success('Confirmation email sent to your registered email address!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-palette-orange mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking confirmation...</p>
        </div>
      </div>
    );
  }

  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h2>
          <p className="text-gray-600 mb-4">The booking details could not be loaded.</p>
          <Button onClick={() => navigate('/')}>Go to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-palette-cream via-white to-palette-cream/30 py-8">
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={180} recycle={false} gravity={0.25} />} 
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 animate-pop-in">
            <CheckCircle className="w-12 h-12 text-green-600 animate-checkmark" />
          </div>
          <h1 className="text-3xl font-bold text-palette-teal mb-2 animate-fade-in">Booking Confirmed!</h1>
          <p className="text-gray-600 animate-fade-in">Your travel booking has been successfully confirmed.</p>
        </div>
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 transition-opacity duration-700 ${detailsVisible ? 'opacity-100' : 'opacity-0'}`}> 
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Details */}
            <Card className="bg-gradient-to-br from-palette-teal/10 to-palette-orange/10 border-0 shadow-xl animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Booking Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Booking ID</p>
                    <p className="font-medium">#{bookingDetails.bookingId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <div className="mt-1">{getStatusBadge(bookingDetails.status)}</div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Start Date</p>
                    <p className="font-medium">{formatDate(bookingDetails.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">End Date</p>
                    <p className="font-medium">{formatDate(bookingDetails.endDate)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Traveler Information */}
            <Card className="bg-gradient-to-br from-palette-orange/10 to-palette-teal/10 border-0 shadow-xl animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Traveler Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Contact Name</p>
                    <p className="font-medium">{bookingDetails.contactFullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{bookingDetails.contactEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{bookingDetails.contactPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Travelers</p>
                    <ul className="font-medium list-disc list-inside">
                      {bookingDetails.travelerNames.split(',').map((name, idx) => (
                        <li key={idx}>{name.trim()}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Insurance</p>
                    <p className="font-medium">
                      {bookingDetails.hasInsurance 
                        ? `Yes (${bookingDetails.insurancePlan || 'Standard'})` 
                        : 'No'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            {bookingDetails.payment && (
              <Card className="bg-gradient-to-br from-palette-teal/10 to-palette-orange/10 border-0 shadow-xl animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5" />
                    <span>Payment Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Payment ID</p>
                      <p className="font-medium">{bookingDetails.payment.razorpayPaymentId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Status</p>
                      <div className="mt-1">{getPaymentStatusBadge(bookingDetails.payment.status)}</div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Amount Paid</p>
                      <p className="font-medium text-lg">{formatIndianRupees(bookingDetails.payment.amount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <p className="font-medium">{bookingDetails.payment.paymentMethod}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar or actions */}
          <div className="flex flex-col gap-4 animate-fade-in">
            <Button className="bg-palette-orange hover:bg-palette-teal text-white font-bold py-3 transition-transform duration-200 hover:scale-105" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
            
            {/* Action Buttons */}
            <Card>
              <CardContent className="space-y-3 p-4">
                <Button 
                  onClick={handleDownloadReceipt}
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Receipt
                </Button>
                <Button 
                  onClick={handleSendEmail}
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email Confirmation
                </Button>
                <Button 
                  onClick={() => navigate('/')}
                  className="w-full bg-palette-orange hover:bg-palette-orange/90"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </CardContent>
            </Card>

            {/* Important Information */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <h3 className="font-medium text-blue-900 mb-2">Important Information</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Keep this confirmation for your records</li>
                  <li>• Contact us 24/7 for any changes</li>
                  <li>• Check-in details will be sent separately</li>
                  <li>• Travel documents required at check-in</li>
                </ul>
              </CardContent>
            </Card>

            {/* Support Contact */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium text-gray-900 mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Our customer support team is available 24/7 to assist you.
                </p>
                <div className="text-sm text-gray-600">
                  <p>📞 +91 98765 43210</p>
                  <p>📧 support@aventra.com</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <style>{`
          .animate-pop-in { animation: pop-in 0.6s cubic-bezier(.23,1.02,.57,1.01); }
          @keyframes pop-in { 0% { transform: scale(0.7); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
          .animate-checkmark { animation: checkmark 0.7s cubic-bezier(.23,1.02,.57,1.01); }
          @keyframes checkmark { 0% { stroke-dasharray: 0 100; opacity: 0; } 100% { stroke-dasharray: 100 0; opacity: 1; } }
          .animate-fade-in { animation: fade-in 0.7s ease; }
          @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        `}</style>
      </div>
    </div>
  );
};

export default ConfirmationPage; 