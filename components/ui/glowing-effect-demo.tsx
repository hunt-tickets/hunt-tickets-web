"use client";

import { Calendar, MapPin, Star, Users, Ticket } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";

export function GlowingEffectDemo() {
  return (
    <div className="p-8 bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Glowing Effect Demo - Event Cards
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <DemoEventCard
            title="Concierto de Rock"
            location="Estadio Nacional"
            date="15 Dic 2024"
            price={45000}
            image="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=600&fit=crop"
            icon={<Star className="h-4 w-4" />}
          />
          
          <DemoEventCard
            title="Festival de Jazz"
            location="Centro Cultural"
            date="20 Dic 2024"
            price={35000}
            image="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=600&fit=crop"
            icon={<Users className="h-4 w-4" />}
          />
          
          <DemoEventCard
            title="Fiesta de Año Nuevo"
            location="Club Premium"
            date="31 Dic 2024"
            price={80000}
            image="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=600&fit=crop"
            icon={<Calendar className="h-4 w-4" />}
          />
          
          <DemoEventCard
            title="Concierto Sinfónico"
            location="Teatro Municipal"
            date="5 Ene 2025"
            price={25000}
            image="https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400&h=600&fit=crop"
            icon={<Ticket className="h-4 w-4" />}
          />
          
          <DemoEventCard
            title="Stand Up Comedy"
            location="Teatro de Bolsillo"
            date="10 Ene 2025"
            price={15000}
            image="https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=400&h=600&fit=crop"
            icon={<Users className="h-4 w-4" />}
          />
          
          <DemoEventCard
            title="Festival Electrónico"
            location="Parque O'Higgins"
            date="15 Ene 2025"
            price={60000}
            image="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&h=600&fit=crop"
            icon={<Star className="h-4 w-4" />}
          />
        </div>
      </div>
    </div>
  );
}

interface DemoEventCardProps {
  title: string;
  location: string;
  date: string;
  price: number;
  image: string;
  icon: React.ReactNode;
}

const DemoEventCard = ({ title, location, date, price, image, icon }: DemoEventCardProps) => {
  return (
    <div className="relative h-[400px] rounded-xl border border-gray-700 overflow-hidden group cursor-pointer transition-transform duration-300 hover:-translate-y-2">
      <GlowingEffect
        spread={60}
        glow={true}
        disabled={false}
        proximity={100}
        inactiveZone={0.2}
        borderWidth={3}
        movementDuration={1.2}
      />
      
      {/* Image Background */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>
      
      {/* Date Badge */}
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
      
      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full p-6">
        <div className="space-y-3 text-white">
          <div className="w-fit rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm p-2">
            {icon}
          </div>
          
          <h3 className="text-xl font-bold line-clamp-2">
            {title}
          </h3>
          
          <div className="flex items-center gap-2 text-white/80">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm line-clamp-1">{location}</span>
          </div>

          <div className="flex items-center gap-2 text-white/80">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{date}</span>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <Ticket className="w-4 h-4 flex-shrink-0 text-green-400" />
            <span className="text-sm text-white/60">Desde</span>
            <span className="text-lg font-bold text-green-400">
              ${price.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};