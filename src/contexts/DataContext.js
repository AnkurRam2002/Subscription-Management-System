'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const DataContext = createContext(undefined);

export function DataProvider({ children }) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });

  // Cache duration: 5 minutes
  const CACHE_DURATION = 5 * 60 * 1000;

  // Check if data is stale
  const isDataStale = useCallback(() => {
    if (!lastFetch) return true;
    return Date.now() - lastFetch > CACHE_DURATION;
  }, [lastFetch, CACHE_DURATION]);

  // Fetch all data in a single request with pagination
  const fetchAllData = useCallback(async (forceRefresh = false, page = 1, limit = 50) => {
    // Skip if data is fresh and not forcing refresh (only for first page)
    if (!forceRefresh && !isDataStale() && subscriptions.length > 0 && categories.length > 0 && page === 1) {
      console.log('Using cached data');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log(`Fetching fresh data - page ${page}, limit ${limit}...`);

      // Single API call to get both subscriptions and categories with pagination
      const response = await fetch(`/api/data?page=${page}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        const { subscriptions: subsData, categories: catsData } = result.data;
        
        console.log('Data received:', {
          subscriptions: Array.isArray(subsData) ? subsData.length : 'not array',
          categories: Array.isArray(catsData) ? catsData.length : 'not array',
          pagination: result.pagination
        });

        // For first page, replace data; for subsequent pages, append
        if (page === 1) {
          setSubscriptions(Array.isArray(subsData) ? subsData : []);
          setCategories(Array.isArray(catsData) ? catsData : []);
        } else {
          setSubscriptions(prev => [...prev, ...(Array.isArray(subsData) ? subsData : [])]);
        }
        
        setPagination(result.pagination || pagination);
        setLastFetch(Date.now());
      } else {
        throw new Error(result.error || 'Failed to fetch data');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [subscriptions.length, categories.length, isDataStale, pagination]);

  // Initial data fetch
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Refresh data function
  const refreshData = useCallback(() => {
    fetchAllData(true, 1, pagination.limit);
  }, [fetchAllData, pagination.limit]);

  // Load more data (pagination)
  const loadMoreData = useCallback(() => {
    if (pagination.hasNext && !loading) {
      fetchAllData(false, pagination.page + 1, pagination.limit);
    }
  }, [fetchAllData, pagination.hasNext, pagination.page, pagination.limit, loading]);

  // Add new subscription
  const addSubscription = useCallback((newSubscription) => {
    setSubscriptions(prev => [...prev, newSubscription]);
    setLastFetch(Date.now()); // Update cache timestamp
  }, []);

  // Update subscription
  const updateSubscription = useCallback((id, updatedData) => {
    setSubscriptions(prev => 
      prev.map(sub => 
        sub._id === id ? { ...sub, ...updatedData } : sub
      )
    );
    setLastFetch(Date.now());
  }, []);

  // Delete subscription
  const deleteSubscription = useCallback((id) => {
    setSubscriptions(prev => prev.filter(sub => sub._id !== id));
    setLastFetch(Date.now());
  }, []);

  // Add new category
  const addCategory = useCallback((newCategory) => {
    setCategories(prev => [...prev, newCategory]);
    setLastFetch(Date.now());
  }, []);

  const value = {
    // Data
    subscriptions,
    categories,
    loading,
    error,
    pagination,
    
    // Actions
    refreshData,
    loadMoreData,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    addCategory,
    
    // Cache info
    lastFetch,
    isDataStale: isDataStale()
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
