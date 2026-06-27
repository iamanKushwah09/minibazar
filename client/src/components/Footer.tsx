'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Send, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      // { name: 'Careers', href: '/careers' },
    ],
    support: [
      { name: 'Shipping Info', href: '/shipping' },
      { name: 'Returns', href: '/returns' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Accessibility', href: '/accessibility' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', href: '#', icon: Facebook },
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'Instagram', href: '#', icon: Instagram },
    { name: 'YouTube', href: '#', icon: Youtube },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-[#0A0F1C] text-white overflow-hidden border-t border-gray-800">
      {/* Subtle Background Glow Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-900/10 rounded-full blur-3xl translate-y-1/3 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand & Contact Info Section */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="flex flex-col mb-6">
              <img 
                src="/shivanya-logo.jpg" 
                alt="Shivanya Fresh Masale" 
                className="h-14 md:h-16 w-auto object-contain brightness-110 mb-3 drop-shadow-lg" 
                style={{ maxWidth: '200px' }} 
              />
              <span className="text-xl font-black tracking-[0.15em] text-white uppercase">
                SHIVANYA FRESH <span className="text-blue-500">MASALE</span>
              </span>
            </div>
            
            <div className="text-gray-400 space-y-4 text-sm leading-relaxed">
              <p className="font-semibold text-white tracking-wide">MOHINI TRADERS</p>
              <p className="flex items-start gap-3 group">
                <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span>H. No. 635, Village Nagla Dhamali<br/>Khandauli, Agra – 283126<br/>Uttar Pradesh, India</span>
              </p>
              <p className="flex items-start gap-3 group">
                <Phone className="w-5 h-5 text-blue-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span>+91 88598 31211<br/>+91 98082 60253<br/>+91 98080 73446</span>
              </p>
              <p className="flex items-center gap-3 group font-semibold text-green-400">
                FSSAI Lic. No. 22726114000057
              </p>
              {/* <p className="flex items-center gap-3 group">
                <Mail className="w-5 h-5 text-blue-500 shrink-0 group-hover:scale-110 transition-transform" />
                <a href="mailto:hello@shivanyamasale.com" className="hover:text-blue-400 transition-colors">
                  hello@shivanyamasale.com
                </a>
              </p> */}
            </div>
          </div>

          {/* Links Section */}
          <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Company */}
            <div>
              <h3 className="text-sm font-bold tracking-wider mb-6 text-white uppercase">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 text-sm hover:text-blue-400 transition-all hover:translate-x-1 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>


          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-4 flex flex-col">
            <h3 className="text-sm font-bold tracking-wider mb-6 text-white uppercase">Stay Updated</h3>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              Subscribe to our newsletter for the latest spice blends and exclusive culinary offers.
            </p>
            <form className="relative group" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email address..."
                className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-white placeholder-gray-500 outline-none transition-all backdrop-blur-sm"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors active:scale-95 flex items-center justify-center shadow-lg shadow-blue-500/20"
                aria-label="Subscribe"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            
            {/* Social Links */}
            <div className="flex items-center space-x-5 mt-10">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all shadow-sm"
                    aria-label={social.name}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-800/80 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-sm text-gray-500">
            <p>
              © {currentYear} Barua Group Spices & Condiments. All rights reserved.
            </p>
            <span className="hidden md:inline-block w-1 h-1 rounded-full bg-gray-700"></span>
            <p>
              Developed by <a href="https://logicfirst.in/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-400 font-semibold transition-colors tracking-wide">Logicfirst</a>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 text-sm font-medium tracking-wide">
              Bringing authentic flavors to your kitchen, always.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
} 
