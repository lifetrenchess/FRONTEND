import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, CreditCard, ArrowLeft, Shield, IndianRupee, Smartphone, Building2, AlertCircle, Loader2, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { getCurrentUserFromStorage } from '@/lib/auth';
import { getApiUrl } from '@/lib/apiConfig';
import styles from '@/styles/PaymentPage.module.css';

// Extend Window interface for Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentFormData {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardholderName: string;
  upiId: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
}

interface RazorpayOrderResponse {
  orderId: string;
  currency: string;
  amount: number;
  keyId: string;
}

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  let { bookingId, totalAmount, userId, insurance, packageData } = (location.state || {}) as {
    bookingId?: number;
    totalAmount?: number;
    userId?: number;
    insurance?: any;
    packageData?: any;
  };

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'upi' | 'netbanking' | 'razorpay'>('card');
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    upiId: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
  });
  const [errors, setErrors] = useState<Partial<PaymentFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Get current user
  const currentUser = getCurrentUserFromStorage();

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => setRazorpayLoaded(false);
    document.body.appendChild(script);
    return () => {
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  // Fallback for missing data
  useEffect(() => {
    if (bookingId && userId && totalAmount) {
      localStorage.setItem('paymentInfo', JSON.stringify({ bookingId, userId, totalAmount, insurance, packageData }));
    }
  }, [bookingId, userId, totalAmount, insurance, packageData]);

  if (!bookingId || !userId || !totalAmount) {
    const stored = localStorage.getItem('paymentInfo');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        bookingId = data.bookingId;
        userId = data.userId;
        totalAmount = data.totalAmount;
        insurance = data.insurance;
        packageData = data.packageData;
      } catch {}
    }
  }

  if (!bookingId || !userId || !totalAmount) {
    toast.error('Payment details missing. Please start your booking again.');
    navigate('/');
    return null;
  }

  const formatIndianRupees = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const validateForm = () => {
    const newErrors: Partial<PaymentFormData> = {};

    if (selectedPaymentMethod === 'card') {
      if (!formData.cardNumber || formData.cardNumber.length < 16) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      }
      if (!formData.expiryMonth || !formData.expiryYear) {
        newErrors.expiryMonth = 'Please enter expiry date';
      }
      if (!formData.cvv || formData.cvv.length < 3) {
        newErrors.cvv = 'Please enter a valid CVV';
      }
      if (!formData.cardholderName.trim()) {
        newErrors.cardholderName = 'Please enter cardholder name';
      }
    } else if (selectedPaymentMethod === 'upi') {
      if (!formData.upiId || !formData.upiId.includes('@')) {
        newErrors.upiId = 'Please enter a valid UPI ID (e.g., name@bank)';
      }
    } else if (selectedPaymentMethod === 'netbanking') {
      if (!formData.bankName.trim()) {
        newErrors.bankName = 'Please select a bank';
      }
      if (!formData.accountNumber || formData.accountNumber.length < 10) {
        newErrors.accountNumber = 'Please enter a valid account number';
      }
      if (!formData.ifscCode || formData.ifscCode.length !== 11) {
        newErrors.ifscCode = 'Please enter a valid 11-character IFSC code';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof PaymentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleRazorpayPayment = async () => {
    if (!razorpayLoaded) {
      toast.error('Payment gateway is loading. Please wait a moment and try again.');
      return;
    }

    setIsLoading(true);

    try {
      // Create payment order
      const orderRequest = {
        userId: userId,
        bookingId: bookingId,
        amount: totalAmount,
        currency: 'INR',
        paymentMethod: 'RAZORPAY'
      };

      const response = await fetch(getApiUrl('BOOKING_SERVICE', '/payments'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderRequest),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment order');
      }

      const orderData: RazorpayOrderResponse = await response.json();

      // Initialize Razorpay
      const options = {
        key: orderData.keyId,
        amount: orderData.amount * 100, // Convert to paisa
        currency: orderData.currency,
        name: 'Aventra Travel',
        description: `Booking #${bookingId}`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch(getApiUrl('BOOKING_SERVICE', '/payments/verify'), {
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

            if (verifyResponse.ok) {
              toast.success('Payment successful!');
              navigate('/confirmation', { 
                state: { 
                  bookingId, 
                  totalAmount, 
                  userId,
                  insurance,
                  packageData,
                  razorpayPaymentId: response.razorpay_payment_id 
                } 
              });
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            toast.error('Payment verification failed. Please contact support.');
            console.error('Payment verification error:', error);
          }
        },
        prefill: {
          name: currentUser?.fullName || '',
          email: currentUser?.email || '',
        },
        theme: {
          color: '#01E8B2'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment initialization failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayNow = async () => {
    if (selectedPaymentMethod === 'razorpay') {
      await handleRazorpayPayment();
      return;
    }

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsLoading(true);
    
    // For demo purposes, use mock payment for other methods
    setTimeout(() => {
      navigate('/mock-payment', { state: { bookingId, totalAmount, userId, insurance, packageData } });
    }, 100);
  };

  const banks = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Punjab National Bank', 'Bank of Baroda', 'Canara Bank', 'Union Bank of India'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-palette-cream via-white to-palette-cream/30 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4 text-palette-teal hover:text-palette-teal/80"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Booking
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 text-center">Complete Your Payment</h1>
          <p className="text-gray-600 text-center mt-2">Choose your preferred payment method</p>
        </div>

        {/* Payment Summary */}
        <Card className="mb-6 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-palette-teal/5 to-palette-orange/5">
            <CardTitle className="text-xl font-bold text-gray-900">Payment Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Booking ID:</span>
                <span className="font-semibold text-gray-900">#{bookingId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold text-gray-900">{formatIndianRupees(totalAmount)}</span>
              </div>
              {insurance && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Insurance:</span>
                  <span className="font-semibold text-gray-900">{insurance.planName} (₹{insurance.price})</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between items-center text-lg">
                <span className="font-bold text-gray-900">Total:</span>
                <span className="font-bold text-palette-teal">{formatIndianRupees(totalAmount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="mb-6 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Select Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Button
                variant={selectedPaymentMethod === 'card' ? 'default' : 'outline'}
                onClick={() => setSelectedPaymentMethod('card')}
                className={`h-12 ${selectedPaymentMethod === 'card' ? 'bg-palette-teal text-white' : 'border-palette-teal text-palette-teal hover:bg-palette-teal hover:text-white'}`}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Credit/Debit Card
              </Button>
              <Button
                variant={selectedPaymentMethod === 'upi' ? 'default' : 'outline'}
                onClick={() => setSelectedPaymentMethod('upi')}
                className={`h-12 ${selectedPaymentMethod === 'upi' ? 'bg-palette-teal text-white' : 'border-palette-teal text-palette-teal hover:bg-palette-teal hover:text-white'}`}
              >
                <Smartphone className="w-4 h-4 mr-2" />
                UPI
              </Button>
              <Button
                variant={selectedPaymentMethod === 'netbanking' ? 'default' : 'outline'}
                onClick={() => setSelectedPaymentMethod('netbanking')}
                className={`h-12 ${selectedPaymentMethod === 'netbanking' ? 'bg-palette-teal text-white' : 'border-palette-teal text-palette-teal hover:bg-palette-teal hover:text-white'}`}
              >
                <Building2 className="w-4 h-4 mr-2" />
                Net Banking
              </Button>
              <Button
                variant={selectedPaymentMethod === 'razorpay' ? 'default' : 'outline'}
                onClick={() => setSelectedPaymentMethod('razorpay')}
                className={`h-12 ${selectedPaymentMethod === 'razorpay' ? 'bg-blue-600 text-white' : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'}`}
              >
                <Zap className="w-4 h-4 mr-2" />
                Razorpay
              </Button>
            </div>

            {/* Payment Forms */}
            {selectedPaymentMethod === 'card' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <img src="/src/assets/Visa.png" alt="Visa" className="h-8" />
                  <img src="/src/assets/mastercard.png" alt="Mastercard" className="h-8" />
                  <img src="/src/assets/amex.png" alt="AmericanExpress" className="h-8" />
                </div>
                
                <div>
                  <Label htmlFor="cardholderName">Cardholder Name</Label>
                  <Input
                    id="cardholderName"
                    value={formData.cardholderName}
                    onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                    placeholder="Name on card"
                    className={errors.cardholderName ? 'border-red-500' : ''}
                  />
                  {errors.cardholderName && <p className="text-red-500 text-sm mt-1">{errors.cardholderName}</p>}
                </div>

                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value.replace(/\D/g, '').slice(0, 16))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={16}
                    className={errors.cardNumber ? 'border-red-500' : ''}
                  />
                  {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="expiryMonth">Month</Label>
                    <Input
                      id="expiryMonth"
                      value={formData.expiryMonth}
                      onChange={(e) => handleInputChange('expiryMonth', e.target.value.replace(/\D/g, ''))}
                      placeholder="MM"
                      maxLength={2}
                      className={errors.expiryMonth ? 'border-red-500' : ''}
                    />
                  </div>
                  <div>
                    <Label htmlFor="expiryYear">Year</Label>
                    <Input
                      id="expiryYear"
                      value={formData.expiryYear}
                      onChange={(e) => handleInputChange('expiryYear', e.target.value.replace(/\D/g, ''))}
                      placeholder="YY"
                      maxLength={2}
                      className={errors.expiryYear ? 'border-red-500' : ''}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                      placeholder="123"
                      maxLength={4}
                      className={errors.cvv ? 'border-red-500' : ''}
                    />
                  </div>
                </div>
                {(errors.expiryMonth || errors.expiryYear || errors.cvv) && (
                  <p className="text-red-500 text-sm">Please enter valid expiry date and CVV</p>
                )}
              </div>
            )}

            {selectedPaymentMethod === 'upi' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    value={formData.upiId}
                    onChange={(e) => handleInputChange('upiId', e.target.value)}
                    placeholder="name@bank"
                    className={errors.upiId ? 'border-red-500' : ''}
                  />
                  {errors.upiId && <p className="text-red-500 text-sm mt-1">{errors.upiId}</p>}
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    You'll be redirected to your UPI app to complete the payment
                  </p>
                </div>
              </div>
            )}

            {selectedPaymentMethod === 'netbanking' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bankName">Select Bank</Label>
                  <select
                    id="bankName"
                    value={formData.bankName}
                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                    className={`w-full p-3 border rounded-md ${errors.bankName ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Choose your bank</option>
                    {banks.map(bank => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>
                  {errors.bankName && <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>}
                </div>

                <div>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={formData.accountNumber}
                    onChange={(e) => handleInputChange('accountNumber', e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter account number"
                    className={errors.accountNumber ? 'border-red-500' : ''}
                  />
                  {errors.accountNumber && <p className="text-red-500 text-sm mt-1">{errors.accountNumber}</p>}
                </div>

                <div>
                  <Label htmlFor="ifscCode">IFSC Code</Label>
                  <Input
                    id="ifscCode"
                    value={formData.ifscCode}
                    onChange={(e) => handleInputChange('ifscCode', e.target.value.toUpperCase())}
                    placeholder="ABCD0001234"
                    maxLength={11}
                    className={errors.ifscCode ? 'border-red-500' : ''}
                  />
                  {errors.ifscCode && <p className="text-red-500 text-sm mt-1">{errors.ifscCode}</p>}
                </div>
              </div>
            )}

            {selectedPaymentMethod === 'razorpay' && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Click "Pay Now" to proceed with secure Razorpay payment gateway
                  </p>
                </div>
                <div className="text-sm text-gray-600">
                  <p>• Accepts all major credit/debit cards</p>
                  <p>• UPI payments (Google Pay, PhonePe, Paytm)</p>
                  <p>• Net banking from 50+ banks</p>
                  <p>• Wallets and other payment methods</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="mb-6 shadow-lg border-0 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-green-600" />
              <p className="text-sm text-green-800">
                Your payment is secured with bank-level encryption. We never store your card details.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Pay Button */}
        <Button 
          onClick={handlePayNow} 
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-palette-teal to-palette-teal/90 hover:from-palette-teal/90 hover:to-palette-teal text-white font-bold py-4 rounded-lg transition-all duration-200 ease-in-out hover:scale-[1.02] shadow-lg hover:shadow-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          size="lg"
        >
          {isLoading ? (
            <div className="flex items-center space-x-3">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing Payment...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <IndianRupee className="w-5 h-5" />
              <span>Pay {formatIndianRupees(totalAmount)}</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PaymentPage; 