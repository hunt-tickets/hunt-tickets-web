"use client";

import { useState, useCallback } from 'react';
import { FigmaDocument, FigmaElement, ZoneElement, ZONE_PRESETS } from '@/types/figma-editor';
import { 
  Trash2, 
  Copy, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock,
  Move,
  RotateCw,
  Square,
  Circle,
  Type,
  Palette,
  Users,
  DollarSign
} from 'lucide-react';

interface FigmaInspectorProps {
  document: FigmaDocument;
  onUpdateElement: (elementId: string, updates: Partial<FigmaElement>) => void;
  onDeleteSelected: () => void;
}

export const FigmaInspector: React.FC<FigmaInspectorProps> = ({
  document,
  onUpdateElement,
  onDeleteSelected
}) => {
  const [activeSection, setActiveSection] = useState<'transform' | 'style' | 'content'>('transform');

  const selectedElement = document.selection.length === 1 
    ? document.elements[document.selection[0]]
    : null;

  const handleTransformUpdate = useCallback((field: keyof FigmaElement['transform'], value: number) => {
    if (!selectedElement) return;
    
    onUpdateElement(selectedElement.id, {
      transform: {
        ...selectedElement.transform,
        [field]: value
      }
    });
  }, [selectedElement, onUpdateElement]);

  const handleStyleUpdate = useCallback((field: keyof FigmaElement['style'], value: any) => {
    if (!selectedElement) return;
    
    onUpdateElement(selectedElement.id, {
      style: {
        ...selectedElement.style,
        [field]: value
      }
    });
  }, [selectedElement, onUpdateElement]);

  const handlePropertyUpdate = useCallback((field: keyof FigmaElement, value: any) => {
    if (!selectedElement) return;
    
    onUpdateElement(selectedElement.id, { [field]: value });
  }, [selectedElement, onUpdateElement]);

  const handleZoneTypeChange = useCallback((zoneType: keyof typeof ZONE_PRESETS) => {
    if (!selectedElement || selectedElement.type !== 'zone') return;
    
    const preset = ZONE_PRESETS[zoneType];
    
    onUpdateElement(selectedElement.id, {
      ...(selectedElement as ZoneElement),
      zoneType,
      style: {
        ...selectedElement.style,
        fill: preset.fill,
        stroke: preset.stroke
      }
    } as any);
  }, [selectedElement, onUpdateElement]);

  const NumberInput = ({ 
    label, 
    value, 
    onChange, 
    suffix,
    min,
    max,
    step = 1 
  }: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    suffix?: string;
    min?: number;
    max?: number;
    step?: number;
  }) => (
    <div className="flex items-center justify-between py-2">
      <label className="text-white/80 text-sm">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={Math.round(value * 100) / 100}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-16 bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm text-right focus:outline-none focus:border-blue-500"
          min={min}
          max={max}
          step={step}
        />
        {suffix && (
          <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/60 text-xs pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );

  const ColorInput = ({ 
    label, 
    value, 
    onChange 
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
  }) => (
    <div className="flex items-center justify-between py-2">
      <label className="text-white/80 text-sm">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 bg-transparent border border-white/20 rounded cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-20 bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-blue-500"
        />
      </div>
    </div>
  );

  const SectionButton = ({ 
    id, 
    icon, 
    label 
  }: { 
    id: typeof activeSection; 
    icon: React.ReactNode; 
    label: string; 
  }) => (
    <button
      onClick={() => setActiveSection(id)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
        activeSection === id
          ? 'bg-blue-600 text-white'
          : 'text-white/70 hover:text-white hover:bg-white/10'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  if (!selectedElement) {
    return (
      <div className="w-80 bg-[#2c2c2c] border-l border-white/10 p-6">
        <div className="text-center text-white/60">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-lg font-medium text-white mb-2">Nada seleccionado</h3>
          <p className="text-sm">
            Selecciona un elemento para ver sus propiedades
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-[#2c2c2c] border-l border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-medium truncate">{selectedElement.name}</h3>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePropertyUpdate('isVisible', !selectedElement.isVisible)}
              className="p-1 hover:bg-white/10 rounded"
              title={selectedElement.isVisible ? 'Ocultar' : 'Mostrar'}
            >
              {selectedElement.isVisible ? (
                <Eye size={16} className="text-white/70" />
              ) : (
                <EyeOff size={16} className="text-white/40" />
              )}
            </button>
            
            <button
              onClick={() => handlePropertyUpdate('isLocked', !selectedElement.isLocked)}
              className="p-1 hover:bg-white/10 rounded"
              title={selectedElement.isLocked ? 'Desbloquear' : 'Bloquear'}
            >
              {selectedElement.isLocked ? (
                <Lock size={16} className="text-white/70" />
              ) : (
                <Unlock size={16} className="text-white/70" />
              )}
            </button>
            
            <button
              onClick={onDeleteSelected}
              className="p-1 hover:bg-red-500/20 rounded"
              title="Eliminar"
            >
              <Trash2 size={16} className="text-red-400" />
            </button>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/80 text-sm transition-colors">
            <Copy size={14} />
            Duplicar
          </button>
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex p-2 bg-black/20">
        <SectionButton id="transform" icon={<Move size={16} />} label="Posición" />
        <SectionButton id="style" icon={<Palette size={16} />} label="Estilo" />
        {selectedElement.type === 'zone' && (
          <SectionButton id="content" icon={<Square size={16} />} label="Zona" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeSection === 'transform' && (
          <div className="space-y-1">
            <h4 className="text-white font-medium mb-3 flex items-center gap-2">
              <Move size={16} />
              Transformación
            </h4>
            
            <NumberInput
              label="X"
              value={selectedElement.transform.x}
              onChange={(value) => handleTransformUpdate('x', value)}
            />
            
            <NumberInput
              label="Y"
              value={selectedElement.transform.y}
              onChange={(value) => handleTransformUpdate('y', value)}
            />
            
            <NumberInput
              label="Ancho"
              value={selectedElement.transform.width}
              onChange={(value) => handleTransformUpdate('width', value)}
              min={1}
            />
            
            <NumberInput
              label="Alto"
              value={selectedElement.transform.height}
              onChange={(value) => handleTransformUpdate('height', value)}
              min={1}
            />
            
            <NumberInput
              label="Rotación"
              value={selectedElement.transform.rotation}
              onChange={(value) => handleTransformUpdate('rotation', value)}
              suffix="°"
              min={-180}
              max={180}
            />

            {/* Quick size presets */}
            <div className="mt-4">
              <h5 className="text-white/80 text-sm mb-2">Tamaños predefinidos</h5>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    handleTransformUpdate('width', 200);
                    handleTransformUpdate('height', 100);
                  }}
                  className="py-2 px-3 bg-white/10 hover:bg-white/20 rounded-lg text-white/80 text-xs transition-colors"
                >
                  200×100
                </button>
                <button
                  onClick={() => {
                    handleTransformUpdate('width', 300);
                    handleTransformUpdate('height', 200);
                  }}
                  className="py-2 px-3 bg-white/10 hover:bg-white/20 rounded-lg text-white/80 text-xs transition-colors"
                >
                  300×200
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'style' && (
          <div className="space-y-1">
            <h4 className="text-white font-medium mb-3 flex items-center gap-2">
              <Palette size={16} />
              Estilo
            </h4>
            
            <ColorInput
              label="Relleno"
              value={selectedElement.style.fill}
              onChange={(value) => handleStyleUpdate('fill', value)}
            />
            
            <ColorInput
              label="Borde"
              value={selectedElement.style.stroke}
              onChange={(value) => handleStyleUpdate('stroke', value)}
            />
            
            <NumberInput
              label="Grosor borde"
              value={selectedElement.style.strokeWidth}
              onChange={(value) => handleStyleUpdate('strokeWidth', value)}
              suffix="px"
              min={0}
            />
            
            <NumberInput
              label="Opacidad"
              value={selectedElement.style.opacity * 100}
              onChange={(value) => handleStyleUpdate('opacity', value / 100)}
              suffix="%"
              min={0}
              max={100}
            />
            
            <NumberInput
              label="Radio borde"
              value={selectedElement.style.borderRadius}
              onChange={(value) => handleStyleUpdate('borderRadius', value)}
              suffix="px"
              min={0}
            />

            {/* Style presets */}
            <div className="mt-4">
              <h5 className="text-white/80 text-sm mb-2">Estilos predefinidos</h5>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    handleStyleUpdate('fill', '#3b82f6');
                    handleStyleUpdate('stroke', '#1d4ed8');
                    handleStyleUpdate('borderRadius', 8);
                  }}
                  className="w-full py-2 px-3 bg-blue-600/20 border border-blue-600/50 hover:bg-blue-600/30 rounded-lg text-blue-400 text-xs transition-colors"
                >
                  Azul moderno
                </button>
                <button
                  onClick={() => {
                    handleStyleUpdate('fill', '#10b981');
                    handleStyleUpdate('stroke', '#059669');
                    handleStyleUpdate('borderRadius', 4);
                  }}
                  className="w-full py-2 px-3 bg-green-600/20 border border-green-600/50 hover:bg-green-600/30 rounded-lg text-green-400 text-xs transition-colors"
                >
                  Verde éxito
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'content' && selectedElement.type === 'zone' && (
          <div className="space-y-4">
            <h4 className="text-white font-medium mb-3 flex items-center gap-2">
              <Square size={16} />
              Configuración de Zona
            </h4>

            {/* Zone type */}
            <div>
              <label className="block text-white/80 text-sm mb-2">Tipo de zona</label>
              <select
                value={(selectedElement as ZoneElement).zoneType}
                onChange={(e) => handleZoneTypeChange(e.target.value as keyof typeof ZONE_PRESETS)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              >
                {Object.entries(ZONE_PRESETS).map(([key, preset]) => (
                  <option key={key} value={key} className="bg-[#1e1e1e] text-white">
                    {preset.icon} {preset.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-white/80 text-sm mb-2">Capacidad</label>
              <div className="relative">
                <Users size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
                <input
                  type="number"
                  value={(selectedElement as ZoneElement).capacity || ''}
                  onChange={(e) => onUpdateElement(selectedElement.id, {
                    capacity: parseInt(e.target.value) || undefined
                  } as any)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  placeholder="Sin límite"
                  min="0"
                />
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-white/80 text-sm mb-2">Precio</label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
                <input
                  type="number"
                  value={(selectedElement as ZoneElement).price || ''}
                  onChange={(e) => onUpdateElement(selectedElement.id, {
                    price: parseFloat(e.target.value) || undefined
                  } as any)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Zone stats */}
            <div className="bg-white/5 rounded-lg p-3">
              <h5 className="text-white/80 text-sm font-medium mb-2">Estadísticas</h5>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/60">Área:</span>
                  <span className="text-white">
                    {Math.round(selectedElement.transform.width * selectedElement.transform.height).toLocaleString()} px²
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Asientos:</span>
                  <span className="text-white">
                    {(selectedElement as ZoneElement).seats?.length || 0}
                  </span>
                </div>
                {(selectedElement as ZoneElement).capacity && (
                  <div className="flex justify-between">
                    <span className="text-white/60">Densidad:</span>
                    <span className="text-white">
                      {Math.round(((selectedElement as ZoneElement).capacity! / (selectedElement.transform.width * selectedElement.transform.height)) * 10000)} p/m²
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};