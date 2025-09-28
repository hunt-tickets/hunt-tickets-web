"use client";

import StatisticsCard5 from "@/components/ui/statistics-card-5";
import StatisticsCard2 from "@/components/ui/statistics-card-2";
import type { EventDetails, EventResponse, SalesStats } from "@/lib/types/event-types";

interface EventOverviewTabProps {
  event: EventDetails;
  eventData: EventResponse;
  salesStats: SalesStats | null;
}

export default function EventOverviewTab({ event, eventData, salesStats }: EventOverviewTabProps) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-white mb-4">Resumen del Evento</h2>
      
      {/* Statistics Cards */}
      <StatisticsCard5 salesData={salesStats} />
      <StatisticsCard2 />
      
      {/* Event Description */}
      <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/[0.08]">
        <h3 className="text-lg font-medium text-white mb-3">Descripción</h3>
        <p className="text-white/80 leading-relaxed">{event.description_plain}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Information */}
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/[0.08]">
          <h3 className="text-lg font-medium text-white mb-4">Información General</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-white/60">ID del Evento:</span>
              <span className="text-white font-mono text-sm">{event.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Fecha y Hora:</span>
              <span className="text-white">{event.date} - {event.hour}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Tiene Entradas:</span>
              <span className={`${eventData.has_tickets ? 'text-green-400' : 'text-gray-400'}`}>
                {eventData.has_tickets ? 'Sí' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Lista de Invitados:</span>
              <span className={`${eventData.guest_list_enabled ? 'text-green-400' : 'text-gray-400'}`}>
                {eventData.guest_list_enabled ? 'Habilitada' : 'Deshabilitada'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">URL del Evento:</span>
              <a 
                href={event.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline text-sm"
              >
                Ver Página
              </a>
            </div>
          </div>
        </div>

        {/* Venue Information */}
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/[0.08]">
          <h3 className="text-lg font-medium text-white mb-4">Información del Lugar</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-white/60">Nombre:</span>
              <span className="text-white">{event.venue.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Ciudad:</span>
              <span className="text-white">{event.venue.city}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-white/60">Dirección:</span>
              <span className="text-white text-sm">{event.venue.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Google Maps:</span>
              <a 
                href={event.venue.google_maps_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline text-sm"
              >
                Ver en Maps
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Producers */}
      {eventData.has_producers && (
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/[0.08]">
          <h3 className="text-lg font-medium text-white mb-4">Organizadores</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {event.producers.map((producer, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-lg">
                {producer.logo && (
                  <img 
                    src={producer.logo} 
                    alt={producer.name}
                    className="w-12 h-12 object-contain rounded-lg bg-white/5"
                  />
                )}
                <span className="text-white font-medium">{producer.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sales Stats Summary */}
      {salesStats && (
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/[0.08]">
          <h3 className="text-lg font-medium text-white mb-4">Resumen de Ventas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white/[0.02] rounded-lg">
              <div className="text-2xl font-bold text-white mb-1">
                ${(salesStats.ventas_totales / 1000000).toFixed(2)}M
              </div>
              <div className="text-white/60 text-sm">Ventas Totales</div>
            </div>
            <div className="text-center p-4 bg-white/[0.02] rounded-lg">
              <div className="text-2xl font-bold text-green-400 mb-1">
                ${(salesStats.ingreso_neto_productor_ajustado / 1000000).toFixed(2)}M
              </div>
              <div className="text-white/60 text-sm">Ingreso Neto</div>
            </div>
            <div className="text-center p-4 bg-white/[0.02] rounded-lg">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {salesStats.promoters.filter(p => p.promoter_name).length}
              </div>
              <div className="text-white/60 text-sm">Promotores Activos</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}