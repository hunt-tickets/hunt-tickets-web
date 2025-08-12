import { getProducerVenues } from "@/supabase/producersService";
import { Venue } from "@/types/site";
import { useEffect, useState } from "react";

export const useProducerVenues = (producer_uuid: string) => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!producer_uuid) return;

    const fetchVenues = async () => {
      setLoading(true);
      const { data, error } = await getProducerVenues(producer_uuid);
      if (error) {
        console.log("Error fetching venues:", error);
        setVenues([]);
      } else {
        setVenues(data || []);
      }
      setLoading(false);
    };

    fetchVenues();
  }, [producer_uuid]);

  return { venues, loading };
};
