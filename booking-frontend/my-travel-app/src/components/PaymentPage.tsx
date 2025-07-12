// src/pages/PaymentPage.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import styles from '../styles/PaymentPage.module.css';

// Your existing types for UI (CardDetails, NetBankingDetails, PaymentDTO) remain,
// but they are primarily for collecting UI input, not directly for Razorpay API calls.
import type { PaymentMethod, CardDetails, NetBankingDetails } from '../types'; // Keep this

import visalogo from '../assets/Visa.png';
import mastercardlogo from '../assets/mastercard.png'; // Corrected path assumption
import amexlogo from '../assets/amex.png';

// --- NEW: Interface for Razorpay Order response from your backend ---
// This should exactly match the RazorpayOrderResponse DTO you created in your Java backend
interface RazorpayOrderResponse {
  orderId: string;
  currency: string;
  amount: number; // This is the amount in INR (not paisa), for display purposes
  keyId: string; // Razorpay Key ID provided by your backend
}

// --- NEW: Declare Razorpay object on window for TypeScript ---
declare global {
  interface Window {
    Razorpay: any;
  }
}
// --- END NEW ---

// --- Define your Backend API Base URL ---
const API_BASE_URL = 'http://localhost:9003/api'; // This must match your Spring Boot application's URL
// --- END API Base URL ---

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { bookingId, totalAmount, userId } = (location.state || {}) as { bookingId: number; totalAmount: number; userId: number; };

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('CREDIT_DEBIT_CARD');
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

  const handleCardDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleNetBankingDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNetBankingDetails(prev => ({ ...prev, [name]: value }));
  };

  const formatIndianRupees = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // --- MODIFIED: useEffect to load Razorpay script dynamically and handle initial checks ---
  useEffect(() => {
    if (!bookingId || totalAmount === 0 || userId === null) {
      toast.error('Payment details are missing. Redirecting to home.');
      navigate('/'); // Redirect if essential data is missing
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
      document.body.removeChild(script);
    };
  }, [bookingId, totalAmount, userId, navigate]); // Added dependencies for useEffect
  // --- END MODIFIED ---

  // --- MODIFIED: handleCompletePayment to use Razorpay with your backend ---
  const handleCompletePayment = async () => {
    setIsLoading(true);
    setError(null);

    // Basic validation for UI fields if still desired, though Razorpay handles actual card processing
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
      // 1. Request Order ID from your backend (Spring Boot)
      // This payload is sent to your backend's @PostMapping("/api/payments")
      const orderRequestPayload = {
        amount: totalAmount, // Send total amount in INR
        currency: 'INR',
        bookingId: bookingId,
        userId: userId,
        paymentMethod: selectedPaymentMethod, // Send selected payment method to satisfy backend DTO validation
      };

      console.log("Requesting Razorpay order from backend:", orderRequestPayload);
      const orderResponse = await axios.post<RazorpayOrderResponse>(
        `${API_BASE_URL}/payments`, // THIS IS THE CORRECTED ENDPOINT for creating the Razorpay Order
        orderRequestPayload
      );

      const { orderId, currency, amount: razorpayAmount, keyId } = orderResponse.data; // Renamed 'amount' to 'razorpayAmount' to avoid conflict
      
      console.log("Received Razorpay order:", orderResponse.data);

      if (!keyId) {
        throw new Error("Razorpay Key ID not received from backend.");
      }

      // 2. Open Razorpay Checkout popup
      const options = {
        key: keyId, // Your Razorpay Key ID from backend. THIS IS CRUCIAL!
        amount: (razorpayAmount * 100), // Amount in paisa (Razorpay requires amount in smallest unit)
        currency: currency,
        name: 'Your Travel Company', // Your company name
        description: `Payment for Booking ID: ${bookingId}`, // Description for payment
        order_id: orderId, // Order ID obtained from your backend
        handler: async function (response: any) {
          // This function is called after successful payment on Razorpay's end
          console.log("Razorpay payment response:", response);
          try {
            // 3. Send verification details to your backend for security
            // This payload is sent to your backend's @PostMapping("/api/payments/verifyPayment")
            const verificationPayload = {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              bookingId: bookingId, // Pass bookingId to help backend identify and update the booking status
              userId: userId, // Pass userId if your backend needs it for verification or logging
            };
            console.log("Sending payment verification to backend:", verificationPayload);
            const verificationResult = await axios.post(
              `${API_BASE_URL}/payments/verifyPayment`, // Your backend verification endpoint
              verificationPayload
            );

            console.log("Payment verification successful:", verificationResult.data);
            toast.success('Payment successful! Redirecting to confirmation page.');
            navigate('/confirmation-page', { state: { bookingId: bookingId } });

          } catch (verifyError: any) {
            console.error('Payment verification failed:', verifyError);
            toast.error(`Payment verification failed: ${verifyError.response?.data || verifyError.message}. Please contact support.`);
            setError('Payment verification failed.');
            // Optionally navigate to a payment failed/error page
          } finally {
            setIsLoading(false);
          }
        },
        prefill: {
          // Optional: prefill customer details (recommended for better UX)
          name: 'Traveler Name', // Replace with actual user name if available
          email: 'traveler@example.com', // Replace with actual user email
          contact: '9999999999', // Replace with actual user contact
        },
        notes: {
          booking_id: bookingId,
          user_id: userId,
          travel_package_details: 'Package name/summary'
        },
        theme: {
          color: '#3399cc',
        },
        modal: {
          ondismiss: function () {
            console.log('Razorpay modal dismissed');
            toast.info('Payment was cancelled by the user.');
            setIsLoading(false);
          },
        },
      };

      if (window.Razorpay) { // Ensure Razorpay object is loaded
        const rzp = new window.Razorpay(options);
        rzp.open(); // Open the Razorpay payment popup
      } else {
        throw new Error("Razorpay SDK is not loaded.");
      }


    } catch (apiError: any) {
      console.error('Error initiating Razorpay payment:', apiError);
      let errorMessage = 'An unknown error occurred.';
      if (apiError.response && apiError.response.data) {
          errorMessage = apiError.response.data; // Backend error message
      } else if (apiError.message) {
          errorMessage = apiError.message; // Axios or other JS error
      }
      toast.error(`Error initiating payment: ${errorMessage}`);
      setError(`Error initiating payment: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };
  // --- END MODIFIED handleCompletePayment ---


  // --- UI RENDERING (remains largely the same) ---
  if (!bookingId || totalAmount === 0 || userId === null) {
    return (
      <div style={{ padding: '50px', textAlign: 'center', color: 'red' }}>
        <ToastContainer />
        <h2>Payment Details Missing</h2>
        <p>Necessary booking information was not provided. Please go back to the <a href="/" onClick={() => navigate('/')}>booking page</a>.</p>
      </div>
    );
  }

  return (
    <div className={styles.paymentPageContainer}>
      <ToastContainer />
      <h1 className={styles.pageTitle}>Complete Your Payment</h1>
      <p className={styles.totalAmountDisplay}>Total Amount Due: {formatIndianRupees(totalAmount)}</p>

      <div className={styles.paymentMethods}>
        <button
          className={`${styles.paymentMethodButton} ${selectedPaymentMethod === 'CREDIT_DEBIT_CARD' ? styles.active : ''}`}
          onClick={() => setSelectedPaymentMethod('CREDIT_DEBIT_CARD')}
        >
          Credit/Debit Card
        </button>
        <button
          className={`${styles.paymentMethodButton} ${selectedPaymentMethod === 'NET_BANKING' ? styles.active : ''}`}
          onClick={() => setSelectedPaymentMethod('NET_BANKING')}
        >
          Net Banking
        </button>
      </div>

      <div className={styles.paymentForm}>
        {selectedPaymentMethod === 'CREDIT_DEBIT_CARD' && (
          <div className={styles.cardPaymentSection}>
            <div className={styles.cardLogos}>
              <img src={visalogo} alt="Visa" className={styles.cardLogo} />
              <img src={mastercardlogo} alt="Mastercard" className={styles.cardLogo} />
              <img src={amexlogo} alt="American Express" className={styles.cardLogo} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="cardholderName">Cardholder Name</label>
              <input
                type="text"
                id="cardholderName"
                name="cardholderName"
                value={cardDetails.cardholderName}
                onChange={handleCardDetailsChange}
                placeholder="Name on card"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="cardNumber">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={cardDetails.cardNumber}
                onChange={handleCardDetailsChange}
                placeholder="XXXX XXXX XXXX XXXX"
                maxLength={19}
                required
              />
            </div>
            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label htmlFor="expiryMonth">Expiration Date</label>
                <div className={styles.expiryCvv}>
                  <input
                    type="text"
                    id="expiryMonth"
                    name="expiryMonth"
                    value={cardDetails.expiryMonth}
                    onChange={handleCardDetailsChange}
                    placeholder="MM"
                    maxLength={2}
                    required
                  />
                  <span className={styles.separator}>/</span>
                  <input
                    type="text"
                    id="expiryYear"
                    name="expiryYear"
                    value={cardDetails.expiryYear}
                    onChange={handleCardDetailsChange}
                    placeholder="YY"
                    maxLength={2}
                    required
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="cvv">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleCardDetailsChange}
                  placeholder="XXX"
                  maxLength={4}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {selectedPaymentMethod === 'NET_BANKING' && (
          <div className={styles.netBankingSection}>
            <div className={styles.formGroup}>
              <label htmlFor="bankName">Bank Name</label>
              <input
                type="text"
                id="bankName"
                name="bankName"
                value={netBankingDetails.bankName}
                onChange={handleNetBankingDetailsChange}
                placeholder="e.g., State Bank of India"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="accountNumber">Account Number</label>
              <input
                type="text"
                id="accountNumber"
                name="accountNumber"
                value={netBankingDetails.accountNumber}
                onChange={handleNetBankingDetailsChange}
                placeholder="Your Bank Account Number"
                required
              />
            </div>
          </div>
        )}
      </div>

      <div className={styles.securityMessage}>
        <p>Your payment is processed securely by our trusted payment partners (Razorpay).</p>
      </div>

      <div className={styles.buttonContainer}>
        <button className={styles.goBackButton} onClick={() => navigate(-1)}>
          Go Back
        </button>
        <button
          className={styles.payButton}
          onClick={handleCompletePayment}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : `Pay Now ${formatIndianRupees(totalAmount)}`}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;