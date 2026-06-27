'use client';

import { useState } from 'react';
import Header from '../../components/Header';

import { 
  PhoneIcon, 
  DevicePhoneMobileIcon,
  EnvelopeIcon, 
  MapPinIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const contactInfo = [
    {
      icon: PhoneIcon,
      title: 'Phone',
      details: '+91 88598 31211',
      description: 'Call or WhatsApp us anytime'
    },
    {
      icon: PhoneIcon,
      title: 'Alternate Phones',
      details: '+91 98082 60253 / +91 98080 73446',
      description: 'Available during business hours'
    },
    /* {
      icon: EnvelopeIcon,
      title: 'Email',
      details: 'hello@shivanyamasale.com',
      description: 'We respond within 24 hours'
    }, */
    {
      icon: MapPinIcon,
      title: 'Mohini Traders',
      details: 'H. No. 635, Village Nagla Dhamali, Khandauli, Agra – 283126, UP, India',
      description: 'FSSAI Lic. No. 22726114000057'
    },
    {
      icon: ClockIcon,
      title: 'Business Hours',
      details: 'Mon - Fri: 9 AM - 6 PM EST',
      description: 'Saturday: 10 AM - 4 PM EST'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Contact form submitted:', formData);
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative text-white py-24 lg:py-32 overflow-hidden">
        {/* Background Image */}
        <img 
          src="/contact-bg.jpg"
          alt="Contact Shivanya Fresh Masale"
          className="absolute inset-0 z-0 w-full h-full object-cover"
        />
        {/* Dark Gradient Overlay for Readability */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-blue-900/80 to-purple-900/80 mix-blend-multiply" />
        <div className="absolute inset-0 z-10 bg-black/20" />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">Contact Us</h1>
            <p className="text-xl md:text-2xl mb-8 drop-shadow-md text-blue-50">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-lg text-gray-600">
              Choose your preferred way to reach us
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="text-center p-4 md:p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow bg-white w-full overflow-hidden flex flex-col items-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4 flex-shrink-0">
                  <info.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                <p className="text-blue-600 font-medium mb-2 break-all text-sm md:text-base w-full px-1">{info.details}</p>
                <p className="text-xs md:text-sm text-gray-600 px-1">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Send us a Message</h2>
              <p className="text-lg text-gray-600">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm transition-all text-gray-900 placeholder:text-gray-400"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm transition-all text-gray-900 placeholder:text-gray-400"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm transition-all text-gray-900"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="product">Product Question</option>
                  <option value="order">Order Status</option>
                  <option value="return">Return/Exchange</option>
                  <option value="support">Technical Support</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm transition-all text-gray-900 placeholder:text-gray-400"
                  placeholder="Tell us how we can help you..."
                />
              </div>
              
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Live Chat Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-8 text-white">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-6">
              <ChatBubbleLeftRightIcon className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Need Immediate Help?</h2>
            <p className="text-xl mb-6">
              Chat with our customer service team in real-time
            </p>
            <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Start Live Chat
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How can I track my order?</h3>
              <p className="text-gray-600">You can track your order by logging into your account and visiting the "My Orders" section, or by using the tracking number sent to your email.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What is your return policy?</h3>
              <p className="text-gray-600">We offer a 30-day return policy for most items. Visit our Returns page for detailed information about our return process.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Do you ship internationally?</h3>
              <p className="text-gray-600">Yes, we ship to over 50 countries worldwide. Shipping costs and delivery times vary by location.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How can I change or cancel my order?</h3>
              <p className="text-gray-600">Orders can be modified or cancelled within 1 hour of placement. Contact our customer service team immediately for assistance.</p>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
} 
