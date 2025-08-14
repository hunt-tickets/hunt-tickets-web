"use client";

import { StaticImageData } from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { ImageLoadingReveal } from "@/components/ui/image-loading-reveal";

interface CardEventProps {
  location: string;
  name: string;
  image: string;
  blurImage: string;
  id: string;
  date?: string;
  price?: number;
  glassmorphismColor?: string;
}

const CardEvent = ({
  location,
  name,
  image,
  blurImage,
  id,
  date,
  price,
  glassmorphismColor = 'bg-white/5',
}: CardEventProps) => {
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
    <div className="relative">
      {/* Glassmorphism container with GlowingEffect */}
      <div className={`relative p-6 rounded-3xl backdrop-blur-xl ${glassmorphismColor} border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20 group`}>
        
        {/* GlowingEffect for glassmorphism border */}
        <div className="absolute inset-0 z-50 rounded-3xl">
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={20}
            inactiveZone={0.8}
            borderWidth={3}
            movementDuration={1.2}
            className="rounded-3xl"
          />
        </div>
        
        <Link href={`/events/${id}`} className="relative z-10">
        <div 
          className="relative mx-auto w-full rounded-3xl transition-all duration-500 ease-out group cursor-pointer" 
          style={{ 
            aspectRatio: '1080/1350',
            boxShadow: '0 12px 40px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.2)',
            border: '1px solid #404040'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 25px 80px rgba(255,255,255,0.1), 0 0 40px rgba(255,255,255,0.05), 0 12px 40px rgba(0,0,0,0.4)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.2)';
            e.currentTarget.style.borderColor = '#404040';
          }}
        >
        {/* Image container with progressive reveal */}
        <ImageLoadingReveal 
          isLoading={!loaded}
          className="relative w-full h-full rounded-3xl"
          duration={2500}
        >
          <div className="relative w-full h-full overflow-hidden rounded-3xl">
            <div
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out rounded-3xl ${
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
              className={`w-full h-full object-cover rounded-3xl transition-all duration-700 ease-out group-hover:brightness-110 group-hover:saturate-110 ${
                loaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        </ImageLoadingReveal>
        
        {/* Glowing Effect for Image - Inner Layer */}
        <div className="absolute inset-0 z-40 rounded-3xl transition-all duration-300 group-hover:scale-[1.01] group-hover:brightness-110">
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={20}
            inactiveZone={0.8}
            borderWidth={4}
            movementDuration={1.2}
            className="rounded-3xl"
          />
        </div>
        
        
        
        {date && (
          <div className="absolute top-4 right-4 z-30 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2" style={{ border: '1px solid #404040' }}>
            <div className="flex flex-col items-center text-white">
              <span className="text-xl font-bold leading-none" style={{ textShadow: '0 0 1px rgba(156, 163, 175, 0.5)' }}>
                {new Date(date).getDate()}
              </span>
              <span className="text-xs font-medium uppercase leading-none mt-1" style={{ textShadow: '0 0 1px rgba(156, 163, 175, 0.5)' }}>
                {new Date(date).toLocaleDateString('es-ES', { month: 'short' }).toUpperCase()}
              </span>
            </div>
          </div>
        )}

        {price && (
          <div className="absolute bottom-4 left-4 z-30 bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2" style={{ border: '1px solid #404040' }}>
            <div className="text-white flex items-center space-x-2">
              <span className="text-xs font-medium opacity-80">Desde</span>
              <span className="text-lg font-bold" style={{ textShadow: '0 0 1px rgba(156, 163, 175, 0.5)' }}>
                ${price.toLocaleString()}
              </span>
            </div>
          </div>
        )}
        
        </div>
        
        {/* Title, venue, and price below image */}
        <div className="mt-4 px-2 py-3 space-y-2">
          <h2 className="text-heading-2 font-heading-2 text-white line-clamp-2 group-hover:text-gray-100 transition-colors duration-300 h-[3.5rem] flex items-start">
            {name}
          </h2>
          <p className="text-body font-body text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
            {location || 'Centro de Eventos Movistar Arena'}
          </p>
        </div>

        </Link>
      </div>
    </div>
  );
};

export default CardEvent;
