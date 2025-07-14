import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, CheckCircle, ArrowLeft, Star, Users, Plane, Heart, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { fetchInsurancePackages, selectInsuranceForBooking, InsurancePlan } from '@/lib/insuranceApi';

const InsurancePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId, totalAmount, userId } = (location.state || {}) as { 
    bookingId: number; 
    totalAmount: number; 
    userId: number; 
  };

  const [insurancePlans, setInsurancePlans] = useState<InsurancePlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch insurance packages from backend on component mount
  useEffect(() => {
    const loadInsurancePackages = async () => {
      try {
        setLoading(true);
        const packages = await fetchInsurancePackages();
        setInsurancePlans(packages);
        setError(null);
      } catch (err) {
        console.error('Failed to load insurance packages:', err);
        setError('Failed to load insurance packages. Please try again.');
        toast.error('Failed to load insurance packages');
      } finally {
        setLoading(false);
      }
    };

    loadInsurancePackages();
  }, []);

  const formatIndianRupees = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handleProceedToSummary = async () => {
    if (!selectedPlan) {
      toast.error('Please select an insurance plan');
      return;
    }

    if (!agreedToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    const selectedPlanData = insurancePlans.find(plan => plan.insuranceId === selectedPlan);
    if (!selectedPlanData) {
      toast.error('Invalid plan selected');
      return;
    }

    try {
      // Create insurance selection in backend
      const insuranceSelection = await selectInsuranceForBooking(
        selectedPlan,
        userId,
        bookingId
      );

      toast.success('Insurance plan selected successfully!');

      // Navigate to booking summary with insurance details
      navigate('/booking-summary', {
        state: {
          bookingId: bookingId,
          totalAmount: totalAmount + selectedPlanData.price,
          userId: userId,
          insurance: {
            planId: selectedPlan,
            planName: selectedPlanData.packageType,
            price: selectedPlanData.price,
            insuranceId: insuranceSelection.insuranceId
          }
        }
      });
    } catch (error) {
      console.error('Failed to select insurance:', error);
      toast.error('Failed to select insurance plan. Please try again.');
    }
  };

  const handleSkipInsurance = () => {
    navigate('/booking-summary', {
      state: {
        bookingId: bookingId,
        totalAmount: totalAmount,
        userId: userId
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-palette-cream via-white to-palette-cream/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-palette-teal mx-auto mb-4" />
          <p className="text-gray-600">Loading insurance packages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-palette-cream via-white to-palette-cream/30 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-palette-orange mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to Load Insurance</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-palette-teal hover:bg-palette-teal/90">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-palette-cream via-white to-palette-cream/30 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center text-palette-teal hover:text-palette-teal/80"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Booking
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Travel Insurance</h1>
          <p className="text-gray-600">Protect your journey with comprehensive travel insurance coverage</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Insurance Plans */}
            <div className="space-y-6">
              {insurancePlans.map((plan) => (
                <Card 
                  key={plan.insuranceId} 
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg backdrop-blur-md bg-white/30 border border-white/40 shadow-xl ${
                    selectedPlan === plan.insuranceId 
                      ? 'ring-2 ring-palette-teal border-palette-teal' 
                      : 'hover:border-gray-300'
                  } ${plan.packageType === 'Medium' ? 'border-2 border-palette-orange' : ''}`}
                  style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)', borderRadius: '1.25rem' }}
                  onClick={() => setSelectedPlan(plan.insuranceId)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <Shield className="w-5 h-5 text-palette-teal" />
                          <span>{plan.packageType} Coverage</span>
                          {plan.packageType === 'Medium' && (
                            <span className="bg-palette-orange text-white text-xs px-2 py-1 rounded-full">
                              Recommended
                            </span>
                          )}
                        </CardTitle>
                        <p className="text-gray-600 mt-1">{plan.coverageDetails}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-palette-teal">
                          {formatIndianRupees(plan.price)}
                        </div>
                        <div className="text-sm text-gray-500">per person</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Provider Info */}
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Shield className="w-4 h-4" />
                        <span>Provider: {plan.provider}</span>
                      </div>
                      
                      {/* Coverage Summary */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Coverage Summary</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-700 leading-relaxed">{plan.coverageDetails}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Terms and Conditions */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agreeTerms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  />
                  <Label htmlFor="agreeTerms" className="text-sm leading-relaxed">
                    I have read and agree to the{' '}
                    <a href="/insurance-terms" target="_blank" rel="noopener noreferrer" className="text-palette-teal hover:underline">
                      Insurance Terms & Conditions
                    </a>{' '}
                    and understand that this insurance coverage is provided by our trusted insurance partner.
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Why Insurance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Why Travel Insurance?</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Heart className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Medical Protection</h4>
                    <p className="text-xs text-gray-600">Coverage for unexpected medical expenses abroad</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Plane className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Trip Protection</h4>
                    <p className="text-xs text-gray-600">Coverage for trip cancellation and delays</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">24/7 Support</h4>
                    <p className="text-xs text-gray-600">Round-the-clock emergency assistance</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card className="backdrop-blur-md bg-white/30 border border-white/40 shadow-xl" style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)', borderRadius: '1.25rem' }}>
              <CardHeader>
                <CardTitle>Insurance Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Booking Amount:</span>
                  <span>{formatIndianRupees(totalAmount)}</span>
                </div>
                {selectedPlan && (
                  <>
                    <div className="flex justify-between">
                      <span>Insurance:</span>
                      <span>{formatIndianRupees(insurancePlans.find(p => p.insuranceId === selectedPlan)?.price || 0)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>{formatIndianRupees(totalAmount + (insurancePlans.find(p => p.insuranceId === selectedPlan)?.price || 0))}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                className="w-full bg-palette-orange hover:bg-palette-orange/90 backdrop-blur-md bg-white/30 border border-white/40 shadow-lg"
                style={{ boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.12)', borderRadius: '0.75rem' }}
                onClick={handleProceedToSummary}
                disabled={!selectedPlan || !agreedToTerms}
              >
                Continue with Insurance
              </Button>
              <Button
                variant="outline"
                className="w-full backdrop-blur-md bg-white/30 border border-white/40 shadow"
                style={{ borderRadius: '0.75rem' }}
                onClick={handleSkipInsurance}
              >
                Skip Insurance
              </Button>
            </div>

            {/* Trust Indicators */}
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="flex justify-center space-x-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-green-700">
                    Trusted by 50,000+ travelers
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsurancePage; 