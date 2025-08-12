import { updateTransactionStatus } from "@/supabase/producersService";
import { useState } from "react";

export const useUpdateTransactionStatus = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async (orderId: string, status: string) => {
    setLoading(true);
    setError(null);
    const result = await updateTransactionStatus(orderId, status);

    if (result.error) {
      setError(result.error);
      setSuccess(false);
    } else {
      setSuccess(true);
    }

    setLoading(false);
  };

  return { updateStatus, loading, success, error };
};
