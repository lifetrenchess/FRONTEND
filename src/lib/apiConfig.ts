// API Configuration for all backend services
export const API_CONFIG = {
  // Gateway API (main entry point)
  GATEWAY: {
    BASE_URL: 'http://localhost:9999/api',
  },
  
  // Individual microservices
  SERVICES: {
    USER_SERVICE: {
      BASE_URL: 'http://localhost:9001/api',
      ENDPOINTS: {
        USERS: '/users',
        AUTH: '/auth',
        PROFILE: '/profile',
      }
    },
    
    PACKAGE_SERVICE: {
      BASE_URL: 'http://localhost:9002/api',
      ENDPOINTS: {
        PACKAGES: '/packages',
        DESTINATIONS: '/destinations',
        SEARCH: '/search',
      }
    },
    
    BOOKING_SERVICE: {
      BASE_URL: 'http://localhost:9003/api',
      ENDPOINTS: {
        BOOKINGS: '/bookings',
        PAYMENTS: '/payments',
        PAYMENT_VERIFICATION: '/payments/verifyPayment',
      }
    },
    
    INSURANCE_SERVICE: {
      BASE_URL: 'http://localhost:9004/api',
      ENDPOINTS: {
        INSURANCE: '/insurance',
        PLANS: '/plans',
        CLAIMS: '/claims',
      }
    },
    
    ASSISTANCE_SERVICE: {
      BASE_URL: 'http://localhost:9005/api',
      ENDPOINTS: {
        ASSISTANCE: '/assistance',
        REQUESTS: '/requests',
        RESOLVE: '/resolve',
      }
    },
    
    REVIEW_SERVICE: {
      BASE_URL: 'http://localhost:8083/api',
      ENDPOINTS: {
        REVIEWS: '/reviews',
        RATINGS: '/ratings',
        FEEDBACK: '/feedback',
      }
    },
  },
  
  // Common headers
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Timeout settings
  TIMEOUT: 10000, // 10 seconds
};

// Helper function to get full URL for a service endpoint
export const getApiUrl = (service: keyof typeof API_CONFIG.SERVICES, endpoint: string): string => {
  const serviceConfig = API_CONFIG.SERVICES[service];
  return `${serviceConfig.BASE_URL}${endpoint}`;
};

// Helper function to get headers with authentication
export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  return {
    ...API_CONFIG.HEADERS,
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Helper function for API requests with error handling
export const apiRequest = async (
  url: string, 
  options: RequestInit = {}
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...API_CONFIG.HEADERS,
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
};

// Helper function for authenticated API requests
export const authenticatedApiRequest = async (
  url: string, 
  options: RequestInit = {}
): Promise<Response> => {
  return apiRequest(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });
}; 