'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Loader from './Loader';

export default function RouteLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  // Hide loader when the route change completes
  useEffect(() => {
    setLoading(false);
  }, [pathname, searchParams]);

  // Intercept all link clicks to show the loader immediately
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      
      const href = target.getAttribute('href');
      const isBlank = target.getAttribute('target') === '_blank';
      
      // If it's a relative/internal link and not a hash link or new tab
      if (href && (href.startsWith('/') || href.startsWith(window.location.origin)) && !href.startsWith('#') && !isBlank) {
        // Only show if it's actually navigating to a new path
        const targetPath = href.replace(window.location.origin, '').split('?')[0];
        if (targetPath !== pathname) {
          setLoading(true);
        }
      }
    };

    // Use capturing phase to ensure we catch it before default behaviors
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [pathname]);

  if (!loading) return null;

  return <Loader text="Shivanya Masale" />;
}
