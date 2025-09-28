'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AddSubscriptionModal from '@/components/AddSubscriptionModal';
import { useData } from '@/contexts/DataContext';
import Icon from '@/components/Icon';

export default function AddSubscriptionPage() {
  const router = useRouter();
  const { categories, loading, addSubscription } = useData();

  // Categories and loading are now managed by DataContext

  const handleAddSubscription = async (subscriptionData) => {
    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscriptionData),
      });

      const result = await response.json();
      
      if (result.success) {
        // Update global state with new subscription
        addSubscription(result.data);
        
        // Redirect to dashboard after successful addition
        router.push('/');
      } else {
        alert('Failed to add subscription');
      }
    } catch (error) {
      console.error('Error adding subscription:', error);
      alert('Failed to add subscription');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8 flex justify-between items-start">
            <div className="flex items-center gap-4">
              
              <div>
                <h1 className="text-4xl font-bold text-slate-900">Add New Subscription</h1>
                <p className="text-slate-600 text-lg">Add a new subscription to your collection</p>
              </div>
            </div>
          </div>

          {/* Add Subscription Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <AddSubscriptionModal
              categories={categories}
              onClose={() => router.push('/')}
              onAdd={handleAddSubscription}
              isPage={true}
            />
          </div>
    </div>
  );
}
