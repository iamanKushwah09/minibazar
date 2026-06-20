'use client';

import { 
  TruckIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  MapPinIcon,
  CalendarIcon,
  PhoneIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: Array<{
    id: string;
    product: {
      name: string;
      brand: string;
      price: number;
    };
    size: string;
    color: string;
    quantity: number;
  }>;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
}

interface DeliveryStatusProps {
  orders: Order[];
  loading: boolean;
  showAll?: boolean;
}

export default function DeliveryStatus({ orders, loading, showAll = false }: DeliveryStatusProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-5 w-5" />;
      case 'processing':
        return <TruckIcon className="h-5 w-5" />;
      case 'shipped':
        return <TruckIcon className="h-5 w-5" />;
      case 'delivered':
        return <CheckCircleIcon className="h-5 w-5" />;
      case 'cancelled':
        return <ExclamationTriangleIcon className="h-5 w-5" />;
      default:
        return <ClockIcon className="h-5 w-5" />;
    }
  };

  const getDeliveryProgress = (status: string) => {
    switch (status) {
      case 'pending':
        return { progress: 25, step: 1, message: 'Order Confirmed' };
      case 'processing':
        return { progress: 50, step: 2, message: 'Processing Order' };
      case 'shipped':
        return { progress: 75, step: 3, message: 'Out for Delivery' };
      case 'delivered':
        return { progress: 100, step: 4, message: 'Delivered' };
      case 'cancelled':
        return { progress: 0, step: 0, message: 'Order Cancelled' };
      default:
        return { progress: 0, step: 0, message: 'Order Placed' };
    }
  };

  const getEstimatedDelivery = (status: string, createdAt: string) => {
    const orderDate = new Date(createdAt);
    const now = new Date();
    const daysSinceOrder = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
    
    switch (status) {
      case 'pending':
        return `Estimated delivery: ${new Date(orderDate.getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}`;
      case 'processing':
        return `Estimated delivery: ${new Date(orderDate.getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}`;
      case 'shipped':
        return `Estimated delivery: ${new Date(orderDate.getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}`;
      case 'delivered':
        return `Delivered on ${new Date(orderDate.getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}`;
      default:
        return 'Delivery date to be confirmed';
    }
  };

  const getTrackingSteps = (status: string) => {
    const steps = [
      { id: 1, name: 'Order Confirmed', description: 'Your order has been confirmed', completed: true },
      { id: 2, name: 'Processing', description: 'Your order is being prepared', completed: ['processing', 'shipped', 'delivered'].includes(status) },
      { id: 3, name: 'Shipped', description: 'Your order is on its way', completed: ['shipped', 'delivered'].includes(status) },
      { id: 4, name: 'Delivered', description: 'Your order has been delivered', completed: status === 'delivered' }
    ];
    return steps;
  };

  const activeOrders = orders.filter(order => 
    ['pending', 'processing', 'shipped'].includes(order.status)
  );
  const displayOrders = showAll ? activeOrders : activeOrders.slice(0, 3);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Loading delivery status...</p>
      </div>
    );
  }

  if (activeOrders.length === 0) {
    return (
      <div className="text-center py-12">
        <TruckIcon className="h-16 w-16 text-gray-400 mx-auto mb-6" />
        <h3 className="text-xl font-semibold text-gray-900 mb-3">No Active Deliveries</h3>
        <p className="text-gray-600 mb-6 text-lg">All your orders have been delivered or are completed</p>
        <Link
          href="/orders"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg"
        >
          <span>View Order History</span>
          <ArrowRightIcon className="h-5 w-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {displayOrders.map((order) => {
        const progress = getDeliveryProgress(order.status);
        const steps = getTrackingSteps(order.status);
        
        return (
          <div key={order.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow bg-white">
            {/* Order Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <TruckIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Order #{order.id}</h2>
                  <p className="text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-gray-900">{formatPrice(order.total)}</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="ml-1">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                </span>
              </div>
            </div>

            {/* Horizontal Timeline */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-900">{progress.message}</span>
                <span className="text-sm font-medium text-blue-600">{progress.progress}% Complete</span>
              </div>
              
              {/* Horizontal Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progress.progress}%` }}
                ></div>
              </div>

              {/* Horizontal Timeline Steps */}
              <div className="relative">
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex flex-col items-center relative z-10">
                      {/* Step Circle */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 mb-3 ${
                        step.completed 
                          ? 'bg-green-100 border-green-500 text-green-600' 
                          : 'bg-gray-100 border-gray-300 text-gray-400'
                      }`}>
                        {step.completed ? (
                          <CheckCircleIcon className="h-6 w-6" />
                        ) : (
                          <span className="text-sm font-bold">{step.id}</span>
                        )}
                      </div>
                      
                      {/* Step Label */}
                      <div className="text-center max-w-24">
                        <p className={`text-sm font-semibold ${
                          step.completed ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {step.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Connecting Lines */}
                <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>
                <div 
                  className="absolute top-6 left-0 h-0.5 bg-green-500 transition-all duration-700 ease-out -z-10"
                  style={{ width: `${progress.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Horizontal Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Delivery Address */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="bg-blue-100 p-1.5 rounded">
                    <MapPinIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900">Delivery Address</h4>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900">{order.shippingAddress.name}</p>
                  <p className="text-xs text-gray-600">{order.shippingAddress.address}</p>
                  <p className="text-xs text-gray-600">
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                  </p>
                </div>
              </div>
              
              {/* Delivery Timeline */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="bg-green-100 p-1.5 rounded">
                    <CalendarIcon className="h-4 w-4 text-green-600" />
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900">Delivery Timeline</h4>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900">
                    {getEstimatedDelivery(order.status, order.createdAt)}
                  </p>
                  {order.status === 'shipped' && (
                    <p className="text-xs text-green-600 font-medium">
                      Package is on its way! 🚚
                    </p>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="bg-purple-100 p-1.5 rounded">
                    <span className="text-purple-600 text-sm font-bold">📦</span>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900">Order Summary</h4>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900">{order.items.length} items</p>
                  <p className="text-xs text-gray-600">
                    {order.items.slice(0, 2).map(item => item.product.name).join(', ')}
                    {order.items.length > 2 && ` +${order.items.length - 2} more`}
                  </p>
                </div>
              </div>
            </div>

            {/* Horizontal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <Link
                href={`/orders/${order.id}`}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <span>View Order Details</span>
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              
              {order.status === 'shipped' && (
                <div className="flex items-center space-x-3">
                  <button className="inline-flex items-center space-x-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium">
                    <TruckIcon className="h-4 w-4" />
                    <span>Track Package</span>
                  </button>
                  <button className="inline-flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                    <PhoneIcon className="h-4 w-4" />
                    <span>Contact Support</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
      
      {!showAll && activeOrders.length > 3 && (
        <div className="text-center pt-6">
          <Link
            href="/dashboard?section=delivery"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
          >
            <span>View All Active Deliveries</span>
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>
      )}
    </div>
  );
} 