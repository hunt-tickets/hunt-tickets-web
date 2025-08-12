"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageViewerProps {
  imageUrl: string;
  onClose: () => void;
}

const ImageViewer = ({ imageUrl, onClose }: ImageViewerProps) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Variables para navegación suave tipo PDF
  const [isZooming, setIsZooming] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [initialDistance, setInitialDistance] = useState(0);
  const [initialScale, setInitialScale] = useState(1);
  const [lastCenter, setLastCenter] = useState({ x: 0, y: 0 });

  // Variables para el pan suave
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [lastPanTime, setLastPanTime] = useState(0);
  const [lastPanPosition, setLastPanPosition] = useState({ x: 0, y: 0 });

  // Variables para doble tap inteligente
  const lastTap = useRef(0);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Prevenir scroll del body
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  // Física mejorada para inercia
  const applyInertia = useCallback(() => {
    if (!isPanning && (Math.abs(velocity.x) > 0.1 || Math.abs(velocity.y) > 0.1)) {
      setPosition(prev => {
        const newX = prev.x + velocity.x;
        const newY = prev.y + velocity.y;
        
        // Aplicar límites suaves
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (containerRect && scale > 1) {
          const maxX = (scale - 1) * containerRect.width * 0.5;
          const maxY = (scale - 1) * containerRect.height * 0.5;
          
          const clampedX = Math.min(Math.max(newX, -maxX), maxX);
          const clampedY = Math.min(Math.max(newY, -maxY), maxY);
          
          return { x: clampedX, y: clampedY };
        }
        
        return { x: newX, y: newY };
      });
      
      // Aplicar fricción
      setVelocity(prev => ({
        x: prev.x * 0.92,
        y: prev.y * 0.92
      }));
      
      animationFrameRef.current = requestAnimationFrame(applyInertia);
    }
  }, [isPanning, velocity.x, velocity.y, scale]);

  useEffect(() => {
    applyInertia();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [applyInertia]);

  // Calcular distancia y centro entre dos toques
  const getTouchDistance = (touch1: React.Touch, touch2: React.Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getTouchCenter = (touch1: React.Touch, touch2: React.Touch) => {
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2
    };
  };

  // Manejo de inicio de toque - Estilo PDF suave
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    
    // Detener inercia
    setVelocity({ x: 0, y: 0 });
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const currentTime = Date.now();
    const tapLength = currentTime - lastTap.current;
    
    // Doble tap para zoom inteligente
    if (e.touches.length === 1 && tapLength < 300 && tapLength > 0) {
      const touch = e.touches[0];
      const rect = containerRef.current?.getBoundingClientRect();
      
      if (rect) {
        // Calcular punto de zoom basado en donde tocó
        const centerX = (touch.clientX - rect.left - rect.width / 2) / scale;
        const centerY = (touch.clientY - rect.top - rect.height / 2) / scale;
        
        if (scale === 1) {
          setScale(2.5);
          setPosition({ x: -centerX * 1.5, y: -centerY * 1.5 });
        } else {
          setScale(1);
          setPosition({ x: 0, y: 0 });
        }
      }
      return;
    }
    
    lastTap.current = currentTime;

    if (e.touches.length === 2) {
      // Zoom con dos dedos - Estilo PDF
      setIsZooming(true);
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      setInitialDistance(getTouchDistance(touch1, touch2));
      setInitialScale(scale);
      setLastCenter(getTouchCenter(touch1, touch2));
    } else if (e.touches.length === 1) {
      // Pan con un dedo
      setIsPanning(true);
      const touch = e.touches[0];
      setDragStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y
      });
      setLastPanTime(currentTime);
      setLastPanPosition({ x: touch.clientX, y: touch.clientY });
    }
  };

  // Manejo de movimiento - Ultra suave como PDF
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();

    if (isZooming && e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDistance = getTouchDistance(touch1, touch2);
      const currentCenter = getTouchCenter(touch1, touch2);
      
      // Zoom suave con punto focal
      const zoomFactor = currentDistance / initialDistance;
      const newScale = Math.min(Math.max(initialScale * zoomFactor, 0.5), 5);
      
      // Mantener el punto focal durante el zoom
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const focusX = (lastCenter.x - rect.left - rect.width / 2) / initialScale;
        const focusY = (lastCenter.y - rect.top - rect.height / 2) / initialScale;
        
        setPosition({
          x: -focusX * (newScale - 1),
          y: -focusY * (newScale - 1)
        });
      }
      
      setScale(newScale);
      
      // Auto-centrar cuando se reduce mucho el zoom
      if (newScale <= 1.1) {
        setPosition({ x: 0, y: 0 });
      }
    } else if (isPanning && e.touches.length === 1) {
      const touch = e.touches[0];
      const currentTime = Date.now();
      
      // Calcular nueva posición
      const newX = touch.clientX - dragStart.x;
      const newY = touch.clientY - dragStart.y;
      
      // Calcular velocidad para inercia
      const deltaTime = currentTime - lastPanTime;
      if (deltaTime > 0) {
        const deltaX = touch.clientX - lastPanPosition.x;
        const deltaY = touch.clientY - lastPanPosition.y;
        setVelocity({
          x: deltaX / deltaTime * 16, // Normalizar a 60fps
          y: deltaY / deltaTime * 16
        });
      }
      
      // Aplicar límites elásticos suaves
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (containerRect && scale > 1) {
        const maxX = (scale - 1) * containerRect.width * 0.5;
        const maxY = (scale - 1) * containerRect.height * 0.5;
        
        // Efecto elástico en los bordes
        const elasticX = newX > maxX ? maxX + (newX - maxX) * 0.3 : 
                        newX < -maxX ? -maxX + (newX + maxX) * 0.3 : newX;
        const elasticY = newY > maxY ? maxY + (newY - maxY) * 0.3 : 
                        newY < -maxY ? -maxY + (newY + maxY) * 0.3 : newY;
        
        setPosition({ x: elasticX, y: elasticY });
      } else {
        setPosition({ x: newX, y: newY });
      }
      
      setLastPanTime(currentTime);
      setLastPanPosition({ x: touch.clientX, y: touch.clientY });
    }
  };

  // Manejo de fin de toque - Rebote suave
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isZooming) {
      setIsZooming(false);
      
      // Auto-corrección suave del zoom
      if (scale < 1) {
        setScale(1);
        setPosition({ x: 0, y: 0 });
      } else if (scale > 4) {
        setScale(4);
      }
    }
    
    if (isPanning) {
      setIsPanning(false);
      
      // Rebote suave a los límites
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (containerRect && scale > 1) {
        const maxX = (scale - 1) * containerRect.width * 0.5;
        const maxY = (scale - 1) * containerRect.height * 0.5;
        
        setPosition(prev => ({
          x: Math.min(Math.max(prev.x, -maxX), maxX),
          y: Math.min(Math.max(prev.y, -maxY), maxY)
        }));
      }
      
      // Iniciar inercia si hay velocidad
      if (Math.abs(velocity.x) > 1 || Math.abs(velocity.y) > 1) {
        applyInertia();
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200]"
        style={{
          background: `
            radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.8) 100%),
            linear-gradient(45deg, rgba(15,15,15,0.95) 0%, rgba(25,25,25,0.98) 100%)
          `,
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
        }}
        // Removemos el onClick del fondo para que no cierre al hacer click
      >
        {/* Botón cerrar mejorado */}
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all duration-200 hover:scale-110 active:scale-95"
          style={{
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </motion.button>

        {/* Indicador de zoom elegante */}
        <AnimatePresence>
          {scale > 1.1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute top-4 left-4 z-10"
              style={{
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.2)",
                padding: "8px 16px",
              }}
            >
              <span className="text-white text-sm font-medium">
                {Math.round(scale * 100)}%
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loader mientras carga la imagen */}
        <AnimatePresence>
          {!imageLoaded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center z-20"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controles de zoom para desktop */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 flex-col gap-2 z-10"
        >
          <button
            onClick={() => setScale(prev => Math.min(prev + 0.5, 5))}
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all duration-200 hover:scale-110 active:scale-95"
            style={{
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          <button
            onClick={() => {
              setScale(prev => Math.max(prev - 0.5, 1));
              if (scale <= 1.5) setPosition({ x: 0, y: 0 });
            }}
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all duration-200 hover:scale-110 active:scale-95"
            style={{
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          <button
            onClick={() => {
              setScale(1);
              setPosition({ x: 0, y: 0 });
            }}
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all duration-200 hover:scale-110 active:scale-95"
            style={{
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5v14"/>
              <circle cx="12" cy="12" r="10"/>
            </svg>
          </button>
        </motion.div>

        {/* Contenedor de imagen con física mejorada */}
        <div 
          ref={containerRef}
          className="w-full h-full flex items-center justify-center overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            ref={imageRef}
            className="relative w-full h-full max-w-4xl max-h-[90vh]"
            animate={{
              scale,
              x: position.x,
              y: position.y
            }}
            transition={{
              type: "spring",
              damping: isPanning || isZooming ? 50 : 20,
              stiffness: isPanning || isZooming ? 300 : 150,
              mass: 0.5
            }}
            style={{
              touchAction: 'none',
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
          >
            <motion.img
              src={imageUrl}
              alt="Mapa de palcos"
              className="w-full h-full object-contain select-none rounded-xl"
              draggable={false}
              initial={{ opacity: 0 }}
              animate={{ opacity: imageLoaded ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              onLoad={() => setImageLoaded(true)}
              style={{
                filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.5))",
              }}
            />
          </motion.div>
        </div>

        {/* Instrucciones mejoradas - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="fixed bottom-4 sm:bottom-8 left-0 right-0 flex justify-center px-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="text-center"
            style={{
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(16px) saturate(120%)",
              WebkitBackdropFilter: "blur(16px) saturate(120%)",
              borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "16px 24px",
              maxWidth: "min(90vw, 500px)",
              width: "100%",
            }}
          >
            <p className="text-white text-sm sm:text-base font-normal">
              <span className="hidden sm:inline">
                Usa el zoom para explorar el mapa y ubicar los palcos disponibles
              </span>
              <span className="sm:hidden">
                Pellizca para hacer zoom y explorar el mapa
              </span>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageViewer;