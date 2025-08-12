import { getProducerLinks } from "@/supabase/producersService";
import { Social } from "@/types/site";
import { useEffect, useState } from "react";

export const useProducerLinks = (producer_uuid: string) => {
  const [links, setLinks] = useState<Social[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!producer_uuid) return;

    const fetchLinks = async () => {
      setLoading(true);
      const { data, error } = await getProducerLinks(producer_uuid);

      if (error) {
        console.log("Error fetching producer links:", error);
        setLinks([]);
      } else {
        setLinks(data || []);
      }

      setLoading(false);
    };

    fetchLinks();
  }, [producer_uuid]);

  return { links, loading };
};
