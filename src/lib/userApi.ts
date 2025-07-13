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
  const token = localStorage.getItem('token');
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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('currentUser');
      // Redirect to login page
      window.location.href = '/';
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
    // Updated to match new controller endpoint
    const response = await userApi.post(getApiUrl('USER_SERVICE', ''), userData);
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const apiError = error as { response?: { data?: { message?: string } } };
      if (apiError.response?.data?.message) {
        throw new Error(apiError.response.data.message);
      }
    }
    throw new Error('Registration failed. Please try again.');
  }
};

export const loginUser = async (loginData: LoginRequest): Promise<string> => {
  try {
    // Updated to match new controller endpoint
    const response = await userApi.post(getApiUrl('USER_SERVICE', '/login'), loginData);
    // Backend returns token directly as string, not wrapped in object
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const apiError = error as { response?: { data?: { message?: string } } };
      if (apiError.response?.data?.message) {
        throw new Error(apiError.response.data.message);
      }
    }
    throw new Error('Login failed. Please check your credentials.');
  }
};

export const getCurrentUser = async (): Promise<UserResponse> => {
  try {
    // Updated to match new controller endpoint
    const response = await userApi.get(getApiUrl('USER_SERVICE', '/me'));
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const apiError = error as { response?: { data?: { message?: string } } };
      if (apiError.response?.data?.message) {
        throw new Error(apiError.response.data.message);
      }
    }
    throw new Error('Failed to fetch user profile.');
  }
};

export const getUserById = async (userId: number): Promise<UserResponse> => {
  try {
    const response = await userApi.get(getApiUrl('USER_SERVICE', `/${userId}`));
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const apiError = error as { response?: { data?: { message?: string } } };
      if (apiError.response?.data?.message) {
        throw new Error(apiError.response.data.message);
      }
    }
    throw new Error('Failed to fetch user.');
  }
};

export const updateUserProfile = async (userId: number, userData: UserProfileDto): Promise<UserResponse> => {
  try {
    const response = await userApi.put(getApiUrl('USER_SERVICE', `/${userId}/profile`), userData);
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const apiError = error as { response?: { data?: { message?: string } } };
      if (apiError.response?.data?.message) {
        throw new Error(apiError.response.data.message);
      }
    }
    throw new Error('Failed to update profile.');
  }
};

export const getAllUsers = async (): Promise<UserResponse[]> => {
  try {
    const response = await userApi.get(getApiUrl('USER_SERVICE', ''));
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const apiError = error as { response?: { data?: { message?: string } } };
      if (apiError.response?.data?.message) {
        throw new Error(apiError.response.data.message);
      }
    }
    throw new Error('Failed to fetch users.');
  }
};

export const createUserByAdmin = async (userData: User): Promise<UserResponse> => {
  try {
    const response = await userApi.post(getApiUrl('USER_SERVICE', '/admin/create'), userData);
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const apiError = error as { response?: { data?: { message?: string } } };
      if (apiError.response?.data?.message) {
        throw new Error(apiError.response.data.message);
      }
    }
    throw new Error('Failed to create user.');
  }
};

export const updateUser = async (userId: number, userData: Partial<User>): Promise<UserResponse> => {
  try {
    const response = await userApi.put(getApiUrl('USER_SERVICE', `/${userId}`), userData);
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const apiError = error as { response?: { data?: { message?: string } } };
      if (apiError.response?.data?.message) {
        throw new Error(apiError.response.data.message);
      }
    }
    throw new Error('Failed to update user.');
  }
};

export const deleteUser = async (userId: number): Promise<string> => {
  try {
    const response = await userApi.delete(getApiUrl('USER_SERVICE', `/${userId}`));
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const apiError = error as { response?: { data?: { message?: string } } };
      if (apiError.response?.data?.message) {
        throw new Error(apiError.response.data.message);
      }
    }
    throw new Error('Failed to delete user.');
  }
};

export const searchUsers = async (searchCriteria: { userName?: string; userEmail?: string; userRole?: string }): Promise<UserResponse[]> => {
  try {
    const response = await userApi.post(getApiUrl('USER_SERVICE', '/search'), searchCriteria);
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const apiError = error as { response?: { data?: { message?: string } } };
      if (apiError.response?.data?.message) {
        throw new Error(apiError.response.data.message);
      }
    }
    throw new Error('Failed to search users.');
  }
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('currentUser');
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

export const getStoredUser = (): UserResponse | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const getStoredCurrentUser = (): { fullName: string; email: string; isAuthenticated: boolean; role: string } | null => {
  const currentUserStr = localStorage.getItem('currentUser');
  return currentUserStr ? JSON.parse(currentUserStr) : null;
}; 