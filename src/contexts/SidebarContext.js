'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize state after hydration
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSidebarOpen = localStorage.getItem('sidebar-open');
      if (savedSidebarOpen !== null) {
        setSidebarOpen(JSON.parse(savedSidebarOpen));
      }
    }
    setIsHydrated(true);
  }, []);

  // Save sidebar open state to localStorage
  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      localStorage.setItem('sidebar-open', JSON.stringify(sidebarOpen));
    }
  }, [sidebarOpen, isHydrated]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <SidebarContext.Provider value={{
      sidebarOpen,
      setSidebarOpen,
      toggleSidebar,
      isHydrated
    }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
