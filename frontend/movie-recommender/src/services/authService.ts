import api from './api';

// Types
export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserData {
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
  isAdmin: boolean;
  token: string;
}

// Authentication services
const authService = {
  // Register a new user
  register: async (userData: RegisterData): Promise<UserData> => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  // Login user
  login: async (userData: LoginData): Promise<UserData> => {
    const response = await api.post('/auth/login', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  // Logout user
  logout: (): void => {
    localStorage.removeItem('token');
  },

  // Get current user profile
  getCurrentUser: async (): Promise<UserData> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData: Partial<UserData>): Promise<UserData> => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },

  // Check if user is logged in
  isLoggedIn: (): boolean => {
    return !!localStorage.getItem('token');
  },
};

export default authService; 