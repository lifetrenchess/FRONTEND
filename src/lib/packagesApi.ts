import axios from 'axios';

// Enhanced interfaces for detailed package information
export interface FlightDto {
  flightId: number;
  airline: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
}

export interface HotelDto {
  hotelId: number;
  name: string;
  location: string;
  starRating: number;
  checkInTime: string;
  checkOutTime: string;
}

export interface SightseeingDto {
  sightseeingId: number;
  name: string;
  description: string;
  duration: string;
  location: string;
}

export interface TravelPackageDto {
  packageId: number;
  title: string;
  description: string;
  duration: number;
  price: number;
  destination: string;
  includeService: string;
  excludeService?: string;
  highlights?: string;
  mainImage?: string;
  images?: string[]; // Array of additional image URLs
  active: boolean;
  createdByAgentId?: number;
  createdAt?: string;
  updatedAt?: string;
  
  // Detailed itinerary information
  flights: FlightDto[];
  hotels: HotelDto[];
  sightseeingList: SightseeingDto[];
  
  // Additional package details
  maxGroupSize?: number;
  minAge?: number;
  cancellationPolicy?: string;
  termsAndConditions?: string;
  whatToBring?: string;
  weatherInfo?: string;
  bestTimeToVisit?: string;
  difficultyLevel?: 'Easy' | 'Moderate' | 'Challenging' | 'Expert';
  packageType?: 'Adventure' | 'Relaxation' | 'Cultural' | 'Wildlife' | 'Beach' | 'Mountain' | 'City' | 'Rural';
}

// Configure axios to use API Gateway
const api = axios.create({
  baseURL: 'http://localhost:9999/api/packages', // API Gateway URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`Making API Gateway request to: ${config.url}`);
  return config;
});

export async function fetchAllPackages(): Promise<TravelPackageDto[]> {
  try {
    console.log('Attempting to fetch packages through API Gateway...');
    const response = await api.get('/');
    console.log('Packages fetched successfully through API Gateway:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.error('Failed to fetch packages from API Gateway:', error);
    console.log('API Gateway not available, using fallback mock data for packages');
    
    // Check if it's a gateway connection error
    if (error && typeof error === 'object' && 'code' in error) {
      const apiError = error as { code?: string; message?: string };
      if (apiError.code === 'ERR_NETWORK' || apiError.message?.includes('fetch')) {
        console.log('Network error detected - API Gateway may not be running');
      }
    }
    
    // Return comprehensive mock data as fallback
    return [
      {
        packageId: 1,
        title: 'Goa Beach Paradise',
        description: 'Experience the perfect beach vacation in Goa with pristine beaches and vibrant nightlife. Enjoy water sports, beach parties, and authentic Goan cuisine.',
        duration: 5,
        price: 15000,
        destination: 'Goa',
        includeService: 'Hotel, Meals, Transport, Guide, Water Sports',
        excludeService: 'Airfare, Personal Expenses, Optional Tours',
        highlights: 'Beach Activities, Water Sports, Nightlife, Portuguese Architecture, Spice Plantations',
        active: true,
        mainImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500',
        packageType: 'Beach',
        difficultyLevel: 'Easy',
        maxGroupSize: 15,
        minAge: 5,
        bestTimeToVisit: 'November to March',
        weatherInfo: 'Tropical climate with pleasant weather during tourist season',
        whatToBring: 'Swimwear, Sunscreen, Light cotton clothes, Beach accessories',
        cancellationPolicy: 'Free cancellation up to 7 days before travel',
        termsAndConditions: 'Standard travel terms apply. Please read our complete terms before booking.',
        flights: [],
        hotels: [],
        sightseeingList: []
      }
    ];
  }
}

export async function fetchPackageById(id: number): Promise<TravelPackageDto> {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (error: unknown) {
    console.error('Failed to fetch package:', error);
    throw new Error('Failed to fetch package. Please try again.');
  }
}

export async function searchPackages(destination?: string, minPrice?: number, maxPrice?: number): Promise<TravelPackageDto[]> {
  try {
    const params = new URLSearchParams();
    if (destination) params.append('destination', destination);
    if (minPrice) params.append('minPrice', minPrice.toString());
    if (maxPrice) params.append('maxPrice', maxPrice.toString());
    
    const response = await api.get(`/search?${params.toString()}`);
    return response.data;
  } catch (error: unknown) {
    console.error('Failed to search packages:', error);
    return [];
  }
}

export async function createPackage(packageData: Omit<TravelPackageDto, 'packageId'>): Promise<TravelPackageDto> {
  try {
    const response = await api.post('/', packageData);
    return response.data;
  } catch (error: unknown) {
    console.error('Failed to create package:', error);
    throw new Error('Failed to create package. Please try again.');
  }
}

export async function updatePackage(id: number, packageData: Partial<TravelPackageDto>): Promise<TravelPackageDto> {
  try {
    const response = await api.put(`/${id}`, packageData);
    return response.data;
  } catch (error: unknown) {
    console.error('Failed to update package:', error);
    throw new Error('Failed to update package. Please try again.');
  }
}

export async function deletePackage(id: number): Promise<void> {
  try {
    await api.delete(`/${id}`);
  } catch (error: unknown) {
    console.error('Failed to delete package:', error);
    throw new Error('Failed to delete package. Please try again.');
  }
} 

export async function uploadPackageImage(packageId: number, image: File, isMain: boolean = false): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('isMain', isMain.toString());
    
    const response = await api.post(`/${packageId}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: unknown) {
    console.error('Failed to upload package image:', error);
    throw new Error('Failed to upload image. Please try again.');
  }
}

export async function updatePackageStatus(packageId: number, active: boolean): Promise<TravelPackageDto> {
  try {
    const response = await api.put(`/${packageId}/status?active=${active}`);
    return response.data;
  } catch (error: unknown) {
    console.error('Failed to update package status:', error);
    throw new Error('Failed to update package status. Please try again.');
  }
}