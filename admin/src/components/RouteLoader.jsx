import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ThemeSuspense from './theme/ThemeSuspense';

const RouteLoader = ({ children }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Show loader when route changes
    setLoading(true);
    
    // Hide loader after a short delay to give a premium feel and ensure content is ready
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600); // 600ms loader

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {loading && <ThemeSuspense />}
      {children}
    </>
  );
};

export default RouteLoader;
