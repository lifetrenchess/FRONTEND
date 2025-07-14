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

// Exported mockPackages array for fallback use in components
export const mockPackages = [
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
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500'
    ],
    packageType: 'Beach' as const,
    difficultyLevel: 'Easy' as const,
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
  },
  {
    packageId: 2,
    title: 'Shimla Mountain Adventure',
    description: 'Explore the beautiful mountains of Shimla with trekking and adventure activities. Experience the colonial charm and scenic beauty of the Queen of Hills.',
    duration: 4,
    price: 12000,
    destination: 'Shimla',
    includeService: 'Hotel, Meals, Transport, Guide, Trekking Equipment',
    excludeService: 'Airfare, Personal Expenses, Optional Adventure Sports',
    highlights: 'Mountain Trekking, Adventure Sports, Scenic Views, Colonial Architecture, Mall Road',
    active: true,
    mainImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500'
    ],
    packageType: 'Mountain' as const,
    difficultyLevel: 'Moderate' as const,
    maxGroupSize: 12,
    minAge: 8,
    bestTimeToVisit: 'March to June, September to November',
    weatherInfo: 'Cool mountain climate with pleasant summers and snowy winters',
    whatToBring: 'Warm clothes, Trekking shoes, Camera, Water bottle',
    cancellationPolicy: 'Free cancellation up to 5 days before travel',
    termsAndConditions: 'Adventure activities require proper fitness. Please read our complete terms before booking.',
    flights: [],
    hotels: [],
    sightseeingList: []
  },
  {
    packageId: 3,
    title: 'Kerala Backwaters Experience',
    description: 'Discover the serene backwaters of Kerala with traditional houseboat stays. Experience Ayurvedic treatments and traditional Kathakali performances.',
    duration: 6,
    price: 18000,
    destination: 'Kerala',
    includeService: 'Houseboat, Meals, Transport, Guide, Ayurvedic Massage',
    excludeService: 'Airfare, Personal Expenses, Optional Treatments',
    highlights: 'Houseboat Cruise, Ayurvedic Massage, Kathakali Performance, Spice Plantations, Tea Gardens',
    active: true,
    mainImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500'
    ],
    packageType: 'Relaxation' as const,
    difficultyLevel: 'Easy' as const,
    maxGroupSize: 8,
    minAge: 3,
    bestTimeToVisit: 'September to March',
    weatherInfo: 'Tropical monsoon climate with pleasant weather during tourist season',
    whatToBring: 'Light cotton clothes, Comfortable footwear, Camera, Personal care items',
    cancellationPolicy: 'Free cancellation up to 10 days before travel',
    termsAndConditions: 'Houseboat bookings are subject to weather conditions. Please read our complete terms before booking.',
    flights: [],
    hotels: [],
    sightseeingList: []
  }
];

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
    const response = await api.get(''); // Removed trailing slash to match backend
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
    
    return mockPackages;
  }
}

