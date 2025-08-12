"use client";

import { StaticImageData } from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface CardEventProps {
  location: string;
  name: string;
  image: string;
  blurImage: string;
  id: string;
  date?: string;
  price?: number;
}

const CardEvent = ({
  location,
  name,
  image,
  blurImage,
  id,
  date,
  price,
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
    <Link href={`/events/${id}`}>
      <div 
        className="relative mx-auto w-full max-w-[350px] overflow-hidden rounded-xl transition-all duration-500 ease-out hover:-translate-y-2 group cursor-pointer" 
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
          className={`w-full h-full object-cover rounded-xl transition-all duration-700 ease-out group-hover:brightness-110 group-hover:saturate-110 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
        {/* Overlay gradual */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-60 transition-all duration-300 ease-out group-hover:bg-opacity-90"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
          }}
        />
        
        {/* Hover glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/5 via-white/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" />
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out mix-blend-overlay" />
        
        {date && (
          <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2" style={{ border: '1px solid #404040' }}>
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
        
      </div>
      
      {/* Title, venue, and price below image */}
      <div className="mt-4 px-2 py-3 space-y-2 group-hover:translate-y-[-2px] transition-transform duration-300 ease-out">
        <h2 className="text-heading-2 font-heading-2 text-white line-clamp-2 group-hover:text-gray-100 transition-colors duration-300">
          {name}
        </h2>
        <p className="text-body font-body text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
          {location || 'Centro de Eventos Movistar Arena'}
        </p>
        {price && (
          <p className="text-lg text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
            Desde <span className="text-white font-bold text-xl group-hover:text-gray-100 transition-colors duration-300">${price.toLocaleString()}</span>
          </p>
        )}
      </div>
    </Link>
  );
};

export default CardEvent;
