import {
  updateProducerBanner,
  uploadProducerBanner,
} from "@/supabase/producersService";
import { useState } from "react";

export const useUploadBanner = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadBanner = async (producerId: string, file: File) => {
    setLoading(true);
    setError(null);

    const response = await uploadProducerBanner(producerId, file);

    if (response.error) {
      setError(response.error);
      setLoading(false);
      return { error: response.error };
    }

    const updateResponse = await updateProducerBanner(
      producerId,
      response.url!
    );
    setLoading(false);
    return updateResponse;
  };

  return { uploadBanner, loading, error };
};
