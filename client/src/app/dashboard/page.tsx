'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchUserOrders } from '../../store/slices/orderSlice';
import { logout } from '../../store/slices/authSlice';
import { 
  UserIcon, 
  ShoppingBagIcon, 
  MapPinIcon, 
  CogIcon,
  ArrowRightIcon,
  CalendarIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  HomeIcon,
  HeartIcon,
  CreditCardIcon,
  ChartBarIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Header from '../../components/Header';
import DashboardStats from '../../components/DashboardStats';
import ProfileInfo from '../../components/ProfileInfo';
import SavedAddresses from '../../components/SavedAddresses';
import RecentOrders from '../../components/RecentOrders';
import DeliveryStatus from '../../components/DeliveryStatus';
import WishlistSummary from '../../components/WishlistSummary';

type DashboardSection = 'overview' | 'orders' | 'delivery' | 'profile' | 'addresses' | 'wishlist' | 'settings';

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  const { orders, loading } = useAppSelector(state => state.orders);
  
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview');

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Fetch user orders
    dispatch(fetchUserOrders());
  }, [isAuthenticated, dispatch, router]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    router.push('/');
  };

  const navigationItems = [
    {
      id: 'overview' as DashboardSection,
      name: 'Dashboard Overview',
      icon: HomeIcon,
      description: 'View your account summary'
    },
    {
      id: 'orders' as DashboardSection,
      name: 'Order History',
      icon: ShoppingBagIcon,
      description: 'Track your orders and shipments'
    },
    {
      id: 'delivery' as DashboardSection,
      name: 'Delivery Status',
      icon: TruckIcon,
      description: 'Real-time delivery tracking'
    },
    {
      id: 'profile' as DashboardSection,
      name: 'Profile Settings',
      icon: UserIcon,
      description: 'Manage your account information'
    },
    {
      id: 'addresses' as DashboardSection,
      name: 'Saved Addresses',
      icon: MapPinIcon,
      description: 'Manage your shipping addresses'
    },
    {
      id: 'wishlist' as DashboardSection,
      name: 'My Wishlist',
      icon: HeartIcon,
      description: 'View your saved items'
    },
    {
      id: 'settings' as DashboardSection,
      name: 'Account Settings',
      icon: CogIcon,
      description: 'Security and preferences'
    }
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-8">
            <DashboardStats orders={orders} />
            <RecentOrders orders={orders} loading={loading} />
            <DeliveryStatus orders={orders} loading={loading} />
          </div>
        );
      case 'orders':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
              <Link
                href="/orders"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>View All Orders</span>
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
            <RecentOrders orders={orders} loading={loading} showAll={true} />
          </div>
        );
      case 'delivery':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Delivery Status</h2>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Live Updates</span>
              </div>
            </div>
            <DeliveryStatus orders={orders} loading={loading} showAll={true} />
          </div>
        );
      case 'profile':
        return <ProfileInfo user={user} />;
      case 'addresses':
        return <SavedAddresses />;
      case 'wishlist':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
              <Link
                href="/wishlist"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>View All</span>
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
            <WishlistSummary maxItems={5} />
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <BellIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <h3 className="font-medium text-gray-900">Email Notifications</h3>
                      <p className="text-sm text-gray-500">Order updates and promotions</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors">
                    Manage
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CreditCardIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <h3 className="font-medium text-gray-900">Payment Methods</h3>
                      <p className="text-sm text-gray-500">Manage your payment options</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors">
                    Manage
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CogIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <h3 className="font-medium text-gray-900">Privacy Settings</h3>
                      <p className="text-sm text-gray-500">Control your data and privacy</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors">
                    Manage
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Header /> */}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-80">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
              </div>
              <nav className="p-4">
                <ul className="space-y-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => setActiveSection(item.id)}
                          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                            activeSection === item.id
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className={`h-5 w-5 ${
                            activeSection === item.id ? 'text-blue-600' : 'text-gray-400'
                          }`} />
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.description}</p>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Orders</span>
                  <span className="text-sm font-medium text-gray-900">{orders.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">In Transit</span>
                  <span className="text-sm font-medium text-blue-600">
                    {orders.filter(o => o.status === 'shipped').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Delivered</span>
                  <span className="text-sm font-medium text-green-600">
                    {orders.filter(o => o.status === 'delivered').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Pending</span>
                  <span className="text-sm font-medium text-yellow-600">
                    {orders.filter(o => o.status === 'pending').length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {renderSectionContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 