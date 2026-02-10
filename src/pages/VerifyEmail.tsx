import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useToast } from '../context/ToastContext';
import Seo from '../components/Seo/Seo';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setError('Verification token is missing');
        setIsLoading(false);
        showToast({
          type: 'error',
          title: 'Verification Failed',
          message: 'Invalid verification link',
          duration: 5000,
        });
        return;
      }

      try {
        const response = await authApi.verifyEmail(token);
        setIsVerified(true);
        showToast({
          type: 'success',
          title: 'Email Verified',
          message: response.message || 'Your email has been verified successfully',
          duration: 5000,
        });
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Email verification failed';
        setError(errorMessage);
        showToast({
          type: 'error',
          title: 'Verification Failed',
          message: errorMessage,
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams, showToast]);

  return (
    <>
      <Seo 
        title="Verify Email - Fakira Fab"
        description="Verify your email address for Fakira Fab"
      />
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {isLoading ? (
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                <p className="mt-4 text-gray-600">Verifying your email...</p>
              </div>
            ) : isVerified ? (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Email Verified Successfully!
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Your email has been verified. You can now sign in to your account.
                </p>
                <div className="mt-6">
                  <Link
                    to="/login"
                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Go to Login
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Verification Failed
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {error || 'The verification link is invalid or has expired.'}
                </p>
                <div className="mt-6 space-y-3">
                  <Link
                    to="/signup"
                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Sign Up Again
                  </Link>
                  <Link
                    to="/login"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Back to Login
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;
