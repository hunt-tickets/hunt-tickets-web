import { getEventDetails } from "@/supabase/producersService";
import { EventFull } from "@/types/site";
import { useEffect, useState } from "react";

export const useEvent = (eventId: string) => {
  const [event, setEvent] = useState<EventFull | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getEventDetails(eventId);

        if (!result || "error" in result) {
          setError(result?.error || "No se pudo cargar el evento.");
        } else {
          setEvent(result);
        }
      } catch (err) {
        setError("Error al obtener el evento.");
        console.log("Error al obtener el evento :.", err);
      }
      setLoading(false);
    };

    fetchEvent();
  }, [eventId]);

  return { event, loading, error };
};
