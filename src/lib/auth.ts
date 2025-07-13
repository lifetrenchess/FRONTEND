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
  
  if (user?.userRole) {
    role = user.userRole;
    console.log('getUserRole - using role from user:', role);
  } else if (currentUser) {
    const currentUserData = JSON.parse(currentUser);
    role = currentUserData.role;
    console.log('getUserRole - using role from currentUser:', role);
  }
  
  console.log('getUserRole - final role:', role);
  
  if (role === 'USER' || role === 'ADMIN' || role === 'TRAVEL_AGENT') {
    return role;
  }
  return null;
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem('token');
} 