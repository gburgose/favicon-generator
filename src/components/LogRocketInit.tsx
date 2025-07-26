'use client';

import { useEffect } from 'react';
import LogRocket from 'logrocket';
// import setupLogRocketReact from 'logrocket-react'; // Temporarily disabled due to React 19 compatibility

export default function LogRocketInit() {
  useEffect(() => {
    try {
      LogRocket.init('kwz0t7/favicon-tools');

      // Setup LogRocket React integration - temporarily disabled
      // setupLogRocketReact(LogRocket);

      // Test LogRocket functionality
      LogRocket.identify('test-user', {
        name: 'Test User',
        email: 'test@example.com',
      });

    } catch (error) {
      console.error('Error initializing LogRocket:', error);
    }
  }, []);

  return null;
} 
