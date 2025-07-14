import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getCurrentUserFromStorage } from '@/lib/auth';

const BookingSummaryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  let { bookingId, totalAmount, userId, insurance, packageData } = (location.state || {}) as {
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
  if (!userId) {
    const user = getCurrentUserFromStorage();
    userId = user?.userId;
  }

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
              <div className="space-y-2">
                <h3 className="font-semibold text-lg mb-2">Package Details</h3>
                <div className="flex items-center space-x-4">
                  {packageData.mainImage && (
                    <img src={packageData.mainImage} alt={packageData.title} className="w-28 h-20 object-cover rounded-lg border" />
                  )}
                  <div>
                    <div className="font-bold text-xl text-palette-teal">{packageData.title}</div>
                    <div className="text-sm text-gray-600">{packageData.destination} &bull; {packageData.duration} days</div>
                    {packageData.packageType && (
                      <div className="text-xs text-blue-700 mt-1">Type: {packageData.packageType}</div>
                    )}
                    {packageData.difficultyLevel && (
                      <div className="text-xs text-orange-700">Difficulty: {packageData.difficultyLevel}</div>
                    )}
                    {packageData.maxGroupSize && (
                      <div className="text-xs text-green-700">Max Group Size: {packageData.maxGroupSize}</div>
                    )}
                  </div>
                </div>
                {packageData.highlights && (
                  <div className="text-xs text-gray-700 mt-2"><span className="font-semibold">Highlights:</span> {packageData.highlights}</div>
                )}
                {packageData.description && (
                  <div className="text-xs text-gray-600 mt-1">{packageData.description}</div>
                )}
              </div>
            )}
            {/* Inclusions */}
            {packageData && (
              <div className="space-y-1">
                <h4 className="font-semibold text-md mb-1">What's Included</h4>
                <div className="flex flex-wrap gap-3 text-xs">
                  {packageData.flights && packageData.flights.length > 0 && (
                    <span className="flex items-center bg-blue-50 px-2 py-1 rounded"><span role="img" aria-label="flight">✈️</span> {packageData.flights.length} Flight{packageData.flights.length > 1 ? 's' : ''}</span>
                  )}
                  {packageData.hotels && packageData.hotels.length > 0 && (
                    <span className="flex items-center bg-orange-50 px-2 py-1 rounded"><span role="img" aria-label="hotel">🏨</span> {packageData.hotels.length} Hotel{packageData.hotels.length > 1 ? 's' : ''}</span>
                  )}
                  {packageData.sightseeingList && packageData.sightseeingList.length > 0 && (
                    <span className="flex items-center bg-purple-50 px-2 py-1 rounded"><span role="img" aria-label="sightseeing">📸</span> {packageData.sightseeingList.length} Sightseeing</span>
                  )}
                  {packageData.includeService && (
                    <span className="flex items-center bg-green-50 px-2 py-1 rounded">{packageData.includeService}</span>
                  )}
                </div>
              </div>
            )}
            {/* Insurance Details */}
            <div>
              <h4 className="font-semibold text-md mb-1">Insurance</h4>
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
                    state: { bookingId, totalAmount, userId, insurance, packageData }
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