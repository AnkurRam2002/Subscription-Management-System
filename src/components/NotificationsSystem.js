'use client';

import { useState, useEffect } from 'react';
import Icon from './Icon';

export default function NotificationsSystem({ subscriptions }) {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    generateNotifications();
  }, [subscriptions]);

  const generateNotifications = () => {
    const now = new Date();
    const newNotifications = [];

    subscriptions.forEach(subscription => {
      if (subscription.status !== 'active') return;

      const nextBilling = new Date(subscription.nextBillingDate);
      const daysUntilBilling = Math.ceil((nextBilling - now) / (1000 * 60 * 60 * 24));

      // Billing reminders
      if (daysUntilBilling <= 3 && daysUntilBilling >= 0) {
        newNotifications.push({
          id: `billing-${subscription._id}`,
          type: 'billing',
          title: 'Billing Reminder',
          message: `${subscription.name} will be charged in ${daysUntilBilling} day${daysUntilBilling !== 1 ? 's' : ''}`,
          priority: daysUntilBilling === 0 ? 'high' : 'medium',
          subscriptionId: subscription._id,
          date: now
        });
      }

      // Free trial expiration
      if (subscription.hasFreeTrial && subscription.freeTrialStartDate) {
        const trialStart = new Date(subscription.freeTrialStartDate);
        const trialEnd = new Date(trialStart);
        trialEnd.setMonth(trialEnd.getMonth() + subscription.freeTrialMonths);
        
        const daysUntilTrialEnd = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24));
        
        if (daysUntilTrialEnd <= 7 && daysUntilTrialEnd >= 0) {
          newNotifications.push({
            id: `trial-${subscription._id}`,
            type: 'trial',
            title: 'Free Trial Ending',
            message: `Your free trial for ${subscription.name} ends in ${daysUntilTrialEnd} day${daysUntilTrialEnd !== 1 ? 's' : ''}`,
            priority: daysUntilTrialEnd <= 2 ? 'high' : 'medium',
            subscriptionId: subscription._id,
            date: now
          });
        }
      }

      // High spending alert
      const monthlyCost = calculateMonthlyCost(subscription);
      if (monthlyCost > 50) {
        newNotifications.push({
          id: `high-spending-${subscription._id}`,
          type: 'spending',
          title: 'High Spending Alert',
          message: `${subscription.name} costs $${monthlyCost}/month - consider reviewing`,
          priority: 'low',
          subscriptionId: subscription._id,
          date: now
        });
      }
    });

    // Unused subscription detection (simplified)
    const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active');
    if (activeSubscriptions.length > 10) {
      newNotifications.push({
        id: 'too-many-subscriptions',
        type: 'recommendation',
        title: 'Too Many Subscriptions',
        message: `You have ${activeSubscriptions.length} active subscriptions. Consider reviewing unused ones.`,
        priority: 'low',
        date: now
      });
    }

    // Sort by priority and date
    newNotifications.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return new Date(b.date) - new Date(a.date);
    });

    setNotifications(newNotifications);
  };

  const calculateMonthlyCost = (subscription) => {
    let monthlyCost = subscription.price;
    const sharedBy = subscription.sharedBy || 1;
    
    switch (subscription.billingCycle) {
      case 'yearly': monthlyCost = subscription.price / 12; break;
      case 'weekly': monthlyCost = subscription.price * 4.33; break;
      case 'daily': monthlyCost = subscription.price * 30; break;
      default: monthlyCost = subscription.price;
    }
    
    return Math.round((monthlyCost / sharedBy) * 100) / 100;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'billing': return 'calendar';
      case 'trial': return 'gift';
      case 'spending': return 'dollar';
      case 'recommendation': return 'star';
      default: return 'bell';
    }
  };

  const getNotificationColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.length;

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
        title="Notifications"
      >
        <Icon name="bell" className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-lg border border-slate-200 z-50">
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Notifications</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
              >
                <Icon name="close" className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-500">
                <Icon name="bell" className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p>No notifications</p>
                <p className="text-sm">You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-slate-50 transition-colors ${getNotificationColor(notification.priority)}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <Icon 
                          name={getNotificationIcon(notification.type)} 
                          className="w-4 h-4" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-slate-900 text-sm">
                              {notification.title}
                            </h4>
                            <p className="text-sm text-slate-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              {new Date(notification.date).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={() => dismissNotification(notification.id)}
                            className="ml-2 p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
                          >
                            <Icon name="close" className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t border-slate-200">
              <button
                onClick={() => setNotifications([])}
                className="w-full text-sm text-slate-600 hover:text-slate-800 py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
