'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useData } from '@/contexts/DataContext';
import Icon from '@/components/Icon';

export default function SettingsPage() {
  const router = useRouter();
  const [currency, setCurrency] = useState('INR');
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  
  // Use global data context
  const { subscriptions, categories, loading } = useData();

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

  // Load currency from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCurrency = localStorage.getItem('subscription-currency') || 'INR';
      setCurrency(savedCurrency);
    }
  }, []);

  const handleCurrencyChange = async (newCurrency) => {
    try {
      setSaving(true);
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('subscription-currency', newCurrency);
        setCurrency(newCurrency);
        
        // Trigger storage event for same-tab listeners
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'subscription-currency',
          newValue: newCurrency,
          oldValue: currency
        }));
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  // Export functions
  const exportToCSV = () => {
    setExporting(true);
    try {
      const headers = ['Name', 'Price', 'Currency', 'Billing Cycle', 'Status', 'Category', 'Next Billing Date', 'Service URL', 'Shared By', 'Has Free Trial'];
      const csvContent = [
        headers.join(','),
        ...subscriptions.map(sub => {
          const categoryName = categories.find(cat => cat._id === sub.categoryId)?.name || 'Uncategorized';
          return [
            `"${sub.name}"`,
            sub.price,
            sub.currency,
            sub.billingCycle,
            sub.status,
            `"${categoryName}"`,
            sub.nextBillingDate,
            `"${sub.serviceUrl || ''}"`,
            sub.sharedBy || 1,
            sub.hasFreeTrial || false
          ].join(',');
        })
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `subscriptions-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export CSV file');
    } finally {
      setExporting(false);
    }
  };

  const exportToJSON = () => {
    setExporting(true);
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        currency: currency,
        subscriptions: subscriptions,
        categories: categories
      };

      const jsonContent = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `subscriptions-${new Date().toISOString().split('T')[0]}.json`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting JSON:', error);
      alert('Failed to export JSON file');
    } finally {
      setExporting(false);
    }
  };

  const exportToPDF = () => {
    setExporting(true);
    try {
      // Create a simple HTML table for PDF generation
      const tableRows = subscriptions.map(sub => {
        const categoryName = categories.find(cat => cat._id === sub.categoryId)?.name || 'Uncategorized';
        return `
          <tr>
            <td>${sub.name}</td>
            <td>${sub.price} ${sub.currency}</td>
            <td>${sub.billingCycle}</td>
            <td>${sub.status}</td>
            <td>${categoryName}</td>
            <td>${new Date(sub.nextBillingDate).toLocaleDateString()}</td>
          </tr>
        `;
      }).join('');

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Subscription Export</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #1e293b; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f8fafc; font-weight: bold; }
            .export-info { margin-bottom: 20px; color: #64748b; }
          </style>
        </head>
        <body>
          <h1>Subscription Manager Export</h1>
          <div class="export-info">
            <p><strong>Export Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Total Subscriptions:</strong> ${subscriptions.length}</p>
            <p><strong>Currency:</strong> ${currency}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Billing Cycle</th>
                <th>Status</th>
                <th>Category</th>
                <th>Next Billing</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `subscriptions-${new Date().toISOString().split('T')[0]}.html`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF file');
    } finally {
      setExporting(false);
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8 flex justify-between items-start">
            <div className="flex items-center gap-4">
              
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

            {/* Data Export */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Icon name="download" className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Data Export</h2>
                  <p className="text-slate-600">Export your subscription data in various formats</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Icon name="info" className="w-5 h-5 text-slate-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-slate-900">Export Information</h3>
                      <p className="text-sm text-slate-600 mt-1">
                        Export your subscription data including {subscriptions.length} subscriptions and {categories.length} categories. 
                        Choose the format that best suits your needs.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* CSV Export */}
                  <button
                    onClick={exportToCSV}
                    disabled={exporting || subscriptions.length === 0}
                    className="p-4 rounded-xl border-2 border-slate-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200 text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                        <Icon name="file" className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">CSV Format</div>
                        <div className="text-sm text-slate-600">Spreadsheet compatible</div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500">
                      Perfect for Excel, Google Sheets, and data analysis
                    </p>
                  </button>

                  {/* JSON Export */}
                  <button
                    onClick={exportToJSON}
                    disabled={exporting || subscriptions.length === 0}
                    className="p-4 rounded-xl border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                        <Icon name="code" className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">JSON Format</div>
                        <div className="text-sm text-slate-600">Complete data backup</div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500">
                      Full data structure with categories and metadata
                    </p>
                  </button>

                  {/* HTML Export */}
                  <button
                    onClick={exportToPDF}
                    disabled={exporting || subscriptions.length === 0}
                    className="p-4 rounded-xl border-2 border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                        <Icon name="file-text" className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">HTML Format</div>
                        <div className="text-sm text-slate-600">Printable report</div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500">
                      Formatted table for printing or sharing
                    </p>
                  </button>
                </div>

                {exporting && (
                  <div className="flex items-center justify-center gap-2 py-4">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-slate-600">Preparing export...</span>
                  </div>
                )}

                {subscriptions.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-slate-500">No subscriptions available to export</p>
                  </div>
                )}
              </div>
            </div>
          </div>
    </div>
  );
}
