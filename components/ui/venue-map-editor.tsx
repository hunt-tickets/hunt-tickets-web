"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Save, 
  Square,
  Circle,
  MousePointer,
  Trash2,
  Plus,
  Minus,
  Grid3X3,
  Armchair
} from 'lucide-react';

interface Seat {
  id: string;
  row: string;
  number: number;
  x: number;
  y: number;
  status: 'available' | 'reserved' | 'blocked';
  label: string;
}

interface Zone {
  id: string;
  type: 'rectangle' | 'circle';
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  capacity?: number;
  seats: Seat[];
}

interface VenueMapEditorProps {
  eventId: string;
  onSave?: (data: any) => void;
}

const ZONE_COLORS = [
  { name: 'General', color: '#3b82f6' },
  { name: 'VIP', color: '#fbbf24' },
  { name: 'Platinum', color: '#8b5cf6' },
  { name: 'Escenario', color: '#ef4444' }
];

export const VenueMapEditor: React.FC<VenueMapEditorProps> = ({
  eventId,
  onSave
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [tool, setTool] = useState<'select' | 'rectangle' | 'circle' | 'seats'>('select');
  const [isDrawing, setIsDrawing] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [zoom, setZoom] = useState(1);

  // Canvas drawing
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = '#ffffff15';
      ctx.lineWidth = 1;
      const gridSize = 20 * zoom;

      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }

    // Draw zones
    zones.forEach(zone => {
      ctx.fillStyle = zone.color + '40';
      ctx.strokeStyle = zone.color;
      ctx.lineWidth = selectedZone === zone.id ? 3 : 2;

      if (zone.type === 'rectangle') {
        ctx.fillRect(zone.x * zoom, zone.y * zoom, zone.width * zoom, zone.height * zoom);
        ctx.strokeRect(zone.x * zoom, zone.y * zoom, zone.width * zoom, zone.height * zoom);
      } else if (zone.type === 'circle') {
        ctx.beginPath();
        ctx.arc(
          (zone.x + zone.width/2) * zoom, 
          (zone.y + zone.height/2) * zoom, 
          (zone.width/2) * zoom, 
          0, 
          2 * Math.PI
        );
        ctx.fill();
        ctx.stroke();
      }

      // Draw zone name
      ctx.fillStyle = '#ffffff';
      ctx.font = `${14 * zoom}px Inter, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(
        zone.name, 
        (zone.x + zone.width / 2) * zoom, 
        (zone.y + zone.height / 2) * zoom
      );

      // Draw seats
      zone.seats.forEach(seat => {
        const seatSize = 8 * zoom;
        ctx.fillStyle = seat.status === 'available' ? '#10b981' : 
                       seat.status === 'reserved' ? '#ef4444' : '#6b7280';
        ctx.fillRect(
          seat.x * zoom - seatSize/2, 
          seat.y * zoom - seatSize/2, 
          seatSize, 
          seatSize
        );
        
        // Draw seat number
        ctx.fillStyle = '#ffffff';
        ctx.font = `${8 * zoom}px Inter`;
        ctx.textAlign = 'center';
        ctx.fillText(
          seat.label, 
          seat.x * zoom, 
          seat.y * zoom + 2
        );
      });
    });
  }, [zones, selectedZone, showGrid, zoom]);

  // Mouse events
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    if (tool === 'select') {
      // Find clicked zone
      const clickedZone = zones.find(zone => 
        x >= zone.x && x <= zone.x + zone.width &&
        y >= zone.y && y <= zone.y + zone.height
      );
      setSelectedZone(clickedZone?.id || null);
    } else if (tool === 'rectangle' || tool === 'circle') {
      setIsDrawing(true);
      setDragStart({ x, y });
    }
  }, [tool, zones, zoom]);

  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !dragStart) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    const width = Math.abs(x - dragStart.x);
    const height = Math.abs(y - dragStart.y);

    if (width > 20 && height > 20) {
      const newZone: Zone = {
        id: `zone-${Date.now()}`,
        type: tool as 'rectangle' | 'circle',
        name: `Zona ${zones.length + 1}`,
        x: Math.min(dragStart.x, x),
        y: Math.min(dragStart.y, y),
        width,
        height,
        color: ZONE_COLORS[zones.length % ZONE_COLORS.length].color,
        seats: []
      };

      setZones(prev => [...prev, newZone]);
      setSelectedZone(newZone.id);
    }

    setIsDrawing(false);
    setDragStart(null);
  }, [isDrawing, dragStart, tool, zones, zoom]);

  // Generate seats for selected zone
  const generateSeats = useCallback(() => {
    if (!selectedZone) return;

    const zone = zones.find(z => z.id === selectedZone);
    if (!zone) return;

    const seats: Seat[] = [];
    const rows = 8;
    const seatsPerRow = 10;
    const seatSpacing = zone.width / (seatsPerRow + 1);
    const rowSpacing = zone.height / (rows + 1);

    for (let row = 0; row < rows; row++) {
      for (let seat = 0; seat < seatsPerRow; seat++) {
        const seatId = `${zone.id}-${row}-${seat}`;
        const rowLetter = String.fromCharCode(65 + row); // A, B, C...
        
        seats.push({
          id: seatId,
          row: rowLetter,
          number: seat + 1,
          x: zone.x + seatSpacing * (seat + 1),
          y: zone.y + rowSpacing * (row + 1),
          status: 'available',
          label: `${rowLetter}${seat + 1}`
        });
      }
    }

    setZones(prev => prev.map(z => 
      z.id === selectedZone ? { ...z, seats, capacity: seats.length } : z
    ));
  }, [selectedZone, zones]);

  // Delete selected zone
  const deleteSelectedZone = useCallback(() => {
    if (!selectedZone) return;
    setZones(prev => prev.filter(z => z.id !== selectedZone));
    setSelectedZone(null);
  }, [selectedZone]);

  // Save data
  const handleSave = useCallback(() => {
    const data = {
      eventId,
      zones,
      lastModified: new Date().toISOString()
    };
    onSave?.(data);
  }, [eventId, zones, onSave]);

  // Redraw when needed
  useEffect(() => {
    draw();
  }, [draw]);

  const selectedZoneData = selectedZone 
    ? zones.find(z => z.id === selectedZone)
    : null;

  return (
    <div className="h-full w-full bg-[#2c2c2c] flex flex-col">
      {/* Toolbar */}
      <div className="bg-[#2c2c2c] border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTool('select')}
              className={`p-2 rounded-lg transition-all ${
                tool === 'select' ? 'bg-blue-600 text-white' : 'text-white/70 hover:bg-white/10'
              }`}
              title="Seleccionar (V)"
            >
              <MousePointer size={18} />
            </button>
            <button
              onClick={() => setTool('rectangle')}
              className={`p-2 rounded-lg transition-all ${
                tool === 'rectangle' ? 'bg-blue-600 text-white' : 'text-white/70 hover:bg-white/10'
              }`}
              title="Rectángulo (R)"
            >
              <Square size={18} />
            </button>
            <button
              onClick={() => setTool('circle')}
              className={`p-2 rounded-lg transition-all ${
                tool === 'circle' ? 'bg-blue-600 text-white' : 'text-white/70 hover:bg-white/10'
              }`}
              title="Círculo (O)"
            >
              <Circle size={18} />
            </button>
            
            <div className="w-px h-6 bg-white/20 mx-2" />
            
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-2 rounded-lg transition-all ${
                showGrid ? 'bg-blue-600 text-white' : 'text-white/70 hover:bg-white/10'
              }`}
              title="Toggle Grid"
            >
              <Grid3X3 size={18} />
            </button>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                className="p-1 text-white/70 hover:text-white"
              >
                <Minus size={16} />
              </button>
              <span className="text-white/70 text-sm min-w-[50px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                className="p-1 text-white/70 hover:text-white"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="text-white font-medium">
            Editor de Venue
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {selectedZone && (
              <>
                <button
                  onClick={generateSeats}
                  className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm"
                >
                  <Armchair size={16} />
                  Generar Sillas
                </button>
                <button
                  onClick={deleteSelectedZone}
                  className="p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium text-sm"
            >
              <Save size={16} />
              Guardar
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex">
        {/* Canvas */}
        <div className="flex-1 relative">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            className="w-full h-full cursor-crosshair"
          />

          {/* Instructions */}
          {zones.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black/60 backdrop-blur-sm rounded-xl p-8 text-center text-white max-w-md">
                <div className="text-4xl mb-4">🎭</div>
                <h3 className="text-lg font-medium mb-2">¡Crea tu primer venue!</h3>
                <p className="text-white/80 text-sm mb-4">
                  Selecciona la herramienta Rectángulo o Círculo y arrastra para crear zonas
                </p>
                <div className="text-xs text-white/60">
                  💡 Luego selecciona una zona y genera sillas automáticamente
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-[#2c2c2c] border-l border-white/10 flex flex-col">
          {/* Zones List */}
          <div className="flex-1 p-4">
            <h3 className="text-white font-medium mb-4">Zonas ({zones.length})</h3>
            
            {zones.length === 0 ? (
              <div className="text-center py-8 text-white/60">
                <div className="text-2xl mb-2">📍</div>
                <p className="text-sm">No hay zonas creadas</p>
              </div>
            ) : (
              <div className="space-y-2">
                {zones.map(zone => (
                  <div
                    key={zone.id}
                    onClick={() => setSelectedZone(zone.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedZone === zone.id
                        ? 'bg-blue-600/30 border border-blue-600/50'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: zone.color }}
                      />
                      <div className="flex-1">
                        <div className="text-white text-sm font-medium">{zone.name}</div>
                        <div className="text-white/60 text-xs">
                          {zone.seats.length} sillas • {zone.type}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Properties */}
          {selectedZoneData && (
            <div className="border-t border-white/10 p-4">
              <h4 className="text-white font-medium mb-4">Propiedades</h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-white/80 text-sm mb-1">Nombre</label>
                  <input
                    type="text"
                    value={selectedZoneData.name}
                    onChange={(e) => {
                      const newName = e.target.value;
                      setZones(prev => prev.map(z => 
                        z.id === selectedZone ? { ...z, name: newName } : z
                      ));
                    }}
                    className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-1">Color</label>
                  <div className="flex gap-2">
                    {ZONE_COLORS.map(color => (
                      <button
                        key={color.color}
                        onClick={() => {
                          setZones(prev => prev.map(z => 
                            z.id === selectedZone ? { ...z, color: color.color } : z
                          ));
                        }}
                        className={`w-8 h-8 rounded border-2 ${
                          selectedZoneData.color === color.color ? 'border-white' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color.color }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {selectedZoneData.seats.length > 0 && (
                  <div>
                    <label className="block text-white/80 text-sm mb-1">Estadísticas</label>
                    <div className="bg-white/5 rounded p-3 text-sm">
                      <div className="text-white/80">
                        Total de sillas: <span className="text-white font-medium">{selectedZoneData.seats.length}</span>
                      </div>
                      <div className="text-white/80">
                        Disponibles: <span className="text-green-400 font-medium">
                          {selectedZoneData.seats.filter(s => s.status === 'available').length}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};