'use client';

import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { Toaster } from 'react-hot-toast';
import Loader from '../components/Loader';

export function Providers({ children }: { children: React.ReactNode }) {
  const [showLoader, setShowLoader] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Show loader for at least 1.0s to allow hydration/resource loading, then fade out
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 1000);

    const removeTimer = setTimeout(() => {
      setShowLoader(false);
    }, 1500); // 1000ms + 500ms transition time

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  return (
    <Provider store={store}>
      {showLoader && (
        <div className={`fixed inset-0 z-[9999] transition-opacity duration-500 ease-in-out ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <Loader text="Shivanya Fresh Masale" />
        </div>
      )}
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </Provider>
  );
} 
