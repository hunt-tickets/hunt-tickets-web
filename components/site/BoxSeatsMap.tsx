"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

interface BoxSeat {
  id: string;
  name: string;
  capacity: number;
  price: number;
  available: boolean;
  description: string;
  x?: number;
  y?: number;
}

interface BoxSection {
  title: string;
  color: string;
  boxes: BoxSeat[];
}

interface BoxSeatsMapProps {
  sections: BoxSection[];
  selectedBox: string | null;
  onBoxSelect: (boxId: string) => void;
  eventMapUrl?: string;
}

const BoxSeatsMap = ({ sections, selectedBox, onBoxSelect }: BoxSeatsMapProps) => {
  const [hoveredBox, setHoveredBox] = useState<string | null>(null);

  // Función para obtener posición del box basada en su index
  const getBoxPosition = (sectionIndex: number, boxIndex: number, totalBoxes: number) => {
    const sectionConfigs = [
      // VIP Section - Zona superior central
      { startX: 35, startY: 15, spacing: 12, perRow: 6 },
      // Premium Section - Laterales superiores
      { startX: 15, startY: 30, spacing: 10, perRow: 4 },
      // General Section - Zona inferior
      { startX: 25, startY: 65, spacing: 8, perRow: 8 },
    ];

    const config = sectionConfigs[sectionIndex] || sectionConfigs[2];
    const row = Math.floor(boxIndex / config.perRow);
    const col = boxIndex % config.perRow;
    
    return {
      x: config.startX + (col * config.spacing),
      y: config.startY + (row * config.spacing * 0.6)
    };
  };

  const renderBox = (box: BoxSeat, sectionColor: string, position: { x: number, y: number }) => {
    const isSelected = selectedBox === box.id;
    const isHovered = hoveredBox === box.id;
    
    return (
      <div
        key={box.id}
        className={cn(
          "absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200",
          "w-8 h-8 rounded-lg border-2 flex items-center justify-center",
          box.available ? "hover:scale-110" : "cursor-not-allowed opacity-60"
        )}
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          backgroundColor: isSelected 
            ? 'rgb(var(--brand-600))'
            : box.available 
              ? isHovered 
                ? sectionColor 
                : `${sectionColor}40`
              : '#1a1a1a',
          borderColor: isSelected
            ? 'rgb(var(--brand-600))'
            : box.available
              ? sectionColor
              : '#404040',
          boxShadow: isSelected || isHovered 
            ? `0 0 12px ${sectionColor}60` 
            : 'none'
        }}
        onClick={() => {
          if (box.available) {
            onBoxSelect(selectedBox === box.id ? "" : box.id);
          }
        }}
        onMouseEnter={() => setHoveredBox(box.id)}
        onMouseLeave={() => setHoveredBox(null)}
      >
        <span className={cn(
          "text-xs font-bold",
          box.available ? "text-white" : "text-neutral-500"
        )}>
          {box.name.split(' ')[1] || box.name}
        </span>
        
        {/* Tooltip para información adicional */}
        {(isHovered || isSelected) && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-2 py-1 rounded text-xs whitespace-nowrap z-10">
            <div className="font-semibold">{box.name}</div>
            <div className="text-neutral-300">{box.capacity} personas</div>
            {box.available && (
              <div className="text-green-400">${box.price.toLocaleString()}</div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-[1080px] mx-auto" style={{ aspectRatio: '3/4' }}>
      {/* Container principal con aspecto 3:4 */}
      <div className="relative w-full h-full bg-gradient-to-b from-neutral-900 to-black rounded-xl overflow-hidden border border-neutral-800">
        {/* Escenario/Stage */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
          <span className="text-xs font-bold text-black">ESCENARIO</span>
        </div>
        
        {/* Renderizar boxes por sección */}
        {sections.map((section, sectionIndex) => (
          <div key={`section-${sectionIndex}`}>
            {section.boxes.map((box, boxIndex) => {
              const position = getBoxPosition(sectionIndex, boxIndex, section.boxes.length);
              return renderBox(box, section.color, position);
            })}
            
            {/* Label de sección */}
            <div 
              className="absolute text-xs font-bold uppercase tracking-wider opacity-60"
              style={{
                left: sectionIndex === 0 ? '50%' : sectionIndex === 1 ? '20%' : '50%',
                top: sectionIndex === 0 ? '12%' : sectionIndex === 1 ? '27%' : '62%',
                transform: 'translateX(-50%)',
                color: section.color
              }}
            >
              {section.title}
            </div>
          </div>
        ))}
        
        {/* Leyenda */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-green-500"></div>
            <span className="text-neutral-400">Disponible</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-brand-primary"></div>
            <span className="text-neutral-400">Seleccionado</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-neutral-600"></div>
            <span className="text-neutral-400">No disponible</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoxSeatsMap;