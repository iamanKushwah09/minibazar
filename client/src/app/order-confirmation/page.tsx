'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '../../store/hooks';
import { 
  CheckCircleIcon, 
  TruckIcon, 
  CreditCardIcon,
  HomeIcon,
  ShoppingBagIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import Header from '../../components/Header';

export default function OrderConfirmationPage() {
  const router = useRouter();
  const { currentOrder } = useAppSelector(state => state.orders);
  const { isAuthenticated } = useAppSelector(state => state.auth);

  useEffect(() => {
    // Redirect to home if no order or not authenticated
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    if (!currentOrder) {
      router.push('/');
      return;
    }
  }, [currentOrder, isAuthenticated, router]);

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

  if (!currentOrder) {
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

  const isCashOnDelivery = currentOrder.paymentMethod === 'Cash on Delivery';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
          <p className="text-lg text-gray-600 mb-2">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
          <p className="text-sm text-gray-500">
            Order #{currentOrder.id} • {formatDate(currentOrder.createdAt)}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                {currentOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 text-xs">Img</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{item.product.name}</h3>
                      <p className="text-xs text-gray-500">{item.product.brand}</p>
                      <p className="text-xs text-gray-500">
                        Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 mt-6 pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(currentOrder.total)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <TruckIcon className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Shipping Address</h2>
              </div>
              
              <div className="text-sm text-gray-700">
                <p className="font-medium">{currentOrder.shippingAddress.name}</p>
                <p>{currentOrder.shippingAddress.address}</p>
                <p>
                  {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} {currentOrder.shippingAddress.zipCode}
                </p>
                <p>{currentOrder.shippingAddress.country}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                {isCashOnDelivery ? (
                  <BanknotesIcon className="h-5 w-5 text-green-600" />
                ) : (
                  <CreditCardIcon className="h-5 w-5 text-blue-600" />
                )}
                <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-900">{currentOrder.paymentMethod}</span>
                {isCashOnDelivery && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Pay on Delivery
                  </span>
                )}
              </div>
              
              {isCashOnDelivery && (
                <p className="text-sm text-gray-600 mt-2">
                  Please have the exact amount of {formatPrice(currentOrder.total)} ready when your order is delivered.
                </p>
              )}
            </div>
          </div>

          {/* Order Status & Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
              
              {/* Status Badge */}
              <div className="mb-6">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  currentOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  currentOrder.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                  currentOrder.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                  currentOrder.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {currentOrder.status.charAt(0).toUpperCase() + currentOrder.status.slice(1)}
                </span>
              </div>

              {/* Order Timeline */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Order Placed</p>
                    <p className="text-xs text-gray-500">{formatDate(currentOrder.createdAt)}</p>
                  </div>
                </div>
                
                {currentOrder.status !== 'pending' && (
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Processing</p>
                      <p className="text-xs text-gray-500">Your order is being prepared</p>
                    </div>
                  </div>
                )}
                
                {['shipped', 'delivered'].includes(currentOrder.status) && (
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Shipped</p>
                      <p className="text-xs text-gray-500">Your order is on its way</p>
                    </div>
                  </div>
                )}
                
                {currentOrder.status === 'delivered' && (
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Delivered</p>
                      <p className="text-xs text-gray-500">Your order has been delivered</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link
                  href="/orders"
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  <ShoppingBagIcon className="h-4 w-4" />
                  <span>View All Orders</span>
                </Link>
                
                <Link
                  href="/"
                  className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  <HomeIcon className="h-4 w-4" />
                  <span>Continue Shopping</span>
                </Link>
              </div>

              {/* Customer Support */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Need Help?</h4>
                <p className="text-xs text-gray-600 mb-2">
                  If you have any questions about your order, please contact our customer support.
                </p>
                <Link
                  href="/contact"
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 