'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { createOrder } from '../store/slices/orderSlice';
import { clearCart } from '../store/slices/cartSlice';
import { useCalculateShippingMutation } from '../store/slices/clientShippingApiSlice';
import { 
  CreditCardIcon, 
  TruckIcon, 
  LockClosedIcon,
  CheckIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { showingTranslateValue } from '../lib/utils';

export default function CheckoutForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, total } = useAppSelector(state => state.cart);
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [calculateShippingApi] = useCalculateShippingMutation();
  const [shippingInfo, setShippingInfo] = useState({ cost: 0, distance: 0, strategy: '' });
  const [paymentMethod, setPaymentMethod] = useState<'credit-card' | 'cash-on-delivery'>('credit-card');
  const [formData, setFormData] = useState({
    // Shipping Address
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    
    // Payment
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    
    // Additional
    saveAddress: true,
    savePayment: false,
  });

  const [guestFormData, setGuestFormData] = useState({
    customer: '',
    phone: '',
    transportStation: '',
    remarks: '',
  });

  const handleGuestInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGuestFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const shippingCost = shippingInfo.cost;
  const finalTotal = total + shippingCost;

  const totalSavings = items.reduce((sum, item) => {
    const originalPrice = item.product.prices?.originalPrice;
    const price = item.product.prices?.price;
    if (originalPrice && price && originalPrice > price) {
      return sum + (originalPrice - price) * item.quantity;
    }
    return sum;
  }, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddressBlur = async () => {
    // Only call if we have items
    if (total > 0) {
      try {
        // In a full implementation, Google Places Autocomplete would provide exact lat/long.
        // Using sample coordinates here (Delhi coordinates).
        const lat = 28.7041; 
        const lng = 77.1025;
        
        toast.loading('Calculating shipping...', { id: 'shipping-toast' });
        
        const res = await calculateShippingApi({ latitude: lat, longitude: lng, orderAmount: total }).unwrap();
        if (res?.data) {
          setShippingInfo({
            cost: res.data.shippingCharge,
            distance: res.data.distanceKm,
            strategy: res.data.shippingStrategy
          });
          toast.success(`Shipping calculated: ₹${res.data.shippingCharge} for ${res.data.distanceKm}km`, { id: 'shipping-toast' });
        }
      } catch (err) {
        toast.error('Failed to calculate dynamic shipping.', { id: 'shipping-toast' });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isAuthenticated) {
      // Basic validation for shipping address
      if (!formData.firstName || !formData.lastName || !formData.email || 
          !formData.address || !formData.city || !formData.state || !formData.zipCode) {
        toast.error('Please fill in all required shipping address fields');
        return;
      }

      // Payment method specific validation
      if (paymentMethod === 'credit-card') {
        if (!formData.cardNumber || !formData.cardName || !formData.expiryMonth || 
            !formData.expiryYear || !formData.cvv) {
          toast.error('Please fill in all required payment fields');
          return;
        }
      }

      setIsProcessing(true);

      try {
        const orderData = {
          cart: items.map(item => ({
            _id: item.product._id,
            id: item.product._id,
            title: showingTranslateValue(item.product.title),
            image: item.product.image || [],
            price: item.product.prices.price,
            originalPrice: item.product.prices.originalPrice,
            quantity: item.quantity,
            itemTotal: item.product.prices.price * item.quantity,
            color: item.color || '',
            size: item.size || ''
          })),
          total: finalTotal,
          subTotal: total,
          discount: 0,
          shippingCost: shippingCost,
          paymentMethod: paymentMethod === 'credit-card' ? 'Credit Card' : 'Cash on Delivery',
          user_info: {
            name: `${formData.firstName} ${formData.lastName}`,
            contact: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          }
        };

        await dispatch(createOrder(orderData)).unwrap();
        
        // Clear cart after successful order
        dispatch(clearCart());
        toast.success('Order placed successfully!');
        router.push('/order-confirmation');
        
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to place order. Please try again.';
        toast.error(errorMessage);
      } finally {
        setIsProcessing(false);
      }
    } else {
      // Guest Checkout Flow
      if (!guestFormData.customer || !guestFormData.phone || !guestFormData.transportStation) {
        toast.error('Please fill in Customer Name, Phone Number, and Transport/Station');
        return;
      }

      setIsProcessing(true);

      try {
        const orderData = {
          cart: items.map(item => ({
            _id: item.product._id,
            id: item.product._id,
            title: showingTranslateValue(item.product.title),
            image: item.product.image || [],
            price: item.product.prices.price,
            originalPrice: item.product.prices.originalPrice,
            quantity: item.quantity,
            itemTotal: item.product.prices.price * item.quantity,
            color: item.color || '',
            size: item.size || ''
          })),
          total: finalTotal,
          subTotal: total,
          discount: 0,
          shippingCost: shippingCost,
          paymentMethod: 'Cash on Delivery',
          user_info: {
            name: guestFormData.customer,
            contact: guestFormData.phone,
            address: guestFormData.transportStation,
            remarks: guestFormData.remarks,
            city: '',
            state: '',
            zipCode: '',
            country: 'India',
          }
        };

        await dispatch(createOrder(orderData)).unwrap();
        
        // Clear cart after successful order
        dispatch(clearCart());
        toast.success('Order placed successfully!');
        router.push('/order-confirmation');
        
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to place order. Please try again.';
        toast.error(errorMessage);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
        <p className="text-gray-600">Complete your purchase</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="xl:col-span-2 space-y-8 min-w-0">
          {isAuthenticated ? (
            <>
              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <TruckIcon className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Shipping Address</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      onBlur={handleAddressBlur}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="USA">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="UK">United Kingdom</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="saveAddress"
                      checked={formData.saveAddress}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Save this address for future orders</span>
                  </label>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <CreditCardIcon className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
                </div>
                
                {/* Payment Method Selection */}
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === 'credit-card' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credit-card"
                        checked={paymentMethod === 'credit-card'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'credit-card' | 'cash-on-delivery')}
                        className="sr-only"
                      />
                      <div className="flex items-center space-x-3">
                        <CreditCardIcon className="h-6 w-6 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">Credit Card</p>
                          <p className="text-sm text-gray-500">Pay securely with your card</p>
                        </div>
                      </div>
                      {paymentMethod === 'credit-card' && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </label>

                    <label className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === 'cash-on-delivery' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash-on-delivery"
                        checked={paymentMethod === 'cash-on-delivery'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'credit-card' | 'cash-on-delivery')}
                        className="sr-only"
                      />
                      <div className="flex items-center space-x-3">
                        <BanknotesIcon className="h-6 w-6 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900">Cash on Delivery</p>
                          <p className="text-sm text-gray-500">Pay when you receive your order</p>
                        </div>
                      </div>
                      {paymentMethod === 'cash-on-delivery' && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Credit Card Form - Only show if credit card is selected */}
                {paymentMethod === 'credit-card' && (
                  <div className="space-y-4 border-t border-gray-200 pt-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required={paymentMethod === 'credit-card'}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name on Card *
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required={paymentMethod === 'credit-card'}
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Month *
                        </label>
                        <select
                          name="expiryMonth"
                          value={formData.expiryMonth}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          required={paymentMethod === 'credit-card'}
                        >
                          <option value="">MM</option>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                            <option key={month} value={month.toString().padStart(2, '0')}>
                              {month.toString().padStart(2, '0')}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Year *
                        </label>
                        <select
                          name="expiryYear"
                          value={formData.expiryYear}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          required={paymentMethod === 'credit-card'}
                        >
                          <option value="">YYYY</option>
                          {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV *
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          maxLength={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          required={paymentMethod === 'credit-card'}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="savePayment"
                          checked={formData.savePayment}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Save this payment method for future orders</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Cash on Delivery Notice */}
                {paymentMethod === 'cash-on-delivery' && (
                  <div className="border-t border-gray-200 pt-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <BanknotesIcon className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-green-800">Cash on Delivery</h4>
                          <p className="text-sm text-green-700 mt-1">
                            You'll pay the full amount of {formatPrice(finalTotal)} when your order is delivered. 
                            Please have the exact amount ready for the delivery person.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            // Guest Checkout Layout styled exactly like selectionfootwear.com
            <div className="space-y-8">
              {/* 01. Personal Details */}
              <div className="bg-white rounded-2xl border border-gray-150 p-6 md:p-8 shadow-sm">
                <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                  <span className="text-[#00B074] text-xl font-bold">01.</span> Personal Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                      Customer *
                    </label>
                    <input
                      type="text"
                      name="customer"
                      placeholder="Customer"
                      value={guestFormData.customer}
                      onChange={handleGuestInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:ring-4 focus:ring-[#00B074]/10 focus:border-[#00B074] transition-all placeholder:text-gray-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+91-XXX-XXX-XX"
                      value={guestFormData.phone}
                      onChange={handleGuestInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:ring-4 focus:ring-[#00B074]/10 focus:border-[#00B074] transition-all placeholder:text-gray-300"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* 02. Shipping Details */}
              <div className="bg-white rounded-2xl border border-gray-150 p-6 md:p-8 shadow-sm">
                <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                  <span className="text-[#00B074] text-xl font-bold">02.</span> Shipping Details
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                      Transport/Station *
                    </label>
                    <input
                      type="text"
                      name="transportStation"
                      placeholder="Transport/Station"
                      value={guestFormData.transportStation}
                      onChange={handleGuestInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:ring-4 focus:ring-[#00B074]/10 focus:border-[#00B074] transition-all placeholder:text-gray-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                      Remarks
                    </label>
                    <textarea
                      name="remarks"
                      placeholder="Remarks"
                      rows={3}
                      value={guestFormData.remarks}
                      onChange={handleGuestInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:ring-4 focus:ring-[#00B074]/10 focus:border-[#00B074] transition-all placeholder:text-gray-300"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="xl:col-span-1 min-w-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            {/* Cart Items */}
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-xs">Img</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {showingTranslateValue(item.product.title)}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {item.size} • {item.color} • Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {formatPrice(item.product.prices.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Totals */}
            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">{formatPrice(total)}</span>
              </div>
              
              {totalSavings > 0 && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Total discount </span>
                  <span className='font-medium text-gray-900'>{formatPrice(totalSavings)}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Shipping {shippingInfo.distance > 0 && `(${shippingInfo.distance} km)`}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">
                    {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
                  </span>
                </div>
              </div>

              {/* Dynamic Shipping Trigger */}
              <button 
                type="button" 
                onClick={handleAddressBlur}
                className="w-full mt-2 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 py-2 rounded transition-colors font-medium border border-blue-200"
              >
                Calculate Dynamic Shipping
              </button>



              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            {isAuthenticated && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <LockClosedIcon className="h-4 w-4" />
                  <span>
                    {paymentMethod === 'credit-card' 
                      ? 'Secure checkout powered by Stripe' 
                      : 'Safe and secure cash on delivery'
                    }
                  </span>
                </div>
              </div>
            )}
            {/* Place Order Button */}
            {isAuthenticated && (
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-5 w-5" />
                    <span>Place Order</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Guest Checkout Actions (Placed at the bottom for all screens) */}
        {!isAuthenticated && (
          <div className="xl:col-span-3 border-t border-gray-200 pt-6 mt-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-gray-800 transition-colors w-full sm:w-auto justify-center sm:justify-start"
              >
                <span>←</span> Continue Shopping
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full sm:w-auto bg-blue-600 text-white py-4 px-10 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#009b65] transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xl shadow-[#00B074]/20 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Confirm Order →'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
    </>
  );
} 