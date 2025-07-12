export interface BookingRequestWithPaymentDto {
    userId: number;
    roomId: number;
    checkInDate: string; // YYYY-MM-DD
    checkOutDate: string; // YYYY-MM-DD
    paymentAmount: number;
    currency: string;
}
 
export interface RazorpayOrder {
    amount: number; // in paise
    currency: string;
    id: string; // order_XXXXXXXXXXXXXX
    entity: string;
    receipt: string;
    // You might find other fields like 'status', 'created_at', etc.
}
 
export interface RazorpayResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}
 
export type MessageType = 'info' | 'success' | 'error' | '';
 
// Extend Window interface to include the Razorpay object
declare global {
    interface Window {
        Razorpay: any; // Razorpay typings can be installed for better type safety if desired
    }
}