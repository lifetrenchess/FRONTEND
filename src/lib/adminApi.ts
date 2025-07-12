import axios from 'axios';

export interface AdminStats {
  totalUsers: number;
  totalAgents: number;
  totalBookings: number;
  totalRevenue: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

export interface Agent {
  id: number;
  name: string;
  email: string;
  status: string;
}

export interface AdminBooking {
  id: number;
  user: string;
  package: string;
  date: string;
  status: string;
}

export interface SystemActivity {
  id: number;
  action: string;
  time: string;
}

// Updated to use API Gateway
const api = axios.create({
  baseURL: 'http://localhost:9999/user-api', // Using Gateway port 9999
  timeout: 10000,
});

// Add auth token to requests - Fixed token key
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Changed from 'authToken' to 'token'
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function getAdminStats(): Promise<AdminStats> {
  try {
    const response = await api.get('/stats');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch admin stats:', error);
    // Return mock data as fallback
    return {
      totalUsers: 1240,
      totalAgents: 18,
      totalBookings: 320,
      totalRevenue: 1250000
    };
  }
}

export async function getAllUsers(): Promise<User[]> {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    // Return mock data as fallback
    return [
      { id: 1, name: 'Ayush Sharma', email: 'ayush@example.com', role: 'USER', status: 'Active' },
      { id: 2, name: 'Priya Singh', email: 'priya@example.com', role: 'USER', status: 'Active' },
    ];
  }
}

export async function getAllAgents(): Promise<Agent[]> {
  try {
    const response = await api.get('/agents');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch agents:', error);
    // Return mock data as fallback
    return [
      { id: 1, name: 'Agent One', email: 'agent1@travel.com', status: 'Active' },
      { id: 2, name: 'Agent Two', email: 'agent2@travel.com', status: 'Active' },
    ];
  }
}

export async function getAllBookings(): Promise<AdminBooking[]> {
  try {
    const response = await api.get('/bookings');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    // Return mock data as fallback
    return [
      { id: 101, user: 'Ayush Sharma', package: 'Goa', date: '2024-07-10', status: 'Confirmed' },
      { id: 102, user: 'Priya Singh', package: 'Shimla', date: '2024-07-09', status: 'Pending' },
    ];
  }
}

export async function getSystemActivity(): Promise<SystemActivity[]> {
  try {
    const response = await api.get('/activity');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch system activity:', error);
    // Return mock data as fallback
    return [
      { id: 1, action: 'User registered', time: '2 min ago' },
      { id: 2, action: 'Booking confirmed', time: '10 min ago' },
      { id: 3, action: 'Agent added', time: '1 hr ago' },
    ];
  }
}

export async function updateUserStatus(userId: number, status: string): Promise<void> {
  try {
    await api.put(`/users/${userId}/status`, { status });
  } catch (error) {
    console.error('Failed to update user status:', error);
    throw error;
  }
}

export async function updateAgentStatus(agentId: number, status: string): Promise<void> {
  try {
    await api.put(`/agents/${agentId}/status`, { status });
  } catch (error) {
    console.error('Failed to update agent status:', error);
    throw error;
  }
} 