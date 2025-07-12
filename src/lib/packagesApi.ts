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
  images?: string; // JSON array of additional images
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
  } catch (error: any) {
    console.error('Failed to fetch packages from API Gateway:', error);
    console.log('API Gateway not available, using fallback mock data for packages');
    
    // Check if it's a gateway connection error
    if (error.code === 'ERR_NETWORK' || error.message.includes('fetch')) {
      console.log('Network error detected - API Gateway may not be running');
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
        flights: [
          {
            flightId: 1,
            airline: 'Air India',
            departure: 'Mumbai',
            arrival: 'Goa',
            departureTime: '10:00 AM',
            arrivalTime: '11:30 AM'
          }
        ],
        hotels: [
          {
            hotelId: 1,
            name: 'Taj Holiday Village Resort',
            location: 'Candolim Beach, Goa',
            starRating: 5,
            checkInTime: '2:00 PM',
            checkOutTime: '12:00 PM'
          }
        ],
        sightseeingList: [
          {
            sightseeingId: 1,
            name: 'Old Goa Churches',
            description: 'Visit the historic churches of Old Goa including Basilica of Bom Jesus',
            duration: '3 hours',
            location: 'Old Goa'
          },
          {
            sightseeingId: 2,
            name: 'Dudhsagar Falls',
            description: 'Explore the majestic Dudhsagar Falls and spice plantations',
            duration: '6 hours',
            location: 'Mollem National Park'
          }
        ]
      },
      {
        packageId: 2,
        title: 'Shimla Mountain Adventure',
        description: 'Explore the beautiful mountains of Shimla with trekking and adventure activities. Experience the colonial charm and scenic beauty of the Queen of Hills.',
        duration: 4,
        price: 12000,
        destination: 'Shimla',
        includeService: 'Hotel, Meals, Transport, Guide, Adventure Activities',
        excludeService: 'Airfare, Personal Expenses, Optional Tours',
        highlights: 'Mountain Trekking, Adventure Sports, Scenic Views, Colonial Architecture, Mall Road',
        active: true,
        mainImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
        packageType: 'Mountain',
        difficultyLevel: 'Moderate',
        maxGroupSize: 12,
        minAge: 8,
        bestTimeToVisit: 'March to June and September to November',
        weatherInfo: 'Pleasant weather with cool temperatures throughout the year',
        whatToBring: 'Warm clothes, Trekking shoes, Rain gear, Camera',
        cancellationPolicy: 'Free cancellation up to 10 days before travel',
        termsAndConditions: 'Adventure activities require proper fitness. Please read our complete terms.',
        flights: [
          {
            flightId: 2,
            airline: 'IndiGo',
            departure: 'Delhi',
            arrival: 'Shimla',
            departureTime: '8:00 AM',
            arrivalTime: '9:30 AM'
          }
        ],
        hotels: [
          {
            hotelId: 2,
            name: 'Oberoi Cecil',
            location: 'Chaura Maidan, Shimla',
            starRating: 5,
            checkInTime: '2:00 PM',
            checkOutTime: '12:00 PM'
          }
        ],
        sightseeingList: [
          {
            sightseeingId: 3,
            name: 'Kufri Adventure',
            description: 'Experience skiing and snow activities at Kufri',
            duration: '4 hours',
            location: 'Kufri'
          },
          {
            sightseeingId: 4,
            name: 'Jakhu Temple Trek',
            description: 'Trek to the famous Jakhu Temple with panoramic views',
            duration: '3 hours',
            location: 'Jakhu Hill'
          }
        ]
      },
      {
        packageId: 3,
        title: 'Kerala Backwaters Experience',
        description: 'Discover the serene backwaters of Kerala with traditional houseboat stays and Ayurvedic wellness.',
        duration: 6,
        price: 18000,
        destination: 'Kerala',
        includeService: 'Houseboat, Meals, Transport, Guide, Ayurvedic Session',
        excludeService: 'Airfare, Personal Expenses, Optional Tours',
        highlights: 'Houseboat Cruise, Ayurvedic Massage, Kathakali Performance, Spice Gardens',
        active: true,
        mainImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
        packageType: 'Relaxation',
        difficultyLevel: 'Easy',
        maxGroupSize: 8,
        minAge: 3,
        bestTimeToVisit: 'June to March',
        weatherInfo: 'Tropical climate with monsoon rains from June to September',
        whatToBring: 'Light cotton clothes, Umbrella, Camera, Comfortable footwear',
        cancellationPolicy: 'Free cancellation up to 14 days before travel',
        termsAndConditions: 'Houseboat bookings are weather dependent. Please read our complete terms.',
        flights: [
          {
            flightId: 3,
            airline: 'Air India',
            departure: 'Mumbai',
            arrival: 'Kochi',
            departureTime: '9:00 AM',
            arrivalTime: '11:00 AM'
          }
        ],
        hotels: [
          {
            hotelId: 3,
            name: 'Kumarakom Lake Resort',
            location: 'Kumarakom, Kerala',
            starRating: 5,
            checkInTime: '2:00 PM',
            checkOutTime: '12:00 PM'
          }
        ],
        sightseeingList: [
          {
            sightseeingId: 5,
            name: 'Alleppey Backwaters',
            description: 'Cruise through the scenic backwaters of Alleppey',
            duration: '8 hours',
            location: 'Alleppey'
          },
          {
            sightseeingId: 6,
            name: 'Ayurvedic Wellness',
            description: 'Traditional Ayurvedic massage and wellness session',
            duration: '2 hours',
            location: 'Kumarakom'
          }
        ]
      },
      {
        packageId: 4,
        title: 'Rajasthan Cultural Heritage',
        description: 'Immerse yourself in the rich cultural heritage of Rajasthan with palace stays and desert adventures.',
        duration: 7,
        price: 22000,
        destination: 'Rajasthan',
        includeService: 'Palace Hotel, Meals, Transport, Guide, Cultural Shows',
        excludeService: 'Airfare, Personal Expenses, Optional Tours',
        highlights: 'Palace Visits, Desert Safari, Cultural Performances, Heritage Walks',
        active: true,
        mainImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500',
        packageType: 'Cultural',
        difficultyLevel: 'Easy',
        maxGroupSize: 10,
        minAge: 5,
        bestTimeToVisit: 'October to March',
        weatherInfo: 'Desert climate with hot summers and pleasant winters',
        whatToBring: 'Traditional clothes, Comfortable footwear, Camera, Sun protection',
        cancellationPolicy: 'Free cancellation up to 10 days before travel',
        termsAndConditions: 'Cultural shows are subject to availability. Please read our complete terms.',
        flights: [
          {
            flightId: 4,
            airline: 'Vistara',
            departure: 'Delhi',
            arrival: 'Jaipur',
            departureTime: '7:00 AM',
            arrivalTime: '8:15 AM'
          }
        ],
        hotels: [
          {
            hotelId: 4,
            name: 'Taj Rambagh Palace',
            location: 'Jaipur, Rajasthan',
            starRating: 5,
            checkInTime: '2:00 PM',
            checkOutTime: '12:00 PM'
          }
        ],
        sightseeingList: [
          {
            sightseeingId: 7,
            name: 'Amber Fort',
            description: 'Explore the magnificent Amber Fort with elephant ride',
            duration: '4 hours',
            location: 'Amber'
          },
          {
            sightseeingId: 8,
            name: 'Desert Safari',
            description: 'Experience the thrill of desert safari in Jaisalmer',
            duration: '6 hours',
            location: 'Jaisalmer'
          }
        ]
      },
      {
        packageId: 5,
        title: 'Ladakh Adventure Trek',
        description: 'Embark on an adventurous trek through the stunning landscapes of Ladakh with high-altitude experiences.',
        duration: 8,
        price: 28000,
        destination: 'Ladakh',
        includeService: 'Camping, Meals, Transport, Guide, Trekking Equipment',
        excludeService: 'Airfare, Personal Expenses, Optional Tours',
        highlights: 'High Altitude Trekking, Monastery Visits, Mountain Biking, Cultural Immersion',
        active: true,
        mainImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
        packageType: 'Adventure',
        difficultyLevel: 'Challenging',
        maxGroupSize: 8,
        minAge: 16,
        bestTimeToVisit: 'June to September',
        weatherInfo: 'Cold desert climate with extreme temperature variations',
        whatToBring: 'Warm clothes, Trekking gear, Oxygen support, High-altitude medication',
        cancellationPolicy: 'Free cancellation up to 15 days before travel',
        termsAndConditions: 'High-altitude trekking requires medical fitness. Please read our complete terms.',
        flights: [
          {
            flightId: 5,
            airline: 'Air India',
            departure: 'Delhi',
            arrival: 'Leh',
            departureTime: '6:00 AM',
            arrivalTime: '8:00 AM'
          }
        ],
        hotels: [
          {
            hotelId: 5,
            name: 'The Grand Dragon Ladakh',
            location: 'Leh, Ladakh',
            starRating: 4,
            checkInTime: '2:00 PM',
            checkOutTime: '12:00 PM'
          }
        ],
        sightseeingList: [
          {
            sightseeingId: 9,
            name: 'Khardungla Pass',
            description: 'Visit the highest motorable pass in the world',
            duration: '6 hours',
            location: 'Khardungla'
          },
          {
            sightseeingId: 10,
            name: 'Pangong Lake Trek',
            description: 'Trek to the famous Pangong Lake',
            duration: '8 hours',
            location: 'Pangong Lake'
          }
        ]
      },
      {
        packageId: 6,
        title: 'Varanasi Spiritual Journey',
        description: 'Experience the spiritual essence of Varanasi with Ganga Aarti, temple visits, and cultural immersion.',
        duration: 4,
        price: 9500,
        destination: 'Varanasi',
        includeService: 'Hotel, Meals, Transport, Guide, Cultural Activities',
        excludeService: 'Airfare, Personal Expenses, Optional Tours',
        highlights: 'Ganga Aarti, Temple Visits, Boat Ride, Cultural Performances',
        active: true,
        mainImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
        packageType: 'Cultural',
        difficultyLevel: 'Easy',
        maxGroupSize: 12,
        minAge: 5,
        bestTimeToVisit: 'October to March',
        weatherInfo: 'Tropical climate with hot summers and pleasant winters',
        whatToBring: 'Modest clothing, Comfortable footwear, Camera, Respectful attitude',
        cancellationPolicy: 'Free cancellation up to 7 days before travel',
        termsAndConditions: 'Temple visits require appropriate dress code. Please read our complete terms.',
        flights: [
          {
            flightId: 6,
            airline: 'IndiGo',
            departure: 'Delhi',
            arrival: 'Varanasi',
            departureTime: '8:30 AM',
            arrivalTime: '10:00 AM'
          }
        ],
        hotels: [
          {
            hotelId: 6,
            name: 'Taj Ganges Varanasi',
            location: 'Varanasi, Uttar Pradesh',
            starRating: 5,
            checkInTime: '2:00 PM',
            checkOutTime: '12:00 PM'
          }
        ],
        sightseeingList: [
          {
            sightseeingId: 11,
            name: 'Ganga Aarti',
            description: 'Witness the mesmerizing Ganga Aarti ceremony',
            duration: '2 hours',
            location: 'Dashashwamedh Ghat'
          },
          {
            sightseeingId: 12,
            name: 'Temple Circuit',
            description: 'Visit the famous temples of Varanasi',
            duration: '4 hours',
            location: 'Varanasi City'
          }
        ]
      }
    ];
  }
}

