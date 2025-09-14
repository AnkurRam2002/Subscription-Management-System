'use client';

import { useState } from 'react';
import Icon from './Icon';
import EditSubscriptionModal from './EditSubscriptionModal';

export default function SubscriptionDetailsModal({ subscription, categories, onClose, onDelete, onUpdate }) {
  const [showEditModal, setShowEditModal] = useState(false);

  const formatPrice = (price, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

  const category = categories.find(cat => cat._id === subscription.categoryId);

  const handleUpdate = async (id, updatedData) => {
    try {
      await onUpdate(id, updatedData);
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      try {
        await onDelete(subscription._id);
        onClose();
      } catch (error) {
        console.error('Error deleting subscription:', error);
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-slate-200 p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200">
                  <Icon name={category?.icon || 'more'} className="w-8 h-8 text-slate-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{subscription.name}</h2>
                  {category && (
                    <span 
                      className="inline-block px-3 py-1 text-sm font-medium rounded-lg mt-2"
                      style={{ backgroundColor: category.color, color: 'white' }}
                    >
                      {category.name}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                >
                  <Icon name="edit" className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                >
                  <Icon name="delete" className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
                  <span>Delete</span>
                </button>
                <button
                  onClick={onClose}
                  className="group p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
                >
                  <Icon name="close" className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8">
            {/* Pricing and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Icon name="dollar" className="w-5 h-5 text-emerald-600" />
                  Pricing
                </h3>
                <div className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-slate-900">
                      {formatPrice(subscription.price, subscription.currency)}
                    </span>
                    <span className="text-slate-500 font-medium text-lg">/{subscription.billingCycle}</span>
                  </div>
                  
                  {/* Shared Subscription Info */}
                  {subscription.sharedBy && subscription.sharedBy > 1 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-sm text-blue-700 mb-2">
                        <Icon name="users" className="w-4 h-4" />
                        <span className="font-medium">Shared by {subscription.sharedBy} people</span>
                      </div>
                      <div className="text-lg font-semibold text-blue-900">
                        {formatPrice(subscription.price / subscription.sharedBy, subscription.currency)} per person
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span>Currency: <strong>{subscription.currency}</strong></span>
                    <span>Cycle: <strong className="capitalize">{subscription.billingCycle}</strong></span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Icon name="check" className="w-5 h-5 text-blue-600" />
                  Status
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className={`inline-block px-4 py-2 text-sm font-medium rounded-full border ${getStatusColor(subscription.status)}`}>
                      {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Icon name="calendar" className="w-4 h-4" />
                      <span>Next: {formatDate(subscription.nextBillingDate)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <div className={`w-3 h-3 rounded-full ${subscription.autoRenew ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                    <span>
                      {subscription.autoRenew ? 'Auto-renew enabled' : 'Auto-renew disabled'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Free Trial Information */}
            {subscription.hasFreeTrial && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                  <Icon name="gift" className="w-5 h-5 text-green-600" />
                  Free Trial Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-green-700 mb-1">Trial Duration</p>
                    <p className="text-lg font-semibold text-green-800">
                      {subscription.freeTrialMonths} month{subscription.freeTrialMonths > 1 ? 's' : ''}
                    </p>
                  </div>
                  {subscription.freeTrialStartDate && (
                    <div>
                      <p className="text-sm font-medium text-green-700 mb-1">Trial Started</p>
                      <p className="text-lg font-semibold text-green-800">
                        {formatDate(subscription.freeTrialStartDate)}
                      </p>
                    </div>
                  )}
                  {subscription.paidSubscriptionStartDate && (
                    <div>
                      <p className="text-sm font-medium text-green-700 mb-1">Paid Subscription Starts</p>
                      <p className="text-lg font-semibold text-green-800">
                        {formatDate(subscription.paidSubscriptionStartDate)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            {subscription.description && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Icon name="file-text" className="w-5 h-5 text-slate-600" />
                  Description
                </h3>
                <p className="text-slate-600 bg-slate-50 rounded-lg p-4">{subscription.description}</p>
              </div>
            )}

            {/* Notes */}
            {subscription.notes && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Icon name="message-square" className="w-5 h-5 text-slate-600" />
                  Notes
                </h3>
                <p className="text-slate-600 bg-slate-50 rounded-lg p-4">{subscription.notes}</p>
              </div>
            )}

            {/* Service Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Icon name="globe" className="w-5 h-5 text-slate-600" />
                  Service Details
                </h3>
                <div className="space-y-3">
                  {subscription.serviceUrl && (
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-1">Website</p>
                      <a
                        href={subscription.serviceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
                      >
                        <span>Visit Service</span>
                        <Icon name="external" className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-1">Created</p>
                    <p className="text-slate-600">{formatDate(subscription.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-1">Last Updated</p>
                    <p className="text-slate-600">{formatDate(subscription.updatedAt)}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Icon name="settings" className="w-5 h-5 text-slate-600" />
                  Additional Info
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-1">Subscription ID</p>
                    <p className="text-slate-600 font-mono text-sm">{subscription._id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-1">User ID</p>
                    <p className="text-slate-600 font-mono text-sm">{subscription.userId || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditSubscriptionModal
          subscription={subscription}
          categories={categories}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdate}
        />
      )}
    </>
  );
}
