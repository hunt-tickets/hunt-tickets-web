"use client";

import SelectableItem from "@/components/site/SelectableItem";
import TicketSummary from "@/components/site/TicketSummary";
import TabNavigation from "@/components/site/TabNavigation";
import BoxDetails from "@/components/site/BoxDetails";
import MobileCartBar from "@/components/site/MobileCartBar";
import ImageViewer from "@/components/site/ImageViewer";
import MapPreview from "@/components/site/MapPreview";
import { useUser } from "@/lib/UserContext";
import { Ticket } from "@/types/site";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useBoxSeats } from "@/hook/useBoxSeats";
import { useElementVisibility } from "@/hook/useElementVisibility";

const MAX_TICKETS_PER_USER = 15;

const TicketSelection = ({
  seller,
  onOpenSummary,
  onRequireLogin,
  eventId,
  sellerUid,
  isModalOpen = false
}: {
  seller: Ticket[];
  onOpenSummary: (tickets: any[], total: number) => void;
  onRequireLogin: () => void;
  eventId?: string;
  sellerUid?: string;
  isModalOpen?: boolean;
}) => {
  const { user } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedBox, setSelectedBox] = useState<string | null>(null);
  const [showMapViewer, setShowMapViewer] = useState(false);
  
  // Ref para el MapPreview móvil
  const mapPreviewRef = useRef<HTMLDivElement | null>(null);
  const isMapPreviewVisible = useElementVisibility(mapPreviewRef, { threshold: 0.1 });

  // Llamar al hook para obtener los palcos del backend
  const { sections, eventMapUrl, loading: boxLoading, error: boxError } = useBoxSeats(eventId || null);
  const availableSections = sections;

  // Obtener todos los boxes
  const getAllBoxes = () => {
    return availableSections.flatMap(section => 
      section.boxes.map(box => ({
        ...box,
        sectionTitle: section.title,
        sectionColor: section.color
      }))
    );
  };

  // Calcular precio mínimo por sección
  const getMinPriceForSection = (sectionBoxes: any[]) => {
    const availableBoxes = sectionBoxes.filter(box => box.available);
    if (availableBoxes.length === 0) return null;
    return Math.min(...availableBoxes.map(box => box.price));
  };

  const [tickets, setTickets] = useState<(Ticket & { count: number; max: number; selected: boolean })[]>([]);

  useEffect(() => {
    const formattedTickets = seller.map((ticket) => ({
      ...ticket,
      count: 0,
      max: Math.min(ticket.available, MAX_TICKETS_PER_USER),
      selected: false,
    }));
    setTickets(formattedTickets);
  }, [seller]);

  const selectedTicketIndex = tickets.findIndex((t) => t.selected);

  const handleCountChange = (index: number, newCount: number) => {
    setTickets((prev) =>
      prev.map((ticket, i) =>
        i === index
          ? { ...ticket, count: newCount }
          : ticket
      )
    );
  };

  const handleTicketSelect = (index: number, selected: boolean) => {
    setTickets((prev) =>
      prev.map((ticket, i) =>
        i === index
          ? { ...ticket, selected, count: selected ? Math.max(1, ticket.count) : 0 }
          : { ...ticket, selected: false, count: 0 }
      )
    );
  };

  const handleBoxSelect = (boxId: string) => {
    if (boxId === "") {
      setSelectedBox(null);
    } else {
      // Verificar que el box esté disponible antes de seleccionarlo
      const allBoxes = getAllBoxes();
      const boxToSelect = allBoxes.find(box => box.id === boxId);
      if (boxToSelect && boxToSelect.available) {
        setSelectedBox(boxId);
        setTickets(prev => prev.map(ticket => ({ ...ticket, count: 0, selected: false })));
      }
    }
  };

  const handleBoxConfirm = () => {
    const allBoxes = getAllBoxes();
    const selectedBoxData = allBoxes.find(box => box.id === selectedBox);
    if (!selectedBoxData) return;

    if (window.innerWidth >= 1024) {
      if (!user?.id) {
        localStorage.setItem("selectedBox", JSON.stringify(selectedBoxData));
        onRequireLogin();
        return;
      }

      const boxAsTicket = [{
        id: selectedBoxData.id,
        title: selectedBoxData.name,
        count: 1,
        price: selectedBoxData.price,
        description: `Palco para ${selectedBoxData.capacity} personas`
      }];

      onOpenSummary(boxAsTicket, selectedBoxData.price);
    }
  };

  const handleOpenSummary = () => {
    const selectedTickets = tickets.filter((ticket) => ticket.selected && ticket.count > 0);
    const total = selectedTickets.reduce(
      (sum, ticket) => sum + ticket.count * ticket.price,
      0
    );

    if (!user?.id) {
      localStorage.setItem("selectedTickets", JSON.stringify(selectedTickets));
      onRequireLogin();
      return;
    }

    onOpenSummary(selectedTickets, total);
  };

  const handleMobileCartBarClose = () => {
    setSelectedBox(null);
  };

  // Icono del mapa
  const MapIcon = ({ size = 24 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
      <line x1="8" y1="2" x2="8" y2="18"/>
      <line x1="16" y1="6" x2="16" y2="22"/>
    </svg>
  );

  const showBoxTab = availableSections.length > 0;
  

  return (
    <div className="w-full">
      {showBoxTab ? (
        <TabNavigation
          tabs={["Entradas Generales", "Palcos"]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      ) : (
        <div className="mb-4" />
      )}

      {!showBoxTab || activeTab === 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
            {tickets.map((ticket, index) => {
              const isBoxSelected = selectedBox !== null;
              
              return (
                <SelectableItem
                  key={ticket.id}
                  title={ticket.name}
                  price={`$${ticket.price.toLocaleString("es-CO")}`}
                  description={ticket.description}
                  min={0}
                  max={ticket.max}
                  count={ticket.count}
                  selected={ticket.selected}
                  disabled={isBoxSelected}
                  onSelect={(selected) => handleTicketSelect(index, selected)}
                  onCountChange={(newCount) => handleCountChange(index, newCount)}
                />
              );
            })}
          </div>
          <TicketSummary tickets={tickets} onConfirm={handleOpenSummary} />
        </>
      ) : (
        <div 
          className="w-full pb-8 lg:pb-0 relative p-6 rounded-2xl backdrop-blur-md border border-white/20 overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
          }}
        >
          {/* Black overlay at 30% opacity */}
          <div 
            className="absolute inset-0 bg-black/30 rounded-2xl"
            style={{ pointerEvents: 'none' }}
          ></div>
          
          <div className="relative z-10">
          {boxLoading ? (
            <div className="flex flex-col justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mb-4"></div>
              <p className="text-body text-gray-600">Cargando palcos disponibles...</p>
            </div>
          ) : boxError ? (
            <div className="flex flex-col justify-center items-center h-64">
              <p className="text-body text-red-600 mb-2">Error al cargar los palcos</p>
              <p className="text-caption text-gray-600">Por favor, intenta de nuevo</p>
            </div>
          ) : (
            <>
              {/* Preview del mapa en móvil */}
              {eventMapUrl && (
                <div ref={mapPreviewRef} className="lg:hidden w-full">
                  <MapPreview 
                    imageUrl={eventMapUrl} 
                    onViewFullScreen={() => setShowMapViewer(true)}
                  />
                </div>
              )}

              {/* Botón del mapa - Solo desktop */}
              {eventMapUrl && (
                <div className="hidden lg:block w-full mb-4">
                  <button
                    onClick={() => setShowMapViewer(true)}
                    className="w-full rounded-xl py-3 px-4 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] bg-white/5 border border-white/20 backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <MapIcon size={24} />
                      <span className="font-medium text-lg text-white">
                        Ver Mapa de Palcos
                      </span>
                    </div>
                  </button>
                </div>
              )}

              {/* Grid de palcos - Sin padding lateral, solo vertical */}
              <div className="bg-black/50 rounded-lg py-4">
                {availableSections.map((section, sectionIndex) => {
                  const minPrice = getMinPriceForSection(section.boxes);
                  
                  return (
                    <div key={`section-${sectionIndex}`} className="mb-8 last:mb-0">
                      <div className="mb-3">
                        <h4 
                          className="text-sm font-semibold uppercase tracking-wider"
                          style={{ color: section.color }}
                        >
                          {section.title}
                        </h4>
                        {minPrice && (
                          <p className="text-xs text-neutral-400 mt-1">
                            Desde ${minPrice.toLocaleString("es-CO")}
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3">
                        {section.boxes.map((box) => (
                          <div
                            key={box.id}
                            onClick={() => box.available && handleBoxSelect(selectedBox === box.id ? "" : box.id)}
                            className={`relative py-3 px-3 rounded-lg border transition-all duration-200 flex flex-col items-center justify-center gap-0.5 ${
                              box.available ? "cursor-pointer" : "cursor-not-allowed"
                            } ${
                              selectedBox === box.id
                                ? "bg-brand-600/20"
                                : box.available
                                ? "bg-transparent hover:bg-white/5"
                                : ""
                            }`}
                            style={{
                              borderColor: selectedBox === box.id 
                                ? 'rgb(var(--brand-600))' 
                                : box.available 
                                  ? `rgba(${parseInt(section.color.slice(1, 3), 16)}, ${parseInt(section.color.slice(3, 5), 16)}, ${parseInt(section.color.slice(5, 7), 16)}, 0.5)`
                                  : 'rgb(64, 64, 64)',
                              ...(!box.available && {
                                backgroundImage: `repeating-linear-gradient(
                                  45deg,
                                  transparent,
                                  transparent 4px,
                                  rgba(100, 100, 100, 0.3) 4px,
                                  rgba(100, 100, 100, 0.3) 8px
                                )`,
                                backgroundColor: 'rgba(20, 20, 20, 0.9)',
                              })
                            }}
                          >
                            <div 
                              className="absolute top-1 right-1 w-2 h-2 rounded-full"
                              style={{ 
                                backgroundColor: box.available ? section.color : 'rgba(100, 100, 100, 0.5)'
                              }}
                            />
                            
                            <span className={`text-sm font-bold ${box.available ? 'text-white' : 'text-neutral-500'}`}>
                              {box.name}
                            </span>
                            
                            <span className={`text-xs ${box.available ? 'text-neutral-400' : 'text-neutral-600'}`}>
                              {box.capacity} personas
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedBox && (
                <div className="hidden lg:block mt-6">
                  <BoxDetails
                    box={getAllBoxes().find(b => b.id === selectedBox) || null}
                    onConfirm={handleBoxConfirm}
                  />
                </div>
              )}
            </>
          )}

          {/* Viewer de imagen simplificado */}
          {showMapViewer && eventMapUrl && (
            <ImageViewer
              imageUrl={eventMapUrl}
              onClose={() => setShowMapViewer(false)}
            />
          )}
          </div>
        </div>
      )}
      
      {/* Barra fija móvil */}
      {showBoxTab && activeTab === 1 && !isModalOpen && !showMapViewer && (
        <MobileCartBar
          selectedBox={selectedBox ? getAllBoxes().find(b => b.id === selectedBox) || null : null}
          onContinue={handleMobileCartBarClose}
          onClear={() => setSelectedBox(null)}
          eventId={eventId || ''}
          sellerUid={sellerUid || ''}
        />
      )}

    </div>
  );
};

export default TicketSelection;