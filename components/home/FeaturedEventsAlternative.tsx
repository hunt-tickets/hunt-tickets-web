"use client";

import blurImage from "@/assets/other.png";
import CardEvent from "../site/CardEvent";
import { useState } from "react";

type FeaturedEventsAlternativeProps = {
  events: any[];
};

const FeaturedEventsAlternative = ({ events }: FeaturedEventsAlternativeProps) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Mock categories - puedes reemplazar con datos reales
  const categories = [
    { id: "all", name: "Todos", count: events.length },
    { id: "concerts", name: "Conciertos", count: Math.floor(events.length * 0.4) },
    { id: "festivals", name: "Festivales", count: Math.floor(events.length * 0.3) },
    { id: "parties", name: "Fiestas", count: Math.floor(events.length * 0.3) }
  ];

  // Featured event (first one)
  const featuredEvent = events[0];
  const otherEvents = events.slice(1, 9); // Show max 8 other events

  if (!events.length) return null;

  return (
    <section className="w-full bg-default-background py-20">
      <div className="w-full px-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Eventos <span className="text-white/60">Destacados</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Descubre las mejores experiencias que tenemos para ti
          </p>
        </div>

        {/* Events Grid - All same size */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 w-full">
          {events.map((event, index) => (
            <div 
              key={event.id} 
              className="group transform hover:scale-105 transition-transform duration-300"
              style={{ 
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
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
              />
            </div>
          ))}
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
      `}</style>
    </section>
  );
};

export default FeaturedEventsAlternative;