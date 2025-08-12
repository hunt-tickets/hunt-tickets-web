"use client";

import {
  Map,
  Marker,
  NavigationControl,
  Popup,
  StyleSpecification,
} from "@vis.gl/react-maplibre";
import { useState, useEffect, useRef } from "react";

interface EventMapProps {
  longitude: number;
  latitude: number;
  zoom?: number;
  mapStyle?: string;
  markerLabel?: string;
  venueName?: string;
  venueAddress?: string;
  venueLogo?: string;
}

const EventMap: React.FC<EventMapProps> = ({
  longitude,
  latitude,
  zoom = 15,
  markerLabel = "Ubicación del evento",
  venueName = "",
  venueAddress = "",
  venueLogo = "",
}) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [mapStyleData, setMapStyleData] = useState<StyleSpecification | null>(null);
  const [mapRef, setMapRef] = useState<any>(null);
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    import("@/lib/map/dark.json").then((module) => {
      setMapStyleData(module.default as StyleSpecification);
    });
  }, []);

  // Función para resetear el mapa a la posición inicial
  const resetMapToInitialPosition = () => {
    if (mapRef && longitude && latitude) {
      mapRef.easeTo({
        center: [longitude, latitude],
        zoom: zoom + 2,
        pitch: 65,
        bearing: -20,
        duration: 1500,
        easing: (t: number) => t * (2 - t)
      });
    }
  };

  // Función para manejar el inicio de interacción
  const handleMapInteractionStart = () => {
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }
  };

  // Función para manejar el fin de interacción
  const handleMapInteractionEnd = () => {
    if (longitude && latitude) {
      resetTimeoutRef.current = setTimeout(() => {
        resetMapToInitialPosition();
      }, 3000);
    }
  };

  // Cleanup del timeout
  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  const PulseMarker = () => (
    <div className="relative flex items-center justify-center w-12 h-12">
      {/* Pulso exterior suave */}
      <div 
        className="absolute w-10 h-10 bg-brand-primary rounded-full opacity-15"
        style={{ 
          animation: 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          animationDelay: '0s'
        }}
      ></div>
      {/* Pulso medio */}
      <div 
        className="absolute w-7 h-7 bg-brand-primary rounded-full opacity-25"
        style={{ 
          animation: 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          animationDelay: '0.4s'
        }}
      ></div>
      {/* Marcador principal minimalista */}
      <div 
        className="relative w-4 h-4 bg-brand-primary rounded-full border-2 border-white shadow-lg"
        style={{
          boxShadow: '0 2px 8px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)'
        }}
      >
        {/* Punto central minimalista */}
        <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full opacity-70"></div>
      </div>
    </div>
  );

  if (!mapStyleData) {
    return (
      <div className="w-full h-80 overflow-hidden flex items-center justify-center bg-neutral-100 rounded-lg md:rounded-none">
        <div className="text-neutral-500">Cargando mapa...</div>
      </div>
    );
  }

  // Validar coordenadas
  if (!longitude || !latitude) {
    return (
      <div className="w-full h-80 overflow-hidden flex items-center justify-center bg-neutral-200 rounded-lg md:rounded-none">
        <div className="text-neutral-600">Coordenadas del venue no disponibles</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-hidden rounded-lg md:rounded-none relative">
      <Map
        ref={setMapRef}
        initialViewState={{
          longitude: longitude || 0,
          latitude: latitude || 0,
          zoom: zoom + 2,
          pitch: 65,
          bearing: -20,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle={mapStyleData}
        scrollZoom={false}
        attributionControl={false}
        dragRotate={true}
        pitchWithRotate={true}
        touchPitch={true}
        onDragStart={handleMapInteractionStart}
        onDragEnd={handleMapInteractionEnd}
        onRotateStart={handleMapInteractionStart}
        onRotateEnd={handleMapInteractionEnd}
        onPitchStart={handleMapInteractionStart}
        onPitchEnd={handleMapInteractionEnd}
        onZoomStart={handleMapInteractionStart}
        onZoomEnd={handleMapInteractionEnd}
      >
        <NavigationControl />
        {showPopup && (
          <Popup
            longitude={longitude}
            latitude={latitude}
            anchor="bottom"
            onClose={() => setShowPopup(false)}
          >
            <p className="text-heading-3 font-heading-3 text-black">
              {markerLabel}
            </p>
          </Popup>
        )}
        <Marker
          longitude={longitude}
          latitude={latitude}
          anchor="center"
          offset={[0, 0]}
          onClick={() => setShowPopup(true)}
        >
          <PulseMarker />
        </Marker>
      </Map>
      
      {/* Venue Card con Glassmorphism */}
      {venueName && (
        <div 
          className="absolute bottom-4 left-4 right-4 p-4 rounded-xl backdrop-blur-md bg-black/20 border border-white/10 shadow-xl cursor-pointer hover:bg-black/30 transition-all duration-200"
          onClick={() => {
            const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
            window.open(googleMapsUrl, '_blank');
          }}
        >
          <div className="flex items-center gap-3">
            {venueLogo && (
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10 border border-white/20 flex-shrink-0">
                <img 
                  src={venueLogo} 
                  alt={venueName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-sm leading-tight truncate">
                {venueName}
              </h3>
              <p className="text-white/70 text-xs leading-tight mt-1 truncate">
                {venueAddress}
              </p>
              <p className="text-white/50 text-xs flex items-center gap-1">
                Ver en Google Maps
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15,3 21,3 21,9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventMap;
