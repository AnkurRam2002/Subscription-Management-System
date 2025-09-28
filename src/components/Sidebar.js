'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useSidebar } from '@/contexts/SidebarContext';
import Icon from '@/components/Icon';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar, isHydrated } = useSidebar();

  // Don't render until hydrated
  if (!isHydrated) {
    return null;
  }


  const menuItems = [
    {
      name: 'Dashboard',
      icon: 'home',
      path: '/',
      description: 'View all subscriptions'
    },
    {
      name: 'Analytics',
      icon: 'chart',
      path: '/analytics',
      description: 'View spending insights and charts'
    },
    {
      name: 'Add Subscription',
      icon: 'plus',
      path: '/add-subscription',
      description: 'Add a new subscription'
    },
    {
      name: 'Settings',
      icon: 'settings',
      path: '/settings',
      description: 'Manage preferences and currency'
    }
  ];

  return (
    <>
      {/* Mobile Menu Button - Fixed Position */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg border border-slate-200 hover:bg-slate-50 transition-colors lg:hidden"
      >
        <Icon name="menu" className="w-6 h-6 text-slate-600" />
      </button>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-50 transform transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        shadow-lg lg:shadow-none
      `}>
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Menu</h2>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Icon name="close" className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav className="p-4 flex-1">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <li key={item.name}>
                    <button
                      onClick={() => {
                        router.push(item.path);
                        // Only close sidebar on mobile after navigation
                        if (window.innerWidth < 1024) {
                          toggleSidebar();
                        }
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors group ${
                        isActive 
                          ? 'bg-blue-50 border border-blue-200' 
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className={`p-2 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-blue-100' 
                          : 'bg-slate-100 group-hover:bg-blue-100'
                      }`}>
                        <Icon 
                          name={item.icon} 
                          className={`w-5 h-5 transition-colors ${
                            isActive 
                              ? 'text-blue-600' 
                              : 'text-slate-600 group-hover:text-blue-600'
                          }`} 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium transition-colors ${
                          isActive 
                            ? 'text-blue-600' 
                            : 'text-slate-900 group-hover:text-blue-600'
                        }`}>
                          {item.name}
                        </div>
                        <div className="text-sm text-slate-500 truncate">
                          {item.description}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200">
            <div className="text-xs text-slate-500 text-center">
              Subscription Manager v1.0
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
