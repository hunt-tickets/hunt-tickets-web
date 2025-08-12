import { getProfiles } from "@/supabase/profilesService";
import { useEffect, useState } from "react";

export const useProfiles = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      const data = await getProfiles();
      setProfiles(data);
      setLoading(false);
    };

    fetchProfiles();
  }, []);

  return { profiles, loading };
};
