import { User } from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

export const AuthService = {
  // Register a new user
  async register(userData: {
    name: string;
    email: string;
    password: string;
    role: string;
  }): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      
      if (response.ok) {
        // Save token to localStorage
        if (result.token) {
          localStorage.setItem('token', result.token);
        }
        return { success: true, user: result.user, token: result.token };
      } else {
        return { success: false, error: result.error || 'Registration failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  },

  // Login an existing user
  async login(credentials: {
    email: string;
    password: string;
  }): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();
      
      if (response.ok) {
        // Save token to localStorage
        if (result.token) {
          localStorage.setItem('token', result.token);
        }
        return { success: true, user: result.user, token: result.token };
      } else {
        return { success: false, error: result.error || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  },

  // Get current logged-in user
  async getCurrentUser(): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return { success: false, error: 'No authentication token found' };
      }

      const response = await fetch(`${API_BASE_URL}/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (response.ok) {
        return { success: true, user: result.user };
      } else {
        return { success: false, error: result.error || 'Failed to get user' };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  },

  // Logout
  logout() {
    localStorage.removeItem('token');
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  },
};