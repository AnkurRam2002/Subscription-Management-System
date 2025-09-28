import { useState, useEffect } from 'react';
import { 
  processSubscriptionsForCalculations, 
  calculateTotalMonthlySpending, 
  calculateTotalYearlySpending, 
  getSubscriptionCounts,
  calculateCategorySpending,
  calculateMonthlyTrend,
  getStatusDistribution,
  getBillingCycleDistribution
} from '@/utils/subscriptionCalculations';

/**
 * Custom hook for subscription calculations
 * @param {Array} subscriptions - Array of subscription objects
 * @param {string} currency - Target currency for calculations
 * @returns {Object} Object containing all calculated data and loading state
 */
export const useSubscriptionCalculations = (subscriptions = [], currency = 'INR') => {
  const [convertedSubscriptions, setConvertedSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const convertSubscriptions = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const converted = await processSubscriptionsForCalculations(subscriptions, currency);
        setConvertedSubscriptions(converted);
      } catch (err) {
        console.error('Error converting subscriptions:', err);
        setError(err.message);
        setConvertedSubscriptions([]);
      } finally {
        setIsLoading(false);
      }
    };

    convertSubscriptions();
  }, [subscriptions, currency]);

  // Calculate all metrics
  const calculations = {
    // Basic calculations
    totalMonthlySpending: calculateTotalMonthlySpending(convertedSubscriptions),
    totalYearlySpending: calculateTotalYearlySpending(convertedSubscriptions),
    subscriptionCounts: getSubscriptionCounts(convertedSubscriptions),
    
    // Chart data
    categorySpending: (categories) => calculateCategorySpending(convertedSubscriptions, categories),
    monthlyTrend: calculateMonthlyTrend(convertedSubscriptions),
    statusDistribution: getStatusDistribution(convertedSubscriptions),
    billingCycleDistribution: getBillingCycleDistribution(convertedSubscriptions),
    
    // Raw data
    convertedSubscriptions
  };

  return {
    ...calculations,
    isLoading,
    error
  };
};
