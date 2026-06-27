'use client';

import { useState } from 'react';
import Header from '../../components/Header';

import { 
  TruckIcon, 
  ClockIcon, 
  MapPinIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

export default function ShippingPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('US');

  const shippingMethods = [
    {
      name: 'Standard Shipping',
      description: 'Free on orders over $50',
      price: '$5.99',
      freeThreshold: '$50',
      deliveryTime: '3-5 business days',
      icon: TruckIcon,
      features: ['Tracking included', 'Signature not required', 'Standard handling']
    },
    {
      name: 'Express Shipping',
      description: 'Fast delivery for urgent orders',
      price: '$12.99',
      freeThreshold: '$100',
      deliveryTime: '1-2 business days',
      icon: ClockIcon,
      features: ['Priority handling', 'Tracking included', 'Signature not required']
    },
    {
      name: 'Overnight Shipping',
      description: 'Next day delivery',
      price: '$24.99',
      freeThreshold: '$200',
      deliveryTime: 'Next business day',
      icon: ShieldCheckIcon,
      features: ['Priority handling', 'Tracking included', 'Signature required']
    }
  ];

  const shippingZones = [
    {
      name: 'United States',
      code: 'US',
      methods: ['Standard', 'Express', 'Overnight'],
      deliveryTime: '1-5 business days',
      freeShipping: 'Orders over $50'
    },
    {
      name: 'Canada',
      code: 'CA',
      methods: ['Standard', 'Express'],
      deliveryTime: '5-10 business days',
      freeShipping: 'Orders over $75'
    },
    {
      name: 'United Kingdom',
      code: 'UK',
      methods: ['Standard', 'Express'],
      deliveryTime: '7-14 business days',
      freeShipping: 'Orders over $100'
    },
    {
      name: 'European Union',
      code: 'EU',
      methods: ['Standard', 'Express'],
      deliveryTime: '7-14 business days',
      freeShipping: 'Orders over $100'
    },
    {
      name: 'Australia',
      code: 'AU',
      methods: ['Standard', 'Express'],
      deliveryTime: '10-15 business days',
      freeShipping: 'Orders over $125'
    }
  ];

  const trackingSteps = [
    {
      step: 1,
      title: 'Order Confirmed',
      description: 'Your order has been received and confirmed',
      icon: CheckCircleIcon
    },
    {
      step: 2,
      title: 'Processing',
      description: 'Your order is being prepared for shipment',
      icon: ClockIcon
    },
    {
      icon: EnvelopeIcon,
      title: 'Email Support',
      description: 'Send us an email for accessibility assistance',
      contact: 'accessibility@shivanyamasale.com',
      availability: 'Response within 24 hours'
    },
    {
      step: 3,
      title: 'Shipped',
      description: 'Your order has been shipped with tracking',
      icon: TruckIcon
    },
    {
      step: 4,
      title: 'Delivered',
      description: 'Your order has been delivered',
      icon: CheckCircleIcon
    }
  ];

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      // Handle tracking logic here
      alert(`Tracking order: ${trackingNumber}`);
    }
  };

  const calculateShipping = (country: string, orderValue: number) => {
    const zone = shippingZones.find(z => z.code === country);
    if (!zone) return { cost: '$5.99', free: false };

    if (country === 'US' && orderValue >= 50) return { cost: 'FREE', free: true };
    if (country === 'CA' && orderValue >= 75) return { cost: 'FREE', free: true };
    if (country === 'UK' && orderValue >= 100) return { cost: 'FREE', free: true };
    if (country === 'EU' && orderValue >= 100) return { cost: 'FREE', free: true };
    if (country === 'AU' && orderValue >= 125) return { cost: 'FREE', free: true };

    return { cost: '$5.99', free: false };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-6">
              <TruckIcon className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Shipping & Delivery</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Fast, reliable shipping to your doorstep. Track your order every step of the way.
            </p>
          </div>
        </div>
      </section>

      {/* Shipping Methods */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shipping Methods</h2>
            <p className="text-lg text-gray-600">
              Choose the shipping option that works best for you
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {shippingMethods.map((method, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                    <method.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{method.price}</div>
                    <div className="text-sm text-gray-600">Free over {method.freeThreshold}</div>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.name}</h3>
                <p className="text-gray-600 mb-4">{method.description}</p>
                
                <div className="flex items-center space-x-2 mb-4">
                  <ClockIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{method.deliveryTime}</span>
                </div>
                
                <ul className="space-y-2">
                  {method.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2 text-sm text-gray-600">
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Order Tracking */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Track Your Order</h2>
            <p className="text-lg text-gray-600">
              Enter your tracking number to see the status of your order
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
                <span>Track Order</span>
              </button>
            </form>
            
            {/* Tracking Steps */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {trackingSteps.map((step, index) => (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold mb-2">
                      {step.step}
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 mb-1">{step.title}</h4>
                    <p className="text-xs text-gray-600">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* International Shipping */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">International Shipping</h2>
            <p className="text-lg text-gray-600">
              We ship worldwide with competitive rates and reliable delivery
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shippingZones.map((zone, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-3 mb-4">
                  <GlobeAltIcon className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">{zone.name}</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Time:</span>
                    <span className="font-medium">{zone.deliveryTime}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Free Shipping:</span>
                    <span className="font-medium text-green-600">{zone.freeShipping}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Methods:</span>
                    <span className="font-medium">{zone.methods.join(', ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shipping Calculator */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shipping Calculator</h2>
            <p className="text-lg text-gray-600">
              Estimate shipping costs for your order
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination Country
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {shippingZones.map((zone) => (
                    <option key={zone.code} value={zone.code}>{zone.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Value
                </label>
                <div className="relative">
                  <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Estimated Shipping Cost:</span>
                <span className="text-xl font-bold text-blue-600">$5.99</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Free shipping available on orders over the threshold for your selected country.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping Policies */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shipping Policies</h2>
            <p className="text-lg text-gray-600">
              Important information about our shipping process
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Processing Time</h3>
              <p className="text-gray-600">
                Orders are typically processed within 1-2 business days. During peak seasons or sales, 
                processing may take 3-5 business days. You'll receive a confirmation email with 
                tracking information once your order ships.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Delivery Address</h3>
              <p className="text-gray-600">
                Please ensure your delivery address is complete and accurate. We cannot be held 
                responsible for delays or failed deliveries due to incorrect address information. 
                P.O. Box addresses are accepted for standard shipping only.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Signature Requirements</h3>
              <p className="text-gray-600">
                Overnight shipping includes signature confirmation. For other shipping methods, 
                packages may be left at your door or with a neighbor if you're not available. 
                You can request signature confirmation for an additional fee.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">International Customs</h3>
              <p className="text-gray-600">
                International orders may be subject to customs duties and taxes. These charges 
                are the responsibility of the recipient and are not included in our shipping costs. 
                Delivery times may be extended due to customs processing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Need Help with Shipping?</h2>
          <p className="text-xl mb-8">
            Our customer service team is here to help with any shipping questions or concerns.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-center justify-center space-x-3">
              <PhoneIcon className="h-6 w-6" />
              <div className="text-left">
                <p className="font-semibold">Call Us</p>
                <p className="text-blue-100">+1 (555) 123-4567</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3">
              <EnvelopeIcon className="h-6 w-6" />
              <div className="text-left">
                <p className="font-semibold">Email Us</p>
                <p className="text-blue-100">shipping@shivanyamasale.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
} 
