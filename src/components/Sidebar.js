'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useSidebar } from '@/contexts/SidebarContext';
import { useAuth } from '@/contexts/AuthContext';
import Icon from '@/components/Icon';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar, isHydrated } = useSidebar();
  const { user, logout } = useAuth();

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
        flex flex-col
      `}>
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex-shrink-0">
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
        <div className="flex flex-col flex-1 min-h-0">
          {/* Navigation */}
          <nav className="p-4 flex-1 overflow-y-auto">
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

          {/* Profile Section */}
          <div className="p-4 border-t border-slate-200 flex-shrink-0">
            {/* User Profile with Tooltip */}
            <div className="relative group mb-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-default">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Icon name="user" className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-900 truncate">
                    {user?.name || 'User'}
                  </div>
                  <div className="text-sm text-slate-500 truncate">
                    {user?.email || 'user@example.com'}
                  </div>
                </div>
                {/* Small Logout Button */}
                <button
                  onClick={logout}
                  className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-colors group/btn"
                  title="Logout"
                >
                  <Icon name="logout" className="w-4 h-4 text-red-600 group-hover/btn:text-red-700" />
                </button>
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                <div className="font-medium">{user?.name || 'User'}</div>
                <div className="text-slate-300 text-xs">{user?.email || 'user@example.com'}</div>
                {/* Tooltip arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
              </div>
            </div>

            {/* Version Info */}
            <div className="text-xs text-slate-400 text-center pt-3 border-t border-slate-100">
              Subscription Manager v1.0
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
