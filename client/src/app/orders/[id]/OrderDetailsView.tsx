'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { fetchUserOrders } from '../../../store/slices/orderSlice';
import { 
  ArrowLeftIcon,
  CalendarIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  CreditCardIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import Header from '../../../components/Header';

export default function OrderDetailsView() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const { orders, loading } = useAppSelector(state => state.orders);
  
  const order = orders.find(o => o.id === orderId);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Fetch user orders if not already loaded
    if (orders.length === 0) {
      dispatch(fetchUserOrders());
    }
  }, [isAuthenticated, dispatch, router, orders.length]);

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
      hour: '2-digit',
      minute: '2-digit',
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

  const getPaymentIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'credit card':
        return <CreditCardIcon className="h-5 w-5" />;
      case 'cash on delivery':
        return <BanknotesIcon className="h-5 w-5" />;
      default:
        return <CreditCardIcon className="h-5 w-5" />;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-6">The order you're looking for doesn't exist or you don't have permission to view it.</p>
            <Link
              href="/orders"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span>Back to Orders</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <Link
            href="/orders"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Back to Orders</span>
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order #{order.id}</h1>
              <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span className="ml-1">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Order Items</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
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
                        <p className="text-xs text-gray-500">
                          {formatPrice(item.product.price)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Order Timeline</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircleIcon className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Order Placed</p>
                      <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  
                  {order.status !== 'cancelled' && (
                    <>
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          ['processing', 'shipped', 'delivered'].includes(order.status) 
                            ? 'bg-blue-100' 
                            : 'bg-gray-100'
                        }`}>
                          <TruckIcon className={`h-4 w-4 ${
                            ['processing', 'shipped', 'delivered'].includes(order.status) 
                              ? 'text-blue-600' 
                              : 'text-gray-400'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Processing</p>
                          <p className="text-xs text-gray-500">
                            {['processing', 'shipped', 'delivered'].includes(order.status) 
                              ? 'Order is being processed' 
                              : 'Pending'
                            }
                          </p>
                        </div>
                      </div>
                      
                      {['shipped', 'delivered'].includes(order.status) && (
                        <div className="flex items-center space-x-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            order.status === 'delivered' ? 'bg-purple-100' : 'bg-gray-100'
                          }`}>
                            <TruckIcon className={`h-4 w-4 ${
                              order.status === 'delivered' ? 'text-purple-600' : 'text-gray-400'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Shipped</p>
                            <p className="text-xs text-gray-500">
                              {order.status === 'delivered' ? 'Package has been shipped' : 'Pending'}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {order.status === 'delivered' && (
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircleIcon className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Delivered</p>
                            <p className="text-xs text-gray-500">Package has been delivered</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  
                  {order.status === 'cancelled' && (
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Order Cancelled</p>
                        <p className="text-xs text-gray-500">This order has been cancelled</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Subtotal</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatPrice(order.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Shipping</span>
                    <span className="text-sm font-medium text-gray-900">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tax</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatPrice(order.total - order.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0))}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-base font-semibold text-gray-900">Total</span>
                      <span className="text-base font-semibold text-gray-900">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Shipping Address</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">{order.shippingAddress.name}</p>
                  <p className="text-sm text-gray-600">{order.shippingAddress.address}</p>
                  <p className="text-sm text-gray-600">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                  <p className="text-sm text-gray-600">{order.shippingAddress.country}</p>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  {getPaymentIcon(order.paymentMethod)}
                  <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm font-medium text-gray-900">{order.paymentMethod}</p>
                <p className="text-xs text-gray-500 mt-1">Payment completed</p>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="space-y-3">
                  <Link
                    href="/orders"
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back to Orders
                  </Link>
                  {order.status === 'delivered' && (
                    <button className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      Write Review
                    </button>
                  )}
                  <Link
                    href="/"
                    className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
