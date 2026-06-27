'use client';

import { useState } from 'react';
import Header from '../../components/Header';

import { 
  EyeIcon, 
  SpeakerWaveIcon, 
  CursorArrowRaysIcon,
  MagnifyingGlassIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  AdjustmentsHorizontalIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

export default function AccessibilityPage() {
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const accessibilityFeatures = [
    {
      icon: EyeIcon,
      title: 'Screen Reader Support',
      description: 'Full compatibility with screen readers including JAWS, NVDA, and VoiceOver',
      details: [
        'Semantic HTML structure',
        'ARIA labels and descriptions',
        'Proper heading hierarchy',
        'Alt text for all images'
      ]
    },
    {
      icon: SpeakerWaveIcon,
      title: 'Keyboard Navigation',
      description: 'Complete website functionality accessible via keyboard only',
      details: [
        'Tab navigation support',
        'Skip to main content links',
        'Focus indicators',
        'Keyboard shortcuts'
      ]
    },
    {
      icon: MagnifyingGlassIcon,
      title: 'Text Scaling',
      description: 'Text can be resized up to 200% without loss of functionality',
      details: [
        'Responsive text scaling',
        'Maintains layout integrity',
        'No horizontal scrolling required',
        'Clear typography hierarchy'
      ]
    },
    {
      icon: CursorArrowRaysIcon,
      title: 'Color and Contrast',
      description: 'High contrast ratios and color-independent information',
      details: [
        'WCAG AA contrast compliance',
        'Color is not the only way to convey information',
        'High contrast mode support',
        'Customizable color schemes'
      ]
    },
    {
      icon: ComputerDesktopIcon,
      title: 'Responsive Design',
      description: 'Accessible across all devices and screen sizes',
      details: [
        'Mobile-friendly navigation',
        'Touch-friendly interface',
        'Adaptive layouts',
        'Consistent experience'
      ]
    },
    {
      icon: DocumentTextIcon,
      title: 'Clear Content',
      description: 'Easy-to-understand language and clear navigation',
      details: [
        'Plain language writing',
        'Logical content structure',
        'Consistent terminology',
        'Clear error messages'
      ]
    }
  ];

  const wcagCompliance = [
    {
      level: 'WCAG 2.1 AA',
      status: 'Compliant',
      description: 'Our website meets WCAG 2.1 AA standards for accessibility',
      features: [
        'Perceivable: Information is presented in ways users can perceive',
        'Operable: Interface components are operable by all users',
        'Understandable: Information and operation are understandable',
        'Robust: Content is compatible with current and future technologies'
      ]
    }
  ];

  const accessibilityTools = [
    {
      name: 'Font Size Adjuster',
      description: 'Increase or decrease text size for better readability',
      action: 'Use the controls above to adjust font size'
    },
    {
      name: 'High Contrast Mode',
      description: 'Switch to high contrast colors for better visibility',
      action: 'Toggle high contrast mode using the button above'
    },
    {
      name: 'Reduced Motion',
      description: 'Reduce or eliminate animations for users with vestibular disorders',
      action: 'Enable reduced motion using the toggle above'
    }
  ];

  const contactMethods = [
    {
      icon: PhoneIcon,
      title: 'Phone Support',
      description: 'Call our accessibility support line',
      contact: '+1 (555) 123-4567',
      availability: 'Monday - Friday, 9 AM - 6 PM EST'
    },
    {
      icon: EnvelopeIcon,
      title: 'Email Support',
      description: 'Send us an email for accessibility assistance',
      contact: 'accessibility@shivanyamasale.com',
      availability: 'Response within 24 hours'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Live Chat',
      description: 'Chat with our accessibility specialists',
      contact: 'Available on website',
      availability: 'Monday - Friday, 9 AM - 6 PM EST'
    }
  ];

  const handleFontSizeChange = (size: number) => {
    setFontSize(size);
    document.documentElement.style.fontSize = `${size}px`;
  };

  const handleHighContrast = () => {
    setHighContrast(!highContrast);
    if (!highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  };

  const handleReducedMotion = () => {
    setReducedMotion(!reducedMotion);
    if (!reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-6">
              <GlobeAltIcon className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Accessibility</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              We're committed to making our website accessible to everyone, 
              regardless of ability or technology.
            </p>
          </div>
        </div>
      </section>

      {/* Accessibility Controls */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Font Size:</label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleFontSizeChange(Math.max(12, fontSize - 2))}
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
                >
                  A-
                </button>
                <span className="text-sm text-gray-600 min-w-[3rem] text-center">{fontSize}px</span>
                <button
                  onClick={() => handleFontSizeChange(Math.min(24, fontSize + 2))}
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
                >
                  A+
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">High Contrast:</label>
              <button
                onClick={handleHighContrast}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  highContrast 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {highContrast ? 'ON' : 'OFF'}
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Reduced Motion:</label>
              <button
                onClick={handleReducedMotion}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  reducedMotion 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {reducedMotion ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Accessibility Features</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We've implemented comprehensive accessibility features to ensure 
              our website is usable by everyone.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {accessibilityFeatures.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                  <feature.icon className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="space-y-1">
                  {feature.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start space-x-2 text-sm text-gray-600">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WCAG Compliance */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">WCAG Compliance</h2>
            <p className="text-lg text-gray-600">
              We follow the Web Content Accessibility Guidelines (WCAG) to ensure 
              our website meets international accessibility standards.
            </p>
          </div>
          
          {wcagCompliance.map((compliance, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{compliance.level}</h3>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {compliance.status}
                </span>
              </div>
              <p className="text-gray-600 mb-6">{compliance.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {compliance.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start space-x-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Accessibility Tools */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Accessibility Tools</h2>
            <p className="text-lg text-gray-600">
              Use these tools to customize your browsing experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {accessibilityTools.map((tool, index) => (
              <div key={index} className="text-center p-6 rounded-lg border border-gray-200">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4">
                  <AdjustmentsHorizontalIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{tool.name}</h3>
                <p className="text-gray-600 mb-3">{tool.description}</p>
                <p className="text-sm text-gray-500">{tool.action}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Accessibility Support</h2>
            <p className="text-lg text-gray-600">
              Need help with accessibility? Our team is here to assist you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                  <method.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-gray-600 mb-3">{method.description}</p>
                <p className="text-blue-600 font-medium mb-2">{method.contact}</p>
                <p className="text-sm text-gray-500">{method.availability}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment Statement */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Our Accessibility Commitment</h2>
          <p className="text-xl mb-8">
            We are committed to ensuring digital accessibility for people with disabilities. 
            We are continually improving the user experience for everyone and applying 
            the relevant accessibility standards.
          </p>
          <div className="bg-white bg-opacity-10 rounded-lg p-6">
            <p className="text-lg">
              If you experience any accessibility barriers or have suggestions for improvement, 
              please contact our accessibility team. We value your feedback and are committed 
              to making our website accessible to all users.
            </p>
          </div>
        </div>
      </section>


    </div>
  );
} 
