import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { authApi } from '../api/auth';
import type { User, LoginCredentials, SignupData } from '../types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  loginWithOTP: (phone: string, otp: string) => Promise<void>;
  sendOTP: (phone: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<{ name: string; phone: string }>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
          // Try to parse stored user
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          // Verify token is still valid by fetching current user
          try {
            const response = await authApi.getCurrentUser();
            if (response.success && response.data) {
              setUser(response.data.user);
              localStorage.setItem('user', JSON.stringify(response.data.user));
            }
          } catch (error) {
            // Token is invalid, clear storage
            console.error('Failed to verify user:', error);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const response = await authApi.login(credentials);
      
      if (response.success && response.data) {
        const { user: userData, tokens } = response.data;
        
        // Store tokens and user
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        setUser(userData);
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, []);

  const sendOTP = useCallback(async (phone: string) => {
    try {
      await authApi.sendOTP(phone);
    } catch (error) {
      console.error('Send OTP error:', error);
      throw error;
    }
  }, []);

  const loginWithOTP = useCallback(async (phone: string, otp: string) => {
    try {
      const response = await authApi.verifyOTP(phone, otp);
      
      if (response.success && response.data) {
        const { user: userData, tokens } = response.data;
        
        // Store tokens and user
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        setUser(userData);
      } else {
        throw new Error('OTP verification failed');
      }
    } catch (error) {
      console.error('OTP login error:', error);
      throw error;
    }
  }, []);

  const signup = useCallback(async (data: SignupData) => {
    try {
      const response = await authApi.signup(data);
      
      if (response.success && response.data) {
        const { user: userData, tokens } = response.data;
        
        // Store tokens and user
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        setUser(userData);
      } else {
        throw new Error('Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear storage and state regardless of API call success
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<{ name: string; phone: string }>) => {
    try {
      const response = await authApi.updateProfile(data);
      
      if (response.success && response.data) {
        const { user: userData } = response.data;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    loginWithOTP,
    sendOTP,
    signup,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
