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
        <Card className="shadow-xl bg-gradient-to-br from-palette-teal/10 to-palette-orange/10 border-0 animate-pop-in">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-palette-teal">Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Enhanced Package Details */}
            {packageData && (
              <div className="flex flex-col md:flex-row gap-6 items-center bg-white/80 rounded-xl p-4 shadow-md mb-4 animate-pop-in">
                {packageData.mainImage && (
                  <img src={packageData.mainImage} alt={packageData.title} className="w-40 h-28 object-cover rounded-lg border shadow" />
                )}
                <div className="flex-1">
                  <div className="font-bold text-xl text-palette-teal mb-1">{packageData.title}</div>
                  <div className="text-sm text-gray-600 mb-1">{packageData.destination} &bull; {packageData.duration} days</div>
                  {packageData.highlights && (
                    <div className="text-xs text-gray-700 mb-1"><span className="font-semibold">Highlights:</span> {packageData.highlights}</div>
                  )}
                  {packageData.description && (
                    <div className="text-xs text-gray-600 line-clamp-2">{packageData.description}</div>
                  )}
                </div>
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
            <div className="flex justify-between font-bold text-lg mt-4">
              <span>Total Amount:</span>
              <span className="shimmer-highlight">{formatIndianRupees(totalAmount)}</span>
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
        <style>{`
          .animate-pop-in { animation: pop-in 0.6s cubic-bezier(.23,1.02,.57,1.01); }
          @keyframes pop-in { 0% { transform: scale(0.7); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
          .shimmer-highlight {
            background: linear-gradient(90deg, #fffbe6 25%, #ffe0b2 50%, #fffbe6 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite linear;
            border-radius: 6px;
            padding: 0 8px;
          }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default BookingSummaryPage; 