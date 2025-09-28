"use client";

import { useState } from "react";
import { useGuestList } from "@/lib/hooks/useGuestList";
import GuestListTable from "@/components/ui/guest-list-table";
import AppleWalletCustomizer from "@/components/ui/apple-wallet-customizer";

interface EventTicketsTabProps {
  eventId: string | string[];
  activeTab: string;
}

export default function EventTicketsTab({ eventId, activeTab }: EventTicketsTabProps) {
  const [ticketsSubTab, setTicketsSubTab] = useState("tickets");

  // Use the existing guest list hook for the guestlist subtab
  const {
    guestListData,
    guestListKPIs,
    loadingGuestList,
    guestListPage,
    handleGuestListPageChange,
    handleGuestListSearch,
    handleGuestListStatusFilter,
  } = useGuestList(eventId, activeTab, "guestlist");

  const ticketsSubTabs = [
    { id: "tickets", name: "Tickets", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg> },
    { id: "create", name: "Crear Tickets", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg> },
    { id: "analytics", name: "Analytics", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
    { id: "lists", name: "Listas", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg> },
    { id: "guestlist", name: "Guest List", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg> },
    { id: "wallet", name: "Apple Wallet", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg> },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl border border-white/[0.08] overflow-hidden">
        <div className="flex h-full">
          {/* Sub-tabs Navigation */}
          <div className="w-80 border-r border-white/[0.08] p-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-white mb-6">Entradas</h2>
              <div className="space-y-1">
                {ticketsSubTabs.map((subTab) => (
                  <button
                    key={subTab.id}
                    onClick={() => setTicketsSubTab(subTab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      ticketsSubTab === subTab.id
                        ? 'bg-white/10 text-white border border-white/20'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="text-lg">{subTab.icon}</span>
                    <span>{subTab.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sub-tabs Content */}
          <div className="flex-1 space-y-6">
            {ticketsSubTab === "tickets" && (
              <div className="space-y-6 p-6">
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-2">Gestión de Tickets</h2>
                  <p className="text-white/60">Administra los tipos de entradas disponibles para tu evento</p>
                </div>
                
                {/* Ticket Types Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* General Ticket */}
                  <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl border border-white/[0.08] p-6 hover:bg-white/[0.06] transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">General</h3>
                          <p className="text-white/60 text-sm">Entrada estándar</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white/70 hover:text-white transition-all">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-white/60 text-sm">Precio:</span>
                        <span className="text-white font-medium">$45.000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60 text-sm">Vendidos:</span>
                        <span className="text-green-400 font-medium">1,247</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60 text-sm">Disponibles:</span>
                        <span className="text-blue-400 font-medium">753</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2 mt-4">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '62%' }}></div>
                      </div>
                      <div className="text-center text-white/60 text-xs">62% vendido</div>
                    </div>
                  </div>

                  {/* VIP Ticket */}
                  <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl border border-white/[0.08] p-6 hover:bg-white/[0.06] transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">VIP</h3>
                          <p className="text-white/60 text-sm">Acceso premium</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white/70 hover:text-white transition-all">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-white/60 text-sm">Precio:</span>
                        <span className="text-white font-medium">$120.000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60 text-sm">Vendidos:</span>
                        <span className="text-green-400 font-medium">89</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60 text-sm">Disponibles:</span>
                        <span className="text-blue-400 font-medium">11</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2 mt-4">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '89%' }}></div>
                      </div>
                      <div className="text-center text-white/60 text-xs">89% vendido</div>
                    </div>
                  </div>

                  {/* Add New Ticket Type */}
                  <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl border border-white/[0.08] border-dashed p-6 hover:bg-white/[0.06] transition-all duration-300 flex flex-col items-center justify-center min-h-[280px] cursor-pointer group">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-all">
                      <svg className="w-6 h-6 text-white/60 group-hover:text-white transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <h3 className="text-white/60 group-hover:text-white font-medium mb-2 transition-all">Crear Nuevo Tipo</h3>
                    <p className="text-white/40 text-sm text-center">Agregar un nuevo tipo de entrada</p>
                  </div>
                </div>
              </div>
            )}

            {ticketsSubTab === "create" && (
              <div className="space-y-6 p-6">
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-2">Crear Nuevo Ticket</h2>
                  <p className="text-white/60">Configura un nuevo tipo de entrada para tu evento</p>
                </div>

                <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl border border-white/[0.08] p-6">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Nombre del Ticket</label>
                        <input
                          type="text"
                          placeholder="Ej: General, VIP, Early Bird"
                          className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:bg-white/10 focus:border-white/20 focus:outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Precio</label>
                        <input
                          type="number"
                          placeholder="0"
                          className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:bg-white/10 focus:border-white/20 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Descripción</label>
                      <textarea
                        placeholder="Descripción del tipo de entrada"
                        rows={3}
                        className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:bg-white/10 focus:border-white/20 focus:outline-none resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Cantidad Total</label>
                        <input
                          type="number"
                          placeholder="0"
                          className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:bg-white/10 focus:border-white/20 focus:outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Límite por Persona</label>
                        <input
                          type="number"
                          placeholder="0"
                          className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:bg-white/10 focus:border-white/20 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Estado</label>
                        <select className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white focus:bg-white/10 focus:border-white/20 focus:outline-none">
                          <option value="active">Activo</option>
                          <option value="inactive">Inactivo</option>
                          <option value="sold_out">Agotado</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        className="flex-1 h-12 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-xl text-white font-medium transition-all duration-200"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="flex-1 h-12 bg-white hover:bg-gray-100 rounded-xl text-gray-800 font-medium transition-all duration-200"
                      >
                        Crear Ticket
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {ticketsSubTab === "analytics" && (
              <div className="space-y-6 p-6">
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-2">Analytics de Tickets</h2>
                  <p className="text-white/60">Análisis de ventas y rendimiento por tipo de entrada</p>
                </div>

                <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl border border-white/[0.08] p-6">
                  <h3 className="text-white font-semibold mb-4">📊 Analytics de Tickets</h3>
                  <p className="text-white/60">Analytics de tickets próximamente...</p>
                </div>
              </div>
            )}

            {ticketsSubTab === "lists" && (
              <div className="space-y-6 p-6">
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-2">Listas de Tickets</h2>
                  <p className="text-white/60">Gestiona listas personalizadas de entradas</p>
                </div>

                <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl border border-white/[0.08] p-6">
                  <h3 className="text-white font-semibold mb-4">📋 Listas de Tickets</h3>
                  <p className="text-white/60">Listas de tickets próximamente...</p>
                </div>
              </div>
            )}

            {ticketsSubTab === "guestlist" && (
              <div className="space-y-6">
                {/* Guest List Table */}
                <GuestListTable
                  data={guestListData?.data || []}
                  loading={loadingGuestList}
                  currentPage={guestListPage}
                  totalPages={guestListData?.pagination.pages || 1}
                  totalItems={guestListData?.pagination.total || 0}
                  onPageChange={handleGuestListPageChange}
                  onSearch={handleGuestListSearch}
                  onStatusFilter={handleGuestListStatusFilter}
                  guestListKPIs={guestListKPIs || undefined}
                />
              </div>
            )}

            {ticketsSubTab === "wallet" && (
              <div className="space-y-6 p-6">
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-2">Apple Wallet</h2>
                  <p className="text-white/60">Personaliza el diseño de los tickets para Apple Wallet</p>
                </div>

                <AppleWalletCustomizer />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}