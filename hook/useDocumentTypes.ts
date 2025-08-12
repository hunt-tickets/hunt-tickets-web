import { getDocumentTypes } from "@/supabase/producersService";
import { DocumentType } from "@/types/site";
import { useEffect, useState } from "react";

export const useDocumentTypes = () => {
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocumentTypes = async () => {
      setLoading(true);
      const { data, error } = await getDocumentTypes();

      if (error) {
        setError(error);
        setDocumentTypes([]);
      } else {
        setDocumentTypes(data || []);
      }

      setLoading(false);
    };

    fetchDocumentTypes();
  }, []);

  return { documentTypes, loading, error };
};
