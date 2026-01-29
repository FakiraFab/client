export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'user' | 'admin';
  isVerified: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export interface OTPLoginData {
  phone: string;
  otp: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    user: User;
    tokens: AuthTokens;
  };
}

export interface RefreshTokenResponse {
  success: boolean;
  data: {
    accessToken: string;
  };
}
