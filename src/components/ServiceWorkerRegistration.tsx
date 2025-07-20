'use client';

import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Register service worker
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content is available
                  toast.success('New version available! Refresh to update.', {
                    duration: 5000,
                  });
                }
              });
            }
          });
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });

      // Handle service worker updates
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('New service worker activated');
      });
    }
  }, []);

  return null;
} 
