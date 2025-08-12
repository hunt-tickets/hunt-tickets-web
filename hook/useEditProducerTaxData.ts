import { updateProducerTaxData } from "@/supabase/producersService";
import { ProducerTaxData } from "@/types/site";
import { useState } from "react";

export const useEditProducerTaxData = (fetchTaxData?: () => void) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const updateTaxData = async (
    id: string,
    taxData: Partial<ProducerTaxData>
  ) => {
    setLoading(true);
    setError(null);
    setMessage(null);

    const response = await updateProducerTaxData(id, taxData);

    if (response?.error) {
      setError(response.error);
    } else {
      setMessage(
        response.success || "✅ Datos fiscales actualizados exitosamente"
      );

      if (fetchTaxData) {
        await fetchTaxData();
      }
    }

    setLoading(false);
    return response;
  };

  return { updateTaxData, loading, error, message };
};
