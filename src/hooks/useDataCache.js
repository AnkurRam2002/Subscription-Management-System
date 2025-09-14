// Custom hook for data caching with React state
import { useState, useEffect, useCallback } from 'react';
import { fetchWithCache, invalidateCache } from '@/utils/dataCache';

export const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);


  const loadSubscriptions = useCallback(async (forceRefresh = false) => {
    if (forceRefresh) {
      invalidateCache('subscriptions');
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchWithCache('/api/subscriptions');
      
      if (result.success) {
        setSubscriptions(result.data);
        setLastFetch(new Date());
      } else {
        setError('Failed to load subscriptions');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error loading subscriptions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshSubscriptions = useCallback(() => {
    loadSubscriptions(true);
  }, [loadSubscriptions]);

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);

  return {
    subscriptions,
    loading,
    error,
    lastFetch,
    refreshSubscriptions,
    loadSubscriptions
  };
};

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);


  const loadCategories = useCallback(async (forceRefresh = false) => {
    if (forceRefresh) {
      invalidateCache('categories');
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchWithCache('/api/categories');
      
      if (result.success) {
        setCategories(result.data);
        setLastFetch(new Date());
      } else {
        setError('Failed to load categories');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshCategories = useCallback(() => {
    loadCategories(true);
  }, [loadCategories]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return {
    categories,
    loading,
    error,
    lastFetch,
    refreshCategories,
    loadCategories
  };
};

// Combined hook for both subscriptions and categories
export const useAppData = () => {
  const subscriptions = useSubscriptions();
  const categories = useCategories();


  const refreshAll = useCallback(() => {
    subscriptions.refreshSubscriptions();
    categories.refreshCategories();
  }, [subscriptions, categories]);

  const isLoading = subscriptions.loading || categories.loading;
  const hasError = subscriptions.error || categories.error;

  return {
    subscriptions: subscriptions.subscriptions,
    categories: categories.categories,
    loading: isLoading,
    error: hasError,
    lastFetch: subscriptions.lastFetch || categories.lastFetch,
    refreshAll,
    refreshSubscriptions: subscriptions.refreshSubscriptions,
    refreshCategories: categories.refreshCategories
  };
};
