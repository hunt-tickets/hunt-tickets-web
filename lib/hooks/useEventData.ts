import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseBrowser';
import type { EventResponse, SalesStats } from '@/lib/types/event-types';

export function useEventData(eventId: string | string[]) {
  const router = useRouter();
  const [eventData, setEventData] = useState<EventResponse | null>(null);
  const [salesStats, setSalesStats] = useState<SalesStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingSales, setLoadingSales] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEventDetails = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        router.push('/login');
        return;
      }

      console.log("Fetching event with ID:", eventId);
      
      const response = await fetch(
        `https://jtfcfsnksywotlbsddqb.functions.supabase.co/event_complete_details`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            event_id: eventId
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status}, body: ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const eventResponse = await response.json();
      console.log("API Response:", eventResponse);
      
      if (eventResponse.event) {
        setEventData(eventResponse);
        setError(null);
      } else if (eventResponse.code) {
        console.error("API Error:", eventResponse.msg || "Unknown error");
        setError(`Error ${eventResponse.code}: ${eventResponse.msg || "Error desconocido"}`);
      } else {
        setError("Evento no encontrado");
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
      setEventData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchSalesStats = async () => {
    if (!eventId) return;
    
    setLoadingSales(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        console.error("No authenticated user found for sales stats");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/get_event_sales_stats`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            p_event_id: eventId
          }),
        }
      );

      if (!response.ok) {
        console.error(`Sales API error! status: ${response.status}`);
        return;
      }

      const salesData = await response.json();
      console.log("Sales Stats Response:", salesData);
      setSalesStats(salesData);
    } catch (error) {
      console.error("Error fetching sales stats:", error);
    } finally {
      setLoadingSales(false);
    }
  };

  // Load event details when eventId changes
  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]);

  // Auto-load sales stats when event data is loaded
  useEffect(() => {
    if (eventData && !salesStats) {
      fetchSalesStats();
    }
  }, [eventData]);

  return {
    eventData,
    salesStats,
    loading,
    loadingSales,
    error,
    refetchEventData: fetchEventDetails,
    refetchSalesStats: fetchSalesStats,
  };
}