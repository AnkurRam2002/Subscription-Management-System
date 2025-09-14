'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/Icon';
import { useSidebar } from '@/contexts/SidebarContext';

export default function SettingsPage() {
  const router = useRouter();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [currency, setCurrency] = useState('INR');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const currencies = [
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' }
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      // Load currency from localStorage or default to INR
      const savedCurrency = localStorage.getItem('subscription-currency') || 'INR';
      setCurrency(savedCurrency);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCurrencyChange = async (newCurrency) => {
    try {
      setSaving(true);
      // Save to localStorage
      localStorage.setItem('subscription-currency', newCurrency);
      setCurrency(newCurrency);
      
      // Trigger storage event for same-tab listeners
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'subscription-currency',
        newValue: newCurrency,
        oldValue: currency
      }));
      
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <h1 className="text-4xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-600 text-lg">Manage your application preferences</p>
              </div>
            </div>
          </div>

          {/* Settings Content */}
          <div className="space-y-8">
            {/* Currency Settings */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Icon name="dollar" className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Currency Settings</h2>
                  <p className="text-slate-600">Choose your preferred currency for analytics and dashboard</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Base Currency
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {currencies.map((curr) => (
                      <button
                        key={curr.code}
                        onClick={() => handleCurrencyChange(curr.code)}
                        disabled={saving}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                          currency === curr.code
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        } ${saving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-slate-900">{curr.code}</div>
                            <div className="text-sm text-slate-600">{curr.name}</div>
                          </div>
                          <div className="text-lg font-bold text-slate-700">
                            {curr.symbol}
                          </div>
                        </div>
                        {currency === curr.code && (
                          <div className="mt-2 flex items-center gap-1 text-blue-600 text-sm">
                            <Icon name="check" className="w-4 h-4" />
                            <span>Selected</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Icon name="clock" className="w-5 h-5 text-slate-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-slate-900">Note</h3>
                      <p className="text-sm text-slate-600 mt-1">
                        Changing the currency will update how amounts are displayed in your dashboard and analytics. 
                        The conversion rates are not automatically applied - this setting only changes the display format.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Settings Placeholder */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <Icon name="settings" className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">More Settings</h2>
                  <p className="text-slate-600">Additional preferences coming soon</p>
                </div>
              </div>
              
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="settings" className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500">More customization options will be available in future updates</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
