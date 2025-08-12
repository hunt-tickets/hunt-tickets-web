import { getProducerUpcomingEvents } from "@/supabase/producersService";
import { Event } from "@/types/site";
import { useEffect, useState } from "react";

export const useProducerUpcomingEvents = (producer_uuid: string) => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      if (!producer_uuid) return;
      setLoading(true);
      const { data, error } = await getProducerUpcomingEvents(producer_uuid);
      if (error) {
        console.log("Error fetching upcoming events:", error);
        setUpcomingEvents([]);
      } else {
        setUpcomingEvents((data || []) as unknown as Event[]);
      }
      setLoading(false);
    };

    fetchUpcomingEvents();
  }, [producer_uuid]);

  return { upcomingEvents, loading };
};
