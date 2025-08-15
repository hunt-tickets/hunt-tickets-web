"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import { 
  VenueMapData, 
  VenueZone, 
  Point, 
  MapEditorState, 
  ZONE_TYPES, 
  EDITOR_TOOLS 
} from '@/types/venue-map';
import { MapEditorToolbar } from './map-editor-toolbar';
import { MapEditorSidebar } from './map-editor-sidebar';

interface VenueMapEditorProps {
  eventId: string;
  initialData?: VenueMapData;
  onSave?: (mapData: VenueMapData) => void;
}

const DEFAULT_MAP_SIZE = { width: 1200, height: 800 };

export const VenueMapEditorSimple: React.FC<VenueMapEditorProps> = ({
  eventId,
  initialData,
  onSave
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mapData, setMapData] = useState<VenueMapData>(
    initialData || {
      id: `map-${eventId}`,
      eventId,
      name: 'Mapa del Venue',
      dimensions: DEFAULT_MAP_SIZE,
      zones: [],
      scale: 1,
      lastModified: new Date().toISOString()
    }
  );

  const [editorState, setEditorState] = useState<MapEditorState>({
    selectedTool: 'select',
    selectedZone: null,
    isDrawing: false,
    currentPoints: [],
    zoom: 1,
    pan: { x: 0, y: 0 },
    showGrid: true,
    snapToGrid: true,
    gridSize: 20
  });

  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const container = document.getElementById('map-editor-container');
      if (container) {
        const rect = container.getBoundingClientRect();
        setCanvasSize({
          width: rect.width - 320, // Subtract sidebar width
          height: rect.height - 80  // Subtract toolbar height
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Draw on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    // Draw grid
    if (editorState.showGrid) {
      drawGrid(ctx);
    }

    // Draw zones
    mapData.zones.forEach(zone => {
      if (zone.isVisible && zone.points.length >= 3) {
        drawZone(ctx, zone);
      }
    });

    // Draw current drawing
    if (editorState.isDrawing && editorState.currentPoints.length > 0) {
      drawCurrentPath(ctx);
    }
  }, [mapData, editorState, canvasSize]);

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    const { gridSize } = editorState;
    const { width, height } = canvasSize;

    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.3;

    // Vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
  };

  const drawZone = (ctx: CanvasRenderingContext2D, zone: VenueZone) => {
    if (zone.points.length < 3) return;

    const isSelected = editorState.selectedZone === zone.id;

    // Draw zone fill
    ctx.fillStyle = zone.color + '4D'; // Add alpha
    ctx.strokeStyle = zone.color;
    ctx.lineWidth = isSelected ? 3 : 2;

    ctx.beginPath();
    ctx.moveTo(zone.points[0].x, zone.points[0].y);
    for (let i = 1; i < zone.points.length; i++) {
      ctx.lineTo(zone.points[i].x, zone.points[i].y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw zone label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 4;
    ctx.fillText(zone.name, zone.points[0].x + 5, zone.points[0].y - 5);
    ctx.shadowBlur = 0;
  };

  const drawCurrentPath = (ctx: CanvasRenderingContext2D) => {
    const { currentPoints } = editorState;
    
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    if (currentPoints.length > 1) {
      ctx.beginPath();
      ctx.moveTo(currentPoints[0].x, currentPoints[0].y);
      for (let i = 1; i < currentPoints.length; i++) {
        ctx.lineTo(currentPoints[i].x, currentPoints[i].y);
      }
      ctx.stroke();
    }

    // Draw points
    ctx.fillStyle = '#3b82f6';
    ctx.setLineDash([]);
    currentPoints.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  const handleToolChange = useCallback((tool: string) => {
    setEditorState(prev => ({
      ...prev,
      selectedTool: tool,
      isDrawing: false,
      currentPoints: []
    }));
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const pos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    const { selectedTool, isDrawing, currentPoints, snapToGrid, gridSize } = editorState;

    let adjustedPos = pos;
    if (snapToGrid) {
      adjustedPos = {
        x: Math.round(pos.x / gridSize) * gridSize,
        y: Math.round(pos.y / gridSize) * gridSize
      };
    }

    switch (selectedTool) {
      case 'zone':
        if (!isDrawing) {
          // Start drawing new zone
          setEditorState(prev => ({
            ...prev,
            isDrawing: true,
            currentPoints: [adjustedPos]
          }));
        } else {
          // Add point to current zone
          setEditorState(prev => ({
            ...prev,
            currentPoints: [...prev.currentPoints, adjustedPos]
          }));
        }
        break;

      case 'seat':
        // Add individual seat
        addSeat(adjustedPos);
        break;

      case 'select':
        // Handle selection - check if clicking on a zone
        const clickedZone = findZoneAtPoint(adjustedPos);
        setEditorState(prev => ({ ...prev, selectedZone: clickedZone?.id || null }));
        break;
    }
  }, [editorState]);

  const handleCanvasDoubleClick = useCallback(() => {
    const { selectedTool, isDrawing, currentPoints } = editorState;

    if (selectedTool === 'zone' && isDrawing && currentPoints.length >= 3) {
      // Finish drawing zone
      const newZone: VenueZone = {
        id: `zone-${Date.now()}`,
        name: `Zona ${mapData.zones.length + 1}`,
        type: 'general',
        color: ZONE_TYPES.general.color,
        points: currentPoints,
        isVisible: true
      };

      setMapData(prev => ({
        ...prev,
        zones: [...prev.zones, newZone],
        lastModified: new Date().toISOString()
      }));

      setEditorState(prev => ({
        ...prev,
        isDrawing: false,
        currentPoints: [],
        selectedZone: newZone.id
      }));
    }
  }, [editorState, mapData.zones.length]);

  const findZoneAtPoint = (point: Point): VenueZone | null => {
    // Simple point-in-polygon check
    for (const zone of mapData.zones) {
      if (zone.isVisible && isPointInPolygon(point, zone.points)) {
        return zone;
      }
    }
    return null;
  };

  const isPointInPolygon = (point: Point, polygon: Point[]): boolean => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      if (((polygon[i].y > point.y) !== (polygon[j].y > point.y)) &&
          (point.x < (polygon[j].x - polygon[i].x) * (point.y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x)) {
        inside = !inside;
      }
    }
    return inside;
  };

  const addSeat = useCallback((position: Point) => {
    // Implementation for adding individual seats
    console.log('Adding seat at:', position);
  }, []);

  const updateZone = useCallback((zoneId: string, updates: Partial<VenueZone>) => {
    setMapData(prev => ({
      ...prev,
      zones: prev.zones.map(zone => 
        zone.id === zoneId ? { ...zone, ...updates } : zone
      ),
      lastModified: new Date().toISOString()
    }));
  }, []);

  const deleteZone = useCallback((zoneId: string) => {
    setMapData(prev => ({
      ...prev,
      zones: prev.zones.filter(zone => zone.id !== zoneId),
      lastModified: new Date().toISOString()
    }));
    setEditorState(prev => ({ ...prev, selectedZone: null }));
  }, []);

  const handleSave = useCallback(() => {
    onSave?.(mapData);
    
    // Also save to localStorage as backup
    localStorage.setItem(`venue-map-${eventId}`, JSON.stringify(mapData));
  }, [mapData, eventId, onSave]);

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-white">
      {/* Toolbar */}
      <MapEditorToolbar
        selectedTool={editorState.selectedTool}
        onToolChange={handleToolChange}
        onSave={handleSave}
        showGrid={editorState.showGrid}
        onToggleGrid={() => setEditorState(prev => ({ ...prev, showGrid: !prev.showGrid }))}
        snapToGrid={editorState.snapToGrid}
        onToggleSnap={() => setEditorState(prev => ({ ...prev, snapToGrid: !prev.snapToGrid }))}
      />

      <div className="flex-1 flex">
        {/* Main Canvas Area */}
        <div 
          id="map-editor-container"
          className="flex-1 bg-[#111111] relative overflow-hidden"
        >
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            onDoubleClick={handleCanvasDoubleClick}
            className="cursor-crosshair border border-white/10"
            style={{ 
              width: canvasSize.width, 
              height: canvasSize.height,
              display: 'block'
            }}
          />

          {/* Canvas info overlay */}
          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md rounded-lg px-3 py-2 text-xs text-white/70">
            {canvasSize.width} × {canvasSize.height} px | Zoom: {Math.round(editorState.zoom * 100)}%
          </div>

          {/* Instructions overlay */}
          {mapData.zones.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black/60 backdrop-blur-md rounded-xl p-6 text-center text-white">
                <div className="text-4xl mb-4">🗺️</div>
                <h3 className="text-lg font-medium mb-2">Bienvenido al Editor de Mapas</h3>
                <p className="text-white/80 text-sm mb-4">
                  Selecciona la herramienta "Crear Zona" y haz clic para comenzar a dibujar
                </p>
                <div className="text-xs text-white/60">
                  • Haz clic para agregar puntos<br/>
                  • Doble clic para completar la zona
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <MapEditorSidebar
          mapData={mapData}
          selectedZone={editorState.selectedZone}
          onUpdateZone={updateZone}
          onDeleteZone={deleteZone}
          onUpdateMapData={setMapData}
        />
      </div>
    </div>
  );
};