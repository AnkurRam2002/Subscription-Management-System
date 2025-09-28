// Service Worker registration and management
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      console.log('Service Worker registered successfully:', registration.scope);
      
      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New content is available, notify user
            if (confirm('New version available! Reload to update?')) {
              window.location.reload();
            }
          }
        });
      });
      
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  } else {
    console.log('Service Worker not supported');
  }
};

export const unregisterServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      
      await Promise.all(
        registrations.map(registration => registration.unregister())
      );
      
      console.log('Service Workers unregistered');
    } catch (error) {
      console.error('Error unregistering Service Workers:', error);
    }
  }
};

// Check if app is online/offline
export const isOnline = () => navigator.onLine;

// Listen for online/offline events
export const addOnlineListener = (callback) => {
  if (typeof window !== 'undefined') {
    window.addEventListener('online', callback);
    window.addEventListener('offline', callback);
  }
};

export const removeOnlineListener = (callback) => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  }
};
