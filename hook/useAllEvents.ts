import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseBrowser";
import { Event } from "@/types/site";

export const useAllEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllEvents = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get the current session to get the JWT token
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.access_token) {
          throw new Error("No authenticated user found");
        }

        // Call the RPC endpoint with JWT token
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/get_all_events_web_dashboard`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
              'Authorization': `Bearer ${session.access_token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const fetchedEvents = await response.json();
        setEvents(fetchedEvents as Event[]);
      } catch (err) {
        console.error("Error fetching all events:", err);
        setError(err instanceof Error ? err.message : "Error fetching all events");
      } finally {
        setLoading(false);
      }
    };

    fetchAllEvents();
  }, []);

  return { events, loading, error };
};