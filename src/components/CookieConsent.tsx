'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = localStorage.getItem('cookies-accepted');
    if (!hasAccepted) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookies-accepted', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-consent">
      <div className="cookie-content">
        <div className="cookie-header">
          <h4>🍪 We use cookies</h4>
          <button
            onClick={acceptCookies}
            className="cookie-close"
            aria-label="Accept cookies"
          >
            <X size={16} />
          </button>
        </div>
        <p>
          This website uses cookies to enhance your experience and analyze site traffic.
          By continuing to use this site, you consent to our use of cookies.
        </p>
        <button
          onClick={acceptCookies}
          className="cookie-accept"
        >
          Accept
        </button>
      </div>
    </div>
  );
} 