export async function fetchPackageById(id: number): Promise<TravelPackageDto> {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (error: unknown) {
    console.error('Failed to fetch package:', error);
    console.log('Using fallback mock data for package ID:', id);
    
    // Return mock data for specific package ID
    const mockPackages = [
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
        images: [
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500'
        ],
        packageType: 'Beach' as const,
        difficultyLevel: 'Easy' as const,
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
      },
      {
        packageId: 2,
        title: 'Shimla Mountain Adventure',
        description: 'Explore the beautiful mountains of Shimla with trekking and adventure activities. Experience the colonial charm and scenic beauty of the Queen of Hills.',
        duration: 4,
        price: 12000,
        destination: 'Shimla',
        includeService: 'Hotel, Meals, Transport, Guide, Trekking Equipment',
        excludeService: 'Airfare, Personal Expenses, Optional Adventure Sports',
        highlights: 'Mountain Trekking, Adventure Sports, Scenic Views, Colonial Architecture, Mall Road',
        active: true,
        mainImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
        images: [
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500'
        ],
        packageType: 'Mountain' as const,
        difficultyLevel: 'Moderate' as const,
        maxGroupSize: 12,
        minAge: 8,
        bestTimeToVisit: 'March to June, September to November',
        weatherInfo: 'Cool mountain climate with pleasant summers and snowy winters',
        whatToBring: 'Warm clothes, Trekking shoes, Camera, Water bottle',
        cancellationPolicy: 'Free cancellation up to 5 days before travel',
        termsAndConditions: 'Adventure activities require proper fitness. Please read our complete terms before booking.',
        flights: [],
        hotels: [],
        sightseeingList: []
      },
      {
        packageId: 3,
        title: 'Kerala Backwaters Experience',
        description: 'Discover the serene backwaters of Kerala with traditional houseboat stays. Experience Ayurvedic treatments and traditional Kathakali performances.',
        duration: 6,
        price: 18000,
        destination: 'Kerala',
        includeService: 'Houseboat, Meals, Transport, Guide, Ayurvedic Massage',
        excludeService: 'Airfare, Personal Expenses, Optional Treatments',
        highlights: 'Houseboat Cruise, Ayurvedic Massage, Kathakali Performance, Spice Plantations, Tea Gardens',
        active: true,
        mainImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
        images: [
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500'
        ],
        packageType: 'Relaxation' as const,
        difficultyLevel: 'Easy' as const,
        maxGroupSize: 8,
        minAge: 3,
        bestTimeToVisit: 'September to March',
        weatherInfo: 'Tropical monsoon climate with pleasant weather during tourist season',
        whatToBring: 'Light cotton clothes, Comfortable footwear, Camera, Personal care items',
        cancellationPolicy: 'Free cancellation up to 10 days before travel',
        termsAndConditions: 'Houseboat bookings are subject to weather conditions. Please read our complete terms before booking.',
        flights: [],
        hotels: [],
        sightseeingList: []
      },
      {
        packageId: 4,
        title: 'Rajasthan Cultural Heritage',
        description: 'Immerse yourself in the rich cultural heritage of Rajasthan. Visit majestic forts, palaces, and experience traditional folk performances.',
        duration: 7,
        price: 22000,
        destination: 'Rajasthan',
        includeService: 'Hotel, Meals, Transport, Guide, Cultural Shows',
        excludeService: 'Airfare, Personal Expenses, Optional Tours',
        highlights: 'Fort Visits, Palace Tours, Folk Performances, Desert Safari, Local Markets',
        active: true,
        mainImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500',
        images: [
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500'
        ],
        packageType: 'Cultural' as const,
        difficultyLevel: 'Easy' as const,
        maxGroupSize: 20,
        minAge: 5,
        bestTimeToVisit: 'October to March',
        weatherInfo: 'Desert climate with hot summers and pleasant winters',
        whatToBring: 'Comfortable clothes, Walking shoes, Camera, Hat and sunscreen',
        cancellationPolicy: 'Free cancellation up to 7 days before travel',
        termsAndConditions: 'Cultural tours involve moderate walking. Please read our complete terms before booking.',
        flights: [],
        hotels: [],
        sightseeingList: []
      },
      {
        packageId: 5,
        title: 'Himalayan Trekking Adventure',
        description: 'Embark on an exciting trekking adventure in the Himalayas. Experience breathtaking mountain views and challenging trails.',
        duration: 8,
        price: 28000,
        destination: 'Himalayas',
        includeService: 'Camping, Meals, Transport, Guide, Trekking Equipment',
        excludeService: 'Airfare, Personal Expenses, Optional Equipment',
        highlights: 'Mountain Trekking, Camping, Scenic Views, Wildlife Spotting, Local Villages',
        active: true,
        mainImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
        images: [
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500'
        ],
        packageType: 'Adventure' as const,
        difficultyLevel: 'Challenging' as const,
        maxGroupSize: 10,
        minAge: 16,
        bestTimeToVisit: 'May to June, September to October',
        weatherInfo: 'Alpine climate with cold temperatures and variable weather conditions',
        whatToBring: 'Warm clothes, Trekking boots, Sleeping bag, First aid kit',
        cancellationPolicy: 'Free cancellation up to 15 days before travel',
        termsAndConditions: 'Trekking requires good physical fitness. Please read our complete terms before booking.',
        flights: [],
        hotels: [],
        sightseeingList: []
      }
    ];
    
    const packageData = mockPackages.find(pkg => pkg.packageId === id);
    if (packageData) {
      return packageData;
    }
    
    throw new Error('Package not found');
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