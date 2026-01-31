import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
}

// Auth state interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Auth context interface
interface AuthContextType extends AuthState {
  login: (email: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize auth state from localStorage/token on mount
  useEffect(() => {
    const initAuth = () => {
      try {
        const token = localStorage.getItem('fakira-auth-token');
        const userStr = localStorage.getItem('fakira-user');
        
        if (token && userStr) {
          const user = JSON.parse(userStr);
          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (email: string) => {
    try {
      // TODO: Replace with actual API call
      // For now, this is a mock implementation
      const mockUser: User = {
        id: 'user-123',
        email,
        name: 'Test User',
      };
      const mockToken = 'mock-jwt-token';

      localStorage.setItem('fakira-auth-token', mockToken);
      localStorage.setItem('fakira-user', JSON.stringify(mockUser));

      setState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('fakira-auth-token');
    localStorage.removeItem('fakira-user');

    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  // Set user (for external auth updates)
  const setUser = (user: User | null) => {
    setState(prev => ({
      ...prev,
      user,
      isAuthenticated: !!user,
    }));
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
