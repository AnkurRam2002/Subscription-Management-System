'use client';

import { useSidebar } from '@/contexts/SidebarContext';
import Icon from '@/components/Icon';

export default function MainContent({ children }) {
  const { sidebarOpen, toggleSidebar, isHydrated } = useSidebar();

  // Don't render until hydrated to prevent layout shift
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="ml-0">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Menu Button - Only show when sidebar is closed */}
      {!sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-40 p-2 rounded-lg bg-white shadow-lg border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          <Icon name="menu" className="w-5 h-5 text-slate-600" />
        </button>
      )}

      <div className={`transition-all duration-300 ease-in-out ${
        sidebarOpen ? 'ml-64' : 'ml-0'
      }`}>
        {children}
      </div>
    </div>
  );
}
