import { addProducerTaxData } from "@/supabase/producersService";
import { ProducerTaxData } from "@/types/site";
import { useState } from "react";

export const useAddProducerTaxData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const saveTaxData = async (data: ProducerTaxData) => {
    setLoading(true);
    setError(null);
    setMessage(null);

    const response = await addProducerTaxData(data);

    if (response.error) {
      setError(response.error);
    } else {
      setMessage(response.success || null);
    }

    setLoading(false);
  };

  return { saveTaxData, loading, message, error };
};
