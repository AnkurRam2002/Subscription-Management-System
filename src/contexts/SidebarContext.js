'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedSidebarOpen = localStorage.getItem('sidebar-open');
      return savedSidebarOpen !== null ? JSON.parse(savedSidebarOpen) : false;
    }
    return false;
  });
  
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedCollapsed = localStorage.getItem('sidebar-collapsed');
      return savedCollapsed !== null ? JSON.parse(savedCollapsed) : false;
    }
    return false;
  });
  
  const [isInitialized, setIsInitialized] = useState(() => {
    return typeof window !== 'undefined';
  });

  // Save sidebar open state to localStorage when it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('sidebar-open', JSON.stringify(sidebarOpen));
    }
  }, [sidebarOpen, isInitialized]);

  // Save collapsed state to localStorage when it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed));
    }
  }, [isCollapsed, isInitialized]);

  const toggleSidebar = () => {
    console.log('Toggling sidebar from', sidebarOpen, 'to', !sidebarOpen);
    setSidebarOpen(!sidebarOpen);
  };
  
  const toggleCollapse = () => {
    console.log('Toggling collapse from', isCollapsed, 'to', !isCollapsed);
    setIsCollapsed(!isCollapsed);
  };

  return (
    <SidebarContext.Provider value={{
      sidebarOpen,
      isCollapsed,
      isInitialized,
      setSidebarOpen,
      setIsCollapsed,
      toggleSidebar,
      toggleCollapse
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
