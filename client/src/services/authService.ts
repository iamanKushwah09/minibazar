import api from './api';
import { User } from '../types';

export class AuthService {
  // Login user
  static async login(credentials: any): Promise<any> {
    const response = await api.post<any>('/store/customer/login', credentials);
    const { token, ...user } = response.data;
    // Store tokens
    if (token) localStorage.setItem('authToken', token);
    return response.data;
  }

  // Register user
  static async register(userData: any): Promise<any> {
    const { token: registrationToken, ...data } = userData;
    const response = await api.post<any>(`/store/customer/register/${registrationToken}`, data);
    return response.data;
  }

  // Logout user
  static async logout(): Promise<void> {
    // Clear tokens
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  }

  // Forgot password
  static async forgotPassword(email: string): Promise<void> {
    await api.put('/store/customer/forget-password', { email });
  }

  // Reset password
  static async resetPassword(body: any): Promise<void> {
    await api.put('/store/customer/reset-password', body);
  }

  // Change password
  static async changePassword(body: any): Promise<void> {
    await api.post('/store/customer/change-password', body);
  }

  // Get current user profile
  static async getCurrentUser(userId: string): Promise<User> {
    const response = await api.get<User>(`/customer/${userId}`);
    return response.data;
  }

  // Update user profile
  static async updateProfile(userId: string, profileData: any): Promise<User> {
    const response = await api.put<User>(`/customer/${userId}`, profileData);
    return response.data;
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Get stored token
  static getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Clear all auth data
  static clearAuthData(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  }
}

export default AuthService;