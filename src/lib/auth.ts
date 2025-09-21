// Utility functions for authentication

export interface User {
  userId: string;
  email: string;
  username: string;
  fullName: string;
  avatar?: string;
  subscription: 'premium' | 'basic' | 'free';
  socialAccountsConnected: string[];
  aiPreferences: {
    contentStyle: string;
    postingFrequency: string;
    preferredTimes: string[];
  };
}

// Check if user is authenticated by verifying token with server
export async function checkAuth(): Promise<{ isAuthenticated: boolean; user?: User }> {
  try {
    const response = await fetch('/api/auth/verify', {
      method: 'GET',
      credentials: 'include', // Include cookies
    });

    if (response.ok) {
      const data = await response.json();
      return {
        isAuthenticated: true,
        user: data.user,
      };
    } else {
      // Clear any stale localStorage data
      localStorage.removeItem('user');
      return { isAuthenticated: false };
    }
  } catch (error) {
    console.error('Auth check failed:', error);
    localStorage.removeItem('user');
    return { isAuthenticated: false };
  }
}

// Get user from localStorage (for immediate access, but should be verified with server)
export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing stored user:', error);
    localStorage.removeItem('user');
    return null;
  }
}

// Logout function
export async function logout(): Promise<void> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always clear local storage and redirect
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
}

// Redirect to login if not authenticated
export function requireAuth() {
  if (typeof window === 'undefined') return;
  
  const user = getStoredUser();
  if (!user) {
    window.location.href = '/login';
    return;
  }
  
  // Verify with server in the background
  checkAuth().then(({ isAuthenticated }) => {
    if (!isAuthenticated) {
      window.location.href = '/login';
    }
  });
}