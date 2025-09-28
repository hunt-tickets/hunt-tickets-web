"use client";

import { useGuestList } from "@/lib/hooks/useGuestList";
import GuestListKPIs from "@/components/ui/guest-list-kpis";
import GuestListTable from "@/components/ui/guest-list-table";

interface EventGuestListTabProps {
  eventId: string | string[];
  activeTab: string;
  ticketsSubTab: string;
}

export default function EventGuestListTab({ eventId, activeTab, ticketsSubTab }: EventGuestListTabProps) {
  const {
    guestListData,
    guestListKPIs,
    loadingGuestList,
    guestListSearch,
    guestListStatusFilter,
    handleGuestListSearch,
    handleGuestListStatusFilter,
    handleGuestListPageChange,
  } = useGuestList(eventId, activeTab, ticketsSubTab);

  if (loadingGuestList) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-lg">Cargando lista de invitados...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Lista de Invitados</h2>
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar invitados..."
              value={guestListSearch}
              onChange={(e) => handleGuestListSearch(e.target.value)}
              className="w-64 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>
          
          {/* Status Filter */}
          <select
            value={guestListStatusFilter}
            onChange={(e) => handleGuestListStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="confirmed">Confirmado</option>
            <option value="redeemed">Canjeado</option>
          </select>
        </div>
      </div>

      {/* KPIs */}
      {guestListKPIs && (
        <GuestListKPIs 
          invitations={guestListKPIs.invitations}
          redeemed={guestListKPIs.redeemed}
          revenue={guestListKPIs.revenue}
        />
      )}

      {/* Guest List Table */}
      {guestListData ? (
        <GuestListTable 
          data={guestListData}
          onPageChange={handleGuestListPageChange}
        />
      ) : (
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/[0.08]">
          <div className="text-center py-12">
            <div className="text-white/60">
              No hay datos de lista de invitados disponibles
            </div>
          </div>
        </div>
      )}
    </div>
  );
}