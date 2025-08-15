"use client";

import { useState, useRef, useCallback, useEffect } from 'react';

interface FigmaVenueEditorSimpleProps {
  eventId: string;
  onSave?: (data: any) => void;
}

export const FigmaVenueEditorSimple: React.FC<FigmaVenueEditorSimpleProps> = ({
  eventId,
  onSave
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTool, setActiveTool] = useState('select');
  const [elements, setElements] = useState<any[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  const tools = [
    { id: 'select', name: 'Seleccionar', icon: '↖️', shortcut: 'V' },
    { id: 'rectangle', name: 'Rectángulo', icon: '⬜', shortcut: 'R' },
    { id: 'circle', name: 'Círculo', icon: '⭕', shortcut: 'O' },
    { id: 'text', name: 'Texto', icon: '🔤', shortcut: 'T' },
    { id: 'hand', name: 'Mano', icon: '✋', shortcut: 'H' },
  ];

  const zoneTypes = [
    { id: 'general', name: 'General', color: '#3b82f6', icon: '👥' },
    { id: 'vip', name: 'VIP', color: '#fbbf24', icon: '⭐' },
    { id: 'platinum', name: 'Platinum', color: '#8b5cf6', icon: '💎' },
    { id: 'stage', name: 'Escenario', color: '#ef4444', icon: '🎭' },
    { id: 'bar', name: 'Bar', color: '#10b981', icon: '🍺' },
  ];

  // Draw canvas
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
    ctx.strokeStyle = '#ffffff15';
    ctx.lineWidth = 1;
    const gridSize = 20;

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

    // Draw elements
    elements.forEach(element => {
      ctx.fillStyle = element.color + '80';
      ctx.strokeStyle = element.color;
      ctx.lineWidth = 2;

      if (element.type === 'rectangle') {
        ctx.fillRect(element.x, element.y, element.width, element.height);
        ctx.strokeRect(element.x, element.y, element.width, element.height);
      }

      // Draw name
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(element.name, element.x + element.width / 2, element.y + element.height / 2);

      // Draw selection
      if (selectedElement === element.id) {
        ctx.strokeStyle = '#007AFF';
        ctx.lineWidth = 3;
        ctx.strokeRect(element.x, element.y, element.width, element.height);
      }
    });
  }, [elements, selectedElement]);

  // Handle mouse events
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === 'rectangle') {
      setIsDrawing(true);
      setDragStart({ x, y });
    } else if (activeTool === 'select') {
      // Find element at click position
      const clickedElement = elements.find(element => 
        x >= element.x && x <= element.x + element.width &&
        y >= element.y && y <= element.y + element.height
      );
      setSelectedElement(clickedElement?.id || null);
    }
  }, [activeTool, elements]);

  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !dragStart || activeTool !== 'rectangle') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = Math.abs(x - dragStart.x);
    const height = Math.abs(y - dragStart.y);

    if (width > 20 && height > 20) {
      const newElement = {
        id: `element-${Date.now()}`,
        type: 'rectangle',
        name: `Zona ${elements.length + 1}`,
        x: Math.min(dragStart.x, x),
        y: Math.min(dragStart.y, y),
        width,
        height,
        color: '#3b82f6',
        zoneType: 'general'
      };

      setElements(prev => [...prev, newElement]);
      setSelectedElement(newElement.id);
    }

    setIsDrawing(false);
    setDragStart(null);
  }, [isDrawing, dragStart, activeTool, elements]);

  // Update element
  const updateElement = useCallback((elementId: string, updates: any) => {
    setElements(prev => prev.map(el => 
      el.id === elementId ? { ...el, ...updates } : el
    ));
  }, []);

  // Delete element
  const deleteElement = useCallback((elementId: string) => {
    setElements(prev => prev.filter(el => el.id !== elementId));
    setSelectedElement(null);
  }, []);

  // Save
  const handleSave = useCallback(() => {
    const data = {
      eventId,
      elements,
      lastModified: new Date().toISOString()
    };
    onSave?.(data);
  }, [eventId, elements, onSave]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      switch (e.key.toLowerCase()) {
        case 'v':
          setActiveTool('select');
          break;
        case 'r':
          setActiveTool('rectangle');
          break;
        case 'delete':
        case 'backspace':
          if (selectedElement) {
            deleteElement(selectedElement);
          }
          break;
      }

      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 's':
            e.preventDefault();
            handleSave();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, deleteElement, handleSave]);

  // Redraw when elements change
  useEffect(() => {
    draw();
  }, [draw]);

  const selectedElementData = selectedElement 
    ? elements.find(el => el.id === selectedElement)
    : null;

  return (
    <div className="h-full w-full bg-[#2c2c2c] flex flex-col">
      {/* Toolbar */}
      <div className="bg-[#2c2c2c] border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Tools */}
          <div className="flex items-center gap-2">
            {tools.map(tool => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${
                  activeTool === tool.id
                    ? 'bg-white/15 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                title={`${tool.name} (${tool.shortcut})`}
              >
                <span className="text-lg">{tool.icon}</span>
              </button>
            ))}
          </div>

          {/* Title */}
          <div className="text-white font-medium">
            Editor de Venue - Estilo Figma
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium text-sm transition-colors"
            >
              💾 Guardar
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
            style={{ cursor: activeTool === 'hand' ? 'grab' : 'crosshair' }}
          />

          {/* Instructions */}
          {elements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black/60 backdrop-blur-sm rounded-xl p-8 text-center text-white max-w-md">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="text-lg font-medium mb-2">¡Comienza a diseñar!</h3>
                <p className="text-white/80 text-sm mb-4">
                  Selecciona la herramienta Rectángulo (R) y arrastra para crear tu primera zona
                </p>
                <div className="text-xs text-white/60">
                  💡 Usa <kbd className="bg-white/20 px-1 rounded">V</kbd> para seleccionar
                </div>
              </div>
            </div>
          )}

          {/* Canvas info */}
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-white/80">
            {elements.length} elementos • Herramienta: {tools.find(t => t.id === activeTool)?.name}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-[#2c2c2c] border-l border-white/10 flex flex-col">
          {/* Layers */}
          <div className="flex-1 p-4">
            <h3 className="text-white font-medium mb-4">Capas ({elements.length})</h3>
            
            {elements.length === 0 ? (
              <div className="text-center py-8 text-white/60">
                <div className="text-2xl mb-2">📄</div>
                <p className="text-sm">No hay elementos</p>
              </div>
            ) : (
              <div className="space-y-2">
                {elements.map(element => (
                  <div
                    key={element.id}
                    onClick={() => setSelectedElement(element.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedElement === element.id
                        ? 'bg-blue-600/30 border border-blue-600/50'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <span className="text-sm">
                      {zoneTypes.find(z => z.id === element.zoneType)?.icon || '📦'}
                    </span>
                    <span className="flex-1 text-white text-sm">{element.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteElement(element.id);
                      }}
                      className="p-1 hover:bg-red-500/20 rounded"
                    >
                      <span className="text-red-400">🗑️</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Properties */}
          {selectedElementData && (
            <div className="border-t border-white/10 p-4">
              <h4 className="text-white font-medium mb-4">Propiedades</h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-white/80 text-sm mb-1">Nombre</label>
                  <input
                    type="text"
                    value={selectedElementData.name}
                    onChange={(e) => updateElement(selectedElementData.id, { name: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-1">Tipo de zona</label>
                  <select
                    value={selectedElementData.zoneType}
                    onChange={(e) => {
                      const zoneType = zoneTypes.find(z => z.id === e.target.value);
                      updateElement(selectedElementData.id, { 
                        zoneType: e.target.value,
                        color: zoneType?.color || '#3b82f6'
                      });
                    }}
                    className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  >
                    {zoneTypes.map(type => (
                      <option key={type.id} value={type.id} className="bg-black">
                        {type.icon} {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/80 text-sm mb-1">Ancho</label>
                    <input
                      type="number"
                      value={Math.round(selectedElementData.width)}
                      onChange={(e) => updateElement(selectedElementData.id, { width: parseInt(e.target.value) })}
                      className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm mb-1">Alto</label>
                    <input
                      type="number"
                      value={Math.round(selectedElementData.height)}
                      onChange={(e) => updateElement(selectedElementData.id, { height: parseInt(e.target.value) })}
                      className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};