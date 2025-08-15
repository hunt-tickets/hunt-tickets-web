"use client";

import { useState } from "react";
import { useAllEvents } from "@/hook/useAllEvents";
import CardEvent from "@/components/site/CardEvent";
import ModernBreadcrumbs from "@/components/ui/modern-breadcrumbs";
import blurImage from "@/assets/other.png";

export default function EventsPage() {
  const { events, loading } = useAllEvents();
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Calculate counts for each tab
  const getEventCounts = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let upcomingCount = 0;
    let pastCount = 0;
    
    events.forEach(event => {
      if (!event.date) {
        upcomingCount++; // Default to upcoming if no date
        return;
      }
      
      const eventDateStr = event.date;
      let eventDate;
      
      // Parse date same way as in getDisplayedEvents
      if (eventDateStr.includes('/')) {
        const [day, month, year] = eventDateStr.split('/');
        eventDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      } else {
        eventDate = new Date(eventDateStr);
      }
      
      if (isNaN(eventDate.getTime())) {
        upcomingCount++; // Default to upcoming if parsing fails
      } else if (eventDate >= today) {
        upcomingCount++;
      } else {
        pastCount++;
      }
    });
    
    return { upcomingCount, pastCount };
  };

  const { upcomingCount, pastCount } = getEventCounts();

  // Tabs for upcoming and past events
  const tabs = [
    { id: "upcoming", name: "Próximos", count: upcomingCount },
    { id: "past", name: "Pasados", count: pastCount }
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

  // Get events based on selected tab and search term - infinite carousel
  const getDisplayedEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today for accurate comparison
    
    // Filter events based on selected tab
    let allEvents = events.filter(event => {
      if (!event.date) return selectedTab === "upcoming"; // Default to upcoming if no date
      
      // Parse the date string (format like "17/06/2025" from new API)
      const eventDateStr = event.date;
      
      // Try to parse different date formats
      let eventDate;
      
      // If it's in "DD/MM/YYYY" format like "17/06/2025"
      if (eventDateStr.includes('/')) {
        const [day, month, year] = eventDateStr.split('/');
        // Month is 0-indexed in JavaScript Date constructor
        eventDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      } else {
        // Fallback to standard date parsing
        eventDate = new Date(eventDateStr);
      }
      
      // If parsing failed, default to upcoming
      if (isNaN(eventDate.getTime())) {
        return selectedTab === "upcoming";
      }
      
      // Compare dates
      if (selectedTab === "upcoming") {
        return eventDate >= today;
      } else {
        return eventDate < today;
      }
    });
    
    // Filter by search term
    if (searchTerm.trim()) {
      allEvents = allEvents.filter(event => 
        event.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
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

  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentIndex(0); // Reset carousel when searching
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <div className="text-white text-lg">Cargando eventos...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto bg-[#0a0a0a] p-12">
      {/* Breadcrumbs */}
      <div className="w-full mb-6">
        <ModernBreadcrumbs />
      </div>

      {/* Events Section - Replicating Landing Page */}
      <section className="w-full bg-[#0a0a0a]">
        <div className="w-full">
          
          {/* Header - Title */}
          <div className="mb-6">
            <h2 className="text-5xl md:text-6xl font-bold text-white" style={{ letterSpacing: '-5px', lineHeight: '130%' }}>
              Mis <span style={{ fontFamily: "'Amarante', 'Cinzel Decorative', serif", fontWeight: '400' }} className="italic">Eventos</span>
            </h2>
          </div>

          {/* Navigation Controls - Tabs, Search, Create Button and Arrows */}
          <div className="flex justify-between items-center mb-6">
            {/* Left: Tabs */}
            <div className="flex space-x-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`relative px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 backdrop-blur-sm border ${
                    selectedTab === tab.id
                      ? 'bg-white/10 text-white border-white/20 shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <span className="relative z-10">{tab.name}</span>
                  <span className="relative z-10 ml-2 text-xs bg-white/10 px-2 py-1 rounded-full">
                    {tab.count}
                  </span>
                  {selectedTab === tab.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-xl"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Center: Search */}
            <div className="flex-1 mx-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Buscar eventos..."
                  className="w-full h-12 px-4 pl-10 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm text-white text-sm font-medium placeholder-white/60 focus:bg-white/10 focus:border-white/20 focus:outline-none transition-all duration-200"
                />
                <svg 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                {searchTerm && (
                  <button
                    onClick={() => handleSearchChange("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60 hover:text-white transition-colors"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            
            {/* Right: Create Button */}
            <div className="flex items-center">
              {/* Create New Event Button */}
              <button className="h-12 px-4 bg-[#d9d9d9] hover:bg-white hover:scale-[1.02] rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg">
                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-black font-medium text-sm">Crear Evento</span>
              </button>
            </div>
          </div>

          {/* Events Carousel - Always 5 cards or Empty State */}
          <div className="relative">
            {displayedEvents.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
                <h3 className="text-2xl font-medium text-white/60 mb-2">
                  {searchTerm ? 'Sin resultados' : 
                   selectedTab === 'upcoming' ? 'No hay eventos próximos' : 'No hay eventos pasados'}
                </h3>
                <p className="text-white/40 text-lg">
                  {searchTerm 
                    ? `No se encontraron eventos que coincidan con "${searchTerm}"`
                    : selectedTab === 'upcoming' 
                      ? 'Aún no hay eventos programados para mostrar'
                      : 'No hay eventos pasados para mostrar'
                  }
                </p>
              </div>
            ) : (
              /* Events Carousel */
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
                        animationDelay: `${index * 100}ms`,
                        animation: 'fadeInUp 0.6s ease-out forwards'
                      }}
                    >
                      <CardEvent
                        location=""
                        name={event.name || 'Sin título'}
                        image={event.flyer || blurImage.src}
                        blurImage={blurImage.src}
                        id={event.id?.toString() || ''}
                        date={event.date}
                        glassmorphismColor={event.glassmorphismColor}
                        hideVenuePriceInfo={true}
                        isDashboard={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation arrows and info below carousel - Only show when there are events */}
          {displayedEvents.length > 0 && (
            <div className="flex justify-between items-center mt-8">
              {/* Event count info */}
              <div className="text-white/60 text-sm">
                Mostrando {Math.min(displayedEvents.length, 5)} de {(() => {
                  // Get filtered events count using the same logic as getDisplayedEvents
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  
                  let filteredEvents = events.filter(event => {
                    if (!event.date) return selectedTab === "upcoming";
                    
                    const eventDateStr = event.date;
                    let eventDate;
                    
                    if (eventDateStr.includes('/')) {
                      const [day, month, year] = eventDateStr.split('/');
                      eventDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                    } else {
                      eventDate = new Date(eventDateStr);
                    }
                    
                    if (isNaN(eventDate.getTime())) {
                      return selectedTab === "upcoming";
                    }
                    
                    if (selectedTab === "upcoming") {
                      return eventDate >= today;
                    } else {
                      return eventDate < today;
                    }
                  });
                  
                  if (searchTerm.trim()) {
                    filteredEvents = filteredEvents.filter(event => 
                      event.name?.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                  }
                  return filteredEvents.length;
                })()} eventos
              </div>

              {/* Navigation arrows */}
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
          )}

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
    </div>
  );
}