import { getApiUrl } from './apiConfig';

export interface InsurancePlan {
  insuranceId: number;
  packageType: string;
  coverageDetails: string;
  provider: string;
  status: string;
  price: number;
  userId?: number;
  bookingId?: number;
  selectionDate?: string;
}

export interface InsuranceSelectionRequest {
  predefinedPackageId: number;
  userId: number;
  bookingId: number;
}

// Fetch all available predefined insurance packages from backend
export const fetchInsurancePackages = async (): Promise<InsurancePlan[]> => {
  try {
    const response = await fetch(getApiUrl('INSURANCE_SERVICE', '/packages'));
    
    if (!response.ok) {
      throw new Error(`Failed to fetch insurance packages: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Fetched insurance packages:', data);
    return data;
  } catch (error) {
    console.error('Error fetching insurance packages:', error);
    // Return fallback data if API fails
    return [
      {
        insuranceId: 1,
        packageType: 'Small',
        coverageDetails: 'Basic coverage for personal accidents and theft (Medical expenses up to Rs 50,000, Lost luggage up to Rs 5,000).',
        provider: 'SafeGuard Insurance Co.',
        status: 'PREDEFINED_AVAILABLE',
        price: 599
      },
      {
        insuranceId: 2,
        packageType: 'Medium',
        coverageDetails: 'Standard coverage including accidents, theft, and fire (Medical expenses up to Rs 1,00,000, Lost luggage up to Rs 10,000, Trip cancellation up to Rs 20,000).',
        provider: 'ShieldsSecure Insurance Ltd.',
        status: 'PREDEFINED_AVAILABLE',
        price: 899
      },
      {
        insuranceId: 3,
        packageType: 'Large',
        coverageDetails: 'Premium coverage with full protection and roadside assistance (Medical expenses up to Rs 2,00,000, Lost luggage up to Rs 20,000, Trip cancellation up to Rs 50,000, Emergency evacuation).',
        provider: 'TitanCover Assurance Group',
        status: 'PREDEFINED_AVAILABLE',
        price: 1000
      }
    ];
  }
};

// Select an insurance package for a specific booking
export const selectInsuranceForBooking = async (
  predefinedPackageId: number,
  userId: number,
  bookingId: number
): Promise<InsurancePlan> => {
  try {
    const response = await fetch(getApiUrl('INSURANCE_SERVICE', '/select'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        predefinedPackageId: predefinedPackageId.toString(),
        userId: userId.toString(),
        bookingId: bookingId.toString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to select insurance: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Insurance selection created:', data);
    return data;
  } catch (error) {
    console.error('Error selecting insurance:', error);
    throw error;
  }
};

// Get insurance selections by booking ID
export const getInsuranceSelectionsByBooking = async (bookingId: number): Promise<InsurancePlan[]> => {
  try {
    const response = await fetch(getApiUrl('INSURANCE_SERVICE', `/selections/booking?bookingId=${bookingId}`));
    
    if (!response.ok) {
      throw new Error(`Failed to fetch insurance selections: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching insurance selections:', error);
    throw error;
  }
};

// Get insurance selections by user ID
export const getInsuranceSelectionsByUser = async (userId: number): Promise<InsurancePlan[]> => {
  try {
    const response = await fetch(getApiUrl('INSURANCE_SERVICE', `/selections/user?userId=${userId}`));
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user insurance selections: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user insurance selections:', error);
    throw error;
  }
}; 