import { getApiUrl } from './apiConfig';

export interface AssistanceRequest {
  requestId?: number;
  userId: number;
  issueDescription: string;
  status?: string;
  resolutionTime?: string;
  resolutionMessage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AssistanceResponse {
  requestId: number;
  userId: number;
  issueDescription: string;
  status: string;
  resolutionTime?: string;
  resolutionMessage?: string;
  createdAt: string;
  updatedAt: string;
}

// Submit a new assistance request
export const submitAssistanceRequest = async (requestData: AssistanceRequest): Promise<AssistanceResponse> => {
  try {
    const response = await fetch(getApiUrl('ASSISTANCE_SERVICE', ''), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to submit assistance request');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting assistance request:', error);
    throw error;
  }
};

// Get assistance requests by user ID
export const getAssistanceRequestsByUser = async (userId: number): Promise<AssistanceResponse[]> => {
  try {
    const response = await fetch(getApiUrl('ASSISTANCE_SERVICE', `/user/${userId}`));
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user assistance requests: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user assistance requests:', error);
    throw error;
  }
};

// Get all assistance requests (admin/agent)
export const getAllAssistanceRequests = async (): Promise<AssistanceResponse[]> => {
  try {
    const response = await fetch(getApiUrl('ASSISTANCE_SERVICE', ''));
    
    if (!response.ok) {
      throw new Error(`Failed to fetch assistance requests: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching assistance requests:', error);
    throw error;
  }
};

// Get assistance request by ID
export const getAssistanceRequestById = async (requestId: number): Promise<AssistanceResponse> => {
  try {
    const response = await fetch(getApiUrl('ASSISTANCE_SERVICE', `/${requestId}`));
    
    if (!response.ok) {
      throw new Error(`Failed to fetch assistance request: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching assistance request:', error);
    throw error;
  }
};

// Resolve assistance request (admin/agent)
export const resolveAssistanceRequest = async (
  requestId: number, 
  resolutionMessage: string
): Promise<AssistanceResponse> => {
  try {
    const response = await fetch(getApiUrl('ASSISTANCE_SERVICE', `/resolve/${requestId}`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resolutionMessage }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to resolve assistance request');
    }

    return await response.json();
  } catch (error) {
    console.error('Error resolving assistance request:', error);
    throw error;
  }
};

// Update assistance request status
export const updateAssistanceRequestStatus = async (
  requestId: number, 
  status: string
): Promise<AssistanceResponse> => {
  try {
    const response = await fetch(getApiUrl('ASSISTANCE_SERVICE', `/${requestId}/status`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update assistance request status');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating assistance request status:', error);
    throw error;
  }
}; 