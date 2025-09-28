"use client";

import { useState } from "react";
import { useGuestList } from "@/lib/hooks/useGuestList";
import GuestListTable from "@/components/ui/guest-list-table";

interface EventCourtesiesTabProps {
  eventId: string | string[];
  activeTab: string;
}

export default function EventCourtesiesTab({ eventId, activeTab }: EventCourtesiesTabProps) {
  const [cortesiasSubTab, setCortesiasSubTab] = useState("dashboard");
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);

  // Use the existing guest list hook
  const {
    guestListData,
    guestListKPIs,
    loadingGuestList,
    guestListPage,
    handleGuestListPageChange,
    handleGuestListSearch,
    handleGuestListStatusFilter,
  } = useGuestList(eventId, activeTab, "guestlist");

  const cortesiasSubTabs = [
    { id: "dashboard", name: "Dashboard", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
    { id: "categorias", name: "Categorías de Cortesía", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg> },
    { id: "configuracion", name: "Configuración", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl border border-white/[0.08] overflow-hidden">
        <div className="flex h-full">
          {/* Sub-tabs Navigation */}
          <div className="w-80 border-r border-white/[0.08] p-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-white mb-6">Cortesías</h2>
              <div className="space-y-1">
                {cortesiasSubTabs.map((subTab) => (
                  <button
                    key={subTab.id}
                    onClick={() => setCortesiasSubTab(subTab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      cortesiasSubTab === subTab.id
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
            {cortesiasSubTab === "dashboard" && (
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
            
            {cortesiasSubTab === "categorias" && (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between p-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">Categorías de Cortesía</h2>
                    <p className="text-white/60 mt-1">Gestiona las categorías disponibles para invitaciones</p>
                  </div>
                  <button
                    onClick={() => setShowNewCategoryModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-lg text-gray-800 hover:text-white transition-all duration-300 group"
                  >
                    <svg className="w-4 h-4 group-hover:scale-105 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-sm font-medium">Nueva Categoría</span>
                  </button>
                </div>
                
                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 pt-0">
                  {/* Category Card - VIP */}
                  <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl border border-white/[0.08] p-6 hover:bg-white/[0.06] transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
                          <span className="text-white text-lg font-bold">V</span>
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">VIP</h3>
                          <p className="text-white/60 text-sm">Premium access</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white/70 hover:text-white transition-all">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button className="w-8 h-8 bg-red-500/10 hover:bg-red-500/20 rounded-lg flex items-center justify-center text-red-400 hover:text-red-300 transition-all">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">24 invitaciones</span>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">Activa</span>
                    </div>
                  </div>

                  {/* Category Card - General */}
                  <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl border border-white/[0.08] p-6 hover:bg-white/[0.06] transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                          <span className="text-white text-lg font-bold">G</span>
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">General</h3>
                          <p className="text-white/60 text-sm">Standard access</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white/70 hover:text-white transition-all">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button className="w-8 h-8 bg-red-500/10 hover:bg-red-500/20 rounded-lg flex items-center justify-center text-red-400 hover:text-red-300 transition-all">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">156 invitaciones</span>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">Activa</span>
                    </div>
                  </div>

                  {/* Category Card - Prensa */}
                  <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl border border-white/[0.08] p-6 hover:bg-white/[0.06] transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                          <span className="text-white text-lg font-bold">P</span>
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">Prensa</h3>
                          <p className="text-white/60 text-sm">Media access</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white/70 hover:text-white transition-all">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button className="w-8 h-8 bg-red-500/10 hover:bg-red-500/20 rounded-lg flex items-center justify-center text-red-400 hover:text-red-300 transition-all">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">8 invitaciones</span>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">Activa</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {cortesiasSubTab === "configuracion" && (
              <div className="space-y-6 p-6">
                <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl border border-white/[0.08] p-6">
                  <h3 className="text-white font-semibold mb-4">Configuración de Cortesías</h3>
                  <p className="text-white/60">Configuración de cortesías próximamente...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal para Nueva Categoría */}
      {showNewCategoryModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-8 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold text-white">Nueva Categoría</h3>
            <p className="text-white/60 mt-2 mb-6">Crea una nueva categoría de cortesía</p>
            
            {/* Formulario */}
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Nombre de la categoría</label>
                <input
                  type="text"
                  placeholder="Ej: VIP, General, Prensa"
                  className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:bg-white/10 focus:border-white/20 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Descripción</label>
                <textarea
                  placeholder="Descripción de la categoría"
                  rows={3}
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:bg-white/10 focus:border-white/20 focus:outline-none resize-none"
                />
              </div>
            </div>
            
            {/* Botones */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowNewCategoryModal(false)}
                className="flex-1 h-12 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-xl text-white font-medium transition-all duration-200"
              >
                Cancelar
              </button>
              <button
                className="flex-1 h-12 bg-white hover:bg-gray-100 rounded-xl text-gray-800 font-medium transition-all duration-200"
              >
                Crear Categoría
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}