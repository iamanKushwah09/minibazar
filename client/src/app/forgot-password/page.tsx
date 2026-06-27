'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { EnvelopeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Header from '../../components/Header';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate email
    if (!email.trim()) {
      setErrors({ email: 'Email is required' });
      return;
    }

    if (!validateEmail(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call for password reset
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real application, you would make an API call here
      // const response = await fetch('/api/forgot-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });

      setIsSubmitted(true);
      toast.success('Password reset link sent to your email!');
    } catch (error) {
      toast.error('Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <EnvelopeIcon className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="mt-6 text-3xl font-bold text-gray-900">Check Your Email</h2>
              <p className="mt-2 text-sm text-gray-600">
                We've sent a password reset link to <span className="font-medium text-gray-900">{email}</span>
              </p>
            </div>

            <div className="bg-white py-8 px-6 shadow rounded-lg">
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Send Another Email
                  </button>
                </div>

                <div className="text-center">
                  <Link
                    href="/login"
                    className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Back to Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <EnvelopeIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              Forgot Your Password?
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full px-3 py-2.5 bg-gray-50 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm`}
                  placeholder="name@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </div>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </div>

            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                Back to Login
              </Link>
            </div>
          </form>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Don't have an account?{' '}
              <Link href="/register" className="text-blue-600 hover:text-blue-500 font-medium">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 
