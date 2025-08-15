"use client";

import CallToAction from "@/components/home/CallToAction";
import CompanyLogos from "@/components/home/CompanyLogos";
import FeaturedEvents from "@/components/home/FeaturedEvent";
import FeaturedEventsAlternative from "@/components/home/FeaturedEventsAlternative";
import FeatureHighlights from "@/components/home/FeatureHighlights";
import Header from "@/components/home/Header";
import Ready from "@/components/home/Ready";
import Title from "@/components/home/Title";
import LoaderAudio from "@/components/site/LoaderAudio";
import MobileEventFooter from "@/components/site/MobileEventFooter";
import { HuntGridMotion } from "@/components/ui/hunt-grid-motion";
import { HuntHeroSection } from "@/components/ui/gradient-bar-hero-section";
import { DisplayCardsDemo } from "@/components/ui/display-cards-demo";
import { CardHoverProvider, useCardHover } from "@/hooks/useCardHover";
import { FlipWordsHover } from "@/components/ui/flip-words-hover";
import { usePopularEvents } from "@/hook/usePopularEvents";
import { useUser } from "@/lib/UserContext";
import { useState } from "react";
import React from "react";

const DynamicTitle = () => {
  const { hoveredCard } = useCardHover();
  
  return (
    <div className="h-20 flex items-center">
      <FlipWordsHover
        currentWord={hoveredCard || "HUNT"}
      />
    </div>
  );
};

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
    <CardHoverProvider>
      <div className="w-full">
        {/* Fixed Header */}
        <Header />
      
      {/* Hunt Hero Section with Gradient Bars */}
      <HuntHeroSection />
      
      {/* Alternative Events Section */}
      <FeaturedEventsAlternative events={events} />
      
      {/* Display Cards Section - Apple Wallet, Email, Hunt App */}
      <section className="w-full py-20" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="w-full px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] gap-16 items-center min-h-[600px]">
            {/* Left Column - Text Content */}
            <div className="w-full space-y-6 pl-8 lg:pl-12 xl:pl-16">
              <DynamicTitle />
              <p className="text-white text-xl leading-relaxed max-w-none">
                Accede a tus eventos desde cualquier lugar con nuestras múltiples opciones de gestión. 
                Una experiencia fluida que se adapta a tu estilo de vida digital moderno y conectado.
              </p>
            </div>
            
            {/* Right Column - Display Cards */}
            <div className="w-full flex items-center justify-center">
              <DisplayCardsDemo />
            </div>
          </div>
        </div>
      </section>

      
      <MobileEventFooter />
      </div>
    </CardHoverProvider>
  );
};

export default EventsPage;
