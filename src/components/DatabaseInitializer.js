'use client';

import { useEffect, useState } from 'react';

export default function DatabaseInitializer() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeDatabase = async () => {
      if (initialized) return; // Prevent multiple initializations
      
      try {
        const response = await fetch('/api/init', {
          method: 'POST',
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
          console.log('Database initialized successfully:', result.message);
          setInitialized(true);
        } else {
          console.error('Failed to initialize database:', result.error || 'Unknown error');
        }
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };

    initializeDatabase();
  }, [initialized]);

  return null; // This component doesn't render anything
}
