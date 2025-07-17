import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Banknote, Loader2 } from 'lucide-react';
import styles from '@/styles/PaymentPage.module.css';
import { useEffect } from 'react';
import AventraLogo from '@/components/AventraLogo';
import { updateBookingStatus } from '@/lib/bookingApi';
import { toast } from 'sonner';

const paymentMethods = [
  { label: 'Credit/Debit Card', value: 'card', icon: <CreditCard className="w-5 h-5 mr-2" /> },
  { label: 'UPI', value: 'upi', icon: <Banknote className="w-5 h-5 mr-2" /> },
  { label: 'Net Banking', value: 'netbanking', icon: <Banknote className="w-5 h-5 mr-2" /> },
];

const MockPaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId, totalAmount, userId } = (location.state || {}) as {
    bookingId?: number;
    totalAmount?: number;
    userId?: number;
  };
  const [method, setMethod] = useState('card');
  const [details, setDetails] = useState({ cardNumber: '', expiry: '', cvv: '', upi: '', bank: '' });
  const [isPaying, setIsPaying] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  if (!bookingId || !userId || !totalAmount) {
    navigate('/');
    return null;
  }

  const handlePay = async () => {
    setIsPaying(true);
    setShowOverlay(true);
    
    try {
      // Mark booking as PAID in backend
      await updateBookingStatus(bookingId, 'PAID');
      console.log('Booking status updated to PAID successfully');
    } catch (error) {
      console.error('Failed to update booking status:', error);
      toast.error('Failed to update payment status in backend.');
      // Still continue to confirmation page even if backend update fails
    }
    
    setTimeout(() => {
      navigate('/confirmation', {
        state: { bookingId, paymentId: 'MOCKPAY' + bookingId, amount: totalAmount },
      });
    }, 3000);
  };

  return (
    <div className={styles.paymentPageContainer}>
      <div className={styles.paymentPageContent}>
        <h1 className={styles.pageTitle}>Complete Your Payment</h1>
        <Card className={styles.summaryCard}>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.summaryItem}><span>Booking ID:</span> <span>#{bookingId}</span></div>
            <div className={styles.summaryItem}><span>Amount:</span> <span>₹{totalAmount}</span></div>
            <Separator />
            <div className={styles.summaryTotal}><span>Total:</span> <span>₹{totalAmount}</span></div>
          </CardContent>
        </Card>
        <div className="my-6">
          <div className="mb-2 font-medium">Select Payment Method</div>
          <div className="flex gap-4 mb-4">
            {paymentMethods.map((pm) => (
              <Button
                key={pm.value}
                variant={method === pm.value ? 'default' : 'outline'}
                onClick={() => setMethod(pm.value)}
                className="flex items-center"
              >
                {pm.icon}
                {pm.label}
              </Button>
            ))}
          </div>
          {/* Payment Details Form */}
          {method === 'card' && (
            <div className="space-y-2">
              <input type="text" placeholder="Card Number" className="input" maxLength={16} value={details.cardNumber} onChange={e => setDetails(d => ({ ...d, cardNumber: e.target.value }))} />
              <div className="flex gap-2">
                <input type="text" placeholder="MM/YY" className="input" maxLength={5} value={details.expiry} onChange={e => setDetails(d => ({ ...d, expiry: e.target.value }))} />
                <input type="password" placeholder="CVV" className="input" maxLength={3} value={details.cvv} onChange={e => setDetails(d => ({ ...d, cvv: e.target.value }))} />
              </div>
            </div>
          )}
          {method === 'upi' && (
            <input type="text" placeholder="UPI ID" className="input" value={details.upi} onChange={e => setDetails(d => ({ ...d, upi: e.target.value }))} />
          )}
          {method === 'netbanking' && (
            <input type="text" placeholder="Bank Name" className="input" value={details.bank} onChange={e => setDetails(d => ({ ...d, bank: e.target.value }))} />
          )}
        </div>
        <Button className={styles.payButton} onClick={handlePay} disabled={isPaying}>
          {isPaying ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : null}
          {isPaying ? 'Processing Payment...' : `Pay ₹${totalAmount}`}
        </Button>
      </div>
      {showOverlay && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(255,255,255,0.95)',zIndex:1000,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
          <div style={{marginBottom:32,display:'flex',flexDirection:'column',alignItems:'center'}}>
            <div className="mockpay-spin">
              <AventraLogo size={64} />
            </div>
            <div style={{fontWeight:600,fontSize:22,marginTop:16,color:'#1B9AAA'}}>Processing your payment...</div>
          </div>
          <div style={{width:320,maxWidth:'80vw',height:12,background:'linear-gradient(90deg,#1B9AAA,#FF8800,#1B9AAA)',borderRadius:8,overflow:'hidden',boxShadow:'0 2px 8px #0001'}}>
            <div style={{height:'100%',width:'100%',background:'linear-gradient(270deg,#FF8800,#1B9AAA,#FF8800)',backgroundSize:'200% 100%',animation:'progressBarAnim 2s linear infinite'}} />
          </div>
          <style>{`
            @keyframes spin { 100% { transform: rotate(360deg); } }
            .mockpay-spin { animation: spin 2s linear infinite; }
            @keyframes progressBarAnim { 0% {background-position:0 0;} 100% {background-position:200% 0;} }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default MockPaymentPage; 