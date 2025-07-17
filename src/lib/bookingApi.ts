import { getApiUrl, getAuthHeaders } from './apiConfig';

export interface BookingDTO {
  userId: number;
  packageId: number;
  startDate: string;
  endDate: string;
  status: string;
  adults: number;
  children: number;
  infants: number;
  contactFullName: string;
  contactEmail: string;
  contactPhone: string;
  travelerNames: string;
  hasInsurance: boolean;
  insurancePlan?: number;
}

export interface BookingResponse {
  bookingId: number;
  userId: number;
  packageId: number;
  startDate: string;
  endDate: string;
  status: string;
  adults: number;
  children: number;
  infants: number;
  contactFullName: string;
  contactEmail: string;
  contactPhone: string;
  travelerNames: string;
  hasInsurance: boolean;
  insurancePlan?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Create a new booking
export const createBooking = async (bookingData: BookingDTO): Promise<BookingResponse> => {
  try {
    const response = await fetch(getApiUrl('BOOKING_SERVICE', ''), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create booking');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

// Get booking by ID
export const getBookingById = async (bookingId: number): Promise<BookingResponse> => {
  try {
    const response = await fetch(getApiUrl('BOOKING_SERVICE', `/${bookingId}`), {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch booking: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching booking:', error);
    throw error;
  }
};

// Get bookings by user ID
export const getBookingsByUser = async (userId: number): Promise<BookingResponse[]> => {
  try {
    const response = await fetch(getApiUrl('BOOKING_SERVICE', `/user/${userId}`), {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user bookings: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
};

// Check if user has booked a specific package
export const hasUserBookedPackage = async (userId: number, packageId: number): Promise<boolean> => {
  try {
    const response = await fetch(getApiUrl('BOOKING_SERVICE', `/user/${userId}/package/${packageId}`), {
      headers: getAuthHeaders(),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error checking if user has booked package:', error);
    return false;
  }
};

// Get all bookings (admin/agent)
export const getAllBookings = async (): Promise<BookingResponse[]> => {
  try {
    const response = await fetch(getApiUrl('BOOKING_SERVICE', ''), {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch bookings: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

// Update booking status
export const updateBookingStatus = async (bookingId: number, status: string): Promise<BookingResponse> => {
  try {
    // First get the current booking to preserve other fields
    const currentBooking = await getBookingById(bookingId);
    
    // Update only the status field
    const updatedBooking = {
      ...currentBooking,
      status: status
    };
    
    const response = await fetch(getApiUrl('BOOKING_SERVICE', `/${bookingId}`), {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updatedBooking),
    });

    if (!response.ok) {
      let errorText = await response.text();
      throw new Error(errorText || 'Failed to update booking status');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};

// Cancel booking
export const cancelBooking = async (bookingId: number): Promise<BookingResponse> => {
  try {
    const response = await fetch(getApiUrl('BOOKING_SERVICE', `/${bookingId}/cancel`), {
      method: 'PUT',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to cancel booking');
    }

    return await response.json();
  } catch (error) {
    console.error('Error canceling booking:', error);
    throw error;
  }
}; 