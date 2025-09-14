'use client';

import { useState, useEffect } from 'react';
import Icon from './Icon';

export default function EditSubscriptionModal({ subscription, categories, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    currency: 'USD',
    billingCycle: 'monthly',
    nextBillingDate: '',
    status: 'active',
    categoryId: '',
    serviceUrl: '',
    notes: '',
    autoRenew: true,
    sharedBy: 1,
    hasFreeTrial: false,
    freeTrialMonths: 0,
    freeTrialStartDate: '',
    paidSubscriptionStartDate: ''
  });

  const [errors, setErrors] = useState({});

  // Initialize form data when subscription changes
  useEffect(() => {
    if (subscription) {
      setFormData({
        name: subscription.name || '',
        description: subscription.description || '',
        price: subscription.price || '',
        currency: subscription.currency || 'USD',
        billingCycle: subscription.billingCycle || 'monthly',
        nextBillingDate: subscription.nextBillingDate ? new Date(subscription.nextBillingDate).toISOString().split('T')[0] : '',
        status: subscription.status || 'active',
        categoryId: subscription.categoryId || '',
        serviceUrl: subscription.serviceUrl || '',
        notes: subscription.notes || '',
        autoRenew: subscription.autoRenew !== undefined ? subscription.autoRenew : true,
        sharedBy: subscription.sharedBy || 1,
        hasFreeTrial: subscription.hasFreeTrial || false,
        freeTrialMonths: subscription.freeTrialMonths || 0,
        freeTrialStartDate: subscription.freeTrialStartDate ? new Date(subscription.freeTrialStartDate).toISOString().split('T')[0] : '',
        paidSubscriptionStartDate: subscription.paidSubscriptionStartDate ? new Date(subscription.paidSubscriptionStartDate).toISOString().split('T')[0] : ''
      });
    }
  }, [subscription]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    if (!formData.nextBillingDate) {
      newErrors.nextBillingDate = 'Next billing date is required';
    }

    // Free trial validation
    if (formData.hasFreeTrial) {
      if (!formData.freeTrialMonths || formData.freeTrialMonths <= 0) {
        newErrors.freeTrialMonths = 'Free trial months must be greater than 0';
      }
      if (!formData.freeTrialStartDate) {
        newErrors.freeTrialStartDate = 'Free trial start date is required';
      }
      if (!formData.paidSubscriptionStartDate) {
        newErrors.paidSubscriptionStartDate = 'Paid subscription start date is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onUpdate(subscription._id, formData);
      onClose();
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Edit Subscription</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-lg"
            >
              <Icon name="close" className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Netflix, Spotify"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.categoryId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="2"
                placeholder="Brief description of the service"
              />
            </div>

            {/* Pricing Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={`w-full border rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Billing Cycle
                </label>
                <select
                  name="billingCycle"
                  value={formData.billingCycle}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="weekly">Weekly</option>
                  <option value="daily">Daily</option>
                </select>
              </div>
            </div>

            {/* Billing and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Next Billing Date *
                </label>
                <input
                  type="date"
                  name="nextBillingDate"
                  value={formData.nextBillingDate}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.nextBillingDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.nextBillingDate && <p className="text-red-500 text-sm mt-1">{errors.nextBillingDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="paused">Paused</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>

            {/* Shared By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shared By (Number of People)
              </label>
              <input
                type="number"
                name="sharedBy"
                value={formData.sharedBy}
                onChange={handleChange}
                min="1"
                max="100"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1"
              />
              <p className="text-sm text-gray-500 mt-1">
                How many people share this subscription? (Used for cost calculations)
              </p>
            </div>

            {/* Additional Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service URL
              </label>
              <input
                type="url"
                name="serviceUrl"
                value={formData.serviceUrl}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Any additional notes about this subscription"
              />
            </div>

            {/* Free Trial Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Icon name="gift" className="w-5 h-5 text-green-600" />
                Free Trial
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="hasFreeTrial"
                      checked={formData.hasFreeTrial}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">This subscription has a free trial period</span>
                  </label>
                </div>

                {formData.hasFreeTrial && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-6 border-l-2 border-green-200">
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-2 h-10 flex items-center">
                        Free Trial Duration (months)
                      </label>
                      <input
                        type="number"
                        name="freeTrialMonths"
                        value={formData.freeTrialMonths}
                        onChange={handleChange}
                        min="1"
                        max="24"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="3"
                      />
                      {errors.freeTrialMonths && <p className="text-red-500 text-sm mt-1">{errors.freeTrialMonths}</p>}
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-2 h-10 flex items-center">
                        Free Trial Start Date
                      </label>
                      <input
                        type="date"
                        name="freeTrialStartDate"
                        value={formData.freeTrialStartDate}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.freeTrialStartDate && <p className="text-red-500 text-sm mt-1">{errors.freeTrialStartDate}</p>}
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-2 h-10 flex items-center">
                        Paid Subscription Start Date
                      </label>
                      <input
                        type="date"
                        name="paidSubscriptionStartDate"
                        value={formData.paidSubscriptionStartDate}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.paidSubscriptionStartDate && <p className="text-red-500 text-sm mt-1">{errors.paidSubscriptionStartDate}</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Auto Renew */}
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="autoRenew"
                  checked={formData.autoRenew}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Auto-renew subscription</span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Update Subscription
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
