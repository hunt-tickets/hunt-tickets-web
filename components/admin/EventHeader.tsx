"use client";

import { useRouter } from "next/navigation";
import ModernBreadcrumbs from "@/components/ui/modern-breadcrumbs";
import blurImage from "@/assets/other.png";
import type { EventDetails, TabType } from "@/lib/types/event-types";

interface EventHeaderProps {
  event: EventDetails;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function EventHeader({ event, activeTab, setActiveTab }: EventHeaderProps) {
  const router = useRouter();

  const tabs = [
    { id: "overview", name: "Resumen", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
    { id: "settings", name: "Configuración", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    { id: "analytics", name: "Analytics", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg> },
    { id: "tickets", name: "Entradas", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg> },
    { id: "cortesias", name: "Cortesías", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg> },
    { id: "transactions", name: "Transacciones", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg> },
    { id: "map", name: "Mapa", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  ];

  return (
    <>
      {/* Breadcrumbs */}
      <div className="w-full mb-6">
        <ModernBreadcrumbs 
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Eventos", href: "/dashboard/events" },
            { label: event.name, isActive: true }
          ]}
        />
      </div>

      {/* Event Flyer Strip */}
      {event.flyer && (
        <div className="w-full mb-8">
          <div className="relative w-full h-24 md:h-32 rounded-2xl overflow-hidden border border-white/10">
            <img
              src={event.flyer}
              alt={`${event.name} - Flyer`}
              className="w-full h-full object-cover blur-md"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = blurImage.src;
              }}
            />
            <div className="absolute inset-0 backdrop-blur-sm" />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold text-lg">{event.name}</h3>
                  <p className="text-white/80 text-sm">{event.date} • {event.hour}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                  <span className="text-white text-xs font-medium">Evento Destacado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full">
        {/* Header with back button */}
        <div className="flex items-center mb-8">
          <button 
            onClick={() => router.push('/dashboard/events')}
            className="w-10 h-10 bg-white/10 border border-white/20 rounded-full backdrop-blur-xl hover:bg-white/20 transition-all duration-200 flex items-center justify-center shadow-lg mr-4"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white" style={{ letterSpacing: '-3px', lineHeight: '130%' }}>
              {event.name}
            </h1>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex space-x-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`relative px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 backdrop-blur-sm border flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-white/10 text-white border-white/20 shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="relative z-10">{tab.name}</span>
              {activeTab === tab.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-xl"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}