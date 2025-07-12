import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, CheckCircle, ArrowLeft, Star, Users, Plane, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';

interface InsurancePlan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  coverage: {
    medical: string;
    trip: string;
    baggage: string;
    cancellation: string;
  };
  recommended?: boolean;
}

const InsurancePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId, totalAmount, userId } = (location.state || {}) as { 
    bookingId: number; 
    totalAmount: number; 
    userId: number; 
  };

  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);

  const insurancePlans: InsurancePlan[] = [
    {
      id: 'basic',
      name: 'Basic Coverage',
      description: 'Essential protection for your trip',
      price: 25,
      features: [
        'Medical expenses up to ₹5,00,000',
        'Trip cancellation coverage',
        'Lost baggage protection',
        '24/7 emergency assistance'
      ],
      coverage: {
        medical: '₹5,00,000',
        trip: '₹2,00,000',
        baggage: '₹50,000',
        cancellation: '₹1,00,000'
      }
    },
    {
      id: 'comprehensive',
      name: 'Comprehensive Coverage',
      description: 'Complete protection for peace of mind',
      price: 45,
      features: [
        'Medical expenses up to ₹10,00,000',
        'Trip cancellation & interruption',
        'Lost baggage & personal effects',
        'Flight delay compensation',
        'Emergency medical evacuation',
        '24/7 worldwide assistance'
      ],
      coverage: {
        medical: '₹10,00,000',
        trip: '₹5,00,000',
        baggage: '₹1,00,000',
        cancellation: '₹2,50,000'
      },
      recommended: true
    },
    {
      id: 'premium',
      name: 'Premium Coverage',
      description: 'Ultimate protection with luxury benefits',
      price: 75,
      features: [
        'Medical expenses up to ₹25,00,000',
        'Trip cancellation & interruption',
        'Lost baggage & personal effects',
        'Flight delay & missed connection',
        'Emergency medical evacuation',
        'Pre-existing condition coverage',
        'Adventure sports coverage',
        '24/7 concierge service'
      ],
      coverage: {
        medical: '₹25,00,000',
        trip: '₹10,00,000',
        baggage: '₹2,50,000',
        cancellation: '₹5,00,000'
      }
    }
  ];

  const formatIndianRupees = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handleProceedToPayment = () => {
    if (!selectedPlan) {
      toast.error('Please select an insurance plan');
      return;
    }

    if (!agreedToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    const selectedPlanData = insurancePlans.find(plan => plan.id === selectedPlan);
    if (!selectedPlanData) {
      toast.error('Invalid plan selected');
      return;
    }

    // Navigate to payment with insurance details
    navigate('/payment', {
      state: {
        bookingId: bookingId,
        totalAmount: totalAmount + selectedPlanData.price,
        userId: userId,
        insurance: {
          planId: selectedPlan,
          planName: selectedPlanData.name,
          price: selectedPlanData.price
        }
      }
    });
  };

  const handleSkipInsurance = () => {
    navigate('/payment', {
      state: {
        bookingId: bookingId,
        totalAmount: totalAmount,
        userId: userId
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
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
                  key={plan.id} 
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    selectedPlan === plan.id 
                      ? 'ring-2 ring-palette-teal border-palette-teal' 
                      : 'hover:border-gray-300'
                  } ${plan.recommended ? 'border-2 border-palette-orange' : ''}`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <Shield className="w-5 h-5 text-palette-teal" />
                          <span>{plan.name}</span>
                          {plan.recommended && (
                            <span className="bg-palette-orange text-white text-xs px-2 py-1 rounded-full">
                              Recommended
                            </span>
                          )}
                        </CardTitle>
                        <p className="text-gray-600 mt-1">{plan.description}</p>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Features */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">What's Included</h4>
                        <ul className="space-y-2">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Coverage Details */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Coverage Limits</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Medical Expenses</span>
                            <span className="text-sm font-medium">{plan.coverage.medical}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Trip Cancellation</span>
                            <span className="text-sm font-medium">{plan.coverage.cancellation}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Baggage Loss</span>
                            <span className="text-sm font-medium">{plan.coverage.baggage}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Trip Interruption</span>
                            <span className="text-sm font-medium">{plan.coverage.trip}</span>
                          </div>
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
            <Card>
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
                      <span>{formatIndianRupees(insurancePlans.find(p => p.id === selectedPlan)?.price || 0)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>{formatIndianRupees(totalAmount + (insurancePlans.find(p => p.id === selectedPlan)?.price || 0))}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                className="w-full bg-palette-orange hover:bg-palette-orange/90"
                onClick={handleProceedToPayment}
                disabled={!selectedPlan || !agreedToTerms}
              >
                Continue with Insurance
              </Button>
              <Button
                variant="outline"
                className="w-full"
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