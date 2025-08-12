import {
  updateProducerLogo,
  uploadProducerLogo,
} from "@/supabase/producersService";
import { useState } from "react";

export const useUploadLogo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadLogo = async (producerId: string, file: File) => {
    setLoading(true);
    setError(null);

    const response = await uploadProducerLogo(producerId, file);

    if (response.error) {
      setError(response.error);
      setLoading(false);
      return { error: response.error };
    }

    const updateResponse = await updateProducerLogo(producerId, response.url!);
    setLoading(false);
    return updateResponse;
  };

  return { uploadLogo, loading, error };
};
