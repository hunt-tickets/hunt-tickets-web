"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useEventData } from "@/lib/hooks/useEventData";
import EventHeader from "@/components/admin/EventHeader";
import EventOverviewTab from "@/components/admin/EventOverviewTab";
import EventTransactionsTab from "@/components/admin/EventTransactionsTab";
import EventGuestListTab from "@/components/admin/EventGuestListTab";
import EventCourtesiesTab from "@/components/admin/EventCourtesiesTab";
import EventTicketsTab from "@/components/admin/EventTicketsTab";
import FigmaStyleMapEditor from "@/components/admin/FigmaStyleMapEditor";
import type { TabType, TicketsSubTab } from "@/lib/types/event-types";

export default function EventDetailsPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [ticketsSubTab] = useState<TicketsSubTab>("tickets");

  // Custom hooks for data management
  const eventId = Array.isArray(params.id) ? params.id[0] : params.id || "";
  const { eventData, salesStats, loading, error } = useEventData(eventId);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <div className="text-white text-lg">Cargando evento...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-2">Error</div>
          <div className="text-white">{error}</div>
        </div>
      </div>
    );
  }

  // No event data
  if (!eventData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <div className="text-white text-lg">Evento no encontrado</div>
      </div>
    );
  }

  const event = eventData.event;

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <EventOverviewTab 
            event={event}
            eventData={eventData}
            salesStats={salesStats}
          />
        );
        
      case "transactions":
        return (
          <EventTransactionsTab
            eventId={eventId}
            activeTab={activeTab}
          />
        );
        
      case "tickets":
        return (
          <EventTicketsTab
            eventId={eventId}
            activeTab={activeTab}
          />
        );
        
      case "cortesias":
        return (
          <EventCourtesiesTab
            eventId={eventId}
            activeTab={activeTab}
          />
        );
        
      case "map":
        return (
          <FigmaStyleMapEditor
            eventId={eventId}
            activeTab={activeTab}
          />
        );
        
      case "settings":
        return (
          <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/[0.08]">
            <h3 className="text-lg font-medium text-white mb-4">Configuración del Evento</h3>
            <p className="text-white/80">Panel de configuración en desarrollo...</p>
          </div>
        );
        
      case "analytics":
        return (
          <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/[0.08]">
            <h3 className="text-lg font-medium text-white mb-4">Analytics</h3>
            <p className="text-white/80">Panel de analytics en desarrollo...</p>
          </div>
        );
        
      default:
        return (
          <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/[0.08]">
            <h3 className="text-lg font-medium text-white mb-4">Contenido no encontrado</h3>
            <p className="text-white/80">La pestaña seleccionada no tiene contenido disponible.</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-[#0a0a0a] p-12">
      <EventHeader 
        event={event}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Tab Content */}
      <div className="mt-8">
        {renderTabContent()}
      </div>
    </div>
  );
}