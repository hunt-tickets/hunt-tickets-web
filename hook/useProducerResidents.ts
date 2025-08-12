import { getProducerResidents } from "@/supabase/producersService";
import { Resident } from "@/types/site";
import { useEffect, useState } from "react";

export const useProducerResidents = (producerUuid: string) => {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResidents = async () => {
      if (!producerUuid) return;

      setLoading(true);
      const { data, error } = await getProducerResidents(producerUuid);

      if (error) {
        setError(error);
        setResidents([]);
      } else {
        setResidents(data || []);
      }
      setLoading(false);
    };

    fetchResidents();
  }, [producerUuid]);

  return { residents, loading, error };
};
