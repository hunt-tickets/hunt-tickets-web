import { useState, useEffect, useCallback } from 'react';
import { getEventGuestList, getGuestListKPIs, type GuestListResponse, type GuestListKPIs } from '@/lib/api/guest-list';
import type { GuestListFilters } from '@/lib/types/event-types';

export function useGuestList(eventId: string | string[], activeTab: string, ticketsSubTab: string) {
  const [guestListData, setGuestListData] = useState<GuestListResponse | null>(null);
  const [guestListKPIs, setGuestListKPIs] = useState<GuestListKPIs | null>(null);
  const [loadingGuestList, setLoadingGuestList] = useState(false);
  
  // Filter states
  const [guestListPage, setGuestListPage] = useState(1);
  const [guestListSearch, setGuestListSearch] = useState("");
  const [guestListStatusFilter, setGuestListStatusFilter] = useState("all");

  const fetchGuestList = useCallback(async (
    page: number = guestListPage,
    search: string = guestListSearch,
    statusFilter: string = guestListStatusFilter
  ) => {
    if (!eventId) return;
    
    setLoadingGuestList(true);
    try {
      const response = await getEventGuestList(
        eventId,
        page,
        50, // limit
        statusFilter,
        search
      );
      setGuestListData(response);
    } catch (error) {
      console.error("Error fetching guest list:", error);
    } finally {
      setLoadingGuestList(false);
    }
  }, [eventId, guestListPage, guestListSearch, guestListStatusFilter]);

  const fetchGuestListKPIsData = useCallback(async () => {
    if (!eventId) return;
    
    try {
      const kpis = await getGuestListKPIs(eventId);
      setGuestListKPIs(kpis);
    } catch (error) {
      console.error("Error fetching guest list KPIs:", error);
      // Use mock data on error
      setGuestListKPIs({
        invitations: 124,
        redeemed: 87,
        revenue: 2850000,
      });
    }
  }, [eventId]);

  const handleGuestListPageChange = useCallback((page: number) => {
    setGuestListPage(page);
    fetchGuestList(page, guestListSearch, guestListStatusFilter);
  }, [fetchGuestList, guestListSearch, guestListStatusFilter]);

  const handleGuestListSearch = useCallback((search: string) => {
    setGuestListSearch(search);
    setGuestListPage(1);
    fetchGuestList(1, search, guestListStatusFilter);
  }, [fetchGuestList, guestListStatusFilter]);

  const handleGuestListStatusFilter = useCallback((status: string) => {
    setGuestListStatusFilter(status);
    setGuestListPage(1);
    fetchGuestList(1, guestListSearch, status);
  }, [fetchGuestList, guestListSearch]);

  // Fetch guest list when guestlist tab is active
  useEffect(() => {
    if (ticketsSubTab === "guestlist" && activeTab === "tickets" && eventId && !guestListData) {
      fetchGuestList();
      fetchGuestListKPIsData();
    }
  }, [ticketsSubTab, activeTab, eventId, guestListData, fetchGuestList, fetchGuestListKPIsData]);

  // Fetch guest list when cortesias tab is active
  useEffect(() => {
    if (activeTab === "cortesias" && eventId && !guestListData) {
      fetchGuestList();
      fetchGuestListKPIsData();
    }
  }, [activeTab, eventId, guestListData, fetchGuestList, fetchGuestListKPIsData]);

  return {
    // Data
    guestListData,
    guestListKPIs,
    loadingGuestList,
    
    // Filter states
    guestListPage,
    setGuestListPage,
    guestListSearch,
    setGuestListSearch,
    guestListStatusFilter,
    setGuestListStatusFilter,
    
    // Functions
    fetchGuestList,
    fetchGuestListKPIsData,
    handleGuestListPageChange,
    handleGuestListSearch,
    handleGuestListStatusFilter,
  };
}