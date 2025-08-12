import { getEventVariableFee } from "@/supabase/producersService";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseBrowser";

export const useVariableFee = (eventId: string) => {
  const [fee, setFee] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;

    const fetchFee = async () => {
      setLoading(true);


      const result = await getEventVariableFee(eventId);

      if ("error" in result) {
        setError(result.error);
      } else {
        setFee(result.variable_fee);
      }

      setLoading(false);
    };

    fetchFee();
  }, [eventId]);

  return { fee, loading, error };
};