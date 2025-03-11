import { createContext, useContext, useState, useEffect } from '@lynx-js/react';
import authService, { UserData, LoginData, RegisterData } from '../services/authService';

// Define the context type
interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  error: string | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<UserData>) => Promise<void>;
  clearError: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateUser: async () => {},
  clearError: () => {},
});

// Create a provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        if (authService.isLoggedIn()) {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        }
      } catch (err) {
        console.error('Failed to get user data:', err);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login function
  const login = async (data: LoginData) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await authService.login(data);
      setUser(userData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (data: RegisterData) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await authService.register(data);
      setUser(userData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Update user function
  const updateUser = async (data: Partial<UserData>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateUser,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the auth context
export const useAuth = () => useContext(AuthContext); 