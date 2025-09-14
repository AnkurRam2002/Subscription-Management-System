'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import NotificationsSystem from '@/components/NotificationsSystem';
import Icon from '@/components/Icon';
import { useAppData } from '@/hooks/useDataCache';
import { useSidebar } from '@/contexts/SidebarContext';

export default function AnalyticsPage() {
  const router = useRouter();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [currency, setCurrency] = useState('INR');

  // Use cached data hook
  const { 
    subscriptions, 
    categories, 
    loading, 
    error, 
    lastFetch, 
    refreshAll 
  } = useAppData();

  // Load currency from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem('subscription-currency') || 'INR';
    setCurrency(savedCurrency);
  }, []);

  // Listen for currency changes from settings
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'subscription-currency') {
        setCurrency(e.newValue || 'INR');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8 flex justify-between items-start">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors lg:hidden"
              >
                <Icon name="menu" className="w-6 h-6 text-slate-600" />
              </button>
              
              <div>
                <h1 className="text-4xl font-bold text-slate-900">Analytics Dashboard</h1>
                <p className="text-slate-600 text-lg">Detailed insights into your subscription spending</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <NotificationsSystem subscriptions={subscriptions} />
            </div>
          </div>

          {/* Analytics Dashboard */}
          <AnalyticsDashboard subscriptions={subscriptions} categories={categories} currency={currency} />
        </div>
      </div>
    </div>
  );
}
