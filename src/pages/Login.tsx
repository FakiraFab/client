import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Seo from '../components/Seo/Seo';
import AuthHeroImage from '../components/AuthHeroImage';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithOTP, sendOTP } = useAuth();
  const { showToast } = useToast();
  
  const [loginMode, setLoginMode] = useState<'email' | 'otp'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  
  // Email/Password form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // OTP form state
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const from = (location.state as any)?.from?.pathname || '/';

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login({ email, password });
      showToast({
        type: 'success',
        title: 'Login Successful',
        message: 'Welcome back!',
        duration: 3000,
      });
      navigate(from, { replace: true });
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Login Failed',
        message: error.response?.data?.message || 'Invalid email or password',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await sendOTP(phone);
      setOtpSent(true);
      showToast({
        type: 'success',
        title: 'OTP Sent',
        message: 'Please check your phone for the OTP',
        duration: 3000,
      });
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Failed to Send OTP',
        message: error.response?.data?.message || 'Please try again',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await loginWithOTP(phone, otp);
      showToast({
        type: 'success',
        title: 'Login Successful',
        message: 'Welcome back!',
        duration: 3000,
      });
      navigate(from, { replace: true });
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Login Failed',
        message: error.response?.data?.message || 'Invalid OTP',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Seo 
        title="Login - Fakira Fab"
        description="Login to your Fakira Fab account"
      />
      <div className="min-h-screen flex">
        {/* Left Column - Login Form */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Welcome back
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Welcome back! Please enter your details.
              </p>
              <p className="mt-4 text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="font-medium text-red-600 hover:text-red-500">
                  Sign up
                </Link>
              </p>
            </div>

            <div className="mt-8">
              <div className="mt-6">
                {/* Login mode toggle */}
                <div className="flex border-b border-gray-200 mb-6">
                  <button
                    type="button"
                    onClick={() => setLoginMode('email')}
                    className={`flex-1 py-2 text-center font-medium ${
                      loginMode === 'email'
                        ? 'text-red-600 border-b-2 border-red-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Email/Password
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMode('otp')}
                    className={`flex-1 py-2 text-center font-medium ${
                      loginMode === 'otp'
                        ? 'text-red-600 border-b-2 border-red-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    OTP Login
                  </button>
                </div>

                {loginMode === 'email' ? (
                  <form onSubmit={handleEmailLogin} className="space-y-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <div className="mt-1">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <div className="mt-1">
                        <input
                          id="password"
                          name="password"
                          type="password"
                          autoComplete="current-password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                          Remember for 30 days
                        </label>
                      </div>
                      <div className="text-sm">
                        <Link
                          to="/forgot-password"
                          className="font-medium text-red-600 hover:text-red-500"
                        >
                          Forgot password
                        </Link>
                      </div>
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Signing in...' : 'Sign in'}
                      </button>
                    </div>

                    <div className="mt-6">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500">or</span>
                        </div>
                      </div>

                      <div className="mt-6">
                        <button
                          type="button"
                          className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                          Sign in with Google
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={otpSent ? handleOTPLogin : handleSendOTP} className="space-y-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <div className="mt-1">
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          disabled={otpSent}
                          placeholder="10-digit mobile number"
                          className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm disabled:bg-gray-100"
                        />
                      </div>
                    </div>

                    {otpSent && (
                      <div>
                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                          Enter OTP
                        </label>
                        <div className="mt-1">
                          <input
                            id="otp"
                            name="otp"
                            type="text"
                            required
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="6-digit OTP"
                            maxLength={6}
                            className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading
                          ? otpSent
                            ? 'Verifying...'
                            : 'Sending OTP...'
                          : otpSent
                          ? 'Verify OTP'
                          : 'Send OTP'}
                      </button>
                    </div>

                    {otpSent && (
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setOtpSent(false);
                            setOtp('');
                          }}
                          className="text-sm text-red-600 hover:text-red-500"
                        >
                          Change phone number
                        </button>
                      </div>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Hero Image (Hidden on mobile) */}
        <div className="hidden lg:block relative w-0 flex-1">
          <AuthHeroImage />
        </div>
      </div>
    </>
  );
};

export default Login;
