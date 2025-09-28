"use client";

import { useMemo } from "react";
import { useCourtesies } from "@/lib/hooks/useCourtesies";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { ChevronUp, ChevronDown } from "lucide-react";
import type { Courtesy } from "@/lib/api/courtesies";

interface EventCourtesiesTabProps {
  eventId: string | string[];
  activeTab: string;
}

export default function EventCourtesiesTab({ eventId, activeTab }: EventCourtesiesTabProps) {
  // Courtesy data hook
  const {
    courtesiesData,
    loadingCourtesies,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    currentPage,
    fetchCourtesies,
    getFilteredCourtesies,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    handleFilterChange,
    toggleStatusFilter,
  } = useCourtesies(eventId, activeTab);

  const getStatusConfig = (status: string) => {
    const configs = {
      'PENDING': { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20', label: 'Pendiente', color: '#f59e0b' },
      'CONFIRMED': { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', label: 'Confirmado', color: '#10b981' },
      'REDEEMED': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', label: 'Canjeado', color: '#3b82f6' },
      'EXPIRED': { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', label: 'Expirado', color: '#dc2626' },
    };
    return configs[status as keyof typeof configs] || configs['PENDING'];
  };

  const renderCourtesyStatus = (status: string) => {
    const config = getStatusConfig(status);
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
        {config.label}
      </span>
    );
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  const filteredCourtesies = getFilteredCourtesies();

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/[0.08]">
        <h2 className="text-2xl font-semibold text-white mb-6">Cortesías</h2>
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-64">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar cortesías..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleFilterChange();
                }}
                className="w-full h-9 pl-9 pr-4 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/50 focus:bg-white/10 focus:border-white/20 focus:outline-none transition-all duration-200"
              />
              <svg className="w-4 h-4 text-white/40 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Status Filter */}
          <DropdownMenu
            minWidth="min-w-48"
            stayOpen={true}
            options={[
              {
                label: "Pendiente",
                onClick: () => toggleStatusFilter("PENDING"),
                Icon: <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusConfig("PENDING").color }}></div>,
                isSelected: statusFilter.includes("PENDING")
              },
              {
                label: "Confirmado",
                onClick: () => toggleStatusFilter("CONFIRMED"),
                Icon: <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusConfig("CONFIRMED").color }}></div>,
                isSelected: statusFilter.includes("CONFIRMED")
              },
              {
                label: "Canjeado",
                onClick: () => toggleStatusFilter("REDEEMED"),
                Icon: <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusConfig("REDEEMED").color }}></div>,
                isSelected: statusFilter.includes("REDEEMED")
              },
              {
                label: "Expirado",
                onClick: () => toggleStatusFilter("EXPIRED"),
                Icon: <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusConfig("EXPIRED").color }}></div>,
                isSelected: statusFilter.includes("EXPIRED")
              }
            ]}
          >
            <div className="flex items-center gap-2">
              {statusFilter.length === 1 ? (
                <>
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: getStatusConfig(statusFilter[0]).color }}
                  ></div>
                  <span>
                    {statusFilter[0] === "PENDING" ? "Pendiente" :
                     statusFilter[0] === "CONFIRMED" ? "Confirmado" :
                     statusFilter[0] === "REDEEMED" ? "Canjeado" :
                     statusFilter[0] === "EXPIRED" ? "Expirado" : "Estado"}
                  </span>
                </>
              ) : (
                <div className="flex items-center gap-1">
                  <div className="flex -space-x-1">
                    {statusFilter.slice(0, 3).map((status, index) => (
                      <div 
                        key={status}
                        className="w-2 h-2 rounded-full border border-white/20" 
                        style={{ backgroundColor: getStatusConfig(status).color }}
                      ></div>
                    ))}
                    {statusFilter.length > 3 && (
                      <div className="w-2 h-2 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="text-[6px] text-white">+</span>
                      </div>
                    )}
                  </div>
                  <span>{statusFilter.length} estados</span>
                </div>
              )}
            </div>
          </DropdownMenu>
        </div>

        {/* Courtesies Table */}
        <div className="mt-6 overflow-hidden">
          {filteredCourtesies.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-white/10">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center gap-1">
                      ID
                      {getSortIcon('id')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('guest_name')}
                  >
                    <div className="flex items-center gap-1">
                      Invitado
                      {getSortIcon('guest_name')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('guest_email')}
                  >
                    <div className="flex items-center gap-1">
                      Email
                      {getSortIcon('guest_email')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('ticket_type')}
                  >
                    <div className="flex items-center gap-1">
                      Tipo de Ticket
                      {getSortIcon('ticket_type')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('quantity')}
                  >
                    <div className="flex items-center gap-1">
                      Cantidad
                      {getSortIcon('quantity')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('created_at')}
                  >
                    <div className="flex items-center gap-1">
                      Fecha Creación
                      {getSortIcon('created_at')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-1">
                      Estado
                      {getSortIcon('status')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {loadingCourtesies ? (
                  /* Table Skeleton Loader */
                  Array.from({ length: 20 }, (_, i) => (
                    <tr key={`skeleton-${i}`} className="animate-pulse">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-16 bg-white/10 rounded"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="h-4 w-36 bg-white/10 rounded"></div>
                          <div className="h-3 w-24 bg-white/5 rounded"></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-48 bg-white/10 rounded"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-32 bg-white/10 rounded"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-8 bg-white/10 rounded"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="h-4 w-24 bg-white/10 rounded"></div>
                          <div className="h-3 w-16 bg-white/5 rounded"></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-6 w-20 bg-white/10 rounded-full"></div>
                      </td>
                    </tr>
                  ))
                ) : (
                  filteredCourtesies.map((courtesy: Courtesy) => (
                    <tr key={courtesy.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-white">
                        {courtesy.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        <div>
                          <div className="font-medium">{courtesy.guest_name}</div>
                          <div className="text-white/60 text-xs">{courtesy.guest_phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {courtesy.guest_email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {courtesy.ticket_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {courtesy.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        <div>
                          <div className="font-medium">{courtesy.created_at}</div>
                          {courtesy.redeemed_at && (
                            <div className="text-white/60 text-xs">Canjeado: {courtesy.redeemed_at}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderCourtesyStatus(courtesy.status)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-white/60">
              {courtesiesData?.data.length === 0 ? "Sin cortesías" : "No hay resultados"}
            </div>
          </div>
        )}
        </div>

        {/* Pagination */}
        {courtesiesData?.pagination && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-white/60 text-sm">
              Mostrando {filteredCourtesies.length} de {courtesiesData.pagination.total_items} cortesías
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => fetchCourtesies(currentPage - 1)}
                disabled={!courtesiesData.pagination.has_previous || loadingCourtesies}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-xl transition-all duration-300 text-white font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingCourtesies ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white/70 rounded-full animate-spin"></div>
                    <span>Anterior</span>
                  </div>
                ) : (
                  "Anterior"
                )}
              </button>
              
              <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, courtesiesData.pagination.total_pages) }, (_, i) => {
                    const page = Math.max(1, Math.min(
                      courtesiesData.pagination.total_pages - 4,
                      courtesiesData.pagination.page - 2
                    )) + i;
                    
                    return (
                      <button
                        key={page}
                        onClick={() => fetchCourtesies(page)}
                        disabled={loadingCourtesies}
                        className={`w-10 h-10 rounded-xl transition-all duration-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                          page === courtesiesData.pagination.page
                            ? 'bg-white/20 text-white border border-white/30'
                            : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white border border-white/10 hover:border-white/20'
                        }`}
                      >
                        {loadingCourtesies && page === courtesiesData.pagination.page ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white/70 rounded-full animate-spin"></div>
                        ) : (
                          page
                        )}
                      </button>
                    );
                  })}
              </div>
              
              <button
                onClick={() => fetchCourtesies(currentPage + 1)}
                disabled={!courtesiesData.pagination.has_next || loadingCourtesies}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-xl transition-all duration-300 text-white font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingCourtesies ? (
                  <div className="flex items-center gap-2">
                    <span>Siguiente</span>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white/70 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  "Siguiente"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}