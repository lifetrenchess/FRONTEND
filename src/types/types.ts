// Payment method types
export type PaymentMethod = 'RAZORPAY' | 'MOCK';

// Basic payment DTO for creating orders
export interface PaymentDTO {
  userId: number;
  bookingId: number;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
}

// Razorpay order response from backend
export interface RazorpayOrderResponse {
  orderId: string;
  currency: string;
  amount: number;
  keyId: string;
}

// Razorpay payment response from frontend
export interface RazorpayHandlerResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// Booking interface
export interface Booking {
  bookingId: number;
  userId: number;
  packageId: number;
  startDate: string;
  endDate: string;
  status: string;
  totalAmount: number;
}

// Travel package interface
export interface TravelPackage {
  packageId: number;
  title: string;
  destination: string;
  price: number;
  duration: number;
  description: string;
  mainImage: string;
}