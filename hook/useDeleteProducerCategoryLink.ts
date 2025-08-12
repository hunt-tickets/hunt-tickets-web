import { deleteProducerCategoryLink } from "@/supabase/producersService";
import { useState } from "react";

export const useDeleteProducerCategoryLink = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const deleteCategoryLink = async (id: string) => {
    setLoading(true);
    setError(null);
    setMessage(null);

    const response = await deleteProducerCategoryLink(id);

    if (response.error) {
      setError(response.error);
    } else {
      setMessage(response.success || "Categoría eliminada con éxito");
      if(onSuccess){
        setTimeout(() => {
          onSuccess();
        }, 1000);
      }
    }

    setLoading(false);
  };

  return { deleteCategoryLink, loading, error, message };
};
