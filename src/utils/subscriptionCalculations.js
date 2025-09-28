import { convertCurrency } from './currencyConverter';

/**
 * Calculate monthly cost for a single subscription
 * @param {Object} subscription - The subscription object
 * @param {string} targetCurrency - Target currency for conversion
 * @returns {Promise<number>} Monthly cost in target currency
 */
export const calculateSubscriptionMonthlyCost = async (subscription, targetCurrency = 'INR') => {
  let monthlyCost = subscription.price;
  
  // Convert to monthly cost for different billing cycles
  switch (subscription.billingCycle) {
    case 'yearly':
      monthlyCost = subscription.price / 12;
      break;
    case 'weekly':
      monthlyCost = subscription.price * 4.33; // Average weeks per month
      break;
    case 'daily':
      monthlyCost = subscription.price * 30; // Average days per month
      break;
    default:
      monthlyCost = subscription.price;
  }
  
  // Calculate cost per person for shared subscriptions
  const sharedBy = subscription.sharedBy || 1;
  const costPerPerson = monthlyCost / sharedBy;
  
  // Convert to target currency
  try {
    const convertedCost = await convertCurrency(costPerPerson, subscription.currency, targetCurrency);
    return convertedCost;
  } catch (error) {
    console.error('Error converting currency:', error);
    return costPerPerson; // Return original cost if conversion fails
  }
};

/**
 * Process and convert all subscriptions to target currency
 * @param {Array} subscriptions - Array of subscription objects
 * @param {string} targetCurrency - Target currency for conversion
 * @returns {Promise<Array>} Array of subscriptions with convertedMonthlyCost
 */
export const processSubscriptionsForCalculations = async (subscriptions, targetCurrency = 'INR') => {
  if (!Array.isArray(subscriptions) || subscriptions.length === 0) {
    return [];
  }

  try {
    const converted = await Promise.all(
      subscriptions.map(async (sub) => {
        const convertedMonthlyCost = await calculateSubscriptionMonthlyCost(sub, targetCurrency);
        
        return {
          ...sub,
          convertedMonthlyCost,
          sharedBy: sub.sharedBy || 1
        };
      })
    );
    
    return converted;
  } catch (error) {
    console.error('Error processing subscriptions:', error);
    // Fallback to original subscriptions with basic calculations
    return subscriptions.map(sub => {
      const sharedBy = sub.sharedBy || 1;
      let monthlyCost = sub.price;
      
      switch (sub.billingCycle) {
        case 'yearly':
          monthlyCost = sub.price / 12;
          break;
        case 'weekly':
          monthlyCost = sub.price * 4.33;
          break;
        case 'daily':
          monthlyCost = sub.price * 30;
          break;
      }
      
      return {
        ...sub,
        convertedMonthlyCost: monthlyCost / sharedBy,
        sharedBy: sharedBy
      };
    });
  }
};

/**
 * Calculate total monthly spending for paid subscriptions only
 * @param {Array} convertedSubscriptions - Array of processed subscriptions
 * @returns {number} Total monthly spending
 */
export const calculateTotalMonthlySpending = (convertedSubscriptions) => {
  return convertedSubscriptions
    .filter(sub => sub.status === 'active' && !sub.hasFreeTrial)
    .reduce((total, sub) => total + (sub.convertedMonthlyCost || 0), 0);
};

/**
 * Calculate total yearly spending for paid subscriptions only
 * @param {Array} convertedSubscriptions - Array of processed subscriptions
 * @returns {number} Total yearly spending
 */
export const calculateTotalYearlySpending = (convertedSubscriptions) => {
  const monthlySpending = calculateTotalMonthlySpending(convertedSubscriptions);
  return monthlySpending * 12;
};

/**
 * Get subscription counts by status
 * @param {Array} convertedSubscriptions - Array of processed subscriptions
 * @returns {Object} Object with counts for each status
 */
