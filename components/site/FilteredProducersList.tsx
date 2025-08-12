"use client";

import ProfileCard from "@/components/site/ProfileCard";
import ProfileSlider from "@/components/site/ProfileSlider";
import SubTitleSection from "@/components/site/SubTitleSection";
import { Producer } from "@/types/site";

interface FilteredProducersListProps {
  producers: Producer[];
  searchTerm: string;
  sortOrder: "asc" | "desc" | undefined;
  loading: boolean;
}

const FilteredProducersList = ({
  producers,
  searchTerm,
  sortOrder,
  loading,
}: FilteredProducersListProps) => {
  const title = searchTerm
    ? `Resultados para "${searchTerm}"`
    : `Ordenar por "${sortOrder}"`;

  if (loading) {
    return <p className="text-center text-lg">Cargando...</p>;
  }

  return (
    <div className="flex w-full flex-col items-start gap-3">
      <div className="flex w-full flex-col items-start gap-3">
        <div className="flex items-center gap-2">
          <SubTitleSection title={title} />
        </div>
        <div className="flex w-full items-start gap-4 mx-0 mt-2 mb-9">
          <div className="w-full">
            {producers.length <= 5 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {producers.map((producer) => (
                  <div key={producer.id} className="px-2">
                    <ProfileCard
                      title={producer.name}
                      avatarLetter={producer.name.charAt(0)}
                      image={producer.logo}
                      id={producer.id}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <ProfileSlider>
                {producers.map((producer) => (
                  <div key={producer.id} className="px-2">
                    <ProfileCard
                      title={producer.name}
                      avatarLetter={producer.name.charAt(0)}
                      image={producer.logo}
                      id={producer.id}
                    />
                  </div>
                ))}
              </ProfileSlider>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilteredProducersList;
