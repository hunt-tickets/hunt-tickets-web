import { uploadProducerRut } from "@/supabase/producersService";
import { useState } from "react";

export const useUploadRut = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  const uploadRut = async (producerId: string, file: File) => {
    setLoading(true);
    setError(null);
    setUrl(null);

    const response = await uploadProducerRut(producerId, file);

    if (response?.error) {
      setError(response.error);
      setLoading(false);
      return { error: response.error };
    } else {
      setUrl(response.url || "");
    }

    setUrl(response.url || "");
    setLoading(false);
    return { url: response.url || "" };
  };

  return { uploadRut, loading, url, error };
};
