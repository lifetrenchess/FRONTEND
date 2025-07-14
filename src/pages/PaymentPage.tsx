import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, Shield, CheckCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface CardDetails {
  cardholderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

interface NetBankingDetails {
  bankName: string;
  accountNumber: string;
}

interface RazorpayOrderResponse {
  orderId: string;
  currency: string;
  amount: number;
  keyId: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

import { getApiUrl } from '@/lib/apiConfig';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId, totalAmount, userId, insurance } = (location.state || {}) as { 
    bookingId: number; 
    totalAmount: number; 
    userId: number; 
    insurance?: {
      planId: number;
      planName: string;
      price: number;
      insuranceId: number;
    };
  };

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('CREDIT_DEBIT_CARD');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardholderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });

  const [netBankingDetails, setNetBankingDetails] = useState<NetBankingDetails>({
    bankName: '',
    accountNumber: '',
  });

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'CREDIT_DEBIT_CARD',
      name: 'Credit/Debit Card',
      icon: <CreditCard className="w-5 h-5" />,
      description: 'Pay securely with your card'
    },
    {
      id: 'NET_BANKING',
      name: 'Net Banking',
      icon: <Shield className="w-5 h-5" />,
      description: 'Pay through your bank account'
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

  useEffect(() => {
    if (!bookingId || totalAmount === 0 || userId === null) {
      toast.error('Payment details are missing. Redirecting to home.');
      navigate('/');
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => console.log('Razorpay SDK loaded successfully');
    script.onerror = () => {
      console.error('Failed to load Razorpay SDK');
      setError('Failed to load payment gateway. Please try again.');
      toast.error('Payment gateway unavailable.');
    };
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, [bookingId, totalAmount, userId, navigate]);

  const handleCardDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleNetBankingDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNetBankingDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleCompletePayment = async () => {
    setIsLoading(true);
    setError(null);

    if (selectedPaymentMethod === 'CREDIT_DEBIT_CARD' && (!cardDetails.cardNumber || !cardDetails.cardholderName || !cardDetails.expiryMonth || !cardDetails.expiryYear || !cardDetails.cvv)) {
      toast.error('Please fill in all card details.');
      setIsLoading(false);
      return;
    }
    if (selectedPaymentMethod === 'NET_BANKING' && (!netBankingDetails.bankName || !netBankingDetails.accountNumber)) {
      toast.error('Please fill in all net banking details.');
      setIsLoading(false);
      return;
    }

    try {
      // Create payment order
      const paymentData = {
        amount: totalAmount,
        currency: 'INR',
        bookingId: bookingId,
        userId: userId,
        paymentMethod: selectedPaymentMethod,
      };

      const orderResponse = await fetch(getApiUrl('PAYMENT_SERVICE', ''), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.message || 'Failed to create payment order');
      }

      const orderData = await orderResponse.json();
      console.log('Payment order created:', orderData);

      // Initialize Razorpay
      const options = {
        key: orderData.keyId, // Use the keyId returned from backend
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Aventra Travel',
        description: `Payment for Booking #${bookingId}`,
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verificationResult = await fetch(getApiUrl('PAYMENT_SERVICE', '/verifyPayment'), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verificationResult.ok) {
              throw new Error('Payment verification failed');
            }

            const verificationData = await verificationResult.json();
            console.log('Payment verified:', verificationData);

            // Navigate to confirmation page
            navigate('/confirmation', {
              state: {
                bookingId: bookingId,
                paymentId: response.razorpay_payment_id,
                amount: totalAmount,
              },
            });
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: 'Traveler Name', // Use default values since userData is not available
          email: 'traveler@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#1B9AAA',
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(`Payment failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Payment</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Package Details</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-palette-orange" />
              <span>Confirm & Pay</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-gray-400" />
              <span>Confirmation</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Choose Payment Method</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedPaymentMethod}
                  onValueChange={setSelectedPaymentMethod}
                  className="space-y-4"
                >
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center space-x-3">
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label htmlFor={method.id} className="flex items-center space-x-3 cursor-pointer">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {method.icon}
                        </div>
                        <div>
                          <div className="font-medium">{method.name}</div>
                          <div className="text-sm text-gray-500">{method.description}</div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Payment Details Form */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedPaymentMethod === 'CREDIT_DEBIT_CARD' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardholderName">Cardholder Name</Label>
                      <Input
                        id="cardholderName"
                        name="cardholderName"
                        value={cardDetails.cardholderName}
                        onChange={handleCardDetailsChange}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        value={cardDetails.cardNumber}
                        onChange={handleCardDetailsChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="expiryMonth">Month</Label>
                        <Input
                          id="expiryMonth"
                          name="expiryMonth"
                          value={cardDetails.expiryMonth}
                          onChange={handleCardDetailsChange}
                          placeholder="MM"
                          maxLength={2}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="expiryYear">Year</Label>
                        <Input
                          id="expiryYear"
                          name="expiryYear"
                          value={cardDetails.expiryYear}
                          onChange={handleCardDetailsChange}
                          placeholder="YY"
                          maxLength={2}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          name="cvv"
                          value={cardDetails.cvv}
                          onChange={handleCardDetailsChange}
                          placeholder="123"
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedPaymentMethod === 'NET_BANKING' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        name="bankName"
                        value={netBankingDetails.bankName}
                        onChange={handleNetBankingDetailsChange}
                        placeholder="Select your bank"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        name="accountNumber"
                        value={netBankingDetails.accountNumber}
                        onChange={handleNetBankingDetailsChange}
                        placeholder="Enter your account number"
                        required
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-green-800">Secure Payment</h3>
                    <p className="text-sm text-green-700 mt-1">
                      Your payment information is encrypted and secure. We use industry-standard SSL encryption to protect your data.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Booking ID:</span>
                  <span className="font-medium">#{bookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-medium">{formatIndianRupees(totalAmount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>{formatIndianRupees(totalAmount)}</span>
                </div>
              </CardContent>
            </Card>

            <Button
              className="w-full bg-palette-orange hover:bg-palette-orange/90"
              onClick={handleCompletePayment}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : `Pay ${formatIndianRupees(totalAmount)}`}
            </Button>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage; 