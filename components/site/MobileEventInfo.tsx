"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface MobileEventInfoProps {
  name: string;
  date: string;
  hour: string;
  endDate: string;
  endHour: string;
  city: string;
  address: string;
  age: number | null;
  description: string;
  className?: string;
}

const MobileEventInfo = ({
  name,
  date,
  hour,
  endDate,
  endHour,
  city,
  address,
  age,
  description,
  className
}: MobileEventInfoProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showExpandButton, setShowExpandButton] = useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    try {
      // Intentar diferentes formatos de fecha
      let eventDate: Date;
      
      // Si viene en formato DD/MM/YYYY o DD-MM-YYYY, convertir a ISO
      if (dateString.includes('/') || dateString.includes('-')) {
        const parts = dateString.split(/[/-]/);
        if (parts.length === 3) {
          // Asumir DD/MM/YYYY o DD-MM-YYYY
          const [day, month, year] = parts;
          eventDate = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
        } else {
          eventDate = new Date(dateString);
        }
      } else {
        eventDate = new Date(dateString);
      }
      
      // Verificar si la fecha es válida
      if (isNaN(eventDate.getTime())) {
        return dateString; // Retornar el string original si no se puede parsear
      }
      
      const day = eventDate.getDate();
      const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
      const month = months[eventDate.getMonth()];
      const year = eventDate.getFullYear();
      
      return `${day} de ${month}, ${year}`;
    } catch (error) {
      console.log('Error formatting date:', dateString, error);
      return dateString; // Fallback al string original
    }
  };

  const isNightEvent = (startDate: string, endDate: string, startHour: string, endHour: string) => {
    try {
      // Convertir fechas a objetos Date
      const parseDate = (dateString: string) => {
        if (dateString.includes('/') || dateString.includes('-')) {
          const parts = dateString.split(/[/-]/);
          if (parts.length === 3) {
            const [day, month, year] = parts;
            return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
          }
        }
        return new Date(dateString);
      };

      const start = parseDate(startDate);
      const end = parseDate(endDate);
      
      // Verificar que las fechas sean válidas
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return false;
      }

      // Calcular diferencia en días
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Solo para eventos que cruzan exactamente 1 día
      if (diffDays !== 1) {
        return false;
      }

      // Verificar si es horario nocturno
      const startHourNum = parseInt(startHour.split(':')[0]);
      const endHourNum = parseInt(endHour.split(':')[0]);

      // Evento nocturno: empieza después de las 6 PM y termina antes de las 8 AM
      return startHourNum >= 18 && endHourNum <= 8;
    } catch (error) {
      return false;
    }
  };

  const shouldShowDescription = (text: string) => {
    if (!text || typeof text !== 'string') return false;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    return words.length >= 2;
  };

  const [lineHeight, setLineHeight] = useState(24);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [titleFontSize, setTitleFontSize] = useState('clamp(1.2rem, 5.5vw, 1.75rem)');
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Ajustar tamaño del título dinámicamente
  useEffect(() => {
    if (titleRef.current && name) {
      const titleLength = name.length;
      
      if (titleLength > 40) {
        setTitleFontSize('clamp(1rem, 4vw, 1.2rem)');
      } else if (titleLength > 30) {
        setTitleFontSize('clamp(1.05rem, 4.2vw, 1.35rem)');
      } else {
        setTitleFontSize('clamp(1.1rem, 4.5vw, 1.5rem)');
      }
    }
  }, [name]);

  // Verificar si el texto necesita expansión
  useEffect(() => {
    if (textRef.current) {
      const computedStyle = window.getComputedStyle(textRef.current);
      const lineHeightValue = parseFloat(computedStyle.lineHeight);
      setLineHeight(lineHeightValue);
      
      const maxHeight = lineHeightValue * 3;
      const actualHeight = textRef.current.scrollHeight;
      
      setShowExpandButton(actualHeight > maxHeight);
    }
  }, [description]);

  return (
    <div className={cn("md:hidden w-full", className)}>
      <div 
        className="relative rounded-xl p-5"
        style={{
          backgroundColor: 'rgba(10, 10, 10, 0.95)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Título del evento */}
        <h2 
          ref={titleRef}
          className="font-medium text-white/95 text-center mb-4"
          style={{
            fontSize: 'clamp(1.1rem, 4.5vw, 1.5rem)',
            lineHeight: '1.1',
            wordBreak: 'break-word',
            hyphens: 'auto',
            maxHeight: '2.2em',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            letterSpacing: '-0.01em',
          }}
        >
          {name}
        </h2>
        
        {/* Línea divisora sutil */}
        <div 
          className="h-px mb-4"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          }}
        />
        
        {/* Card de Fecha, Hora y Edad combinada */}
        <div 
          className="rounded-lg p-4 mb-4"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/80">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {date === endDate || isNightEvent(date, endDate, hour, endHour) ? (
              <p className="text-sm font-medium text-white/90">
                {formatDate(date)}
              </p>
            ) : (
              <p className="text-sm font-medium text-white/90">
                {(() => {
                  const startFormatted = formatDate(date);
                  const endFormatted = formatDate(endDate);
                  
                  // Extraer componentes de las fechas
                  const startParts = startFormatted.match(/(\d+) de (\w+), (\d+)/);
                  const endParts = endFormatted.match(/(\d+) de (\w+), (\d+)/);
                  
                  if (startParts && endParts) {
                    const [, startDay, startMonth, startYear] = startParts;
                    const [, endDay, endMonth, endYear] = endParts;
                    
                    // Si mismo mes y año
                    if (startMonth === endMonth && startYear === endYear) {
                      const dayDiff = parseInt(endDay) - parseInt(startDay) + 1;
                      // Si son solo 2 días, usar "y"
                      if (dayDiff === 2) {
                        return `${startDay} y ${endDay} de ${startMonth}, ${startYear}`;
                      }
                      // Si son 3+ días, usar rango
                      else {
                        return `${startDay} - ${endDay} de ${startMonth}, ${startYear}`;
                      }
                    }
                    // Si mismo año pero diferente mes, mostrar "21 de jun y 22 de jul, 2025"
                    else if (startYear === endYear) {
                      return `${startDay} de ${startMonth} y ${endDay} de ${endMonth}, ${startYear}`;
                    }
                  }
                  
                  // Fallback al formato original
                  return `${startFormatted} y ${endFormatted}`;
                })()}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>{hour} — {endHour}</span>
            <span>•</span>
            <span>{age !== null && age > 0 ? `+${age} años` : "Para todo público"}</span>
          </div>
        </div>
        
        {/* Card de Ubicación */}
        <div 
          className="rounded-lg p-4 mb-4"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className="flex items-center gap-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/80">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <div>
              <p className="text-sm font-medium text-white/90">{city}</p>
              <p className="text-xs text-white/60">{address}</p>
            </div>
          </div>
        </div>


        {/* Descripción con efecto fade */}
        {shouldShowDescription(description) && (
          <>
            <motion.div className="relative">
              <motion.div
                className="relative overflow-hidden"
                animate={{ 
                  height: isExpanded ? "auto" : `${lineHeight * 3}px`
                }}
                transition={{ 
                  duration: 0.6, 
                  ease: [0.23, 1, 0.32, 1]
                }}
              >
                <motion.p 
                  ref={textRef}
                  className="text-sm text-white/70 whitespace-pre-wrap text-justify leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  {description}
                </motion.p>
                
                {/* Fade gradient */}
                <AnimatePresence>
                  {!isExpanded && showExpandButton && (
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
                      style={{
                        background: 'linear-gradient(to bottom, transparent, rgba(10, 10, 10, 0.95))'
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>

            {/* Botón de expansión */}
            <AnimatePresence>
              {showExpandButton && (
                <motion.div
                  className="flex justify-center mt-3"
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.8 }}
                  transition={{ 
                    duration: 0.4, 
                    ease: [0.23, 1, 0.32, 1],
                    delay: 0.1
                  }}
                >
                  <motion.button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-white/50 hover:text-white/70 transition-colors duration-300 text-caption font-caption flex items-center gap-1"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isExpanded ? (
                      <>
                        Leer menos
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="m18 15-6-6-6 6"/>
                        </svg>
                      </>
                    ) : (
                      <>
                        Leer más
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileEventInfo;