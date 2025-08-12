"use client";

import AppShowcase from "@/components/home/AppShowcase";
import Banner from "@/components/home/Banners";
import CallToAction from "@/components/home/CallToAction";
import CompanyLogos from "@/components/home/CompanyLogos";
import Discover from "@/components/home/Discover";
import FeaturedEvents from "@/components/home/FeaturedEvent";
import FeaturedEventsAlternative from "@/components/home/FeaturedEventsAlternative";
import FeatureHighlights from "@/components/home/FeatureHighlights";
import Ready from "@/components/home/Ready";
import Title from "@/components/home/Title";
import LoaderAudio from "@/components/site/LoaderAudio";
import MobileEventFooter from "@/components/site/MobileEventFooter";
import { usePopularEvents } from "@/hook/usePopularEvents";
import { useUser } from "@/lib/UserContext";
import { useState } from "react";
import Link from "next/link";

const EventsPage = () => {
  const { user, loading: userLoading } = useUser();
  const [selectedCityId, setSelectedCityId] = useState<string | null>(
    "709a1819-8d1a-4338-9cd2-09f6f8bfad19"
  );
  const { events, loading: eventsLoading } = usePopularEvents(selectedCityId);

  if (userLoading) {
    return <LoaderAudio />;
  }

  return (
    <div className="w-full">
      <Banner />

      {/* Alternative Events Section */}
      <FeaturedEventsAlternative events={events} />
      
      {/* Company Logos Section */}
      <CompanyLogos />
      
      {/* App Showcase Section */}
      <AppShowcase />
      
      <div className="flex w-full flex-col items-center justify-center gap-8 bg-default-background px-6 py-20">
        <Discover />
        <div className="flex h-3 w-full flex-none flex-col items-center justify-center gap-2 px-6 py-6" />
        <Ready />
        <div className="flex h-3 w-full flex-none flex-col items-center justify-center gap-2 px-6 py-6" />
        <FeatureHighlights />
        <CallToAction />
      </div>
      
      <div className="flex w-full flex-col items-center justify-center gap-8 bg-default-background px-6 py-20">
      </div>
      <MobileEventFooter />
    </div>
  );
};

export default EventsPage;
