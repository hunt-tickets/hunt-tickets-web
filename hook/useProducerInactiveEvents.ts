import { getProducerInactiveEvents } from "@/supabase/producersService";
import { Event } from "@/types/site";
import { useEffect, useState } from "react";

export const useProducerInactiveEvents = (producer_uuid: string) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!producer_uuid) return;

    const fetchInactiveEvents = async () => {
      setLoading(true);
      const { data, error } = await getProducerInactiveEvents(producer_uuid);
      if (error) {
        console.log("Error fetching inactive events:", error);
        setEvents([]);
      } else {
        setEvents((data || []) as unknown as Event[]);
      }
      setLoading(false);
    };

    fetchInactiveEvents();
  }, [producer_uuid]);

  return { events, loading };
};
