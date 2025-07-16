import axios from 'axios';

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
    const response = await axios.post('/api/users/login', {
      username: email,
      password,
    });

    const { token, message } = response.data;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const roles: string[] = payload.roles?.map((r: any) => r.roleName) || [];
    const name: string = payload.name || email;

    if (!roles.length) {
      throw new Error('Access denied: No roles assigned.');
    }

    // Store token and user info
    localStorage.setItem('token', token);
    localStorage.setItem('user-email', email);
    localStorage.setItem('user-name', name);

    // Use our auth helper to store user info
    const user: UserInfo = {
      userId: payload.userId || 1,
      fullName: name,
      email,
      role: roles[0] as 'USER' | 'ADMIN' | 'TRAVEL_AGENT',
    };
    loginUser(user);

    return { success: true, message, user };
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
    const response = await axios.post('/api/users', userData);
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