export async function fetchPackageById(id: number): Promise<TravelPackageDto> {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (error: any) {
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
  } catch (error: any) {
    console.error('Failed to search packages:', error);
    return [];
  }
}

export async function createPackage(packageData: Omit<TravelPackageDto, 'packageId'>): Promise<TravelPackageDto> {
  try {
    const response = await api.post('/', packageData);
    return response.data;
  } catch (error: any) {
    console.error('Failed to create package:', error);
    throw new Error('Failed to create package. Please try again.');
  }
}

export async function updatePackage(id: number, packageData: Partial<TravelPackageDto>): Promise<TravelPackageDto> {
  try {
    const response = await api.put(`/${id}`, packageData);
    return response.data;
  } catch (error: any) {
    console.error('Failed to update package:', error);
    throw new Error('Failed to update package. Please try again.');
  }
}

export async function deletePackage(id: number): Promise<void> {
  try {
    await api.delete(`/${id}`);
  } catch (error: any) {
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
  } catch (error: any) {
    console.error('Failed to upload package image:', error);
    throw new Error('Failed to upload image. Please try again.');
  }
}

export async function updatePackageStatus(packageId: number, active: boolean): Promise<TravelPackageDto> {
  try {
    const response = await api.put(`/${packageId}/status?active=${active}`);
    return response.data;
  } catch (error: any) {
    console.error('Failed to update package status:', error);
    throw new Error('Failed to update package status. Please try again.');
  }
}