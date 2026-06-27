'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchUserOrders } from '../../store/slices/orderSlice';
import { 
  ShoppingBagIcon, 
  CalendarIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import Header from '../../components/Header';

export default function OrdersPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const { orders, loading } = useAppSelector(state => state.orders);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Fetch user orders
    dispatch(fetchUserOrders());
  }, [isAuthenticated, dispatch, router]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-4 w-4" />;
      case 'processing':
        return <TruckIcon className="h-4 w-4" />;
      case 'shipped':
        return <TruckIcon className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'cancelled':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  // Filter and sort orders
  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.product.name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'price':
          return b.total - a.total;
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

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
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
              <p className="text-gray-600">Track and manage your orders</p>
            </div>
            <Link
              href="/"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ShoppingBagIcon className="h-5 w-5" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="date">Sort by Date</option>
                <option value="price">Sort by Price</option>
                <option value="status">Sort by Status</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-end">
              <span className="text-sm text-gray-600">
                {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBagIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600 mb-6">
                {orders.length === 0 
                  ? "You haven't placed any orders yet." 
                  : "No orders match your current filters."
                }
              </p>
              <Link
                href="/"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ShoppingBagIcon className="h-5 w-5" />
                <span>Start Shopping</span>
              </Link>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-semibold text-gray-900">Order #{order.id}</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{formatPrice(order.total)}</p>
                      <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-500 text-xs">Img</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{item.product.name}</h4>
                          <p className="text-xs text-gray-500">{item.product.brand}</p>
                          <p className="text-xs text-gray-500">
                            Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Shipping Address:</span> {order.shippingAddress.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Payment:</span> {order.paymentMethod}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Link
                          href={`/orders/${order.id}`}
                          className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          View Details
                        </Link>
                        {order.status === 'delivered' && (
                          <button className="px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 border border-green-600 rounded-lg hover:bg-green-50 transition-colors">
                            Write Review
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 
