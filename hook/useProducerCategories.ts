import { getProducerCategories } from "@/supabase/producersService";
import { useEffect, useState } from "react";

export const useProducerCategories = () => {
  const [categories, setCategories] = useState<
    { id: string; name: string; status: boolean; icon: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const { data, error } = await getProducerCategories();
      if (error) {
        console.log("Error fetching categories:", error);
        setCategories([]);
      } else {
        setCategories(
          data?.map((category) => ({
            ...category,
            icon: category.icon || "",
          })) || []
        );
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  return { categories, loading };
};
