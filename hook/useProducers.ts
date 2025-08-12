import { getProducers } from "@/supabase/producersService";
import { Producer } from "@/types/site";
import { useEffect, useState } from "react";

export const useProducers = () => {
  const [producers, setProducers] = useState<Producer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>(""); // Asegúrate de que este estado existe
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState<keyof Producer>("name");

  const fetchProducers = async () => {
    setLoading(true);
    setTimeout(async () => {
      const { data, error } = await getProducers({
        searchTerm,
        sortOrder,
        sortColumn,
      });

      if (error) {
        console.log("Error fetching producers:", error);
        setProducers([]);
      } else {
        setProducers(data || []);
      }

      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    fetchProducers();
  }, [searchTerm, sortOrder, sortColumn]);

  return {
    producers,
    loading,
    searchTerm,
    setSearchTerm,
    setSortOrder,
    setSortColumn,
    addProducer: (newProducer: Producer) =>
      setProducers((prev) => [...prev, newProducer]),
    updateProducerInList: (updatedProducer: Producer) =>
      setProducers((prev) =>
        prev.map((producer) =>
          producer.id === updatedProducer.id ? updatedProducer : producer
        )
      ),
  };
};
