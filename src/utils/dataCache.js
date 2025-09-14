// Data caching utility for subscriptions and categories
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const CACHE_KEYS = {
  SUBSCRIPTIONS: 'subscriptions-cache',
  CATEGORIES: 'categories-cache',
  CURRENCY: 'currency-cache'
};

class DataCache {
  constructor() {
    this.memoryCache = new Map();
    this.cacheTimestamps = new Map();
  }

  // Get data from cache (memory first, then localStorage)
  get(key) {
    // Check memory cache first
    if (this.memoryCache.has(key)) {
      const timestamp = this.cacheTimestamps.get(key);
      if (this.isCacheValid(timestamp)) {
        return this.memoryCache.get(key);
      } else {
        // Remove expired cache
        this.memoryCache.delete(key);
        this.cacheTimestamps.delete(key);
      }
    }

    // Check localStorage
    try {
      const cached = localStorage.getItem(key);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (this.isCacheValid(timestamp)) {
          // Store in memory for faster access
          this.memoryCache.set(key, data);
          this.cacheTimestamps.set(key, timestamp);
          return data;
        } else {
          // Remove expired cache
          localStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }

    return null;
  }

  // Set data in cache (both memory and localStorage)
  set(key, data) {
    const timestamp = Date.now();
    
    // Store in memory
    this.memoryCache.set(key, data);
    this.cacheTimestamps.set(key, timestamp);

    // Store in localStorage
    try {
      localStorage.setItem(key, JSON.stringify({ data, timestamp }));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }

  // Check if cache is still valid
  isCacheValid(timestamp) {
    if (!timestamp) return false;
    return (Date.now() - timestamp) < CACHE_DURATION;
  }

  // Invalidate specific cache
  invalidate(key) {
    this.memoryCache.delete(key);
    this.cacheTimestamps.delete(key);
    localStorage.removeItem(key);
  }

  // Invalidate all caches
  invalidateAll() {
    this.memoryCache.clear();
    this.cacheTimestamps.clear();
    Object.values(CACHE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // Get cache age in minutes
  getCacheAge(key) {
    const timestamp = this.cacheTimestamps.get(key);
    if (!timestamp) return null;
    return Math.floor((Date.now() - timestamp) / (1000 * 60));
  }
}

// Create singleton instance
const dataCache = new DataCache();

// API wrapper with caching
export const fetchWithCache = async (url, options = {}) => {
  const cacheKey = url.includes('subscriptions') ? CACHE_KEYS.SUBSCRIPTIONS : CACHE_KEYS.CATEGORIES;
  
  // Try to get from cache first
  const cachedData = dataCache.get(cacheKey);
  if (cachedData) {
    console.log(`📦 Cache hit for ${url} (age: ${dataCache.getCacheAge(cacheKey)}min)`);
    return { success: true, data: cachedData, fromCache: true };
  }

  try {
    console.log(`🌐 Fetching fresh data from ${url}`);
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.success) {
      // Cache the successful response
      dataCache.set(cacheKey, result.data);
      console.log(`💾 Cached data for ${url}`);
    }
    
    return { ...result, fromCache: false };
  } catch (error) {
    console.error(`❌ Error fetching ${url}:`, error);
    
    // Return cached data if available (even if expired)
    const staleData = dataCache.get(cacheKey);
    if (staleData) {
      console.log(`🔄 Using stale cache for ${url}`);
      return { success: true, data: staleData, fromCache: true, stale: true };
    }
    
    throw error;
  }
};

// Cache management functions
export const invalidateCache = (type = 'all') => {
  if (type === 'all') {
    dataCache.invalidateAll();
  } else if (type === 'subscriptions') {
    dataCache.invalidate(CACHE_KEYS.SUBSCRIPTIONS);
  } else if (type === 'categories') {
    dataCache.invalidate(CACHE_KEYS.CATEGORIES);
  }
};

export const getCacheInfo = () => {
  return {
    subscriptions: {
      cached: dataCache.memoryCache.has(CACHE_KEYS.SUBSCRIPTIONS),
      age: dataCache.getCacheAge(CACHE_KEYS.SUBSCRIPTIONS)
    },
    categories: {
      cached: dataCache.memoryCache.has(CACHE_KEYS.CATEGORIES),
      age: dataCache.getCacheAge(CACHE_KEYS.CATEGORIES)
    }
  };
};

export default dataCache;
