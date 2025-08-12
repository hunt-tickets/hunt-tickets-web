import { addCategoryToProducer } from "@/supabase/producersService";
import { ProducerCategoryOrder } from "@/types/site";
import { useState } from "react";

export const useAddCategoryToProducer = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addCategory = async (
    producer_id: string,
    producer_category_id: string
  ): Promise<{ category?: ProducerCategoryOrder; error?: string }> => {
    setLoading(true);
    setMessage(null);
    setError(null);

    const response = await addCategoryToProducer({
      producer_id,
      producer_category_id,
    });

    if (response?.error) {
      setError(response.error);
      setLoading(false);
      return { error: response.error };
    }

    setMessage(response.success || "Categoría agregada correctamente");
    setLoading(false);
    return {
      category: {
        id: producer_category_id,
        producer_id,
        position: 0,
        status: true,
        producers_category: {
          name: "Nueva Categoría",
          icon: "FeatherAlertCircle",
        },
      },
    };
  };

  return { addCategory, loading, message, error };
};
