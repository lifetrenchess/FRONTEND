import axios from 'axios';

export interface AgentStats {
  packagesManaged: number;
  bookings: number;
  earnings: number;
}

export interface AgentPackage {
  packageId: number;
  title: string;
  description: string;
  duration: number;
  price: number;
  destination: string;
  includeService: string;
  excludeService?: string;
  highlights: string;
  mainImage?: string;
  images?: string;
  active: boolean;
  createdByAgentId: number;
  createdAt: string;
  updatedAt: string;
}

export interface AgentBooking {
  id: number;
  customer: string;
  package: string;
  date: string;
  status: string;
}

export interface CustomerInquiry {
  id: number;
  customer: string;
  message: string;
  time: string;
}

// Updated to use API Gateway for package service
const packageApi = axios.create({
  baseURL: 'http://localhost:9999/api/packages', // Package service through gateway
  timeout: 10000,
});

const userApi = axios.create({
  baseURL: 'http://localhost:9999/user-api', // User service through gateway
  timeout: 10000,
});

// Add auth token to requests
packageApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

userApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function getAgentStats(): Promise<AgentStats> {
  try {
    const response = await userApi.get('/stats');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch agent stats:', error);
    // Return mock data as fallback
    return {
      packagesManaged: 12,
      bookings: 48,
      earnings: 210000
    };
  }
}

export async function getAgentPackages(): Promise<AgentPackage[]> {
  try {
    // Get current user to get agent ID
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    const userData = JSON.parse(currentUser);
    const response = await packageApi.get(`/agent/${userData.userId || 1}`); // Default to 1 if not set
    return response.data;
  } catch (error) {
    console.error('Failed to fetch agent packages:', error);
    // Return mock data as fallback
    return [
      { 
        packageId: 1, 
        title: 'Goa Beach Escape', 
        description: 'Amazing beach vacation',
        duration: 5,
        price: 15000,
        destination: 'Goa',
        includeService: 'Hotel, Meals, Transport',
        highlights: 'Beach, Water Sports',
        active: true,
        createdByAgentId: 1,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      { 
        packageId: 2, 
        title: 'Shimla Hills', 
        description: 'Mountain adventure',
        duration: 4,
        price: 12000,
        destination: 'Shimla',
        includeService: 'Hotel, Meals, Transport',
        highlights: 'Mountains, Trekking',
        active: true,
        createdByAgentId: 1,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
    ];
  }
}

export async function getAgentBookings(): Promise<AgentBooking[]> {
  try {
    const response = await userApi.get('/bookings');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch agent bookings:', error);
    // Return mock data as fallback
    return [
      { id: 201, customer: 'Ayush Sharma', package: 'Goa Beach Escape', date: '2024-07-10', status: 'Confirmed' },
      { id: 202, customer: 'Priya Singh', package: 'Shimla Hills', date: '2024-07-09', status: 'Pending' },
    ];
  }
}

export async function getCustomerInquiries(): Promise<CustomerInquiry[]> {
  try {
    const response = await userApi.get('/inquiries');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch customer inquiries:', error);
    // Return mock data as fallback
    return [
      { id: 1, customer: 'Rohit Verma', message: 'Can I get a discount?', time: '5 min ago' },
      { id: 2, customer: 'Neha Patel', message: 'Is breakfast included?', time: '20 min ago' },
    ];
  }
}

export async function createAgentPackage(packageData: Partial<AgentPackage>): Promise<AgentPackage> {
  try {
    // Get current user to set agent ID
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    const userData = JSON.parse(currentUser);
    const packageWithAgent = {
      ...packageData,
      createdByAgentId: userData.userId || 1
    };
    
    const response = await packageApi.post('/', packageWithAgent);
    return response.data;
  } catch (error) {
    console.error('Failed to create agent package:', error);
    throw error;
  }
}

export async function updateAgentPackage(packageId: number, packageData: Partial<AgentPackage>): Promise<AgentPackage> {
  try {
    const response = await packageApi.put(`/${packageId}`, packageData);
    return response.data;
  } catch (error) {
    console.error('Failed to update agent package:', error);
    throw error;
  }
}

export async function deleteAgentPackage(packageId: number): Promise<void> {
  try {
    await packageApi.delete(`/${packageId}`);
  } catch (error) {
    console.error('Failed to delete agent package:', error);
    throw error;
  }
}

export async function uploadPackageImage(packageId: number, image: File, isMain: boolean = false): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('isMain', isMain.toString());
    
    const response = await packageApi.post(`/${packageId}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to upload package image:', error);
    throw error;
  }
}

export async function updatePackageStatus(packageId: number, active: boolean): Promise<AgentPackage> {
  try {
    const response = await packageApi.put(`/${packageId}/status?active=${active}`);
    return response.data;
  } catch (error) {
    console.error('Failed to update package status:', error);
    throw error;
  }
}

export async function updateBookingStatus(bookingId: number, status: string): Promise<void> {
  try {
    await userApi.put(`/bookings/${bookingId}/status`, { status });
  } catch (error) {
    console.error('Failed to update booking status:', error);
    throw error;
  }
}

export async function respondToInquiry(inquiryId: number, response: string): Promise<void> {
  try {
    await userApi.post(`/inquiries/${inquiryId}/respond`, { response });
  } catch (error) {
    console.error('Failed to respond to inquiry:', error);
    throw error;
  }
} 