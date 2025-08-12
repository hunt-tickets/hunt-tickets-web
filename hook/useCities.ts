import { getCities } from "@/supabase/producersService";
import { City } from "@/types/site";
import { useEffect, useState } from "react";

export const useCities = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedCities = await getCities();
        setCities(fetchedCities);
      } catch (err) {
        setError("Error fetching cities");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  return { cities, loading, error };
};
