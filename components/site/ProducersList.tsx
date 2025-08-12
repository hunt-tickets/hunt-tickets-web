"use client";

import ProfileCard from "@/components/site/ProfileCard";
import ProfileSlider from "@/components/site/ProfileSlider";
import SubTitleSection from "@/components/site/SubTitleSection";
import { ProducerView } from "@/types/site";

interface ProducersListProps {
  producers: ProducerView[];
  loading: boolean;
  title: string;
}

const ProducersList = ({ producers, loading, title }: ProducersListProps) => {
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
                  <div key={producer.producer_id} className="px-2">
                    <ProfileCard
                      title={producer.producers.name}
                      avatarLetter={producer.producers.name.charAt(0)}
                      image={producer.producers.logo}
                      id={producer.producer_id}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <ProfileSlider>
                {producers.map((producer) => (
                  <div key={producer.producer_id} className="px-2">
                    <ProfileCard
                      title={producer.producers.name}
                      avatarLetter={producer.producers.name.charAt(0)}
                      image={producer.producers.logo}
                      id={producer.producer_id}
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

export default ProducersList;
