'use client';

import { useState } from 'react';
import Icon from './Icon';
import SubscriptionDetailsModal from './SubscriptionDetailsModal';

export default function SubscriptionCard({ subscription, categories, onDelete, onUpdate }) {
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const category = categories.find(cat => cat._id === subscription.categoryId);

  const formatPrice = (price, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'paused': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'expired': return 'bg-slate-100 text-slate-800 border-slate-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };


  return (
    <>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200 p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
              <Icon name={category?.icon || 'more'} className="w-6 h-6 text-slate-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">{subscription.name}</h3>
              {category && (
                <span 
                  className="inline-block px-2 py-1 text-xs font-medium rounded-md"
                  style={{ backgroundColor: category.color, color: 'white' }}
                >
                  {category.name}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex gap-1">
            <button
              onClick={() => setShowDetailsModal(true)}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
              title="View Details"
            >
              <Icon name="eye" className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(subscription._id)}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              title="Delete"
            >
              <Icon name="delete" className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Price and Billing */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">
              {formatPrice(subscription.price, subscription.currency)}
            </span>
            <span className="text-slate-500 font-medium">/{subscription.billingCycle}</span>
            {/* Free Trial Indicator */}
            {subscription.hasFreeTrial && (
              <div className="ml-2 flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium">
                <Icon name="gift" className="w-3 h-3" />
                <span>Free</span>
              </div>
            )}
          </div>
          
          {/* Shared Subscription Info */}
          {subscription.sharedBy && subscription.sharedBy > 1 && (
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
              <Icon name="users" className="w-4 h-4" />
              <span>Shared by {subscription.sharedBy} people</span>
              <span className="text-slate-400">•</span>
              <span className="font-medium text-slate-700">
                {formatPrice(subscription.price / subscription.sharedBy, subscription.currency)} per person
              </span>
            </div>
          )}
        </div>

        {/* Status and Next Billing */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(subscription.status)}`}>
              {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Icon name="calendar" className="w-4 h-4" />
            <span>Next: {formatDate(subscription.nextBillingDate)}</span>
          </div>
        </div>

        {/* Auto Renew */}
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
          <div className={`w-2 h-2 rounded-full ${subscription.autoRenew ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
          <span>
            {subscription.autoRenew ? 'Auto-renew enabled' : 'Auto-renew disabled'}
          </span>
        </div>

        {/* Service URL */}
        {subscription.serviceUrl && (
          <div className="mb-4">
            <a
              href={subscription.serviceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <span>Visit Service</span>
              <Icon name="external" className="w-4 h-4" />
            </a>
          </div>
        )}

        {/* Show More Button */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowDetailsModal(true)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors py-2 px-4 rounded-lg hover:bg-slate-50"
          >
            <span className="text-sm font-medium">Show More</span>
            <Icon name="chevron-down" className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && (
        <SubscriptionDetailsModal
          subscription={subscription}
          categories={categories}
          onClose={() => setShowDetailsModal(false)}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
}
