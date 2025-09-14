'use client';

import { useState, useEffect } from 'react';
import SubscriptionCard from '@/components/SubscriptionCard';
import CategoryFilter from '@/components/CategoryFilter';
import StatsOverview from '@/components/StatsOverview';
import { useRouter } from 'next/navigation';
import NotificationsSystem from '@/components/NotificationsSystem';
import Icon from '@/components/Icon';
import { useAppData } from '@/hooks/useDataCache';
import { useSidebar } from '@/contexts/SidebarContext';

export default function Home() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
  const [currency, setCurrency] = useState('INR');
  const { sidebarOpen, toggleSidebar } = useSidebar();

  // Use cached data hook
  const { 
    subscriptions, 
    categories, 
    loading, 
    error, 
    lastFetch, 
    refreshAll 
  } = useAppData();

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

  // Filter subscriptions when category changes
  useEffect(() => {
    if (selectedCategory === 'all' || (Array.isArray(selectedCategory) && selectedCategory.length === 0)) {
      setFilteredSubscriptions(subscriptions);
    } else if (Array.isArray(selectedCategory)) {
      setFilteredSubscriptions(
        subscriptions.filter(sub => selectedCategory.includes(sub.categoryId))
      );
    } else {
      setFilteredSubscriptions(
        subscriptions.filter(sub => sub.categoryId === selectedCategory)
      );
    }
  }, [subscriptions, selectedCategory]);

  // Load currency from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem('subscription-currency') || 'INR';
    setCurrency(savedCurrency);
  }, []);


  const handleDeleteSubscription = async (id) => {
    if (!confirm('Are you sure you want to delete this subscription?')) {
      return;
    }

    try {
      const response = await fetch(`/api/subscriptions/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (result.success) {
        // Refresh data to get updated list
        refreshAll();
      } else {
        alert('Failed to delete subscription');
      }
    } catch (error) {
      console.error('Error deleting subscription:', error);
      alert('Failed to delete subscription');
    }
  };

  const handleUpdateSubscription = async (id, updatedData) => {
    try {
      const response = await fetch(`/api/subscriptions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();
      
      if (result.success) {
        // Refresh data to get updated list
        refreshAll();
      } else {
        alert('Failed to update subscription');
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
      alert('Failed to update subscription');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading subscriptions...</p>
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
                <h1 className="text-4xl font-bold text-slate-900 mb-2">Subscription Manager</h1>
                <p className="text-slate-600 text-lg">Manage all your subscriptions in one place</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <NotificationsSystem subscriptions={subscriptions} />
            </div>
          </div>

        {/* Stats Overview */}
        <StatsOverview subscriptions={subscriptions} currency={currency} />

        {/* Controls */}
        <div className="mb-6">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Subscriptions Grid */}
        {filteredSubscriptions.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="more" className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 mb-3">No subscriptions found</h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              {(selectedCategory === 'all' || (Array.isArray(selectedCategory) && selectedCategory.length === 0))
                ? "Get started by adding your first subscription"
                : "No subscriptions in selected categories"
              }
            </p>
            {(selectedCategory === 'all' || (Array.isArray(selectedCategory) && selectedCategory.length === 0)) && (
              <button
                onClick={() => router.push('/add-subscription')}
                className="group relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-10 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5 active:translate-y-0 active:shadow-lg overflow-hidden mx-auto"
              >
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                
                {/* Button content */}
                <div className="relative flex items-center gap-3">
                  <div className="p-1.5 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors duration-300">
                    <Icon name="plus" className="w-5 h-5" />
                  </div>
                  <span className="text-base">Add Your First Subscription</span>
                </div>
                
                {/* Subtle glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredSubscriptions.map((subscription) => (
              <SubscriptionCard
                key={subscription._id}
                subscription={subscription}
                categories={categories}
                onDelete={handleDeleteSubscription}
                onUpdate={handleUpdateSubscription}
              />
            ))}
          </div>
        )}

        </div>
      </div>
    </div>
  );
}