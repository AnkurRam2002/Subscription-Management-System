'use client';

import Icon from './Icon';
import { formatCurrency } from '../utils/currencyConverter';
import { useSubscriptionCalculations } from '../hooks/useSubscriptionCalculations';

export default function StatsOverview({ subscriptions = [], currency = 'INR' }) {
  const { 
    totalMonthlySpending, 
    totalYearlySpending, 
    subscriptionCounts, 
    isLoading 
  } = useSubscriptionCalculations(subscriptions, currency);

  const formatAmount = (amount) => {
    const locale = currency === 'INR' ? 'en-IN' : 'en-US';
    return formatCurrency(amount, currency, locale);
  };

  const costStats = [
    {
      title: 'Monthly Cost',
      value: formatAmount(totalMonthlySpending),
      icon: 'dollar',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      iconColor: '#059669'
    },
    {
      title: 'Yearly Cost',
      value: formatAmount(totalYearlySpending),
      icon: 'chart',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: '#2563eb'
    }
  ];

  const otherStats = [
    {
      title: 'Paid Active',
      value: subscriptionCounts.activePaid,
      icon: 'check',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      iconColor: '#16a34a'
    },
    {
      title: 'Free Trial',
      value: subscriptionCounts.activeFreeTrial,
      icon: 'gift',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: '#9333ea'
    },
    {
      title: 'Cancelled',
      value: subscriptionCounts.cancelled,
      icon: 'x',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      iconColor: '#dc2626'
    },
    {
      title: 'Paused',
      value: subscriptionCounts.paused,
      icon: 'pause',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      iconColor: '#d97706'
    },
    {
      title: 'Total',
      value: subscriptionCounts.total,
      icon: 'more',
      color: 'text-slate-600',
      bgColor: 'bg-slate-50',
      iconColor: '#475569'
    }
  ];

  // Reusable stat card component
  const StatCard = ({ stat, isLarge = false }) => (
    <div className="group relative">
      <div className={`bg-gradient-to-br from-white to-slate-50 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full flex flex-col ${isLarge ? 'p-8' : 'p-5'}`}>
        {/* Header with icon and title */}
        <div className="flex items-start justify-between mb-4">
          <div 
            className={`rounded-lg shadow-sm flex-shrink-0 ${isLarge ? 'p-4' : 'p-2.5'}`}
            style={{ backgroundColor: `${stat.iconColor}15` }}
          >
            <Icon name={stat.icon} className={`${isLarge ? 'w-8 h-8' : 'w-5 h-5'}`} color={stat.iconColor} />
          </div>
          <div className="text-right flex-1 ml-3">
            <p className={`font-medium text-slate-500 uppercase tracking-wide leading-tight break-words ${isLarge ? 'text-sm' : 'text-xs'}`}>{stat.title}</p>
          </div>
        </div>
        
        {/* Value and description */}
        <div className="flex-1 flex flex-col justify-end">
          <p className={`${isLarge ? 'text-4xl lg:text-5xl' : (stat.title.includes('Cost') ? 'text-xl lg:text-2xl' : 'text-2xl lg:text-3xl')} font-bold ${stat.color} mb-1 break-words`}>{stat.value}</p>
          <div className={`text-slate-500 leading-tight ${isLarge ? 'text-sm' : 'text-xs'}`}>
            {stat.title.includes('Cost') && (
              <p>Paid subscriptions only</p>
            )}
            {stat.title.includes('Paid Active') && (
              <p>Currently active</p>
            )}
            {stat.title.includes('Free Trial') && (
              <p>On free trial</p>
            )}
            {stat.title.includes('Cancelled') && (
              <p>Cancelled services</p>
            )}
            {stat.title.includes('Paused') && (
              <p>Temporarily paused</p>
            )}
            {stat.title.includes('Total') && (
              <p>All subscriptions</p>
            )}
          </div>
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Dashboard Overview</h2>
            <p className="text-slate-600">Loading currency conversion rates...</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-sm font-medium text-slate-700">Loading...</span>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Dashboard Overview</h2>
          <p className="text-slate-600">Track your subscription spending and status</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg">
          <Icon name="chart" className="w-5 h-5 text-slate-600" />
          <span className="text-sm font-medium text-slate-700">Live Data</span>
        </div>
      </div>

      {/* Cost Stats - Large tiles on first line */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {costStats.map((stat, index) => (
          <StatCard key={index} stat={stat} isLarge={true} />
        ))}
      </div>

      {/* Other Stats - Smaller tiles on second line */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {otherStats.map((stat, index) => (
          <StatCard key={index} stat={stat} isLarge={false} />
        ))}
      </div>

      {/* Dashboard Footer */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Icon name="clock" className="w-4 h-4" />
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Real-time data</span>
          </div>
        </div>
      </div>
    </div>
  );
}
