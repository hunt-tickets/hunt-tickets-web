"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  getSubscriptions, 
  getSubscriptionStats,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  searchSubscriptions,
  type Subscription,
  type CreateSubscriptionData,
  type UpdateSubscriptionData
} from '@/supabase/subscriptionsService';

interface UseSubscriptionsOptions {
  initialLoad?: boolean;
  pageSize?: number;
}

interface SubscriptionStats {
  totalSubscriptions: number;
  totalAmountUSD: number;
  thisMonthAmount: number;
  thisMonthSubscriptions: number;
  averageAmount: number;
}

export const useSubscriptions = (options: UseSubscriptionsOptions = {}) => {
  const { initialLoad = true, pageSize = 10 } = options;

  // State
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<{
    company?: string;
    currency?: string;
    dateFrom?: string;
    dateTo?: string;
  }>({});

  // Fetch subscriptions
  const fetchSubscriptions = useCallback(async (
    searchQuery?: string,
    page = 1,
    customFilters?: typeof filters
  ) => {
    setLoading(true);
    setError(null);

    try {
      const offset = (page - 1) * pageSize;
      const appliedFilters = customFilters || filters;

      let result;
      
      if (searchQuery && searchQuery.trim()) {
        result = await searchSubscriptions(searchQuery.trim());
      } else {
        result = await getSubscriptions({
          ...appliedFilters,
          orderBy: sortBy,
          orderDirection: sortDirection,
          limit: pageSize,
          offset
        });
      }

      if (result.error) {
        throw new Error(result.error.message || 'Error fetching subscriptions');
      }

      setSubscriptions(result.data || []);
      setTotalCount(result.data?.length || 0);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, sortDirection, pageSize]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const result = await getSubscriptionStats();
      if (result.error) {
        throw new Error(result.error.message || 'Error fetching stats');
      }
      setStats(result.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  // Create subscription
  const createNewSubscription = useCallback(async (data: CreateSubscriptionData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await createSubscription(data);
      if (result.error) {
        throw new Error(result.error.message || 'Error creating subscription');
      }

      // Refresh data
      await fetchSubscriptions(searchTerm, currentPage);
      await fetchStats();

      return { success: true, data: result.data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchSubscriptions, fetchStats, searchTerm, currentPage]);

  // Update subscription
  const updateExistingSubscription = useCallback(async (id: string, data: UpdateSubscriptionData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await updateSubscription(id, data);
      if (result.error) {
        throw new Error(result.error.message || 'Error updating subscription');
      }

      // Refresh data
      await fetchSubscriptions(searchTerm, currentPage);
      await fetchStats();

      return { success: true, data: result.data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchSubscriptions, fetchStats, searchTerm, currentPage]);

  // Delete subscription
  const deleteExistingSubscription = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await deleteSubscription(id);
      if (result.error) {
        throw new Error(result.error.message || 'Error deleting subscription');
      }

      // Refresh data
      await fetchSubscriptions(searchTerm, currentPage);
      await fetchStats();

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchSubscriptions, fetchStats, searchTerm, currentPage]);

  // Search handler
  const handleSearch = useCallback((query: string) => {
    setSearchTerm(query);
    setCurrentPage(1);
    fetchSubscriptions(query, 1);
  }, [fetchSubscriptions]);

  // Sort handler
  const handleSort = useCallback((column: string) => {
    const newDirection = sortBy === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortBy(column);
    setSortDirection(newDirection);
    
    // Trigger refetch with new sorting
    fetchSubscriptions(searchTerm, currentPage);
  }, [sortBy, sortDirection, fetchSubscriptions, searchTerm, currentPage]);

  // Filter handler
  const handleFilter = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    fetchSubscriptions(searchTerm, 1, newFilters);
  }, [fetchSubscriptions, searchTerm]);

  // Pagination
  const goToPage = useCallback((page: number) => {
    fetchSubscriptions(searchTerm, page);
  }, [fetchSubscriptions, searchTerm]);

  const nextPage = useCallback(() => {
    if (currentPage * pageSize < totalCount) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, pageSize, totalCount, goToPage]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({});
    setSearchTerm('');
    setCurrentPage(1);
    setSortBy('date');
    setSortDirection('desc');
    fetchSubscriptions('', 1, {});
  }, [fetchSubscriptions]);

  // Refresh data
  const refresh = useCallback(() => {
    fetchSubscriptions(searchTerm, currentPage);
    fetchStats();
  }, [fetchSubscriptions, fetchStats, searchTerm, currentPage]);

  // Initial load
  useEffect(() => {
    if (initialLoad) {
      fetchSubscriptions();
      fetchStats();
    }
  }, [initialLoad, fetchSubscriptions, fetchStats]);

  // Computed values
  const hasNextPage = currentPage * pageSize < totalCount;
  const hasPrevPage = currentPage > 1;
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    // Data
    subscriptions,
    stats,
    loading,
    error,
    
    // Pagination
    currentPage,
    totalCount,
    totalPages,
    hasNextPage,
    hasPrevPage,
    pageSize,
    
    // Search and filters
    searchTerm,
    filters,
    sortBy,
    sortDirection,
    
    // Actions
    createSubscription: createNewSubscription,
    updateSubscription: updateExistingSubscription,
    deleteSubscription: deleteExistingSubscription,
    search: handleSearch,
    sort: handleSort,
    filter: handleFilter,
    goToPage,
    nextPage,
    prevPage,
    resetFilters,
    refresh,
    
    // Manual fetch for specific cases
    fetchSubscriptions
  };
};