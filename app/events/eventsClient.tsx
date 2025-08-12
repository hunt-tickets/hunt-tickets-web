"use client";

import FilterSubtitle from "@/components/home/FilterSubtitle";
import Title from "@/components/home/Title";
import CardEvent from "@/components/site/CardEvent";
import LoaderAudio from "@/components/site/LoaderAudio";
import { useCities } from "@/hook/useCities";
import { usePopularEvents } from "@/hook/usePopularEvents";
import blurImage from "@/assets/other.png";
import { useEffect, useState } from "react";

const EventsClient = () => {
  const { cities, loading: citiesLoading } = useCities();
  const [selectedCity, setSelectedCity] = useState<string | null>("");
  const [selectedCityId, setSelectedCityId] = useState<string | null>(
    "709a1819-8d1a-4338-9cd2-09f6f8bfad19"
  );
  useEffect(() => {
    const city = cities.find((c) => c.name === selectedCity);
    setSelectedCityId(city ? city.id || "" : "");
  }, [selectedCity, cities]);

  const { events, loading: eventsLoading } = usePopularEvents(selectedCityId);

  if (citiesLoading || eventsLoading) {
    return <LoaderAudio />;
  }

  return (
    <div className="flex w-full flex-col items-center justify-center gap-8 bg-default-background px-6 py-20">
      <div className="flex w-full grow shrink-0 basis-0 flex-col items-start">
        <Title title="Eventos destacados" />
      </div>
      <div className="hidden flex w-full grow shrink-0 basis-0 flex-col items-start">
        <FilterSubtitle
          title="Eventos populares en"
          cities={cities}
          selectedCity={selectedCity || ""}
          setSelectedCity={setSelectedCity}
        />
      </div>
      <div className="flex w-full flex-col items-center sm:items-start gap-3">
        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 gap-4 w-full">
            {events.map((event) => (
              <div key={`event-${event.id}`} className="mx-auto sm:mx-0 px-2">
                <CardEvent
                  location={event.venue_name!}
                  name={event.name!}
                  image={event.flyer!}
                  blurImage={blurImage.src}
                  id={event.id}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-lg w-full">
            No hay eventos destacados
          </p>
        )}
      </div>
    </div>
  );
};

export default EventsClient;
