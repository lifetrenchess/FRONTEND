import { UserResponse } from './userApi';

export function getCurrentUserFromStorage(): UserResponse | null {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function getUserRole(): 'USER' | 'ADMIN' | 'TRAVEL_AGENT' | null {
  // Check both 'user' and 'currentUser' in localStorage
  const user = getCurrentUserFromStorage();
  const currentUser = localStorage.getItem('currentUser');
  
  console.log('getUserRole - user from localStorage:', user);
  console.log('getUserRole - currentUser from localStorage:', currentUser);
  
  let role: string | undefined;
  
  // First try to get role from user data (from backend)
  if (user?.userRole) {
    role = user.userRole;
    console.log('getUserRole - using role from user:', role);
  } 
  // Then try to get role from currentUser data (frontend state)
  else if (currentUser) {
    try {
      const currentUserData = JSON.parse(currentUser);
      role = currentUserData.role;
      console.log('getUserRole - using role from currentUser:', role);
    } catch (error) {
      console.error('Error parsing currentUser:', error);
    }
  }
  
  console.log('getUserRole - final role before normalization:', role);
  
  // Normalize role names to match expected values
  if (role) {
    const normalizedRole = role.toUpperCase().trim();
    console.log('getUserRole - normalized role:', normalizedRole);
    
    if (normalizedRole === 'USER' || normalizedRole === 'ADMIN' || normalizedRole === 'TRAVEL_AGENT') {
      console.log('getUserRole - returning normalized role:', normalizedRole);
      return normalizedRole as 'USER' | 'ADMIN' | 'TRAVEL_AGENT';
    }
    // Handle potential variations
    if (normalizedRole === 'AGENT') {
      console.log('getUserRole - converting AGENT to TRAVEL_AGENT');
      return 'TRAVEL_AGENT';
    }
  }
  
  console.log('getUserRole - no valid role found, returning null');
  return null;
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem('token');
} 

export const getStoredCurrentUser = (): { fullName: string; email: string; isAuthenticated: boolean; role: string } | null => {
  const currentUserStr = localStorage.getItem('currentUser');
  return currentUserStr ? JSON.parse(currentUserStr) : null;
}; 