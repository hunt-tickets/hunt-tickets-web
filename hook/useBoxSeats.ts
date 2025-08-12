import { useState, useEffect } from 'react';

interface BoxTicket {
  id: string;
  name: string;
  capacity: number;
  price: number;
  description: string;
  available: boolean;
}

interface BoxSection {
  title: string;
  color: string;
  boxes: BoxTicket[];
}

interface UseBoxSeatsReturn {
  sections: BoxSection[];
  eventMapUrl?: string;
  loading: boolean;
  error: string | null;
  hasBoxSeats: boolean;
}

export const useBoxSeats = (eventId: string | null | undefined): UseBoxSeatsReturn => {
  const [sections, setSections] = useState<BoxSection[]>([]);
  const [eventMapUrl, setEventMapUrl] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('useBoxSeats - eventId recibido:', eventId);
    console.log('useBoxSeats - tipo de eventId:', typeof eventId);

    // Validación robusta del eventId
    if (!eventId || eventId === 'undefined' || eventId === 'null' || eventId.trim() === '') {
      console.log('useBoxSeats - eventId inválido, no se hará la llamada');
      setLoading(false);
      setSections([]);
      return;
    }

    const fetchBoxSeats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // URL del endpoint
        const edgeFunctionUrl = `https://jtfcfsnksywotlbsddqb.supabase.co/functions/v1/get-box-seats`;
        
        console.log('useBoxSeats - Llamando a get-box-seats con eventId:', eventId);

        // Usar el mismo patrón que getEventDetails
        const response = await fetch(`${edgeFunctionUrl}?event_id=${eventId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            "Content-Type": "application/json",
          },
        });

        console.log('useBoxSeats - Response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error('useBoxSeats - Error response:', errorData);
          throw new Error(errorData.error || `Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('useBoxSeats - Respuesta completa:', data);

        if (data && data.sections && Array.isArray(data.sections)) {
          console.log('useBoxSeats - Sections recibidas:', data.sections);
          setSections(data.sections);
          setEventMapUrl(data.eventMapUrl);
        } else {
          console.log('useBoxSeats - No se recibieron sections válidas');
          setSections([]);
        }
      } catch (err) {
        console.error('useBoxSeats - Error capturado:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar los palcos');
        setSections([]);
      } finally {
        setLoading(false);
      }
    };

    // Pequeño delay para asegurar que eventId esté estable
    const timeoutId = setTimeout(() => {
      fetchBoxSeats();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [eventId]);

  return { 
    sections, 
    eventMapUrl, 
    loading, 
    error,
    hasBoxSeats: sections.length > 0
  };
};