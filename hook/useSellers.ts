import {
  createSeller,
  deleteSeller,
  getSellersByProducer,
} from "@/supabase/producersService";
import { useEffect, useState } from "react";

interface Seller {
  id: string;
  name?: string;
  phone?: string;
  [key: string]: any;
}

export const useSellers = (producerId: string) => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSellers = async () => {
    setLoading(true);
    const { data, error } = await getSellersByProducer(producerId);

    if (error) {
      setError(error);
      setSellers([]);
    } else {
      setSellers(data);
    }
    setLoading(false);
  };

  const addSeller = async (phone: string) => {
    setLoading(true);
    const { data, error } = await createSeller(producerId, phone);

    if (error) {
      setError(error);
      setLoading(false);
      return false;
    }

    await fetchSellers();
    return true;
  };

  const removeSeller = async (sellerId: string) => {
    setLoading(true);
    const { success, error } = await deleteSeller(sellerId);

    if (error) {
      setError(error);
      setLoading(false);
      return false;
    }

    await fetchSellers();
    return true;
  };

  useEffect(() => {
    if (producerId) fetchSellers();
  }, [producerId]);

  return { sellers, loading, error, addSeller, removeSeller };
};
