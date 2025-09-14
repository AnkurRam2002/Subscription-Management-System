'use client';

import { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { convertCurrency as convertCurrencyUtil, formatCurrency as formatCurrencyUtil } from '@/utils/currencyConverter';
import Icon from './Icon';

export default function AnalyticsDashboard({ subscriptions, categories, currency = 'INR' }) {
  const [timeRange, setTimeRange] = useState('6months');
  const [analyticsData, setAnalyticsData] = useState(null);

  // Currency conversion function using the utility
  const convertCurrency = useCallback(async (amountInINR) => {
    if (currency === 'INR') {
      return amountInINR;
    }
    return await convertCurrencyUtil(amountInINR, 'INR', currency);
  }, [currency]);

  // Currency formatting function using the utility
  const formatCurrency = (amount) => {
    return formatCurrencyUtil(amount, currency);
  };

  useEffect(() => {
    const calculateAnalytics = async () => {
    const now = new Date();
    const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active' && !sub.hasFreeTrial);
    
    // Calculate monthly costs
    const monthlyCosts = activeSubscriptions.map(sub => {
      let monthlyCost = sub.price;
      const sharedBy = sub.sharedBy || 1;
      
      switch (sub.billingCycle) {
        case 'yearly': monthlyCost = sub.price / 12; break;
        case 'weekly': monthlyCost = sub.price * 4.33; break;
        case 'daily': monthlyCost = sub.price * 30; break;
        default: monthlyCost = sub.price;
      }
      
      return {
        ...sub,
        monthlyCost: monthlyCost / sharedBy,
        category: categories.find(cat => cat._id === sub.categoryId)?.name || 'Other'
      };
    });

    // Generate historical data based on time range
    const months = timeRange === '3months' ? 3 : timeRange === '6months' ? 6 : 12;
    const historicalData = [];
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      
      // Simulate some variation in costs (in real app, this would come from historical data)
      const baseCost = monthlyCosts.reduce((sum, sub) => sum + sub.monthlyCost, 0);
      const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
      const monthlyTotal = baseCost * (1 + variation);
      
      // Convert to selected currency
      const convertedTotal = await convertCurrency(monthlyTotal);
      const convertedActive = await convertCurrency(monthlyTotal * 0.8);
      const convertedCancelled = await convertCurrency(monthlyTotal * 0.2);
      
      historicalData.push({
        month: monthName,
        total: Math.round(convertedTotal * 100) / 100,
        active: Math.round(convertedActive * 100) / 100,
        cancelled: Math.round(convertedCancelled * 100) / 100
      });
    }

    // Category breakdown
    const categoryBreakdown = monthlyCosts.reduce((acc, sub) => {
      const category = sub.category;
      if (!acc[category]) {
        acc[category] = { name: category, value: 0, count: 0 };
      }
      acc[category].value += sub.monthlyCost;
      acc[category].count += 1;
      return acc;
    }, {});

    const categoryData = await Promise.all(Object.values(categoryBreakdown).map(async (cat) => ({
      ...cat,
      value: Math.round((await convertCurrency(cat.value)) * 100) / 100
    })));

    // Spending insights
    const totalMonthlyINR = monthlyCosts.reduce((sum, sub) => sum + sub.monthlyCost, 0);
    const totalMonthly = await convertCurrency(totalMonthlyINR);
    const totalYearly = await convertCurrency(totalMonthlyINR * 12);
    const averagePerSubscription = monthlyCosts.length > 0 ? await convertCurrency(totalMonthlyINR / monthlyCosts.length) : 0;
    
    // Find most expensive subscription
    const mostExpensiveINR = monthlyCosts.reduce((max, sub) => 
      sub.monthlyCost > max.monthlyCost ? sub : max, 
      { monthlyCost: 0, name: 'None' }
    );
    const mostExpensive = {
      ...mostExpensiveINR,
      monthlyCost: await convertCurrency(mostExpensiveINR.monthlyCost)
    };

    // Calculate potential savings
    const potentialSavingsINR = monthlyCosts
      .filter(sub => sub.billingCycle === 'monthly')
      .reduce((savings, sub) => {
        const yearlyEquivalent = sub.price * 12;
        const yearlyDiscount = yearlyEquivalent * 0.15; // Assume 15% discount for yearly
        return savings + (yearlyDiscount / 12);
      }, 0);
    const potentialSavings = await convertCurrency(potentialSavingsINR);

      setAnalyticsData({
        historicalData,
        categoryData,
        insights: {
          totalMonthly: Math.round(totalMonthly * 100) / 100,
          totalYearly: Math.round(totalYearly * 100) / 100,
          averagePerSubscription: Math.round(averagePerSubscription * 100) / 100,
          subscriptionCount: monthlyCosts.length,
          mostExpensive: mostExpensive,
          potentialSavings: Math.round(potentialSavings * 100) / 100
        }
      });
    };

    calculateAnalytics();
  }, [subscriptions, timeRange, categories, currency, convertCurrency]);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h2>
          <p className="text-slate-600">Insights into your subscription spending</p>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="12months">Last 12 Months</option>
          </select>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="dollar" className="w-6 h-6 text-blue-600" />
            <h3 className="font-semibold text-slate-900">Monthly Total</h3>
          </div>
          <p className="text-3xl font-bold text-blue-900">{formatCurrency(analyticsData.insights.totalMonthly)}</p>
          <p className="text-sm text-blue-700">Per month</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="chart" className="w-6 h-6 text-emerald-600" />
            <h3 className="font-semibold text-slate-900">Yearly Total</h3>
          </div>
          <p className="text-3xl font-bold text-emerald-900">{formatCurrency(analyticsData.insights.totalYearly)}</p>
          <p className="text-sm text-emerald-700">Per year</p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="crown" className="w-6 h-6 text-amber-600" />
            <h3 className="font-semibold text-slate-900">Most Expensive</h3>
          </div>
          <p className="text-3xl font-bold text-amber-900">{formatCurrency(analyticsData.insights.mostExpensive.monthlyCost)}</p>
          <p className="text-sm text-amber-700">{analyticsData.insights.mostExpensive.name}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="gift" className="w-6 h-6 text-purple-600" />
            <h3 className="font-semibold text-slate-900">Potential Savings</h3>
          </div>
          <p className="text-3xl font-bold text-purple-900">{formatCurrency(analyticsData.insights.potentialSavings)}</p>
          <p className="text-sm text-purple-700">Switch to yearly plans</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Spending Trend */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Spending Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analyticsData.historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(value), 'Total']} />
              <Area type="monotone" dataKey="total" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analyticsData.categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [formatCurrency(value), 'Amount']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Category Breakdown</h3>
        <div className="space-y-3">
          {analyticsData.categoryData.map((category, index) => (
            <div key={category.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="font-medium text-slate-900">{category.name}</span>
                <span className="text-sm text-slate-500">({category.count} subscription{category.count !== 1 ? 's' : ''})</span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-slate-900">{formatCurrency(category.value)}</div>
                <div className="text-sm text-slate-500">per month</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
