'use client';

import { useState, useEffect } from 'react';
import SubscriptionCard from '@/components/SubscriptionCard';
import CategoryFilter from '@/components/CategoryFilter';
import StatsOverview from '@/components/StatsOverview';
import LoadMoreButton from '@/components/LoadMoreButton';
import { useRouter } from 'next/navigation';
import { useData } from '@/contexts/DataContext';
import Icon from '@/components/Icon';

export default function Home() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
  const [currency, setCurrency] = useState('INR');

  // Use global data context instead of local state
  const { 
    subscriptions, 
    categories, 
    loading, 
    error, 
    pagination,
    refreshData,
    updateSubscription,
    deleteSubscription 
  } = useData();

  // Refresh handler
  const handleRefresh = () => {
    refreshData();
  };

  // Data is now managed by DataContext - no need for local fetching

  // Listen for currency changes from settings
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
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
    // Ensure subscriptions is an array
    if (!Array.isArray(subscriptions)) {
      setFilteredSubscriptions([]);
      return;
    }

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
    if (typeof window !== 'undefined') {
      const savedCurrency = localStorage.getItem('subscription-currency') || 'INR';
      setCurrency(savedCurrency);
    }
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
        // Update global state instead of reloading page
        deleteSubscription(id);
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
        // Update global state instead of reloading page
        updateSubscription(id, updatedData);
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
          <p className="mt-2 text-sm text-slate-500">Debug: Loading state active</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="x" className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Error Loading Data</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={refreshData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8 flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">Subscription Manager</h1>
                <p className="text-slate-600 text-lg">Manage all your subscriptions in one place</p>
              </div>
            </div>
            
            {/* Refresh Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="group relative bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon 
                  name="refresh" 
                  className={`w-4 h-4 transition-transform duration-200 ${loading ? 'animate-spin' : 'group-hover:rotate-180'}`} 
                />
                <span className="text-sm">
                  {loading ? 'Refreshing...' : 'Refresh'}
                </span>
              </button>
              
              {/* Data Status Indicator */}
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
                <span className="text-xs text-slate-600">
                  {loading ? 'Loading...' : `${subscriptions.length} subscriptions`}
                </span>
              </div>
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
        {!Array.isArray(filteredSubscriptions) || filteredSubscriptions.length === 0 ? (
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {Array.isArray(filteredSubscriptions) && filteredSubscriptions.map((subscription) => (
                <SubscriptionCard
                  key={subscription._id}
                  subscription={subscription}
                  categories={categories}
                  onDelete={handleDeleteSubscription}
                  onUpdate={handleUpdateSubscription}
                />
              ))}
            </div>
            
            {/* Pagination Info */}
            {pagination.total > 0 && (
              <div className="text-center text-sm text-slate-500 mb-4">
                Showing {filteredSubscriptions.length} of {pagination.total} subscriptions
              </div>
            )}
            
            {/* Load More Button */}
            <LoadMoreButton />
          </>
        )}

    </div>
  );
}