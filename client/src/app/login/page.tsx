'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { loginUser } from '../../store/slices/authSlice';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  LockClosedIcon,
  UserIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import type { RootState } from '../../store/types';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading } = useAppSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get redirect URL from query params
  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    // If already authenticated, redirect to the intended page
    if (isAuthenticated) {
      router.push(redirect);
    }
  }, [isAuthenticated, redirect, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      await dispatch(loginUser(formData)).unwrap();
      toast.success('Login successful!');
      
      // Redirect to the intended page
      router.push(redirect);
      
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading if already authenticated and redirecting
  if (isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <LockClosedIcon className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-600">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
                placeholder="name@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-12 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                Remember me
              </label>
            </div>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
          >
            {isSubmitting || loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign in</span>
                <ArrowRightIcon className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
