import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Users, CreditCard, ArrowLeft } from 'lucide-react';
import { fetchPackageById, TravelPackageDto } from '@/lib/packagesApi';

const BookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState<TravelPackageDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    numberOfPeople: 1,
    startDate: '',
    endDate: '',
    specialRequests: ''
  });

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    fetchPackageById(Number(id))
      .then((data) => {
        setPkg(data);
        setLoading(false);
      })
      .catch(() => {
        navigate('/');
      });
  }, [id, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const calculateTotalPrice = () => {
    if (!pkg) return 0;
    return pkg.price * bookingData.numberOfPeople;
  };

  const handleBooking = async () => {
    // TODO: Implement booking API call
    console.log('Booking data:', {
      packageId: pkg?.packageId,
      ...bookingData,
      totalPrice: calculateTotalPrice()
    });
    
    // For now, just show success message
    alert('Booking submitted successfully! You will receive a confirmation email shortly.');
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-palette-teal mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-4">Package Not Found</h2>
        <Button onClick={() => navigate('/')} className="bg-palette-teal text-white">
          Go Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <Button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-palette-teal mb-6 hover:underline"
          variant="ghost"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Package Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-palette-teal" />
                Package Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{pkg.title}</h3>
                  <p className="text-gray-600">{pkg.description}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold">{pkg.duration} days</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Price per person:</span>
                  <span className="font-semibold text-palette-teal">₹{pkg.price?.toLocaleString()}</span>
                </div>
                
                {pkg.highlights && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Highlights:</h4>
                    <p className="text-gray-600 text-sm">{pkg.highlights}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Booking Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-palette-teal" />
                Booking Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="numberOfPeople">Number of People</Label>
                  <Input
                    id="numberOfPeople"
                    name="numberOfPeople"
                    type="number"
                    min="1"
                    value={bookingData.numberOfPeople}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={bookingData.startDate}
                    onChange={handleInputChange}
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={bookingData.endDate}
                    onChange={handleInputChange}
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                  <textarea
                    id="specialRequests"
                    name="specialRequests"
                    value={bookingData.specialRequests}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-palette-teal focus:border-transparent"
                    rows={3}
                    placeholder="Any special requests or dietary requirements..."
                  />
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Price per person:</span>
                    <span>₹{pkg.price?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Number of people:</span>
                    <span>{bookingData.numberOfPeople}</span>
                  </div>
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>Total Price:</span>
                    <span className="text-palette-teal">₹{calculateTotalPrice().toLocaleString()}</span>
                  </div>
                </div>

                <Button 
                  type="button"
                  onClick={handleBooking}
                  className="w-full bg-palette-teal hover:bg-palette-teal/90 text-white py-3"
                >
                  Confirm Booking
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingPage; 