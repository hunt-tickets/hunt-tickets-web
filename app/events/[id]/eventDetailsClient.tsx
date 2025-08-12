"use client";
import EventDescription from "@/components/site/EventDescription";
import MobileEventInfo from "@/components/site/MobileEventInfo";
import LoginModal from "@/components/home/LoginModal";
import Subtitle from "@/components/home/Subtitle";
import Title from "@/components/home/Title";
import BannerEvent from "@/components/site/BannerEvent";
import BaseDialog from "@/components/site/BaseDialog";
import EventMap from "@/components/site/EventMap";
import InfoDisplay from "@/components/site/InfoDisplay";
import LoaderAudio from "@/components/site/LoaderAudio";
import TicketSelection from "@/components/site/TicketSelection";
import TicketSummaryDrawer from "@/components/site/TicketSummaryDrawer";
import VenueCard from "@/components/site/VenueCard";
import MobileEventFooter from "@/components/site/MobileEventFooter";
import { useEvent } from "@/hook/useEvent";
import { useProfiles } from "@/hook/useProfiles";
import { useUser } from "@/lib/UserContext";
import { InfoItem } from "@/types/site";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const EventsListPage = ({ otherParams }: { otherParams: { id: string } }) => {
  const params = useParams<{ id: string }>();
  const rawParam = decodeURIComponent(params.id ?? "");
  const [eventId, sellerUid] = rawParam.split("&");
  const { user, loading: userLoading } = useUser();
  const { profile, loading: profileLoading, updateUserProfile } = useProfiles();
  const { event, loading: eventLoading, error } = useEvent(eventId);

  const [isOpenPayment, setIsOpenPayment] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [isOpenLogin, setIsOpenLogin] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isScrollAtBottom, setIsScrollAtBottom] = useState(false);

  const eventInfo = [
    {
      icon: "FeatherCalendar",
      label: "Fecha y Hora",
      value: event?.date + " " + event?.hour,
    },
    {
      icon: "FeatherCalendar",
      label: "Finalización",
      value: event?.end_date + " " + event?.end_hour,
    },
    { icon: "FeatherMapPin", label: "Ciudad", value: event?.venue_city },
    {
      icon: "FeatherInfo",
      label: "Restricción de edad",
      value: event?.age !== null ? `${event?.age}+` : "Sin restricción",
    },
  ];

  const handleOpenSummary = (tickets: any[], totalAmount: number) => {
    setSelectedTickets(tickets);
    setTotal(totalAmount);
    setIsOpenPayment(true);
  };

  const handleConfirmPayment = () => {
    setIsOpenPayment(false);
  };

  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userLoading && !eventLoading && event && !isPageLoaded) {
      setIsPageLoaded(true);
    }
  }, [userLoading, eventLoading, event, isPageLoaded]);

  if (userLoading || eventLoading) {
    return <LoaderAudio />;
  }

  if (!event) {
    return (
      <div className="flex h-[550vh] md:h-[100vh] w-screen items-center justify-center">
        <p className="text-center text-lg">No se encontró el evento.</p>
      </div>
    );
  }

  // Determinar si algún modal está abierto
  const isAnyModalOpen = isOpenPayment || isOpenLogin;

  // URL de imagen para el fondo
  const backgroundImageUrl = event?.flyer || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxOE6ue2hBPvf2ZDbHLEDKhzWMNARa_KkgCQ&s";

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5; // 5px tolerance
    setIsScrollAtBottom(isAtBottom);
  };

  return (
    <div className="w-full">
      {/* Banner section with blur background - Full width */}
      <div className="relative w-full h-[750px] bg-gray-900 overflow-hidden">
            {/* Blur background only for this section */}
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: "url(" + backgroundImageUrl + ")",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                filter: 'blur(20px)'
              }}
            ></div>
            {/* Gradient overlay que termina en negro abajo */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]"></div>
            {/* Container for content */}
            <div className="relative z-10 flex flex-col justify-center items-center h-full px-12 lg:px-16 w-full">
              
              {/* Three column layout: flyer | info box | location */}
              <div className="flex flex-col lg:flex-row justify-center items-start gap-8 mb-8 w-full">
              
              {/* Left column: Image only */}
              <div className="flex flex-col items-start flex-1">
                <img
                  className="h-[460px] w-auto rounded-lg object-cover shadow-2xl"
                  src={backgroundImageUrl}
                  alt="Event banner"
                />
              </div>
              
              {/* Center column: Info box with glassmorphism */}
              <div 
                className="relative h-[460px] flex flex-col justify-center p-8 rounded-2xl backdrop-blur-md border border-white/20 flex-1 overflow-hidden"
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
                <div className="relative z-10 space-y-4">
                  {/* Two column grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left column - Description */}
                    <div>
                      <p className="text-sm text-gray-300 mb-2">Descripción</p>
                      <div className="relative">
                        <div 
                          className="max-h-56 overflow-y-scroll scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-white/10 pr-2"
                          onScroll={handleScroll}
                          style={{
                            maskImage: isScrollAtBottom 
                              ? 'none'
                              : 'linear-gradient(to bottom, black 75%, transparent 100%)',
                            WebkitMaskImage: isScrollAtBottom 
                              ? 'none'
                              : 'linear-gradient(to bottom, black 75%, transparent 100%)'
                          }}
                        >
                          <p className="text-white/90 text-sm leading-relaxed whitespace-pre-line">
                            {event?.description ?? "No hay descripción disponible para este evento."}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right column - Event info */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-300 mb-2">Fechas del Evento</p>
                        <div className="flex items-center gap-2">
                          {/* Calendar component for start date */}
                          <div 
                            className="rounded-lg p-2 text-center backdrop-blur-md border border-white/30 flex-1"
                            style={{
                              background: 'rgba(255, 255, 255, 0.15)',
                              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                            }}
                          >
                            <div className="text-xs font-semibold text-white/80 uppercase mb-1">
                              {event?.date ? (() => {
                                const dateParts = event.date.split(' ');
                                const monthName = dateParts[2]; // "oct"
                                return monthName?.slice(0, 3).toUpperCase() || 'MES';
                              })() : 'MES'}
                            </div>
                            <div className="text-lg font-bold text-white">
                              {event?.date ? event.date.split(' ')[0] || '0' : '0'}
                            </div>
                            <div className="text-xs text-white/70 mt-1">
                              {event?.hour || '--:--'}
                            </div>
                          </div>
                          
                          {/* Arrow or separator */}
                          <div className="text-white/60 text-lg">→</div>
                          
                          {/* Calendar component for end date */}
                          <div 
                            className="rounded-lg p-2 text-center backdrop-blur-md border border-white/30 flex-1"
                            style={{
                              background: 'rgba(255, 255, 255, 0.15)',
                              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                            }}
                          >
                            <div className="text-xs font-semibold text-white/80 uppercase mb-1">
                              {event?.end_date ? (() => {
                                const dateParts = event.end_date.split(' ');
                                const monthName = dateParts[2]; // "oct"
                                return monthName?.slice(0, 3).toUpperCase() || 'MES';
                              })() : 'MES'}
                            </div>
                            <div className="text-lg font-bold text-white">
                              {event?.end_date ? event.end_date.split(' ')[0] || '0' : '0'}
                            </div>
                            <div className="text-xs text-white/70 mt-1">
                              {event?.end_hour || '--:--'}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-300 mb-1">Ciudad</p>
                        <p className="text-white font-medium">{event?.venue_city}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-300 mb-1">Restricción de edad</p>
                        <p className="text-white font-medium">
                          {event?.age !== null ? `${event?.age}+` : "Sin restricción"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right column: Location with glassmorphism */}
              <div 
                className="relative h-[460px] flex flex-col p-6 rounded-2xl backdrop-blur-md border border-white/20 flex-1 overflow-hidden"
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
                
                <div className="relative z-10 flex flex-col h-full">
                  <h3 className="text-lg font-semibold text-white mb-4">Ubicación</h3>
                  <div className="flex-1 rounded-xl overflow-hidden">
                    <EventMap
                      longitude={event?.venue_longitude}
                      latitude={event?.venue_latitude}
                      markerLabel={event?.venue_name}
                      venueName={event?.venue_name}
                      venueAddress={event?.venue_address}
                      venueLogo={event?.venue_logo}
                    />
                  </div>
                </div>
              </div>
              
              </div>
              
              {/* Event title below columns */}
              <div className="text-left w-full">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                  {event?.name || "Nombre del Evento"}
                </h1>
              </div>
              
            </div>
          </div>
      
      {/* Tickets section - Full width */}
      <div className="w-full px-12 lg:px-16 py-12">
        <div className="flex w-full flex-col items-start gap-4">
          <Subtitle title="Tickets" />
          <TicketSelection
            seller={event?.tickets}
            onOpenSummary={handleOpenSummary}
            onRequireLogin={() => setIsOpenLogin(true)}
            eventId={eventId}
            sellerUid={sellerUid}
            isModalOpen={isAnyModalOpen}
          />
        </div>
      </div>
      
      {profile && (
        <TicketSummaryDrawer
          user={profile}
          open={isOpenPayment}
          close={() => setIsOpenPayment(false)}
          tickets={selectedTickets}
          total={total}
          onConfirm={handleConfirmPayment}
          eventId={eventId}
          sellerUid={sellerUid}
        />
      )}
      
      <BaseDialog
        open={isOpenLogin}
        close={() => setIsOpenLogin(false)}
        title="Iniciar sesión"
        disableClose={true}
      >
        <LoginModal onClose={() => setIsOpenLogin(false)} />
      </BaseDialog>
      
      {/* Footer específico para móvil - movido fuera del contenedor w-5/6 */}
      <MobileEventFooter />
    </div>
  );
};

export default EventsListPage;