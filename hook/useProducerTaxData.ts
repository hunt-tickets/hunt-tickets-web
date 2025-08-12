import { getProducerTaxData } from "@/supabase/producersService";
import { ProducerTaxData } from "@/types/site";
import { useCallback, useEffect, useState } from "react";

export const useProducerTaxData = (producerId: string) => {
  const [taxData, setTaxData] = useState<ProducerTaxData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTaxData = useCallback(async () => {
    if (!producerId) return;

    setLoading(true);
    const { data, error } = await getProducerTaxData(producerId);

    if (error) {
      setError(error);
      setTaxData(null);
    } else {
      setTaxData(data?.length ? data[0] : null);
    }

    setLoading(false);
  }, [producerId]);

  useEffect(() => {
    fetchTaxData();
  }, [fetchTaxData]);

  return { taxData, loading, error, fetchTaxData };
};
