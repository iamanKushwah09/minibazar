'use client';

import { useState } from 'react';
import Header from '../../components/Header';

import { 
  ArrowUturnLeftIcon, 
  ClockIcon, 
  TruckIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  DocumentTextIcon,
  CreditCardIcon,
  ShoppingBagIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function ReturnsPage() {
  const [selectedReason, setSelectedReason] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [returnItems, setReturnItems] = useState<string[]>([]);
  const [showReturnForm, setShowReturnForm] = useState(false);

  const returnReasons = [
    'Wrong size',
    'Defective product',
    'Not as described',
    'Changed my mind',
    'Received wrong item',
    'Quality issues',
    'Other'
  ];

  const returnSteps = [
    {
      icon: DocumentTextIcon,
      title: 'Initiate Return',
      description: 'Fill out our return form with your order details and reason for return'
    },
    {
      icon: CheckCircleIcon,
      title: 'Get Approval',
      description: 'We\'ll review your return request and send you a return authorization'
    },
    {
      icon: TruckIcon,
      title: 'Ship Item Back',
      description: 'Package your item securely and ship it back using our prepaid label'
    },
    {
      icon: CreditCardIcon,
      title: 'Receive Refund',
      description: 'Once we receive and inspect your item, we\'ll process your refund'
    }
  ];

  const returnPolicy = [
    {
      title: '30-Day Return Window',
      description: 'You have 30 days from the date of delivery to initiate a return',
      icon: ClockIcon
    },
    {
      title: 'Free Return Shipping',
      description: 'We provide prepaid shipping labels for all returns within the US',
      icon: TruckIcon
    },
    {
      title: 'Full Refund',
      description: 'Receive a full refund to your original payment method',
      icon: CreditCardIcon
    },
    {
      title: 'Easy Process',
      description: 'Simple online return process with tracking and updates',
      icon: CheckCircleIcon
    }
  ];

  const nonReturnableItems = [
    'Personalized or custom items',
    'Sale items marked as final sale',
    'Items without original packaging',
    'Worn or damaged items',
    'Gift cards',
    'Digital downloads'
  ];

  const handleReturnForm = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle return form submission
    console.log('Return form submitted:', { orderNumber, email, selectedReason, returnItems });
    alert('Return request submitted successfully! You will receive an email confirmation shortly.');
    setShowReturnForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-6">
              <ArrowUturnLeftIcon className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Easy Returns</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Not satisfied with your purchase? We make returns simple and hassle-free.
            </p>
            <button 
              onClick={() => setShowReturnForm(true)}
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Return Process
            </button>
          </div>
        </div>
      </section>

      {/* Return Policy Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Return Policy</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We want you to be completely satisfied with your purchase. 
              Here's everything you need to know about our return process.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {returnPolicy.map((policy, index) => (
              <div key={index} className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                  <policy.icon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{policy.title}</h3>
                <p className="text-gray-600">{policy.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Return Process Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Returns Work</h2>
            <p className="text-lg text-gray-600">
              Follow these simple steps to return your item
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {returnSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center p-6 rounded-lg bg-white shadow-md">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                    <step.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < returnSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <div className="w-8 h-0.5 bg-gray-300"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Non-Returnable Items Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Non-Returnable Items</h2>
              <p className="text-lg text-gray-600">
                Some items cannot be returned for hygiene, safety, or customization reasons
              </p>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-red-900 mb-3">Items that cannot be returned:</h3>
                  <ul className="space-y-2">
                    {nonReturnableItems.map((item, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <XMarkIcon className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-red-800">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Return Form Modal */}
      {showReturnForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Start Return Process</h3>
                <button 
                  onClick={() => setShowReturnForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleReturnForm} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your order number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Return *
                  </label>
                  <select
                    required
                    value={selectedReason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a reason</option>
                    {returnReasons.map((reason) => (
                      <option key={reason} value={reason}>{reason}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Items to Return
                  </label>
                  <div className="space-y-2">
                    {['Item 1', 'Item 2', 'Item 3'].map((item) => (
                      <label key={item} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={returnItems.includes(item)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setReturnItems([...returnItems, item]);
                            } else {
                              setReturnItems(returnItems.filter(i => i !== item));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowReturnForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Submit Return
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How long does it take to process my return?</h3>
              <p className="text-gray-600">Returns are typically processed within 3-5 business days after we receive your item. Refunds will appear in your account within 5-10 business days.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Do I need to pay for return shipping?</h3>
              <p className="text-gray-600">No, we provide free return shipping labels for all returns within the United States. International returns may incur shipping costs.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What if my item arrives damaged?</h3>
              <p className="text-gray-600">If your item arrives damaged, please contact our customer service team immediately. We'll arrange for a replacement or refund at no additional cost.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I exchange an item instead of returning it?</h3>
              <p className="text-gray-600">Yes, you can request an exchange during the return process. Simply select "Exchange" as your return type and specify the desired replacement item.</p>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
} 
