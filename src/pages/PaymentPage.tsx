import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, CreditCard, ArrowLeft, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { getCurrentUserFromStorage } from '@/lib/auth';
import { getApiUrl } from '@/lib/apiConfig';
import styles from '@/styles/PaymentPage.module.css';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  let { bookingId, totalAmount, userId } = (location.state || {}) as {
    bookingId?: number;
    totalAmount?: number;
    userId?: number;
  };

  // Minimal localStorage fallback for refreshes
  useEffect(() => {
    if (bookingId && userId && totalAmount) {
      localStorage.setItem('paymentInfo', JSON.stringify({ bookingId, userId, totalAmount }));
    }
  }, [bookingId, userId, totalAmount]);

  if (!bookingId || !userId || !totalAmount) {
    const stored = localStorage.getItem('paymentInfo');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        bookingId = data.bookingId;
        userId = data.userId;
        totalAmount = data.totalAmount;
      } catch {}
    }
  }

  if (!bookingId || !userId || !totalAmount) {
    toast.error('Payment details missing. Please start your booking again.');
    navigate('/');
    return null;
  }

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const formatIndianRupees = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handlePayNow = async () => {
    setIsLoading(true);
    try {
      const paymentData = {
        amount: totalAmount,
        currency: 'INR',
        bookingId,
        userId,
      };
      const orderResponse = await fetch(getApiUrl('PAYMENT_SERVICE', ''), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
      });
      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.message || 'Failed to create payment order');
      }
      const orderData = await orderResponse.json();
      const options = {
        key: orderData.keyId,
        amount: orderData.amount * 100,
        currency: orderData.currency,
        name: 'Aventra Travel',
        description: `Payment for Booking #${bookingId}`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            const verificationResult = await fetch(getApiUrl('PAYMENT_SERVICE', '/verifyPayment'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            if (!verificationResult.ok) throw new Error('Payment verification failed');
            localStorage.removeItem('paymentInfo');
            navigate('/confirmation', {
              state: {
                bookingId,
                paymentId: response.razorpay_payment_id,
                amount: totalAmount,
              },
            });
          } catch (error) {
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: 'Traveler',
          email: 'traveler@example.com',
          contact: '9999999999',
        },
        theme: { color: '#1B9AAA' },
      };
      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      toast.error(`Payment failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.paymentPageContainer}>
      <div className={styles.paymentPageContent}>
        <div className={styles.header}>
          <Button variant="ghost" onClick={() => navigate(-1)} className={styles.backButton}>
            <ArrowLeft className={styles.arrowLeft} />
            Back to Booking
          </Button>
          <h1 className={styles.pageTitle}>Complete Your Payment</h1>
        </div>
        <div className={styles.summaryCardWrapper}>
          <Card className={styles.summaryCard}>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.summaryItem}><span>Booking ID:</span> <span>#{bookingId}</span></div>
              <div className={styles.summaryItem}><span>Amount:</span> <span>{formatIndianRupees(totalAmount)}</span></div>
              <Separator />
              <div className={styles.summaryTotal}><span>Total:</span> <span>{formatIndianRupees(totalAmount)}</span></div>
            </CardContent>
          </Card>
        </div>
        <Button className={styles.payButton} onClick={handlePayNow} disabled={isLoading}>
          {isLoading ? 'Processing...' : `Pay ${formatIndianRupees(totalAmount)}`}
        </Button>
        <Card className={styles.securityCard}>
          <CardContent>
            <div className={styles.securityNotice}><Shield className={styles.securityIcon} /> Your payment is encrypted and secure.</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentPage; 