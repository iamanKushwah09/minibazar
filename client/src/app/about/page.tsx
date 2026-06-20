'use client';

import Header from '../../components/Header';

import { 
  HeartIcon, 
  SparklesIcon, 
  GlobeAltIcon,
  UsersIcon,
  TrophyIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { useEffect, useState, useRef } from 'react';

const useInView = (options = { threshold: 0.1 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [options.threshold]);

  return [ref, isVisible] as const;
};

const AnimatedCounter = ({ target, suffix = '', prefix = '' }: { target: number, suffix?: string, prefix?: string }) => {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useInView();

  useEffect(() => {
    if (isVisible) {
      let start = 0;
      const duration = 2000;
      const increment = target / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isVisible, target]);

  return <div ref={ref}>{prefix}{count}{suffix}</div>;
};

const SlideIn = ({ children, direction = 'left', delay = 0 }: { children: React.ReactNode, direction?: 'left' | 'right', delay?: number }) => {
  const [ref, isVisible] = useInView({ threshold: 0.2 });
  
  const initialClass = direction === 'left' ? '-translate-x-[100vw] opacity-0' : 'translate-x-[100vw] opacity-0';
  const finalClass = 'translate-x-0 opacity-100';

  return (
    <div ref={ref} className="overflow-hidden">
      <div 
        className={`transition-all duration-1000 ease-out ${isVisible ? finalClass : initialClass}`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {children}
      </div>
    </div>
  );
};

export default function AboutPage() {
  const values = [
    {
      icon: HeartIcon,
      title: 'Customer First',
      description: 'We put our customers at the heart of everything we do, ensuring exceptional service and satisfaction.'
    },
    {
      icon: SparklesIcon,
      title: 'Authenticity',
      description: 'We continuously innovate while staying true to our roots to bring you the finest and most authentic spice blends.'
    },
    {
      icon: GlobeAltIcon,
      title: 'Sustainability',
      description: 'We are committed to reducing our environmental impact through sustainable farming practices and eco-friendly packaging.'
    },
    {
      icon: UsersIcon,
      title: 'Community',
      description: 'We build strong relationships with local farmers, culinary experts, and partners worldwide.'
    },
    {
      icon: TrophyIcon,
      title: 'Quality',
      description: 'We never compromise on quality, ensuring every spice batch meets our high standards.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Trust',
      description: 'We earn and maintain your trust through transparency, honesty, and reliability in delivering pure ingredients.'
    }
  ];

  const stats = [
    { target: 500, suffix: '+', label: 'Happy Customers' },
    { target: 25, suffix: '+', label: 'Premium Spices' },
    { target: 100, suffix: '%', label: 'Pure & Authentic' },
    { target: 24, suffix: '/7', label: 'Customer Support' }
  ];

  const teamMembers = [
    {
      name: 'Mr Rajendra Barua',
      role: 'Founder & Whole Time Director',
      quote: 'Welcome to Shivanya Masale. At the helm of our journey, I am driven by a vision of excellence, integrity, and authenticity. With our collective expertise, we aim to redefine the standards of culinary excellence and global spice distribution.',
      bio: 'Rajendra has over 25 years of pioneering experience in the spice trade and agricultural management. His strategic leadership has successfully scaled our operations, building trusted networks across 50+ countries. He holds an MBA in Agri-Business Management and has dedicated his career to improving global access to authentic flavors.',
      image: '/founder.jpeg',
      accentColor: 'text-blue-600',
      borderColor: 'border-[#A8D3CE]',
      notchColor: 'border-blue-600',
      imageLeft: false
    },
    {
      name: 'Mr Hariom Barua',
      role: 'Co-founder & whole-Time managing Director',
      quote: 'Tradition and integrity are the cornerstones of authentic taste. We believe in bridging the gap between traditional farming and modern quality control to bring the purest spices to your kitchen.',
      bio: 'Hariom brings with him 25 years of rich experience in food quality and spice blending. He leads our sourcing divisions, oversees quality control protocols, and ensures that every spice blend meets international food safety standards. He holds a Ph.D. in Food Science and Technology.',
      image: '/co-founder.jpeg',
      accentColor: 'text-emerald-600',
      borderColor: 'border-emerald-200',
      notchColor: 'border-emerald-600',
      imageLeft: true
    },
    {
      name: 'Mr Rahul Barua',
      role: 'General Manager (Marketing)',
      quote: 'Operational agility and supply chain resilience are what make fresh spices accessible globally. We are committed to maintaining a seamless, ethical, and highly efficient logistics network that never fails.',
      bio: 'Rahul has over 12 years of experience in agri-food supply chain logistics, operations, and regulatory compliance. He leads our state-of-the-art warehousing and distribution networks, ensuring that premium spices are transported safely, retaining their aroma, and arriving on schedule. He holds a degree in Operations and Supply Chain Management.',
      image: '/GM.jpeg',
      accentColor: 'text-purple-600',
      borderColor: 'border-purple-200',
      notchColor: 'border-purple-600',
      imageLeft: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative text-white py-24 lg:py-32 overflow-hidden">
        {/* Background Image */}
        <img 
          src="/about-bg.jpg"
          alt="Shivanya masale Background"
          className="absolute inset-0 z-0 w-full h-full object-cover"
        />
        {/* Dark Gradient Overlay for Readability */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-blue-900/80 to-purple-900/80 mix-blend-multiply" />
        <div className="absolute inset-0 z-10 bg-black/20" />
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">About Shivanya Masale</h1>
            <p className="text-xl md:text-2xl mb-8 drop-shadow-md text-blue-50">
              Your destination for premium spices. Quality, aroma, and authentic taste in every pinch.
            </p>
          </div>
        </div>
      </section>


      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <SlideIn direction="left">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Shivanya Masale was born out of a passionate desire to bring the most authentic, 
                  unadulterated spices directly from the finest farms to your kitchen. 
                  Our commitment to purity and traditional flavors runs deep in everything we do.
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  We believe that access to pure spices and traditional blends can completely transform how you cook 
                  and experience food. That's why we provide culinary essentials 
                  that combine rich heritage with rigorous modern quality standards.
                </p>
                <p className="text-lg text-gray-600">
                  We are dedicated to setting a benchmark for quality, 
                  reliability, and preserving the true authentic taste of traditional Indian masalas.
                </p>
              </div>
            </SlideIn>
            <SlideIn direction="right" delay={200}>
              <div className="rounded-2xl h-[400px] flex items-center justify-center overflow-hidden shadow-2xl ring-1 ring-gray-900/5">
                <img 
                  src="/company-img.jpg" 
                  alt="Shivanya masale Research Facility" 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </SlideIn>
          </div>
        </div>
      </section>

      {/* Leadership Team Section
      <section className="py-16 lg:py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-16 text-center lg:text-left">
            Meet Our <span className="text-blue-600">Leadership Team</span>
          </h2>
          
          <div className="space-y-24 lg:space-y-32">
            {teamMembers.map((member, index) => (
              <div 
                key={index} 
                className={`flex flex-col lg:flex-row items-center gap-16 lg:gap-24 ${
                  member.imageLeft ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className="flex-1 relative w-full pt-4">
                  <div className="absolute top-0 left-0 text-gray-200 z-10">
                    <span className="text-[120px] leading-[0.8] font-serif block">“</span>
                  </div>

                  <div className={`border-t-2 border-r-2 border-b-2 ${member.borderColor} rounded-tr-[2rem] rounded-br-[2rem] p-8 lg:p-12 pb-16 relative mt-10 border-l-0 ml-4`}>
                    <p className="text-xl lg:text-2xl text-gray-800 leading-relaxed font-medium">
                      {member.quote}
                    </p>

                    <div className={`absolute -bottom-[13px] left-[3.5rem] w-6 h-6 border-b-2 border-l-2 ${member.notchColor} bg-white transform -rotate-45 z-10`}></div>
                  </div>

                  <div className="mt-8 ml-[4.5rem]">
                    <h4 className="text-2xl font-bold text-gray-900">{member.name}</h4>
                    <p className={`font-semibold ${member.accentColor} mb-4`}>{member.role}</p>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {member.bio}
                    </p>
                  </div>
                </div>

                <div className="flex-shrink-0 relative">
                  <div className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white ring-1 ring-gray-100 transition-transform duration-500 hover:scale-105">
                    <img 
                      src={member.image} 
                      alt={`${member.name} - ${member.role}`} 
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      */}
      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">By the Numbers</h2>
            <p className="text-lg text-gray-600">
              Our impact in numbers
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                  <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              These core values guide everything we do and shape the way we serve our customers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                  <value.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl mb-8">
            To provide authentic, high-quality spices that empower people to create delicious meals, 
            while maintaining the highest standards of safety, purity, and heritage.
          </p>
          <div className="bg-white bg-opacity-10 rounded-lg p-6">
            <p className="text-lg">
              We're committed to creating a world where everyone can access the true flavors and 
              traditional culinary essentials they need to bring their cooking to life.
            </p>
          </div>
        </div>
      </section>


    </div>
  );
} 