'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import Icon from '@/components/Icon';
import { formatCurrency } from '@/utils/currencyConverter';
import { useData } from '@/contexts/DataContext';
import { 
  processSubscriptionsForCalculations, 
  calculateTotalMonthlySpending, 
  calculateCategorySpending, 
  calculateMonthlyTrend, 
  getStatusDistribution, 
  getBillingCycleDistribution,
  getSubscriptionCounts 
} from '@/utils/subscriptionCalculations';

export default function AnalyticsPage() {
  const [convertedSubscriptions, setConvertedSubscriptions] = useState([]);
  const [currency, setCurrency] = useState('INR');
  
  // Use global data context
  const { subscriptions, categories, loading, error } = useData();

  // Data is now managed by DataContext - no need for local fetching

  // Load currency from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCurrency = localStorage.getItem('subscription-currency') || 'INR';
      setCurrency(savedCurrency);
    }
  }, []);

  // Convert all subscriptions to target currency using helper function
  useEffect(() => {
    const convertSubscriptions = async () => {
      try {
        const converted = await processSubscriptionsForCalculations(subscriptions, currency);
        setConvertedSubscriptions(converted);
      } catch (error) {
        console.error('Error converting subscriptions:', error);
        setConvertedSubscriptions([]);
      }
    };

    convertSubscriptions();
  }, [subscriptions, currency]);

  // Helper function to calculate monthly spending for paid subscriptions only (using converted data)
  const calculateMonthlySpending = () => {
    return calculateTotalMonthlySpending(convertedSubscriptions);
  };

  // Process data for charts using helper functions
  const processChartData = () => {
    if (!Array.isArray(convertedSubscriptions) || convertedSubscriptions.length === 0) {
      return {
        categoryData: [],
        monthlyData: [],
        statusData: [],
        billingData: []
      };
    }

    const categoryData = calculateCategorySpending(convertedSubscriptions, categories);
    const monthlyData = calculateMonthlyTrend(convertedSubscriptions);
    const statusData = getStatusDistribution(convertedSubscriptions);
    const billingData = getBillingCycleDistribution(convertedSubscriptions);

    return { categoryData, monthlyData, statusData, billingData };
  };


  const { categoryData, monthlyData, statusData, billingData } = processChartData();

  const getCurrencySymbol = (currency) => {
    const symbols = {
      'INR': '₹',
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
      'CAD': 'C$',
      'AUD': 'A$',
      'CHF': 'CHF',
      'CNY': '¥',
      'SGD': 'S$'
    };
    return symbols[currency] || currency;
  };


  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600 font-medium">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="x" className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Error Loading Analytics</h2>
            <p className="text-slate-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Analytics Dashboard</h1>
          <p className="text-slate-600 text-lg">Insights into your subscription spending patterns</p>
          <p className="text-sm text-slate-500 mt-1">* Free trial subscriptions are excluded from cost calculations</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Subscriptions</p>
              <p className="text-3xl font-bold text-slate-900">{subscriptions.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Icon name="list" className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Paid Subscriptions</p>
              <p className="text-3xl font-bold text-green-600">
                {getSubscriptionCounts(convertedSubscriptions).activePaid}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Icon name="check" className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Free Trials</p>
              <p className="text-3xl font-bold text-blue-600">
                {getSubscriptionCounts(convertedSubscriptions).activeFreeTrial}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Icon name="clock" className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Monthly Spending</p>
              <p className="text-3xl font-bold text-slate-900">
                {formatCurrency(calculateMonthlySpending(), currency)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Icon name="dollar" className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Category Spending Chart */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Spending by Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                  tick={{ fill: '#1e293b' }}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value, currency), 'Amount']}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  labelStyle={{
                    color: '#1e293b',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}
                />
                <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-slate-500">
              <div className="text-center">
                <Icon name="chart" className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No data available</p>
              </div>
            </div>
          )}
        </div>

        {/* Monthly Spending Trend */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Monthly Spending Trend</h3>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} tick={{ fill: '#1e293b' }} />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value, currency), 'Amount']}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  labelStyle={{
                    color: '#1e293b',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-slate-500">
              <div className="text-center">
                <Icon name="chart" className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No data available</p>
              </div>
            </div>
          )}
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Subscription Status</h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  labelStyle={{
                    color: '#1e293b',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-slate-500">
              <div className="text-center">
                <Icon name="chart" className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No data available</p>
              </div>
            </div>
          )}
        </div>

        {/* Billing Cycle Distribution */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Billing Cycles</h3>
          {billingData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={billingData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {billingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  labelStyle={{
                    color: '#1e293b',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-slate-500">
              <div className="text-center">
                <Icon name="chart" className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No data available</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Details Table */}
      {categoryData.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Category Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Subscriptions</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700">Monthly Cost</th>
                </tr>
              </thead>
              <tbody>
                {categoryData.map((category, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-900">{category.name}</td>
                    <td className="py-3 px-4 text-slate-600">{category.count}</td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-900">
                      {formatCurrency(category.amount, currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
