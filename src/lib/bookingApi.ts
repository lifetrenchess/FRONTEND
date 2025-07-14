import { getApiUrl } from './apiConfig';

export interface BookingDTO {
  userId: number;
  packageId: number;
  startDate: string;
  endDate: string;
  status: string;
  travelers: {
    adults: number;
    children: number;
    infants: number;
    contact: {
      fullName: string;
      email: string;
      phoneNumber: string;
    };
    names: string[];
  };
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
      headers: {
        'Content-Type': 'application/json',
      },
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
    const response = await fetch(getApiUrl('BOOKING_SERVICE', `/${bookingId}`));
    
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
    const response = await fetch(getApiUrl('BOOKING_SERVICE', `/user/${userId}`));
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user bookings: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
};

// Get all bookings (admin/agent)
export const getAllBookings = async (): Promise<BookingResponse[]> => {
  try {
    const response = await fetch(getApiUrl('BOOKING_SERVICE', ''));
    
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
    const response = await fetch(getApiUrl('BOOKING_SERVICE', `/${bookingId}/status`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update booking status');
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