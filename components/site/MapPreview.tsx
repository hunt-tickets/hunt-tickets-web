"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface MapPreviewProps {
  imageUrl: string;
  onViewFullScreen: () => void;
}

const MapPreview = ({ imageUrl, onViewFullScreen }: MapPreviewProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastTouchDistance, setLastTouchDistance] = useState(0);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    // Reset zoom y posición al colapsar
    if (isExpanded) {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleViewFullScreen = () => {
    onViewFullScreen();
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!isExpanded) return;
    
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const newZoom = Math.max(1, Math.min(4, zoom + (e.deltaY > 0 ? -0.1 : 0.1)));
    
    if (newZoom === 1) {
      setPosition({ x: 0, y: 0 });
    }
    
    setZoom(newZoom);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isExpanded || zoom <= 1) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isExpanded) return;
    
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getTouchDistance = (touches: React.TouchList) => {
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isExpanded) return;
    
    if (e.touches.length === 2) {
      const distance = getTouchDistance(e.touches);
      setLastTouchDistance(distance);
    } else if (e.touches.length === 1 && zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isExpanded) return;
    
    e.preventDefault();
    
    if (e.touches.length === 2) {
      const distance = getTouchDistance(e.touches);
      if (lastTouchDistance > 0) {
        const scale = distance / lastTouchDistance;
        const newZoom = Math.max(1, Math.min(4, zoom * scale));
        
        if (newZoom === 1) {
          setPosition({ x: 0, y: 0 });
        }
        
        setZoom(newZoom);
      }
      setLastTouchDistance(distance);
    } else if (e.touches.length === 1 && isDragging && zoom > 1) {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setLastTouchDistance(0);
  };

  return (
    <motion.div 
      className="bg-black/20 backdrop-blur-md rounded-xl border border-white/20 p-4 py-6 shadow-xl"
      style={{
        backdropFilter: 'blur(16px) saturate(120%)',
        WebkitBackdropFilter: 'blur(16px) saturate(120%)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.1)'
      }}
      layout
    >
      {/* Header clickeable */}
      <motion.div 
        className="flex items-center justify-between cursor-pointer"
        onClick={toggleExpanded}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <h4 className="text-sm font-medium text-white/80">
          Mapa de Palcos
        </h4>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/50">
            {isExpanded ? "Contraer" : "Vista previa"}
          </span>
          <motion.svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-white/60"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <path d="M6 9l6 6 6-6"/>
          </motion.svg>
        </div>
      </motion.div>

      {/* Container del mapa que se transforma */}
      <motion.div
        className="pt-3"
        layout
      >
        <motion.div 
          layoutId="map-container"
          className="relative w-full max-w-sm mx-auto bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border border-white/20 hover:border-white/30 transition-colors hover:bg-white/10"
          onClick={isExpanded ? (zoom > 1 ? undefined : toggleExpanded) : undefined}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            cursor: isExpanded ? (zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'pointer') : 'default'
          }}
          initial={false}
          animate={{
            height: isExpanded ? 400 : 200,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.6
          }}
        >
          {/* Imagen que se mantiene */}
          {!imageError && imageUrl && (
            <motion.div
              layoutId="map-image"
              className="absolute inset-0"
              onClick={!isExpanded ? toggleExpanded : undefined}
              style={{
                cursor: !isExpanded ? 'pointer' : 'default',
                transform: isExpanded ? `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)` : 'none',
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.1s ease-out'
              }}
            >
              <Image
                src={imageUrl}
                alt="Mapa de palcos"
                fill
                className="object-contain p-2 rounded-lg select-none"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                sizes="(max-width: 384px) 100vw, 384px"
                draggable={false}
              />
            </motion.div>
          )}

          {/* Loading state */}
          {!imageLoaded && !imageError && imageUrl && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/10">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white/50" />
            </div>
          )}

          {/* Error state */}
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/10">
              <div className="text-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto text-white/50">
                  <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
                  <line x1="8" y1="2" x2="8" y2="18"/>
                  <line x1="16" y1="6" x2="16" y2="22"/>
                </svg>
                <p className="text-xs text-white/50 mt-1">Error al cargar</p>
              </div>
            </div>
          )}

          {/* Sin imagen */}
          {!imageUrl && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/10">
              <div className="text-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto text-white/50">
                  <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
                </svg>
                <p className="text-xs text-white/50 mt-1">Sin mapa</p>
              </div>
            </div>
          )}

          {/* Controles de zoom y botón fullscreen - solo en estado expandido */}
          {isExpanded && (
            <>
              {/* Controles de zoom */}
              <motion.div 
                className="absolute top-3 right-3 flex flex-col gap-1 pointer-events-auto z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const newZoom = Math.min(4, zoom + 0.2);
                    setZoom(newZoom);
                  }}
                  className="w-8 h-8 bg-white/10 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  style={{
                    backdropFilter: 'blur(12px) saturate(120%)',
                    WebkitBackdropFilter: 'blur(12px) saturate(120%)',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const newZoom = Math.max(1, zoom - 0.2);
                    setZoom(newZoom);
                    if (newZoom === 1) {
                      setPosition({ x: 0, y: 0 });
                    }
                  }}
                  className="w-8 h-8 bg-white/10 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  style={{
                    backdropFilter: 'blur(12px) saturate(120%)',
                    WebkitBackdropFilter: 'blur(12px) saturate(120%)',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
              </motion.div>

              {/* Botón fullscreen */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-center p-3 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div 
                  className="bg-white/10 backdrop-blur-md border border-white/30 rounded-full px-3 py-1 flex items-center gap-2 shadow-lg pointer-events-auto"
                  style={{
                    backdropFilter: 'blur(12px) saturate(120%)',
                    WebkitBackdropFilter: 'blur(12px) saturate(120%)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.2)'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewFullScreen();
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                  </svg>
                  <span className="text-xs text-white font-medium">Ver completo</span>
                </div>
              </motion.div>
            </>
          )}

          {/* Indicador de expandir - solo en estado colapsado */}
          {!isExpanded && (
            <motion.div 
              className="absolute inset-0 bg-black/10 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="bg-white/20 backdrop-blur-sm rounded-full p-2"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default MapPreview;