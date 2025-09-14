'use client';

import { useRouter, usePathname } from 'next/navigation';
import Icon from '@/components/Icon';
import { useSidebar } from '@/contexts/SidebarContext';

export default function Sidebar({ isOpen, onToggle }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isCollapsed, toggleCollapse } = useSidebar();

  console.log('Sidebar render - isOpen:', isOpen, 'isCollapsed:', isCollapsed, 'pathname:', pathname);


  const menuItems = [
    {
      name: 'Dashboard',
      icon: 'home',
      path: '/',
      description: 'View all subscriptions'
    },
    {
      name: 'Add Subscription',
      icon: 'plus',
      path: '/add-subscription',
      description: 'Add a new subscription'
    },
    {
      name: 'Analytics',
      icon: 'chart',
      path: '/analytics',
      description: 'Detailed insights and reports'
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
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white border-r border-slate-200 z-50 transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
        ${isCollapsed ? 'w-16' : 'w-64'} shadow-lg lg:shadow-none
      `}>
        {/* Header */}
        <div className={`p-6 border-b border-slate-200 ${isCollapsed ? 'px-3' : ''}`}>
          <div className="flex items-center justify-between">
            {!isCollapsed && <h2 className="text-xl font-bold text-slate-900">Menu</h2>}
            <div className="flex items-center gap-2">
        <button
          onClick={toggleCollapse}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
                <Icon name={isCollapsed ? 'chevron-right' : 'chevron-left'} className="w-4 h-4 text-slate-600" />
              </button>
              <button
                onClick={onToggle}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors lg:hidden"
              >
                <Icon name="close" className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav className={`p-4 flex-1 ${isCollapsed ? 'px-2' : ''}`}>
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <li key={item.name}>
                    <button
                      onClick={() => {
                        router.push(item.path);
                        onToggle(); // Close sidebar on mobile after navigation
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors group ${
                        isCollapsed ? 'justify-center' : ''
                      } ${
                        isActive 
                          ? 'bg-blue-50 border border-blue-200' 
                          : 'hover:bg-slate-50'
                      }`}
                      title={isCollapsed ? item.name : ''}
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
                      {!isCollapsed && (
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
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          {!isCollapsed && (
            <div className="p-4 border-t border-slate-200">
              <div className="text-xs text-slate-500 text-center">
                Subscription Manager v1.0
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
