'use client';

import { 
  ShoppingBagIcon, 
  CalendarIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
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

interface RecentOrdersProps {
  orders: Order[];
  loading: boolean;
  showAll?: boolean;
}

export default function RecentOrders({ orders, loading, showAll = false }: RecentOrdersProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
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

  const displayOrders = showAll ? orders : orders.slice(0, 3);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <ShoppingBagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
        <p className="text-gray-600 mb-4">Start shopping to see your orders here</p>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayOrders.map((order) => (
        <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-900">Order #{order.id}</span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span className="ml-1">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
              </span>
            </div>
            <span className="text-sm font-medium text-gray-900">{formatPrice(order.total)}</span>
          </div>
          
          <div className="space-y-2">
            {order.items.slice(0, 2).map((item) => (
              <div key={item.id} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-gray-500 text-xs">Img</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                  <p className="text-xs text-gray-500">
                    {item.size} • {item.color} • Qty: {item.quantity}
                  </p>
                </div>
              </div>
            ))}
            {order.items.length > 2 && (
              <p className="text-xs text-gray-500">+{order.items.length - 2} more items</p>
            )}
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center">
                <CalendarIcon className="h-3 w-3 mr-1" />
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
              <Link
                href={`/orders/${order.id}`}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      ))}
      
      {!showAll && orders.length > 3 && (
        <div className="text-center pt-4">
          <Link
            href="/orders"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <span>View All Orders</span>
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
} 
