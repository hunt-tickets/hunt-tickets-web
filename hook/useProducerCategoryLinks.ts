import { getProducerCategoryLinks } from "@/supabase/producersService";
import { ProducerCategoryOrder } from "@/types/site";
import { useCallback, useEffect, useState } from "react";

export const useProducerCategoryLinks = (producerId: string) => {
  const [categories, setCategories] = useState<ProducerCategoryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    if (!producerId) return;

    setLoading(true);
    setTimeout(async () => {
      const { data, error } = await getProducerCategoryLinks(producerId);

      if (error) {
        console.log("Error fetching producer category links:", error);
        setError(error);
        setCategories([]);
      } else {
        setCategories(data || []);
      }

      setLoading(false);
    }, 1500);
  }, [producerId]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, fetchCategories };
};
