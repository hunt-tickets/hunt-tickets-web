"use client";

import { StaticImageData } from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GlowCard } from "@/components/ui/spotlight-card";
import { Calendar, MapPin, Ticket } from "lucide-react";

interface CardEventSpotlightProps {
  location: string;
  name: string;
  image: string;
  blurImage: string;
  id: string;
  date?: string;
  price?: number;
  glowColor?: 'blue' | 'purple' | 'green' | 'red' | 'orange';
}

const CardEventSpotlight = ({
  location,
  name,
  image,
  blurImage,
  id,
  date,
  price,
  glowColor = 'blue'
}: CardEventSpotlightProps) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const handleLoad = () => setLoaded(true);

    if (img.complete) {
      handleLoad();
    } else {
      img.addEventListener("load", handleLoad);
      return () => img.removeEventListener("load", handleLoad);
    }
  }, [image]);

  return (
    <Link href={`/events/${id}`}>
      <GlowCard 
        glowColor={glowColor}
        customSize={true}
        className="w-full h-[400px] overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-[1.02]"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <div
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              loaded ? "opacity-0" : "opacity-100"
            }`}
            style={{
              backgroundImage: `url(${blurImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(20px)",
            }}
          />
          <img
            ref={imgRef}
            src={image}
            loading="lazy"
            alt={name}
            className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:brightness-110 group-hover:saturate-110 group-hover:scale-105 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />
          {/* Gradient Overlay */}
          <div 
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-300 group-hover:from-black/70"
          />
          {/* Glassmorphism overlay on hover */}
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-sm" />
        </div>

        {/* Date Badge */}
        {date && (
          <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md rounded-lg px-3 py-2 border border-white/20">
            <div className="flex flex-col items-center text-white">
              <span className="text-xl font-bold leading-none">
                {new Date(date).getDate()}
              </span>
              <span className="text-xs font-medium uppercase leading-none mt-1">
                {new Date(date).toLocaleDateString('es-ES', { month: 'short' }).toUpperCase()}
              </span>
            </div>
          </div>
        )}

        {/* Content Container */}
        <div className="relative z-10 flex flex-col justify-end h-full p-6">
          {/* Event Details */}
          <div className="space-y-3 text-white">
            <h3 className="text-xl font-bold line-clamp-2 group-hover:text-white/90 transition-colors duration-300">
              {name}
            </h3>
            
            <div className="flex items-center gap-2 text-white/80 group-hover:text-white/90 transition-colors duration-300">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm line-clamp-1">{location}</span>
            </div>

            {date && (
              <div className="flex items-center gap-2 text-white/80 group-hover:text-white/90 transition-colors duration-300">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">
                  {new Date(date).toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            )}

            {price && (
              <div className="flex items-center gap-2 mt-3">
                <Ticket className="w-4 h-4 flex-shrink-0 text-green-400" />
                <span className="text-sm text-white/60">Desde</span>
                <span className="text-lg font-bold text-green-400">
                  ${price.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Call to Action Button */}
          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <div className="bg-white/20 backdrop-blur-md rounded-lg px-4 py-2 border border-white/30 text-center">
              <span className="text-white font-medium text-sm">Ver Detalles</span>
            </div>
          </div>
        </div>
      </GlowCard>
    </Link>
  );
};

export default CardEventSpotlight;