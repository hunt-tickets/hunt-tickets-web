"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

interface BoxItemProps {
  palco: {
    id: string;
    name: string;
    capacity: number;
    price: number;
    available: boolean;
    description?: string;
  };
  sectionColor: string;
  selected: boolean;
  onClick: () => void;
}

const BoxItem = ({ palco, sectionColor, selected, onClick }: BoxItemProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Función para convertir hex a rgba para transparencias
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const handleClick = () => {
    if (!palco.available) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
      return;
    }
    onClick();
  };

  // Patrón diagonal para boxes no disponibles
  const disabledPattern = `repeating-linear-gradient(
    45deg,
    transparent,
    transparent 4px,
    rgba(100, 100, 100, 0.3) 4px,
    rgba(100, 100, 100, 0.3) 8px
  )`;

  return (
    <>
      <button
        onClick={handleClick}
        disabled={!palco.available}
        className={cn(
          "relative py-3 px-3 rounded-lg border transition-all duration-200",
          "flex flex-col items-center justify-center gap-0.5",
          palco.available ? "cursor-pointer" : "cursor-not-allowed",
          selected
            ? "bg-brand-600/20"
            : palco.available
            ? "bg-transparent hover:bg-white/5"
            : ""
        )}
        style={{
          borderColor: selected 
            ? 'rgb(var(--brand-600))' 
            : palco.available 
              ? hexToRgba(sectionColor, 0.5)
              : 'rgb(64, 64, 64)',
          ...(palco.available && !selected && {
            '--hover-border-color': sectionColor,
          } as any),
          ...(!palco.available && {
            backgroundImage: disabledPattern,
            backgroundColor: 'rgba(20, 20, 20, 0.9)',
          })
        }}
        onMouseEnter={(e) => {
          if (palco.available && !selected) {
            e.currentTarget.style.borderColor = sectionColor;
          }
        }}
        onMouseLeave={(e) => {
          if (palco.available && !selected) {
            e.currentTarget.style.borderColor = hexToRgba(sectionColor, 0.5);
          }
        }}
      >
        {/* Indicador de color de sección */}
        <div 
          className="absolute top-1 right-1 w-2 h-2 rounded-full"
          style={{ 
            backgroundColor: palco.available ? sectionColor : 'rgba(100, 100, 100, 0.5)'
          }}
        />
        
        <span className={cn(
          "text-sm font-bold",
          palco.available ? "text-white" : "text-neutral-500"
        )}>
          {palco.name}
        </span>
        
        <span className={cn(
          "text-xs",
          palco.available ? "text-neutral-400" : "text-neutral-600"
        )}>
          {palco.capacity} personas
        </span>
      </button>

      {/* Tooltip para boxes no disponibles */}
      {showTooltip && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[200] animate-fade-in">
          <div className="bg-black/90 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg">
            Agotado o Reservado
          </div>
        </div>
      )}
    </>
  );
};

export default BoxItem;