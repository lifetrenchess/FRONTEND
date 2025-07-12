import axios from 'axios';
import { API_CONFIG, getApiUrl } from './apiConfig';

// Create a dedicated axios instance for user API calls
const userApi = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Configure axios interceptor to include auth token
userApi.interceptors.request.use((config) => {
  const token = localStorage.getItem(API_CONFIG.AUTH.TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor to handle auth errors
userApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem(API_CONFIG.AUTH.TOKEN_KEY);
      localStorage.removeItem(API_CONFIG.AUTH.USER_KEY);
      localStorage.removeItem(API_CONFIG.AUTH.CURRENT_USER_KEY);
      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface User {
  userName: string;
  userEmail: string;
  userPassword: string;
  userRole: string;
  userContactNumber: string;
}

export interface LoginRequest {
  userEmail: string;
  userPassword: string;
}

export interface UserResponse {
  userId: number;
  userName: string;
  userEmail: string;
  userRole: string;
  userContactNumber: string;
  userCreatedAt: string;
  userUpdatedAt: string;
}

export interface UserProfileDto {
  userName: string;
  userEmail: string;
  userContactNumber: string;
}

export const registerUser = async (userData: User): Promise<void> => {
  try {
    const response = await userApi.post(getApiUrl('USER_SERVICE', API_CONFIG.USER_SERVICE.ENDPOINTS.REGISTER), userData);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Registration failed. Please try again.');
  }
};

export const loginUser = async (loginData: LoginRequest): Promise<string> => {
  try {
    const response = await userApi.post(getApiUrl('USER_SERVICE', API_CONFIG.USER_SERVICE.ENDPOINTS.LOGIN), loginData);
    // Backend returns token directly as string, not wrapped in object
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Login failed. Please check your credentials.');
  }
};

export const getCurrentUser = async (): Promise<UserResponse> => {
  try {
    const response = await userApi.get(getApiUrl('USER_SERVICE', API_CONFIG.USER_SERVICE.ENDPOINTS.PROFILE));
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch user profile.');
  }
};

export const getUserById = async (userId: number): Promise<UserResponse> => {
  try {
    const response = await userApi.get(getApiUrl('USER_SERVICE', API_CONFIG.USER_SERVICE.ENDPOINTS.BY_ID(userId)));
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch user.');
  }
};

export const updateUserProfile = async (userId: number, userData: UserProfileDto): Promise<UserResponse> => {
  try {
    const response = await userApi.put(getApiUrl('USER_SERVICE', API_CONFIG.USER_SERVICE.ENDPOINTS.UPDATE_PROFILE(userId)), userData);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to update profile.');
  }
};

export const getAllUsers = async (): Promise<UserResponse[]> => {
  try {
    const response = await userApi.get(getApiUrl('USER_SERVICE', API_CONFIG.USER_SERVICE.ENDPOINTS.ALL));
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch users.');
  }
};

export const logout = (): void => {
  localStorage.removeItem(API_CONFIG.AUTH.TOKEN_KEY);
  localStorage.removeItem(API_CONFIG.AUTH.USER_KEY);
  localStorage.removeItem(API_CONFIG.AUTH.CURRENT_USER_KEY);
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem(API_CONFIG.AUTH.TOKEN_KEY);
};

export const getStoredUser = (): UserResponse | null => {
  const userStr = localStorage.getItem(API_CONFIG.AUTH.USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

export const getStoredCurrentUser = (): { fullName: string; email: string; isAuthenticated: boolean; role: string } | null => {
  const currentUserStr = localStorage.getItem(API_CONFIG.AUTH.CURRENT_USER_KEY);
  return currentUserStr ? JSON.parse(currentUserStr) : null;
}; 