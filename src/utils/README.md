# Subscription Calculation Utilities

This directory contains centralized helper functions for subscription calculations used across the application.

## Files

### `subscriptionCalculations.js`
Core utility functions for subscription calculations:

- **`calculateSubscriptionMonthlyCost(subscription, targetCurrency)`** - Calculate monthly cost for a single subscription
- **`processSubscriptionsForCalculations(subscriptions, targetCurrency)`** - Process all subscriptions with currency conversion
- **`calculateTotalMonthlySpending(convertedSubscriptions)`** - Get total monthly spending (paid subscriptions only)
- **`calculateTotalYearlySpending(convertedSubscriptions)`** - Get total yearly spending
- **`getSubscriptionCounts(convertedSubscriptions)`** - Get counts by status
- **`calculateCategorySpending(convertedSubscriptions, categories)`** - Category spending breakdown
- **`calculateMonthlyTrend(convertedSubscriptions)`** - Monthly spending trend data
- **`getStatusDistribution(convertedSubscriptions)`** - Status distribution for charts
- **`getBillingCycleDistribution(convertedSubscriptions)`** - Billing cycle distribution for charts

### `currencyConverter.js`
Currency conversion utilities with real-time exchange rates.

## Usage

### Direct Function Usage
```javascript
import { calculateTotalMonthlySpending, processSubscriptionsForCalculations } from '@/utils/subscriptionCalculations';

// Process subscriptions
const converted = await processSubscriptionsForCalculations(subscriptions, 'USD');

// Calculate spending
const monthlySpending = calculateTotalMonthlySpending(converted);
```

### Using the Hook
```javascript
import { useSubscriptionCalculations } from '@/hooks/useSubscriptionCalculations';

function MyComponent({ subscriptions, currency }) {
  const { 
    totalMonthlySpending, 
    subscriptionCounts, 
    isLoading 
  } = useSubscriptionCalculations(subscriptions, currency);

  return (
    <div>
      <p>Monthly Spending: {totalMonthlySpending}</p>
      <p>Active Subscriptions: {subscriptionCounts.activePaid}</p>
    </div>
  );
}
```

## Benefits

1. **Consistency** - All calculations use the same logic
2. **Maintainability** - Changes in one place affect the entire app
3. **Reusability** - Functions can be used in any component
4. **Testing** - Easy to unit test individual functions
5. **Performance** - Optimized calculations with proper error handling

## Features

- ✅ Currency conversion with real-time rates
- ✅ Shared subscription support (cost per person)
- ✅ Billing cycle conversion (yearly → monthly, etc.)
- ✅ Free trial exclusion from cost calculations
- ✅ Error handling and fallbacks
- ✅ TypeScript-ready (can be easily converted)
