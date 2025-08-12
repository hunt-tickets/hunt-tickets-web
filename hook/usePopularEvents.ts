import { getPopularEvents } from "@/supabase/producersService";
import { Event } from "@/types/site";
import { useEffect, useState } from "react";

export const usePopularEvents = (cityId: string | null) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cityId) return;

    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedEvents = await getPopularEvents(cityId);
        setEvents(fetchedEvents as unknown as Event[]);
      } catch (err) {
        setError("Error fetching popular events");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [cityId]);

  return { events, loading, error };
};
