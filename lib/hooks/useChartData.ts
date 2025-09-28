import { useState, useEffect, useCallback } from 'react';
import { getEventTransactions, type Transaction } from '@/lib/api/transactions';

export function useChartData(eventId: string | string[], activeTab: string) {
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Simple fetch function that only runs once
  const fetchChartData = useCallback(async () => {
    if (!eventId || isLoaded || isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await getEventTransactions(eventId as string, 1, 1000);
      setAllTransactions(response.data);
      setIsLoaded(true);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [eventId, isLoaded, isLoading]);

  // Only fetch when transactions tab becomes active and data not loaded
  useEffect(() => {
    if (activeTab === "transactions" && eventId && !isLoaded && !isLoading) {
      fetchChartData();
    }
  }, [activeTab, eventId, isLoaded, isLoading, fetchChartData]);

  return {
    allTransactions,
    isLoaded,
    isLoading
  };
}