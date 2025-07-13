// API Configuration for all backend services through API Gateway
export const API_CONFIG = {
  // Gateway API (main entry point for all services)
  GATEWAY: {
    BASE_URL: 'http://localhost:9999',
  },
  
  // Individual microservices (all requests go through gateway)
  SERVICES: {
    USER_SERVICE: {
      BASE_URL: 'http://localhost:9999/user-api',
      ENDPOINTS: {
        USERS: '/users',
        LOGIN: '/users/login',
        ME: '/users/me',
        PROFILE: '/users/profile',
      }
    },
    
    PACKAGE_SERVICE: {
      BASE_URL: 'http://localhost:9999/api/packages',
      ENDPOINTS: {
        PACKAGES: '',
        ALL_PACKAGES: '/all',
        AGENT_PACKAGES: '/agent',
        SEARCH: '/search',
        IMAGE: '/image',
        IMAGES: '/images',
        STATUS: '/status',
      }
    },
    
    BOOKING_SERVICE: {
      BASE_URL: 'http://localhost:9999/api/bookings',
      ENDPOINTS: {
        BOOKINGS: '',
        PAYMENTS: '/payments',
        PAYMENT_VERIFICATION: '/payments/verifyPayment',
      }
    },
    
    INSURANCE_SERVICE: {
      BASE_URL: 'http://localhost:9999/api/insurance',
      ENDPOINTS: {
        INSURANCE: '',
        PACKAGES: '/packages',
        SELECT: '/select',
        ADMIN_PACKAGE: '/admin/package',
        SELECTIONS_BY_BOOKING: '/selections/booking',
        SELECTIONS_BY_USER: '/selections/user',
      }
    },
    
    ASSISTANCE_SERVICE: {
      BASE_URL: 'http://localhost:9999/api/assistance',
      ENDPOINTS: {
        ASSISTANCE: '',
        USER_REQUESTS: '/user',
        RESOLVE: '/resolve',
      }
    },
    
    REVIEW_SERVICE: {
      BASE_URL: 'http://localhost:9999/api/reviews',
      ENDPOINTS: {
        REVIEWS: '',
        RESPONSE: '/response',
      }
    },
  },
  
  // Common headers
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Timeout settings
  TIMEOUT: 10000, // 10 seconds for regular requests
  UPLOAD_TIMEOUT: 30000, // 30 seconds for file uploads
};

// Helper function to get full URL for a service endpoint through API Gateway
export const getApiUrl = (service: keyof typeof API_CONFIG.SERVICES, endpoint: string): string => {
  const serviceConfig = API_CONFIG.SERVICES[service];
  const fullUrl = `${serviceConfig.BASE_URL}${endpoint}`;
  console.log(`API Gateway URL generated for ${service}: ${fullUrl}`);
  return fullUrl;
};

// Helper function to get headers with authentication
export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  const headers = {
    ...API_CONFIG.HEADERS,
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
  console.log('Auth headers generated:', headers);
  return headers;
};

// Helper function for API requests with error handling
export const apiRequest = async (
  url: string, 
  options: RequestInit = {}
): Promise<Response> => {
  console.log(`Making API Gateway request to: ${url}`);
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
    console.log(`API Gateway response status: ${response.status} for ${url}`);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error(`API Gateway request failed for ${url}:`, error);
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

 