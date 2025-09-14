// Currency conversion utility with real-time API
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
let conversionCache = {
  rates: null,
  timestamp: null,
  baseCurrency: 'USD'
};

// Free currency API - ExchangeRate-API
const API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';

export const getConversionRates = async () => {
  const now = Date.now();
  
  // Return cached rates if they're still fresh
  if (conversionCache.rates && conversionCache.timestamp && 
      (now - conversionCache.timestamp) < CACHE_DURATION) {
    return conversionCache.rates;
  }

  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Cache the rates
    conversionCache = {
      rates: data.rates,
      timestamp: now,
      baseCurrency: data.base
    };
    
    return data.rates;
  } catch (error) {
    console.error('Error fetching conversion rates:', error);
    
    // Return fallback rates if API fails
    return {
      INR: 83.5,
      EUR: 0.85,
      GBP: 0.73,
      USD: 1
    };
  }
};

export const convertCurrency = async (amount, fromCurrency, toCurrency = 'INR') => {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  try {
    const rates = await getConversionRates();
    
    // Convert to USD first if not already USD
    let amountInUSD = amount;
    if (fromCurrency !== 'USD') {
      const fromRate = rates[fromCurrency];
      if (fromRate) {
        amountInUSD = amount / fromRate;
      } else {
        console.warn(`Currency ${fromCurrency} not found in rates`);
        return amount; // Return original amount if conversion fails
      }
    }
    
    // Convert from USD to target currency
    const toRate = rates[toCurrency];
    if (toRate) {
      return amountInUSD * toRate;
    } else {
      console.warn(`Currency ${toCurrency} not found in rates`);
      return amountInUSD; // Return USD amount if target currency not found
    }
  } catch (error) {
    console.error('Error converting currency:', error);
    
    // Fallback conversion rates
    const fallbackRates = {
      USD: { INR: 83.5, EUR: 0.85, GBP: 0.73 },
      EUR: { INR: 98.2, USD: 1.18, GBP: 0.86 },
      GBP: { INR: 114.3, USD: 1.37, EUR: 1.16 },
      INR: { USD: 0.012, EUR: 0.010, GBP: 0.009 }
    };
    
    if (fallbackRates[fromCurrency] && fallbackRates[fromCurrency][toCurrency]) {
      return amount * fallbackRates[fromCurrency][toCurrency];
    }
    
    return amount; // Return original amount if all else fails
  }
};

// Helper function to get current USD to INR rate
export const getUSDToINRRate = async () => {
  try {
    const rates = await getConversionRates();
    return rates.INR || 83.5; // Fallback rate
  } catch (error) {
    console.error('Error getting USD to INR rate:', error);
    return 83.5; // Fallback rate
  }
};

// Helper function to format currency with proper locale
export const formatCurrency = (amount, currency = 'INR', locale = 'en-IN') => {
  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
  
  // Remove trailing .00
  return formatted.replace(/\.00$/, '');
};
