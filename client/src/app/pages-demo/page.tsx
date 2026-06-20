'use client';

import Link from 'next/link';
import Header from '../../components/Header';

import { 
  BriefcaseIcon, 
  ArrowUturnLeftIcon, 
  GlobeAltIcon,
  UsersIcon,
  EnvelopeIcon,
  SparklesIcon,
  TruckIcon
} from '@heroicons/react/24/outline';

export default function PagesDemo() {
  const pages = [
    {
      icon: UsersIcon,
      title: 'About Us',
      description: 'Learn about our company story, mission, and values',
      href: '/about',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: BriefcaseIcon,
      title: 'Careers',
      description: 'Join our team and explore job opportunities',
      href: '/careers',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: TruckIcon,
      title: 'Shipping',
      description: 'Shipping methods, tracking, and delivery information',
      href: '/shipping',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: ArrowUturnLeftIcon,
      title: 'Returns',
      description: 'Easy returns and exchanges process',
      href: '/returns',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: GlobeAltIcon,
      title: 'Accessibility',
      description: 'Our commitment to web accessibility',
      href: '/accessibility',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      icon: EnvelopeIcon,
      title: 'Contact',
      description: 'Get in touch with our customer service team',
      href: '/contact',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: SparklesIcon,
      title: 'Mega Menu Demo',
      description: 'Test the click-based mega menu functionality',
      href: '/mega-menu-demo',
      color: 'from-pink-500 to-pink-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Pages Demo</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Explore all the pages we've created for the Shivanya Masale ecommerce website
            </p>
          </div>
        </div>
      </section>

      {/* Pages Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Available Pages</h2>
            <p className="text-lg text-gray-600">
              Click on any page to explore its features and functionality
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pages.map((page, index) => (
              <Link
                key={index}
                href={page.href}
                className="group block"
              >
                <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className={`bg-gradient-to-r ${page.color} p-6 text-white`}>
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 rounded-lg mb-4">
                      <page.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{page.title}</h3>
                    <p className="text-white text-opacity-90">{page.description}</p>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                        Visit Page
                      </span>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h2>
            <p className="text-lg text-gray-600">
              What makes these pages special
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <SparklesIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Modern Design</h3>
              <p className="text-gray-600">Clean, responsive design that works on all devices</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                <GlobeAltIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Accessible</h3>
              <p className="text-gray-600">WCAG compliant with screen reader support</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                <BriefcaseIcon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive</h3>
              <p className="text-gray-600">Engaging forms and interactive elements</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mb-4">
                <EnvelopeIcon className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">User-Friendly</h3>
              <p className="text-gray-600">Intuitive navigation and clear information</p>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Instructions */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How to Navigate</h2>
            <p className="text-lg text-gray-600">
              You can access these pages through the main navigation
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Navigation Tips:</h3>
            <ul className="space-y-2 text-blue-800">
              <li>• Use the "More" dropdown in the main navigation to access About, Careers, Returns, Accessibility, and Contact</li>
              <li>• All pages are also accessible through the footer links</li>
              <li>• The mega menu demo shows the click-based navigation functionality</li>
              <li>• Each page is fully responsive and accessible</li>
            </ul>
          </div>
        </div>
      </section>


    </div>
  );
} 