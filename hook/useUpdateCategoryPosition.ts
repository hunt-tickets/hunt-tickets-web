import { updateCategoryPosition } from "@/supabase/producersService";
import { useState } from "react";

export const useUpdateCategoryPosition = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const updatePosition = async (id: string, position: number) => {
    setLoading(true);
    setError(null);
    setMessage(null);

    const response = await updateCategoryPosition(id, position);

    if (response.error) {
      setError(response.error);
    } else {
      setMessage(response.success || "Category position updated successfully");
    }

    setLoading(false);
  };

  return { updatePosition, loading, error, message };
};
