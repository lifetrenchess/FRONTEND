// src/types.ts

// Define PaymentMethod as a TypeScript union type
// 'RAZORPAY_DEFAULT' is used when Razorpay handles the specific method selection internally.
export type PaymentMethod = 'CREDIT_DEBIT_CARD' | 'NET_BANKING' | 'RAZORPAY_DEFAULT';

export interface BookingDTO {
    userId: number;
    packageId: number;
    startDate: string;
    endDate: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
    adults: number;
    children: number;
    infants: number;
    contactFullName: string;
    contactEmail: string;
    contactPhone: string;
    travelerNames: string;
    hasInsurance: boolean;
}

export interface TravelPackageSummary {
    image: string;
    title: string;
    duration: string;
    selectedDates: string;
}

export interface PriceBreakdown {
    packagePrice: number;
    travelInsurance: number;
    taxesFees: number;
    totalAmount: number;
}

// CardDetails and NetBankingDetails are kept here for completeness,
// but they are not directly used for form submission in the current Razorpay-integrated PaymentPage.tsx.
// They might be useful for other parts of your application or if you implement custom payment forms later.
export interface CardDetails {
    cardholderName: string;
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
}

export interface NetBankingDetails {
    bankName: string;
    accountNumber: string;
    // Add more fields if necessary, like IFSC code, accountHolderName etc.
}

// This PaymentDTO is for the initial request to your backend to create a Razorpay Order.
// It reflects the payload your Spring Boot backend expects for this specific endpoint.
export interface PaymentDTO {
    bookingId: number;
    userId: number;
    amount: number;
    currency: string; // Added currency to match backend expectation for order creation
    paymentMethod: PaymentMethod; // Use the union type here
    // cardDetails and netBankingDetails are NOT sent in this initial payload for Razorpay flow.
}


// --- Types specific to Razorpay integration ---

// This interface is for the response received from your backend
// after it successfully creates a Razorpay Order.
// Ensure this matches your Java backend's DTO (e.g., RazorpayOrderResponse.java).
export interface RazorpayOrderResponse {
    orderId: string; // The Razorpay order ID (e.g., "order_XXXXXXXXXXXXXX")
    currency: string;
    amount: number; // The amount returned by backend (often in INR, before converting to paisa for Razorpay JS)
    keyId: string; // Your public Razorpay Key ID, which your backend provides for security
}

// This interface defines the structure of the object received by the Razorpay checkout handler function (frontend).
export interface RazorpayHandlerResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
    // Optional error object if the payment fails directly in Razorpay popup
    error?: {
        code: string;
        description: string;
        source: string;
        step: string;
        reason: string;
        field: string;
    };
}

// Type for general messages displayed in the UI.
export type MessageType = 'info' | 'success' | 'error' | '';