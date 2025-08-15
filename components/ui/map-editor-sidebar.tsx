"use client";

import { useState } from 'react';
import { VenueMapData, VenueZone, ZONE_TYPES } from '@/types/venue-map';
import { Trash2, Edit3, Copy, Eye, EyeOff, Users, DollarSign } from 'lucide-react';

interface MapEditorSidebarProps {
  mapData: VenueMapData;
  selectedZone: string | null;
  onUpdateZone: (zoneId: string, updates: Partial<VenueZone>) => void;
  onDeleteZone: (zoneId: string) => void;
  onUpdateMapData: (mapData: VenueMapData) => void;
}

export const MapEditorSidebar: React.FC<MapEditorSidebarProps> = ({
  mapData,
  selectedZone,
  onUpdateZone,
  onDeleteZone,
  onUpdateMapData
}) => {
  const [activeTab, setActiveTab] = useState<'zones' | 'properties'>('zones');
  const [editingZone, setEditingZone] = useState<string | null>(null);

  const selectedZoneData = selectedZone 
    ? mapData.zones.find(z => z.id === selectedZone)
    : null;

  const handleZoneUpdate = (zoneId: string, field: keyof VenueZone, value: any) => {
    onUpdateZone(zoneId, { [field]: value });
  };

  const handleToggleZoneVisibility = (zoneId: string) => {
    const zone = mapData.zones.find(z => z.id === zoneId);
    if (zone) {
      onUpdateZone(zoneId, { isVisible: !zone.isVisible });
    }
  };

  const handleDuplicateZone = (zoneId: string) => {
    const zone = mapData.zones.find(z => z.id === zoneId);
    if (zone) {
      const duplicatedZone: VenueZone = {
        ...zone,
        id: `zone-${Date.now()}`,
        name: `${zone.name} (Copia)`,
        points: zone.points.map(p => ({ x: p.x + 20, y: p.y + 20 }))
      };
      
      onUpdateMapData({
        ...mapData,
        zones: [...mapData.zones, duplicatedZone],
        lastModified: new Date().toISOString()
      });
    }
  };

  const ZoneListItem = ({ zone }: { zone: VenueZone }) => {
    const zoneType = ZONE_TYPES[zone.type];
    const isSelected = selectedZone === zone.id;
    const isEditing = editingZone === zone.id;

    return (
      <div
        className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
          isSelected
            ? 'bg-blue-600/20 border-blue-600/50'
            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 flex-1">
            <div 
              className="w-4 h-4 rounded border-2 border-white/20"
              style={{ backgroundColor: zone.color }}
            />
            {isEditing ? (
              <input
                type="text"
                value={zone.name}
                onChange={(e) => handleZoneUpdate(zone.id, 'name', e.target.value)}
                onBlur={() => setEditingZone(null)}
                onKeyDown={(e) => e.key === 'Enter' && setEditingZone(null)}
                className="bg-transparent text-white text-sm font-medium outline-none border-b border-white/30 flex-1"
                autoFocus
              />
            ) : (
              <span className="text-white text-sm font-medium truncate">
                {zone.name}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleToggleZoneVisibility(zone.id)}
              className="p-1 hover:bg-white/10 rounded"
              title={zone.isVisible ? 'Ocultar zona' : 'Mostrar zona'}
            >
              {zone.isVisible ? (
                <Eye size={14} className="text-white/60" />
              ) : (
                <EyeOff size={14} className="text-white/40" />
              )}
            </button>
            
            <button
              onClick={() => setEditingZone(zone.id)}
              className="p-1 hover:bg-white/10 rounded"
              title="Editar nombre"
            >
              <Edit3 size={14} className="text-white/60" />
            </button>
            
            <button
              onClick={() => handleDuplicateZone(zone.id)}
              className="p-1 hover:bg-white/10 rounded"
              title="Duplicar zona"
            >
              <Copy size={14} className="text-white/60" />
            </button>
            
            <button
              onClick={() => onDeleteZone(zone.id)}
              className="p-1 hover:bg-red-500/20 rounded"
              title="Eliminar zona"
            >
              <Trash2 size={14} className="text-red-400" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-white/60">
          <span className="flex items-center gap-1">
            <span>{zoneType.icon}</span>
            <span>{zoneType.name}</span>
          </span>
          {zone.capacity && (
            <span className="flex items-center gap-1">
              <Users size={12} />
              <span>{zone.capacity}</span>
            </span>
          )}
          {zone.price && (
            <span className="flex items-center gap-1">
              <DollarSign size={12} />
              <span>${zone.price.toLocaleString()}</span>
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-80 bg-black/20 backdrop-blur-xl border-l border-white/10 flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveTab('zones')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'zones'
              ? 'text-white bg-white/10 border-b-2 border-blue-500'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          Zonas ({mapData.zones.length})
        </button>
        <button
          onClick={() => setActiveTab('properties')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'properties'
              ? 'text-white bg-white/10 border-b-2 border-blue-500'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          Propiedades
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'zones' && (
          <div className="space-y-3">
            {mapData.zones.length === 0 ? (
              <div className="text-center py-8 text-white/60">
                <div className="text-4xl mb-4">🗺️</div>
                <p className="text-sm">No hay zonas creadas</p>
                <p className="text-xs mt-2">
                  Usa la herramienta "Crear Zona" para comenzar
                </p>
              </div>
            ) : (
              mapData.zones.map(zone => (
                <ZoneListItem key={zone.id} zone={zone} />
              ))
            )}
          </div>
        )}

        {activeTab === 'properties' && selectedZoneData && (
          <div className="space-y-4">
            <h3 className="text-white font-medium">
              Propiedades de {selectedZoneData.name}
            </h3>

            {/* Zone Type */}
            <div>
              <label className="block text-white/80 text-sm mb-2">Tipo de Zona</label>
              <select
                value={selectedZoneData.type}
                onChange={(e) => {
                  const type = e.target.value as keyof typeof ZONE_TYPES;
                  handleZoneUpdate(selectedZoneData.id, 'type', type);
                  handleZoneUpdate(selectedZoneData.id, 'color', ZONE_TYPES[type].color);
                }}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              >
                {Object.entries(ZONE_TYPES).map(([key, type]) => (
                  <option key={key} value={key} className="bg-black text-white">
                    {type.icon} {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Zone Color */}
            <div>
              <label className="block text-white/80 text-sm mb-2">Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={selectedZoneData.color}
                  onChange={(e) => handleZoneUpdate(selectedZoneData.id, 'color', e.target.value)}
                  className="w-12 h-10 bg-transparent border border-white/20 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={selectedZoneData.color}
                  onChange={(e) => handleZoneUpdate(selectedZoneData.id, 'color', e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  placeholder="#000000"
                />
              </div>
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-white/80 text-sm mb-2">Capacidad</label>
              <input
                type="number"
                value={selectedZoneData.capacity || ''}
                onChange={(e) => handleZoneUpdate(selectedZoneData.id, 'capacity', parseInt(e.target.value) || undefined)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                placeholder="Capacidad máxima"
                min="1"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-white/80 text-sm mb-2">Precio</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 text-sm">$</span>
                <input
                  type="number"
                  value={selectedZoneData.price || ''}
                  onChange={(e) => handleZoneUpdate(selectedZoneData.id, 'price', parseFloat(e.target.value) || undefined)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-8 pr-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Zone Stats */}
            <div className="bg-white/5 rounded-lg p-3 space-y-2">
              <h4 className="text-white/80 text-sm font-medium">Estadísticas</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-white/60">Puntos</div>
                  <div className="text-white">{selectedZoneData.points.length}</div>
                </div>
                <div>
                  <div className="text-white/60">Asientos</div>
                  <div className="text-white">{selectedZoneData.seats?.length || 0}</div>
                </div>
              </div>
            </div>

            {/* Zone Actions */}
            <div className="space-y-2">
              <button
                onClick={() => handleDuplicateZone(selectedZoneData.id)}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-colors"
              >
                Duplicar Zona
              </button>
              <button
                onClick={() => onDeleteZone(selectedZoneData.id)}
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-medium transition-colors"
              >
                Eliminar Zona
              </button>
            </div>
          </div>
        )}

        {activeTab === 'properties' && !selectedZoneData && (
          <div className="text-center py-8 text-white/60">
            <div className="text-4xl mb-4">⚙️</div>
            <p className="text-sm">Selecciona una zona</p>
            <p className="text-xs mt-2">
              Haz clic en una zona para ver sus propiedades
            </p>
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="border-t border-white/10 p-4">
        <div className="text-xs text-white/60 space-y-1">
          <div>Última modificación:</div>
          <div>{new Date(mapData.lastModified).toLocaleString('es-ES')}</div>
        </div>
      </div>
    </div>
  );
};