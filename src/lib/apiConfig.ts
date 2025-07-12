// Standardized API Configuration for Travel Booking System
// Centralized configuration for all API endpoints

interface ServiceConfig {
  BASE_URL: string;
  ENDPOINTS: Record<string, any>;
}

export const API_CONFIG = {
  // API Gateway Configuration
  GATEWAY_BASE_URL: 'http://localhost:9999',
  
  // User Service Configuration
  USER_SERVICE: {
    BASE_URL: 'http://localhost:9999/user-api/users',
    ENDPOINTS: {
      REGISTER: '',
      LOGIN: '/login',
      PROFILE: '/me',
      BY_ID: (id: number) => `/${id}`,
      UPDATE_PROFILE: (id: number) => `/${id}/profile`,
      UPDATE_USER: (id: number) => `/${id}`,
      DELETE: (id: number) => `/${id}`,
      SEARCH: '/search',
    }
  } as ServiceConfig,
  
  // Package Service Configuration
  PACKAGE_SERVICE: {
    BASE_URL: 'http://localhost:9999/api/packages',
    ENDPOINTS: {
      ALL: '/',
      BY_ID: (id: number) => `/${id}`,
      CREATE: '/',
      UPDATE: (id: number) => `/${id}`,
      DELETE: (id: number) => `/${id}`,
    }
  } as ServiceConfig,
  
  // Authentication Configuration
  AUTH: {
    TOKEN_KEY: 'token',
    USER_KEY: 'user',
    CURRENT_USER_KEY: 'currentUser',
  },
  
  // Request Configuration
  REQUEST: {
    TIMEOUT: 10000,
    HEADERS: {
      'Content-Type': 'application/json',
    }
  }
};

// Helper function to get full URL for an endpoint
export const getApiUrl = (service: keyof typeof API_CONFIG, endpoint: string): string => {
  const serviceConfig = API_CONFIG[service] as ServiceConfig;
  if (serviceConfig && 'BASE_URL' in serviceConfig) {
    return `${serviceConfig.BASE_URL}${endpoint}`;
  }
  throw new Error(`Invalid service: ${service}`);
};

// Helper function to get auth token
export const getAuthToken = (): string | null => {
  return localStorage.getItem(API_CONFIG.AUTH.TOKEN_KEY);
};

// Helper function to set auth token
export const setAuthToken = (token: string): void => {
  localStorage.setItem(API_CONFIG.AUTH.TOKEN_KEY, token);
};

// Helper function to clear auth data
export const clearAuthData = (): void => {
  localStorage.removeItem(API_CONFIG.AUTH.TOKEN_KEY);
  localStorage.removeItem(API_CONFIG.AUTH.USER_KEY);
  localStorage.removeItem(API_CONFIG.AUTH.CURRENT_USER_KEY);
}; 