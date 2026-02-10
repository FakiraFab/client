import apiClient from './client';
import type { 
  AuthResponse, 
  LoginCredentials, 
  SignupData,
  RefreshTokenResponse 
} from '../types/auth';

export const authApi = {
  // Signup new user
  signup: async (data: SignupData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/signup', data);
    return response.data;
  },

  // Login with email/password
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  // Send OTP to phone
  sendOTP: async (phone: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post('/auth/otp/send', { phone });
    return response.data;
  },

  // Verify OTP and login
  verifyOTP: async (phone: string, otp: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/otp/verify', { phone, otp });
    return response.data;
  },

  // Refresh access token
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  // Logout
  logout: async (): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  // Verify email with token
  verifyEmail: async (token: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post('/auth/verify-email', { token });
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (
    token: string, 
    password: string, 
    confirmPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post('/auth/reset-password', {
      token,
      password,
      confirmPassword,
    });
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: Partial<{ name: string; phone: string }>): Promise<AuthResponse> => {
    const response = await apiClient.patch('/auth/me', data);
    return response.data;
  },
};