export const getSubscriptionCounts = (convertedSubscriptions) => {
  return {
    total: convertedSubscriptions.length,
    activePaid: convertedSubscriptions.filter(sub => sub.status === 'active' && !sub.hasFreeTrial).length,
    activeFreeTrial: convertedSubscriptions.filter(sub => sub.status === 'active' && sub.hasFreeTrial).length,
    cancelled: convertedSubscriptions.filter(sub => sub.status === 'cancelled').length,
    paused: convertedSubscriptions.filter(sub => sub.status === 'paused').length,
    expired: convertedSubscriptions.filter(sub => sub.status === 'expired').length
  };
};

/**
 * Calculate category spending breakdown
 * @param {Array} convertedSubscriptions - Array of processed subscriptions
 * @param {Array} categories - Array of category objects
 * @returns {Array} Array of category spending data
 */
export const calculateCategorySpending = (convertedSubscriptions, categories) => {
  const categorySpending = {};
  
  convertedSubscriptions.forEach(sub => {
    if (sub.status === 'active' && !sub.hasFreeTrial) {
      const categoryName = categories.find(cat => cat._id === sub.categoryId)?.name || 'Uncategorized';
      categorySpending[categoryName] = (categorySpending[categoryName] || 0) + (sub.convertedMonthlyCost || 0);
    }
  });

  return Object.entries(categorySpending).map(([name, amount]) => ({
    name,
    amount,
    count: convertedSubscriptions.filter(sub => 
      sub.status === 'active' && !sub.hasFreeTrial &&
      (categories.find(cat => cat._id === sub.categoryId)?.name || 'Uncategorized') === name
    ).length
  }));
};

/**
 * Calculate monthly spending trend data (last 6 months)
 * @param {Array} convertedSubscriptions - Array of processed subscriptions
 * @returns {Array} Array of monthly spending data
 */
export const calculateMonthlyTrend = (convertedSubscriptions) => {
  const monthlyData = [];
  const currentDate = new Date();
  const monthlySpending = calculateTotalMonthlySpending(convertedSubscriptions);
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    
    monthlyData.push({
      month: `${monthName} ${year}`,
      amount: Math.round(monthlySpending * 100) / 100
    });
  }
  
  return monthlyData;
};

/**
 * Get status distribution data for charts
 * @param {Array} convertedSubscriptions - Array of processed subscriptions
 * @returns {Array} Array of status distribution data
 */
export const getStatusDistribution = (convertedSubscriptions) => {
  const statusCounts = {};
  convertedSubscriptions.forEach(sub => {
    statusCounts[sub.status] = (statusCounts[sub.status] || 0) + 1;
  });

  const getStatusColor = (status) => {
    const colors = {
      active: '#10B981',
      cancelled: '#EF4444',
      paused: '#F59E0B',
      expired: '#6B7280'
    };
    return colors[status] || '#6B7280';
  };

  return Object.entries(statusCounts).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    color: getStatusColor(status)
  }));
};

/**
 * Get billing cycle distribution data for charts
 * @param {Array} convertedSubscriptions - Array of processed subscriptions
 * @returns {Array} Array of billing cycle distribution data
 */
export const getBillingCycleDistribution = (convertedSubscriptions) => {
  const billingCounts = {};
  convertedSubscriptions.forEach(sub => {
    billingCounts[sub.billingCycle] = (billingCounts[sub.billingCycle] || 0) + 1;
  });

  const getBillingColor = (cycle) => {
    const colors = {
      monthly: '#3B82F6',
      yearly: '#8B5CF6',
      weekly: '#06B6D4',
      daily: '#F59E0B'
    };
    return colors[cycle] || '#6B7280';
  };

  return Object.entries(billingCounts).map(([cycle, count]) => ({
    name: cycle.charAt(0).toUpperCase() + cycle.slice(1),
    value: count,
    color: getBillingColor(cycle)
  }));
};
