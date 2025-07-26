'use client';

import { useEffect } from 'react';
import LogRocket from 'logrocket';

export default function LogRocketInit() {
  useEffect(() => {
    console.log('Initializing LogRocket...');
    LogRocket.init('kwz0t7/favicon-tools');
    console.log('LogRocket initialized successfully');
  }, []);

  return null;
} 
