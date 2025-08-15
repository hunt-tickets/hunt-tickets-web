"use client";

import blurImage from "@/assets/other.png";
import CardEvent from "../site/CardEvent";
import { useState } from "react";

type FeaturedEventsAlternativeProps = {
  events: any[];
};

const FeaturedEventsAlternative = ({ events }: FeaturedEventsAlternativeProps) => {
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Tabs for upcoming and past events
  const tabs = [
    { id: "upcoming", name: "Próximos", count: events.length },
    { id: "past", name: "Pasados", count: events.length } // Reutiliza el mismo endpoint por ahora
  ];

  // Todos los cards con el gris más oscuro
  const darkGrayVariants = [
    'bg-[#2a2a2a]/60',
    'bg-[#2a2a2a]/60', 
    'bg-[#2a2a2a]/60'
  ];

  // Helper function para módulo positivo
  const positiveModulo = (n: number, m: number) => {
    return ((n % m) + m) % m;
  };

  // Get events based on selected tab - infinite carousel
  const getDisplayedEvents = () => {
    // Por ahora ambos tabs muestran los mismos eventos
    // Más adelante se puede implementar el endpoint de eventos pasados
    const allEvents = selectedTab === "upcoming" ? events : events; // Mismo array por ahora
    
    if (allEvents.length === 0) return [];
    
    // Crear array infinito repitiendo eventos
    const eventsWithColors = [];
    for (let i = 0; i < 5; i++) {
      const eventIndex = positiveModulo(currentIndex + i, allEvents.length);
      const event = allEvents[eventIndex];
      
      if (event) {
        eventsWithColors.push({
          ...event,
          glassmorphismColor: darkGrayVariants[i % darkGrayVariants.length],
          // Agregar key único para evitar problemas de React
          uniqueKey: `${event.id}-${Math.floor((currentIndex + i) / allEvents.length)}`
        });
      }
    }
    
    return eventsWithColors;
  };

  const displayedEvents = getDisplayedEvents();

  // Cambiar tab resetea el índice
  const handleTabChange = (tabId: string) => {
    setSelectedTab(tabId);
    setCurrentIndex(0);
  };

  if (!events.length) return null;

  return (
    <section className="w-full bg-default-background py-32">
      <div className="w-full px-6">
        
        {/* Header - Single line layout with centered tabs */}
        <div className="relative flex justify-between items-center mb-8">
          {/* Left: Title */}
          <div>
            <h2 className="text-5xl md:text-6xl font-bold text-white" style={{ letterSpacing: '-5px', lineHeight: '130%' }}>
              EVENTOS <span style={{ fontFamily: "'Amarante', 'Cinzel Decorative', serif", fontWeight: '400' }} className="italic">Destacados</span>
            </h2>
          </div>
          
          {/* Center: Tabs - absolutely positioned to center of screen */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`relative px-6 py-3 text-base font-semibold rounded-xl transition-all duration-300 backdrop-blur-sm border ${
                  selectedTab === tab.id
                    ? 'bg-white/10 text-white border-white/20 shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border-white/10 hover:border-white/20'
                }`}
                style={{ letterSpacing: 'normal' }}
              >
                <span className="relative z-10">{tab.name}</span>
                {selectedTab === tab.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-xl"></div>
                )}
              </button>
            ))}
          </div>
          
          {/* Right: Navigation arrows */}
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentIndex(currentIndex - 1)}
              className="w-10 h-10 bg-white/10 border border-white/20 rounded-full backdrop-blur-xl hover:bg-white/20 transition-all duration-200 flex items-center justify-center shadow-lg"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentIndex(currentIndex + 1)}
              className="w-10 h-10 bg-white/10 border border-white/20 rounded-full backdrop-blur-xl hover:bg-white/20 transition-all duration-200 flex items-center justify-center shadow-lg"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Events Carousel - Always 5 cards */}
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out gap-6"
              style={{
                transform: `translateX(0%)`,
                width: 'fit-content'
              }}
            >
              {displayedEvents.map((event, index) => (
                <div 
                  key={event.uniqueKey || event.id} 
                  className="flex-shrink-0 w-[calc(20%-1.2rem)] min-w-[280px] group transform hover:scale-105 transition-all duration-500 ease-in-out"
                  style={{ 
                    animationName: 'fadeInUp',
                    animationDuration: '0.6s',
                    animationTimingFunction: 'ease-out',
                    animationFillMode: 'forwards',
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <CardEvent
                    location={event.venue_name!}
                    name={event.name!}
                    image={event.flyer!}
                    blurImage={blurImage.src}
                    id={event.id}
                    date={event.date || event.event_date}
                    price={event.min_price || event.price || Math.floor(Math.random() * 80000) + 20000}
                    glassmorphismColor={event.glassmorphismColor}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Simple animation when cards change */
        .flex-shrink-0:nth-child(1) { animation-delay: 0ms; }
        .flex-shrink-0:nth-child(2) { animation-delay: 100ms; }
        .flex-shrink-0:nth-child(3) { animation-delay: 200ms; }
        .flex-shrink-0:nth-child(4) { animation-delay: 300ms; }
        .flex-shrink-0:nth-child(5) { animation-delay: 400ms; }
      `}</style>
    </section>
  );
};

export default FeaturedEventsAlternative;