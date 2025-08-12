import { getProducerPastEvents } from "@/supabase/producersService";
import { Event } from "@/types/site";
import { useEffect, useState } from "react";

export const useProducerPastEvents = (producer_uuid: string) => {
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPastEvents = async () => {
      if (!producer_uuid) return;
      setLoading(true);
      const { data, error } = await getProducerPastEvents(producer_uuid);
      if (error) {
        console.log("Error fetching past events:", error);
        setPastEvents([]);
      } else {
        setPastEvents((data || []) as unknown as Event[]);
      }
      setLoading(false);
    };

    fetchPastEvents();
  }, [producer_uuid]);

  return { pastEvents, loading };
};
