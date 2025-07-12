// src/global.d.ts

// Extend the global Window interface to include the Razorpay object
// This is necessary because Razorpay injects its object onto the window.
declare global {
    interface Window {
        Razorpay: any; // Using 'any' for simplicity; for full type safety, you'd install @types/razorpay
    }
}