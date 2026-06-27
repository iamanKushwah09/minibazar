'use client';

import React from 'react';

interface LoaderProps {
  fullScreen?: boolean;
  text?: string;
}

export default function Loader({ fullScreen = true, text }: LoaderProps) {
  const containerClasses = fullScreen
    ? 'fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm transition-all duration-500'
    : 'flex flex-col items-center justify-center p-8 w-full';

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-8">
        <div className="relative flex items-center justify-center w-36 h-36 sm:w-40 sm:h-40">
          {/* Turmeric Ring (Outer) */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-400 border-r-orange-400 opacity-80 animate-[spin_3s_linear_infinite]" />
          
          {/* Chili Ring (Middle) */}
          <div className="absolute inset-3 rounded-full border-4 border-transparent border-t-red-500 border-l-red-500 opacity-80 animate-[spin_2s_linear_infinite_reverse]" />
          
          {/* Cardamom Ring (Inner) */}
          <div className="absolute inset-6 rounded-full border-4 border-transparent border-b-green-500 border-r-green-500 opacity-80 animate-[spin_1.5s_linear_infinite]" />
          
          {/* Logo container inside: perfectly centered with pulse */}
          <div className="absolute w-[80px] h-[80px] sm:w-[90px] sm:h-[90px] rounded-full bg-white shadow-[0_0_20px_rgba(0,0,0,0.1)] flex items-center justify-center p-3 animate-pulse">
            <img
              src="/shivanya-logo.jpg"
              alt="Shivanya Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        
        {text && (
          <div className="flex flex-col items-center">
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-green-600 font-bold tracking-widest text-sm sm:text-base uppercase animate-pulse">
              {text}
            </p>
            <div className="flex gap-1 mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

