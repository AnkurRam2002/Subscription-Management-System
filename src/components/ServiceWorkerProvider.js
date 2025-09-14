'use client';

import { useEffect } from 'react';
import { registerServiceWorker } from '@/utils/serviceWorker';

export default function ServiceWorkerProvider({ children }) {
  useEffect(() => {
    // Register service worker on client side
    registerServiceWorker();
  }, []);

  return <>{children}</>;
}
