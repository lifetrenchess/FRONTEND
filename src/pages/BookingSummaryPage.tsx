import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const BookingSummaryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId, totalAmount, userId, insurance, packageData } = (location.state || {}) as {
    bookingId: number;
    totalAmount: number;
    userId: number;
    insurance?: {
      planId: number;
      planName: string;
      price: number;
      insuranceId: number;
    };
    packageData?: any;
  };

  const formatIndianRupees = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-palette-cream via-white to-palette-cream/30 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-palette-teal">Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Package Details */}
            {packageData && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Package</h3>
                <div className="flex items-center space-x-4">
                  {packageData.mainImage && (
                    <img src={packageData.mainImage} alt={packageData.title} className="w-24 h-16 object-cover rounded-lg" />
                  )}
                  <div>
                    <div className="font-bold">{packageData.title}</div>
                    <div className="text-sm text-gray-600">{packageData.duration} days</div>
                  </div>
                </div>
              </div>
            )}
            {/* Insurance Details */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Insurance</h3>
              {insurance ? (
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-palette-orange">{insurance.planName}</span>
                  <span className="text-gray-600">(₹{insurance.price})</span>
                </div>
              ) : (
                <span className="text-gray-500">No insurance selected</span>
              )}
            </div>
            <Separator />
            {/* Total */}
            <div className="flex justify-between font-bold text-lg">
              <span>Total Amount:</span>
              <span>{formatIndianRupees(totalAmount)}</span>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mt-6">
              <Button
                className="bg-palette-orange hover:bg-palette-orange/90 flex-1"
                onClick={() => {
                  navigate('/payment', {
                    state: { bookingId, totalAmount, userId, insurance }
                  });
                }}
              >
                Confirm & Proceed to Payment
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate(-1)}
              >
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingSummaryPage; 