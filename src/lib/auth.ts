import axios from 'axios';
import { getApiUrl } from './apiConfig';

// User interface
export interface UserInfo {
  userId: number;
  fullName: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'TRAVEL_AGENT';
}

const USER_KEY = 'currentUser';

// Core user management functions
export function loginUser(user: UserInfo) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function logoutUser() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem('token');
  localStorage.removeItem('user-email');
  localStorage.removeItem('user-name');
}

export function getCurrentUser(): UserInfo | null {
  const data = localStorage.getItem(USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as UserInfo;
  } catch {
    return null;
  }
}

export function getUserRole(): UserInfo['role'] | null {
  const user = getCurrentUser();
  return user ? user.role : null;
}

export function isAuthenticated(): boolean {
  return !!getCurrentUser();
}

// Additional functions that other files expect
export function getCurrentUserFromStorage(): UserInfo | null {
  return getCurrentUser();
}

export function getStoredCurrentUser(): { fullName: string; email: string; isAuthenticated: boolean; role: string } | null {
  const user = getCurrentUser();
  if (!user) return null;
  return {
    fullName: user.fullName,
    email: user.email,
    isAuthenticated: true,
    role: user.role
  };
}

// API functions
export async function login(email: string, password: string) {
  try {
    const response = await axios.post(getApiUrl('USER_SERVICE', '/login'), {
      userEmail: email,
      userPassword: password,
    });

    console.log('Login response:', response.data);
    const token = response.data;
    
    if (!token) {
      throw new Error('No token received from server');
    }
    
    // Store token
    localStorage.setItem('token', token);
    localStorage.setItem('user-email', email);
    
    // Fetch user details from database to get actual role
    try {
      const userResponse = await axios.get(getApiUrl('USER_SERVICE', '/me'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const userData = userResponse.data;
      const name = userData.userName || email.split('@')[0];
      const role = userData.userRole || 'USER';
      
      // Store user info
      localStorage.setItem('user-name', name);

      // Use our auth helper to store user info
      const user: UserInfo = {
        userId: userData.userId || 1,
        fullName: name,
        email,
        role: role as 'USER' | 'ADMIN' | 'TRAVEL_AGENT',
      };
      loginUser(user);

      return { success: true, message: 'Login successful', user };
    } catch (userError) {
      // If /me endpoint fails, assume USER role (for new registrations)
      console.log('Could not fetch user details, assuming USER role');
      const name = email.split('@')[0];
      const role = 'USER';
      
      localStorage.setItem('user-name', name);

      const user: UserInfo = {
        userId: 1,
        fullName: name,
        email,
        role: role as 'USER' | 'ADMIN' | 'TRAVEL_AGENT',
      };
      loginUser(user);

      return { success: true, message: 'Login successful', user };
    }
  } catch (error: any) {
    console.error('Login error:', error);
    if (error.response) {
      throw new Error(error.response.data.message || 'Invalid credentials');
    } else {
      throw new Error('Login failed: Network error');
    }
  }
}

export async function register(userData: {
  userName: string;
  userEmail: string;
  userPassword: string;
  userRole: string;
  userContactNumber: string;
}) {
  try {
    const response = await axios.post(getApiUrl('USER_SERVICE', ''), userData);
    const { message } = response.data;
    return { success: true, message };
  } catch (error: any) {
    console.error('Registration error:', error);
    if (error.response) {
      throw new Error(error.response.data.message || 'Registration failed');
    } else {
      throw new Error('Registration failed: Network error');
    }
  }
} 