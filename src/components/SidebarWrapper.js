'use client';

import { useSidebar } from '@/contexts/SidebarContext';
import Sidebar from './Sidebar';

export default function SidebarWrapper() {
  const { sidebarOpen, toggleSidebar, isInitialized } = useSidebar();

  console.log('SidebarWrapper render - sidebarOpen:', sidebarOpen, 'isInitialized:', isInitialized);

  // Don't render until state is initialized
  if (!isInitialized) {
    console.log('SidebarWrapper: Not initialized yet, returning null');
    return null;
  }

  console.log('SidebarWrapper: Rendering Sidebar');
  return <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />;
}
