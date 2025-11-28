import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * GAListener Component
 * 
 * Purpose: Tracks page views for Single Page Application (SPA) in Google Analytics 4
 * 
 * Why this is needed:
 * - Google Analytics script in index.html only tracks initial page load
 * - React Router enables client-side navigation without full page reloads
 * - Without this component, GA would miss all route changes after the initial load
 * - This listener detects route changes and manually sends page_path to GA4
 * 
 * How it works:
 * - useLocation() hook captures every route change in the application
 * - When pathname or search changes, it triggers gtag config with new page path
 * - Safely handles cases where gtag is not yet loaded
 */
const GAListener: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if gtag is available (loaded from index.html)
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      // Send page view event to Google Analytics with current route path
      window.gtag('config', 'G-PYBCDXP7R5', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location.pathname, location.search]);

  // This component doesn't render anything, it's purely for tracking
  return null;
};

export default GAListener;

// TypeScript declaration for window.gtag to avoid type errors
declare global {
  interface Window {
    gtag?: (command: string, id: string, config?: Record<string, any>) => void;
    dataLayer?: any[];
  }
}
