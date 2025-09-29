"use client";

import React, { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import { 
  Save, 
  ZoomIn, 
  ZoomOut, 
  Minus,
  Plus,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  Copy,
  Grid3X3,
  Move,
  Square,
  Circle,
  Type,
  Hand,
  MousePointer,
  Armchair
} from 'lucide-react';

interface Seat {
  id: string;
  row: string;
  number: number;
  x: number;
  y: number;
  zoneId: string;
  status: 'available' | 'reserved' | 'blocked';
  price?: number;
  label: string; // "A1", "B2", etc.
  notes?: string;
}

interface Element {
  id: string;
  type: 'rectangle' | 'circle' | 'text';
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  zoneType: string;
  isVisible: boolean;
  isLocked: boolean;
  capacity?: number;
  price?: number;
  seats?: Seat[];
}

interface SeatGenerationConfig {
  rows: number;
  seatsPerRow: number;
  rowSpacing: number;
  seatSpacing: number;
  startRow: string;
  startNumber: number;
  curve: number; // 0 = straight, positive = curved
  format: 'A1' | 'A-1' | 'Row A Seat 1';
}

interface FigmaVenueEditorProProps {
  eventId: string;
  onSave?: (data: any) => void;
}

export const FigmaVenueEditorPro: React.FC<FigmaVenueEditorProProps> = ({
  eventId,
  onSave
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Editor state
  const [activeTool, setActiveTool] = useState('select');
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [showLayers, setShowLayers] = useState(true);
  const [showInspector, setShowInspector] = useState(true);
  const [showSeatPanel, setShowSeatPanel] = useState(false);
  
  // Interaction state
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Canvas size
  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 800 });

  // Seat configuration
  const [seatConfig, setSeatConfig] = useState<SeatGenerationConfig>({
    rows: 5,
    seatsPerRow: 10,
    rowSpacing: 40,
    seatSpacing: 30,
    startRow: 'A',
    startNumber: 1,
    curve: 0,
    format: 'A1'
  });

  const tools = [
    { id: 'select', name: 'Seleccionar', icon: MousePointer, shortcut: 'V', cursor: 'default' },
    { id: 'rectangle', name: 'Rectángulo', icon: Square, shortcut: 'R', cursor: 'crosshair' },
    { id: 'circle', name: 'Círculo', icon: Circle, shortcut: 'O', cursor: 'crosshair' },
    { id: 'text', name: 'Texto', icon: Type, shortcut: 'T', cursor: 'text' },
    { id: 'seats', name: 'Sillas', icon: Armchair, shortcut: 'S', cursor: 'crosshair' },
    { id: 'hand', name: 'Mano', icon: Hand, shortcut: 'H', cursor: 'grab' },
  ];

  const zoneTypes = [
    { id: 'general', name: 'General', color: '#3b82f6', icon: '👥', description: 'Zona general de acceso' },
    { id: 'vip', name: 'VIP', color: '#fbbf24', icon: '⭐', description: 'Zona VIP exclusiva' },
    { id: 'platinum', name: 'Platinum', color: '#8b5cf6', icon: '💎', description: 'Zona premium platinum' },
    { id: 'stage', name: 'Escenario', color: '#ef4444', icon: '🎭', description: 'Área de presentación' },
    { id: 'bar', name: 'Bar', color: '#10b981', icon: '🍺', description: 'Zona de bar y bebidas' },
    { id: 'entrance', name: 'Entrada', color: '#6b7280', icon: '🚪', description: 'Punto de entrada' },
    { id: 'bathroom', name: 'Baños', color: '#6b7280', icon: '🚻', description: 'Servicios sanitarios' },
    { id: 'emergency', name: 'Emergencia', color: '#dc2626', icon: '🚨', description: 'Salida de emergencia' },
  ];

  // Update canvas size based on container
  useLayoutEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const leftPanelWidth = showLayers ? 320 : 0;
        const rightPanelWidth = showInspector ? 320 : 0;
        const toolbarHeight = 64;
        
        setCanvasSize({
          width: Math.max(800, rect.width - leftPanelWidth - rightPanelWidth),
          height: Math.max(600, rect.height - toolbarHeight)
        });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [showLayers, showInspector]);

  // Screen to canvas coordinates
  const screenToCanvas = useCallback((screenX: number, screenY: number) => {
    return {
      x: (screenX - panOffset.x) / zoom,
      y: (screenY - panOffset.y) / zoom
    };
  }, [zoom, panOffset]);

  // Canvas to screen coordinates
  const canvasToScreen = useCallback((canvasX: number, canvasY: number) => {
    return {
      x: canvasX * zoom + panOffset.x,
      y: canvasY * zoom + panOffset.y
    };
  }, [zoom, panOffset]);

  // Find element at point
  const getElementAtPoint = useCallback((x: number, y: number): Element | null => {
    const canvasPoint = screenToCanvas(x, y);
    
    // Check in reverse order (top to bottom)
    for (let i = elements.length - 1; i >= 0; i--) {
      const element = elements[i];
      if (!element.isVisible) continue;
      
      if (canvasPoint.x >= element.x && 
          canvasPoint.x <= element.x + element.width &&
          canvasPoint.y >= element.y && 
          canvasPoint.y <= element.y + element.height) {
        return element;
      }
    }
    return null;
  }, [elements, screenToCanvas]);

  // Find seat at point
  const getSeatAtPoint = useCallback((x: number, y: number): { element: Element; seat: Seat } | null => {
    const canvasPoint = screenToCanvas(x, y);
    
    for (let i = elements.length - 1; i >= 0; i--) {
      const element = elements[i];
      if (!element.isVisible || !element.seats) continue;
      
      for (const seat of element.seats) {
        const seatRadius = 12; // Seat radius in canvas units
        const distance = Math.sqrt(
          Math.pow(canvasPoint.x - seat.x, 2) + 
          Math.pow(canvasPoint.y - seat.y, 2)
        );
        
        if (distance <= seatRadius) {
          return { element, seat };
        }
      }
    }
    return null;
  }, [elements, screenToCanvas]);

  // Generate seat label
  const generateSeatLabel = useCallback((row: string, number: number, format: string): string => {
    switch (format) {
      case 'A-1':
        return `${row}-${number}`;
      case 'Row A Seat 1':
        return `Row ${row} Seat ${number}`;
      default:
        return `${row}${number}`;
    }
  }, []);

  // Generate seats for a zone
  const generateSeats = useCallback((element: Element, config: SeatGenerationConfig): Seat[] => {
    const seats: Seat[] = [];
    const { rows, seatsPerRow, rowSpacing, seatSpacing, startRow, startNumber, curve, format } = config;
    
    for (let row = 0; row < rows; row++) {
      const rowLetter = String.fromCharCode(startRow.charCodeAt(0) + row);
      
      for (let seat = 0; seat < seatsPerRow; seat++) {
        const seatNumber = startNumber + seat;
        
        // Calculate position
        let x = element.x + (element.width - (seatsPerRow - 1) * seatSpacing) / 2 + seat * seatSpacing;
        let y = element.y + (element.height - (rows - 1) * rowSpacing) / 2 + row * rowSpacing;
        
        // Apply curve if specified
        if (curve > 0) {
          const centerSeat = (seatsPerRow - 1) / 2;
          const distanceFromCenter = seat - centerSeat;
          const curveOffset = Math.pow(distanceFromCenter, 2) * curve * 0.1;
          y += curveOffset;
        }
        
        const seatId = `seat-${element.id}-${rowLetter}${seatNumber}`;
        const label = generateSeatLabel(rowLetter, seatNumber, format);
        
        seats.push({
          id: seatId,
          row: rowLetter,
          number: seatNumber,
          x,
          y,
          zoneId: element.id,
          status: 'available',
          label,
          price: element.price
        });
      }
    }
    
    return seats;
  }, [generateSeatLabel]);

  // Draw everything
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    // Clear with dark background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Save context and apply zoom/pan
    ctx.save();
    ctx.translate(panOffset.x, panOffset.y);
    ctx.scale(zoom, zoom);

    // Draw grid
    if (showGrid) {
      drawGrid(ctx);
    }

    // Draw elements and their seats
    elements.forEach(element => {
      if (element.isVisible) {
        drawElement(ctx, element);
        
        // Draw seats if they exist
        if (element.seats && element.seats.length > 0) {
          drawSeats(ctx, element);
        }
      }
    });

    ctx.restore();

    // Draw UI overlays (selection handles, etc.)
    drawUIOverlays(ctx);

  }, [canvasSize, panOffset, zoom, showGrid, elements, selectedElement]);

  const drawGrid = useCallback((ctx: CanvasRenderingContext2D) => {
    const gridSize = 20;
    const viewportWidth = canvasSize.width / zoom;
    const viewportHeight = canvasSize.height / zoom;
    const startX = Math.floor(-panOffset.x / zoom / gridSize) * gridSize;
    const startY = Math.floor(-panOffset.y / zoom / gridSize) * gridSize;

    ctx.strokeStyle = zoom > 0.5 ? '#ffffff08' : '#ffffff04';
    ctx.lineWidth = 1 / zoom;

    // Vertical lines
    for (let x = startX; x < startX + viewportWidth + gridSize; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, startY);
      ctx.lineTo(x, startY + viewportHeight + gridSize);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = startY; y < startY + viewportHeight + gridSize; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(startX + viewportWidth + gridSize, y);
      ctx.stroke();
    }
  }, [canvasSize, zoom, panOffset]);

  const drawElement = useCallback((ctx: CanvasRenderingContext2D, element: Element) => {
    // Set styles
    ctx.fillStyle = element.color + '80'; // Add transparency
    ctx.strokeStyle = element.color;
    ctx.lineWidth = 2 / zoom;

    // Draw shape
    if (element.type === 'rectangle') {
      ctx.fillRect(element.x, element.y, element.width, element.height);
      ctx.strokeRect(element.x, element.y, element.width, element.height);
    } else if (element.type === 'circle') {
      ctx.beginPath();
      ctx.ellipse(
        element.x + element.width / 2,
        element.y + element.height / 2,
        element.width / 2,
        element.height / 2,
        0, 0, 2 * Math.PI
      );
      ctx.fill();
      ctx.stroke();
    }

    // Draw label if element is large enough and no seats
    if (element.width * zoom > 60 && element.height * zoom > 30 && (!element.seats || element.seats.length === 0)) {
      ctx.fillStyle = '#ffffff';
      ctx.font = `${Math.max(12, 14 / zoom)}px Inter, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const centerX = element.x + element.width / 2;
      const centerY = element.y + element.height / 2;
      
      // Draw zone type icon
      ctx.font = `${Math.max(16, 18 / zoom)}px system-ui`;
      const zoneType = zoneTypes.find(z => z.id === element.zoneType);
      if (zoneType) {
        ctx.fillText(zoneType.icon, centerX, centerY - 10 / zoom);
      }
      
      // Draw name
      ctx.font = `${Math.max(10, 12 / zoom)}px Inter, system-ui, sans-serif`;
      ctx.fillText(element.name, centerX, centerY + 8 / zoom);
    }
  }, [zoom, zoneTypes]);

  const drawSeats = useCallback((ctx: CanvasRenderingContext2D, element: Element) => {
    if (!element.seats) return;

    element.seats.forEach(seat => {
      const seatRadius = Math.max(4, 12 / zoom);
      const isSelected = selectedSeats.includes(seat.id);
      
      // Seat color based on status
      let fillColor = element.color;
      if (seat.status === 'reserved') fillColor = '#6b7280';
      else if (seat.status === 'blocked') fillColor = '#ef4444';
      else if (isSelected) fillColor = '#007AFF';
      
      // Draw seat circle
      ctx.fillStyle = fillColor;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1 / zoom;
      
      ctx.beginPath();
      ctx.arc(seat.x, seat.y, seatRadius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      
      // Draw seat label if zoomed in enough
      if (zoom > 1 && seatRadius > 8) {
        ctx.fillStyle = '#ffffff';
        ctx.font = `${Math.max(6, 8 / zoom)}px Inter, system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(seat.label, seat.x, seat.y);
      }
      
      // Draw selection indicator
      if (isSelected) {
        ctx.strokeStyle = '#007AFF';
        ctx.lineWidth = 2 / zoom;
        ctx.beginPath();
        ctx.arc(seat.x, seat.y, seatRadius + 3 / zoom, 0, 2 * Math.PI);
        ctx.stroke();
      }
    });
  }, [zoom, selectedSeats]);

  const drawUIOverlays = useCallback((ctx: CanvasRenderingContext2D) => {
    if (!selectedElement) return;

    const element = elements.find(e => e.id === selectedElement);
    if (!element || !element.isVisible) return;

    const screenPos = canvasToScreen(element.x, element.y);
    const screenWidth = element.width * zoom;
    const screenHeight = element.height * zoom;

    // Selection border
    ctx.strokeStyle = '#007AFF';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.strokeRect(screenPos.x, screenPos.y, screenWidth, screenHeight);

    // Resize handles
    const handleSize = 8;
    const handles = [
      { x: screenPos.x, y: screenPos.y }, // top-left
      { x: screenPos.x + screenWidth, y: screenPos.y }, // top-right
      { x: screenPos.x, y: screenPos.y + screenHeight }, // bottom-left
      { x: screenPos.x + screenWidth, y: screenPos.y + screenHeight }, // bottom-right
    ];

    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#007AFF';
    ctx.lineWidth = 1;

    handles.forEach(handle => {
      ctx.fillRect(handle.x - handleSize/2, handle.y - handleSize/2, handleSize, handleSize);
      ctx.strokeRect(handle.x - handleSize/2, handle.y - handleSize/2, handleSize, handleSize);
    });
  }, [selectedElement, elements, canvasToScreen, zoom]);

  // Mouse event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === 'hand') {
      setIsPanning(true);
      setDragStart({ x: x - panOffset.x, y: y - panOffset.y });
    } else if (activeTool === 'select') {
      // First check if clicking on a seat
      const clickedSeat = getSeatAtPoint(x, y);
      
      if (clickedSeat) {
        // Handle seat selection
        if (e.shiftKey || e.ctrlKey) {
          // Multi-select seats
          setSelectedSeats(prev => 
            prev.includes(clickedSeat.seat.id) 
              ? prev.filter(id => id !== clickedSeat.seat.id)
              : [...prev, clickedSeat.seat.id]
          );
        } else {
          setSelectedSeats([clickedSeat.seat.id]);
        }
        setSelectedElement(null);
      } else {
        // Check for elements
        const clickedElement = getElementAtPoint(x, y);
        
        if (clickedElement) {
          setSelectedElement(clickedElement.id);
          setSelectedSeats([]);
          setIsDragging(true);
          const canvasPoint = screenToCanvas(x, y);
          setDragOffset({
            x: canvasPoint.x - clickedElement.x,
            y: canvasPoint.y - clickedElement.y
          });
        } else {
          setSelectedElement(null);
          setSelectedSeats([]);
        }
      }
      
      setDragStart({ x, y });
    } else if (activeTool === 'seats') {
      // Handle seat tool - show seat panel
      setShowSeatPanel(true);
      setDragStart({ x, y });
    } else if (activeTool === 'rectangle' || activeTool === 'circle') {
      setIsDrawing(true);
      setDragStart({ x, y });
    }
  }, [activeTool, getElementAtPoint, getSeatAtPoint, screenToCanvas, panOffset]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isPanning && dragStart) {
      setPanOffset({
        x: x - dragStart.x,
        y: y - dragStart.y
      });
    } else if (isDragging && selectedElement && dragStart) {
      const canvasPoint = screenToCanvas(x, y);
      const newX = canvasPoint.x - dragOffset.x;
      const newY = canvasPoint.y - dragOffset.y;
      
      updateElement(selectedElement, { x: newX, y: newY });
    }
  }, [isPanning, isDragging, selectedElement, dragStart, dragOffset, screenToCanvas]);

  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isDrawing && dragStart && (activeTool === 'rectangle' || activeTool === 'circle')) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const canvasStart = screenToCanvas(dragStart.x, dragStart.y);
      const canvasEnd = screenToCanvas(x, y);

      const width = Math.abs(canvasEnd.x - canvasStart.x);
      const height = Math.abs(canvasEnd.y - canvasStart.y);

      if (width > 20 && height > 20) {
        const newElement: Element = {
          id: `element-${Date.now()}`,
          type: activeTool as 'rectangle' | 'circle',
          name: `${activeTool === 'rectangle' ? 'Zona' : 'Área'} ${elements.length + 1}`,
          x: Math.min(canvasStart.x, canvasEnd.x),
          y: Math.min(canvasStart.y, canvasEnd.y),
          width,
          height,
          color: '#3b82f6',
          zoneType: 'general',
          isVisible: true,
          isLocked: false
        };

        setElements(prev => [...prev, newElement]);
        setSelectedElement(newElement.id);
      }
    }

    setIsDrawing(false);
    setIsDragging(false);
    setIsPanning(false);
    setDragStart(null);
  }, [isDrawing, dragStart, activeTool, elements, screenToCanvas, setElements, setSelectedElement]);

  // Zoom controls
  const handleZoom = useCallback((delta: number, centerX?: number, centerY?: number) => {
    const newZoom = Math.max(0.1, Math.min(10, zoom + delta));
    
    if (centerX !== undefined && centerY !== undefined) {
      // Zoom towards mouse position
      const factor = newZoom / zoom;
      setPanOffset(prev => ({
        x: centerX - (centerX - prev.x) * factor,
        y: centerY - (centerY - prev.y) * factor
      }));
    }
    
    setZoom(newZoom);
  }, [zoom]);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const centerX = e.clientX - rect.left;
        const centerY = e.clientY - rect.top;
        handleZoom(-e.deltaY * 0.001, centerX, centerY);
      }
    }
  }, [handleZoom]);

  // Element operations
  const updateElement = useCallback((elementId: string, updates: Partial<Element>) => {
    setElements(prev => prev.map(el => 
      el.id === elementId ? { ...el, ...updates } : el
    ));
  }, []);

  // Generate seats for selected element
  const generateSeatsForElement = useCallback((elementId: string) => {
    const element = elements.find(el => el.id === elementId);
    if (!element) return;

    const seats = generateSeats(element, seatConfig);
    updateElement(elementId, { seats });
    setShowSeatPanel(false);
  }, [elements, seatConfig, generateSeats, updateElement, setShowSeatPanel]);

  const deleteElement = useCallback((elementId: string) => {
    setElements(prev => prev.filter(el => el.id !== elementId));
    if (selectedElement === elementId) {
      setSelectedElement(null);
    }
  }, [selectedElement, setElements, setSelectedElement]);

  const duplicateElement = useCallback((elementId: string) => {
    const element = elements.find(el => el.id === elementId);
    if (element) {
      const newElement = {
        ...element,
        id: `element-${Date.now()}`,
        name: `${element.name} Copy`,
        x: element.x + 20,
        y: element.y + 20
      };
      setElements(prev => [...prev, newElement]);
      setSelectedElement(newElement.id);
    }
  }, [elements, setElements, setSelectedElement]);

  // Save function
  const handleSave = useCallback(() => {
    const data = {
      eventId,
      elements,
      viewport: { zoom, panOffset },
      lastModified: new Date().toISOString()
    };
    onSave?.(data);
  }, [eventId, elements, zoom, panOffset, onSave]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      // Tool shortcuts
      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        switch (e.key.toLowerCase()) {
          case 'v': setActiveTool('select'); break;
          case 'r': setActiveTool('rectangle'); break;
          case 'o': setActiveTool('circle'); break;
          case 't': setActiveTool('text'); break;
          case 's': setActiveTool('seats'); break;
          case 'h': setActiveTool('hand'); break;
          case 'delete':
          case 'backspace':
            if (selectedElement) {
              deleteElement(selectedElement);
            }
            break;
          case 'escape':
            setSelectedElement(null);
            setActiveTool('select');
            break;
        }
      }

      // Modifier shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'd':
            e.preventDefault();
            if (selectedElement) {
              duplicateElement(selectedElement);
            }
            break;
          case 'a':
            e.preventDefault();
            // Select all elements
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, deleteElement, duplicateElement, handleSave]);

  // Redraw when needed
  useEffect(() => {
    draw();
  }, [draw]);

  const selectedElementData = selectedElement 
    ? elements.find(el => el.id === selectedElement)
    : null;

  const currentTool = tools.find(t => t.id === activeTool);

  return (
    <div ref={containerRef} className="h-full w-full bg-[#2c2c2c] flex flex-col overflow-hidden">
      {/* Top Toolbar */}
      <div className="bg-[#2c2c2c] border-b border-white/10 px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left - Tools */}
          <div className="flex items-center gap-2">
            {tools.map(tool => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className={`group relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${
                    activeTool === tool.id
                      ? 'bg-white/15 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  title={`${tool.name} (${tool.shortcut})`}
                >
                  <Icon size={18} />
                  
                  {/* Tooltip */}
                  <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {tool.name}
                    <span className="ml-2 text-white/60">{tool.shortcut}</span>
                  </div>
                </button>
              );
            })}
            
            <div className="w-px h-6 bg-white/20 mx-3" />
            
            {/* Grid toggle */}
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${
                showGrid ? 'bg-white/15 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              title="Toggle Grid"
            >
              <Grid3X3 size={18} />
            </button>
          </div>

          {/* Center - Project Info */}
          <div className="flex items-center gap-4">
            <div className="text-white font-medium text-lg">
              Editor de Venue
            </div>
            
            {/* Zoom controls */}
            <div className="flex items-center gap-2 bg-black/20 rounded-lg px-3 py-1">
              <button
                onClick={() => handleZoom(-0.1)}
                className="p-1 hover:bg-white/20 rounded text-white/70 hover:text-white"
              >
                <Minus size={14} />
              </button>
              
              <button
                onClick={() => {
                  setZoom(1);
                  setPanOffset({ x: 0, y: 0 });
                }}
                className="px-3 py-1 text-white/80 hover:text-white text-sm font-mono transition-colors min-w-[60px]"
              >
                {Math.round(zoom * 100)}%
              </button>
              
              <button
                onClick={() => handleZoom(0.1)}
                className="p-1 hover:bg-white/20 rounded text-white/70 hover:text-white"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Right - View controls and save */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLayers(!showLayers)}
              className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${
                showLayers ? 'bg-white/15 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              title="Toggle Layers"
            >
              <div className="flex flex-col gap-0.5">
                <div className="w-3 h-0.5 bg-current rounded"></div>
                <div className="w-3 h-0.5 bg-current rounded"></div>
                <div className="w-3 h-0.5 bg-current rounded"></div>
              </div>
            </button>
            
            <button
              onClick={() => setShowInspector(!showInspector)}
              className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${
                showInspector ? 'bg-white/15 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              title="Toggle Inspector"
            >
              <div className="grid grid-cols-2 gap-0.5">
                <div className="w-1 h-1 bg-current rounded-full"></div>
                <div className="w-1 h-1 bg-current rounded-full"></div>
                <div className="w-1 h-1 bg-current rounded-full"></div>
                <div className="w-1 h-1 bg-current rounded-full"></div>
              </div>
            </button>

            <div className="w-px h-6 bg-white/20 mx-3" />

            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] rounded-lg transition-all duration-300 text-white font-medium shadow-lg shadow-blue-600/25"
            >
              <Save size={16} />
              Guardar
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Layers */}
        {showLayers && (
          <div className="w-80 bg-[#2c2c2c] border-r border-white/10 flex flex-col">
            <div className="p-4 border-b border-white/10">
              <h3 className="text-white font-medium text-lg mb-3">Capas</h3>
              <div className="text-white/60 text-sm">
                {elements.length} elementos
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {elements.length === 0 ? (
                <div className="text-center py-12 text-white/60">
                  <div className="text-4xl mb-4">📄</div>
                  <p className="text-sm">No hay elementos</p>
                  <p className="text-xs mt-2 text-white/40">
                    Usa las herramientas para crear
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {elements.slice().reverse().map((element) => {
                    const zoneType = zoneTypes.find(z => z.id === element.zoneType);
                    const isSelected = selectedElement === element.id;
                    
                    return (
                      <div
                        key={element.id}
                        onClick={() => setSelectedElement(element.id)}
                        className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? 'bg-blue-600/30 border border-blue-600/50'
                            : 'hover:bg-white/5'
                        }`}
                      >
                        <span className="text-lg">{zoneType?.icon || '📦'}</span>
                        
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-sm font-medium truncate">
                            {element.name}
                          </div>
                          <div className="text-white/60 text-xs">
                            {Math.round(element.width)} × {Math.round(element.height)}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateElement(element.id, { isVisible: !element.isVisible });
                            }}
                            className="p-1 hover:bg-white/20 rounded"
                          >
                            {element.isVisible ? 
                              <Eye size={14} className="text-white/60" /> : 
                              <EyeOff size={14} className="text-white/40" />
                            }
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              duplicateElement(element.id);
                            }}
                            className="p-1 hover:bg-white/20 rounded"
                          >
                            <Copy size={14} className="text-white/60" />
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteElement(element.id);
                            }}
                            className="p-1 hover:bg-red-500/20 rounded"
                          >
                            <Trash2 size={14} className="text-red-400" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Center - Canvas */}
        <div className="flex-1 relative bg-[#1a1a1a] overflow-hidden">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={handleWheel}
            className="w-full h-full"
            style={{ cursor: currentTool?.cursor || 'default' }}
          />

          {/* Canvas overlay info */}
          <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2 text-sm text-white/80 font-mono">
            {Math.round(zoom * 100)}% • {elements.length} elementos • {currentTool?.name}
          </div>

          {/* Welcome message */}
          {elements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-8 text-center text-white max-w-lg">
                <div className="text-6xl mb-6">🎨</div>
                <h3 className="text-2xl font-semibold mb-4">¡Comienza a diseñar tu venue!</h3>
                <p className="text-white/80 text-base mb-6 leading-relaxed">
                  Selecciona la herramienta <strong>Rectángulo (R)</strong> y arrastra para crear tu primera zona.
                  Usa <strong>V</strong> para seleccionar y editar elementos.
                </p>
                <div className="text-sm text-white/60 space-y-2">
                  <div>💡 <strong>R</strong> - Crear rectángulos</div>
                  <div>💡 <strong>V</strong> - Seleccionar elementos</div>
                  <div>💡 <strong>H</strong> - Mover la vista</div>
                  <div>💡 <strong>Ctrl+S</strong> - Guardar</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Inspector */}
        {showInspector && (
          <div className="w-80 bg-[#2c2c2c] border-l border-white/10 flex flex-col">
            {selectedElementData ? (
              <>
                <div className="p-4 border-b border-white/10">
                  <h3 className="text-white font-medium text-lg mb-3">Propiedades</h3>
                  <div className="text-white/60 text-sm">
                    {selectedElementData.name}
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Nombre</label>
                    <input
                      type="text"
                      value={selectedElementData.name}
                      onChange={(e) => updateElement(selectedElementData.id, { name: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 focus:bg-white/15 transition-all"
                    />
                  </div>

                  {/* Zone Type */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Tipo de zona</label>
                    <select
                      value={selectedElementData.zoneType}
                      onChange={(e) => {
                        const zoneType = zoneTypes.find(z => z.id === e.target.value);
                        updateElement(selectedElementData.id, { 
                          zoneType: e.target.value,
                          color: zoneType?.color || '#3b82f6'
                        });
                      }}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 focus:bg-white/15 transition-all"
                    >
                      {zoneTypes.map(type => (
                        <option key={type.id} value={type.id} className="bg-[#1e1e1e] text-white">
                          {type.icon} {type.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-white/50 text-xs mt-1">
                      {zoneTypes.find(z => z.id === selectedElementData.zoneType)?.description}
                    </p>
                  </div>

                  {/* Transform */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-3">Transformación</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-white/60 text-xs mb-1">X</label>
                        <input
                          type="number"
                          value={Math.round(selectedElementData.x)}
                          onChange={(e) => updateElement(selectedElementData.id, { x: parseInt(e.target.value) || 0 })}
                          className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-white/60 text-xs mb-1">Y</label>
                        <input
                          type="number"
                          value={Math.round(selectedElementData.y)}
                          onChange={(e) => updateElement(selectedElementData.id, { y: parseInt(e.target.value) || 0 })}
                          className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-white/60 text-xs mb-1">Ancho</label>
                        <input
                          type="number"
                          value={Math.round(selectedElementData.width)}
                          onChange={(e) => updateElement(selectedElementData.id, { width: Math.max(20, parseInt(e.target.value) || 20) })}
                          className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-white/60 text-xs mb-1">Alto</label>
                        <input
                          type="number"
                          value={Math.round(selectedElementData.height)}
                          onChange={(e) => updateElement(selectedElementData.id, { height: Math.max(20, parseInt(e.target.value) || 20) })}
                          className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Zone Properties */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-3">Propiedades de zona</label>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-white/60 text-xs mb-1">Capacidad</label>
                        <input
                          type="number"
                          value={selectedElementData.capacity || ''}
                          onChange={(e) => updateElement(selectedElementData.id, { capacity: parseInt(e.target.value) || undefined })}
                          placeholder="Sin límite"
                          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-white/60 text-xs mb-1">Precio ($)</label>
                        <input
                          type="number"
                          value={selectedElementData.price || ''}
                          onChange={(e) => updateElement(selectedElementData.id, { price: parseFloat(e.target.value) || undefined })}
                          placeholder="0.00"
                          step="0.01"
                          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Seat Management */}
                  <div className="bg-white/5 rounded-lg p-3">
                    <h5 className="text-white/80 text-sm font-medium mb-3">Gestión de Sillas</h5>
                    {selectedElementData.seats && selectedElementData.seats.length > 0 ? (
                      <div className="space-y-3">
                        <div className="text-white/60 text-sm">
                          {selectedElementData.seats.length} sillas configuradas
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center">
                            <div className="text-green-400 font-medium">
                              {selectedElementData.seats.filter(s => s.status === 'available').length}
                            </div>
                            <div className="text-white/60">Disponibles</div>
                          </div>
                          <div className="text-center">
                            <div className="text-yellow-400 font-medium">
                              {selectedElementData.seats.filter(s => s.status === 'reserved').length}
                            </div>
                            <div className="text-white/60">Reservadas</div>
                          </div>
                          <div className="text-center">
                            <div className="text-red-400 font-medium">
                              {selectedElementData.seats.filter(s => s.status === 'blocked').length}
                            </div>
                            <div className="text-white/60">Bloqueadas</div>
                          </div>
                        </div>
                        <button
                          onClick={() => updateElement(selectedElementData.id, { seats: [] })}
                          className="w-full py-2 px-3 bg-red-600/20 hover:bg-red-600/30 rounded-lg text-red-400 text-sm transition-colors"
                        >
                          Eliminar todas las sillas
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="text-white/60 text-sm">
                          No hay sillas configuradas
                        </div>
                        <button
                          onClick={() => setShowSeatPanel(true)}
                          className="w-full py-2 px-3 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg text-blue-400 text-sm transition-colors"
                        >
                          <Armchair size={16} className="inline mr-2" />
                          Agregar Sillas
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <button
                      onClick={() => duplicateElement(selectedElementData.id)}
                      className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-colors"
                    >
                      <Copy size={16} />
                      Duplicar elemento
                    </button>
                    
                    <button
                      onClick={() => deleteElement(selectedElementData.id)}
                      className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-600/20 hover:bg-red-600/30 rounded-lg text-red-400 text-sm font-medium transition-colors"
                    >
                      <Trash2 size={16} />
                      Eliminar elemento
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center text-white/60">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-lg font-medium text-white mb-2">Nada seleccionado</h3>
                  <p className="text-sm leading-relaxed">
                    Selecciona un elemento para ver y editar sus propiedades
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Seat Configuration Panel */}
      {showSeatPanel && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#2c2c2c] border border-white/20 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-lg">Configurar Sillas</h3>
              <button
                onClick={() => setShowSeatPanel(false)}
                className="text-white/60 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Row and seat configuration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Filas</label>
                  <input
                    type="number"
                    value={seatConfig.rows}
                    onChange={(e) => setSeatConfig(prev => ({ ...prev, rows: parseInt(e.target.value) || 1 }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                    min="1"
                    max="50"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Sillas por fila</label>
                  <input
                    type="number"
                    value={seatConfig.seatsPerRow}
                    onChange={(e) => setSeatConfig(prev => ({ ...prev, seatsPerRow: parseInt(e.target.value) || 1 }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                    min="1"
                    max="50"
                  />
                </div>
              </div>

              {/* Spacing */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Espacio entre filas</label>
                  <input
                    type="number"
                    value={seatConfig.rowSpacing}
                    onChange={(e) => setSeatConfig(prev => ({ ...prev, rowSpacing: parseInt(e.target.value) || 20 }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                    min="20"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Espacio entre sillas</label>
                  <input
                    type="number"
                    value={seatConfig.seatSpacing}
                    onChange={(e) => setSeatConfig(prev => ({ ...prev, seatSpacing: parseInt(e.target.value) || 20 }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                    min="15"
                    max="60"
                  />
                </div>
              </div>

              {/* Start row and number */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Fila inicial</label>
                  <input
                    type="text"
                    value={seatConfig.startRow}
                    onChange={(e) => setSeatConfig(prev => ({ ...prev, startRow: e.target.value.toUpperCase().substr(0, 1) || 'A' }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                    maxLength={1}
                    placeholder="A"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Número inicial</label>
                  <input
                    type="number"
                    value={seatConfig.startNumber}
                    onChange={(e) => setSeatConfig(prev => ({ ...prev, startNumber: parseInt(e.target.value) || 1 }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                    min="1"
                  />
                </div>
              </div>

              {/* Curve and format */}
              <div>
                <label className="block text-white/80 text-sm mb-2">Curvatura (0 = recto)</label>
                <input
                  type="range"
                  value={seatConfig.curve}
                  onChange={(e) => setSeatConfig(prev => ({ ...prev, curve: parseFloat(e.target.value) }))}
                  className="w-full"
                  min="0"
                  max="5"
                  step="0.1"
                />
                <div className="text-white/60 text-xs mt-1">
                  {seatConfig.curve === 0 ? 'Filas rectas' : `Curvatura: ${seatConfig.curve}`}
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">Formato de numeración</label>
                <select
                  value={seatConfig.format}
                  onChange={(e) => setSeatConfig(prev => ({ ...prev, format: e.target.value as any }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="A1" className="bg-[#1e1e1e]">A1, A2, A3...</option>
                  <option value="A-1" className="bg-[#1e1e1e]">A-1, A-2, A-3...</option>
                  <option value="Row A Seat 1" className="bg-[#1e1e1e]">Row A Seat 1, Row A Seat 2...</option>
                </select>
              </div>

              {/* Preview */}
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-white/80 text-sm mb-2">Vista previa:</div>
                <div className="text-white text-xs font-mono">
                  {generateSeatLabel(seatConfig.startRow, seatConfig.startNumber, seatConfig.format)}, {' '}
                  {generateSeatLabel(seatConfig.startRow, seatConfig.startNumber + 1, seatConfig.format)}, {' '}
                  {generateSeatLabel(String.fromCharCode(seatConfig.startRow.charCodeAt(0) + 1), seatConfig.startNumber, seatConfig.format)}...
                </div>
                <div className="text-white/60 text-xs mt-2">
                  Total: {seatConfig.rows * seatConfig.seatsPerRow} sillas
                </div>
              </div>

              {/* Templates */}
              <div>
                <label className="block text-white/80 text-sm mb-2">Templates rápidos</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSeatConfig(prev => ({ ...prev, rows: 8, seatsPerRow: 12, curve: 0.5, rowSpacing: 35, seatSpacing: 28 }))}
                    className="py-2 px-3 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg text-blue-400 text-xs transition-colors"
                  >
                    🎭 Teatro
                  </button>
                  <button
                    onClick={() => setSeatConfig(prev => ({ ...prev, rows: 15, seatsPerRow: 20, curve: 1.5, rowSpacing: 30, seatSpacing: 25 }))}
                    className="py-2 px-3 bg-green-600/20 hover:bg-green-600/30 rounded-lg text-green-400 text-xs transition-colors"
                  >
                    🏟️ Estadio
                  </button>
                  <button
                    onClick={() => setSeatConfig(prev => ({ ...prev, rows: 5, seatsPerRow: 8, curve: 0, rowSpacing: 40, seatSpacing: 35 }))}
                    className="py-2 px-3 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg text-purple-400 text-xs transition-colors"
                  >
                    🎪 Íntimo
                  </button>
                  <button
                    onClick={() => setSeatConfig(prev => ({ ...prev, rows: 12, seatsPerRow: 16, curve: 0.8, rowSpacing: 32, seatSpacing: 26 }))}
                    className="py-2 px-3 bg-yellow-600/20 hover:bg-yellow-600/30 rounded-lg text-yellow-400 text-xs transition-colors"
                  >
                    🎤 Concierto
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowSeatPanel(false)}
                className="flex-1 py-2 px-4 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (selectedElement) {
                    generateSeatsForElement(selectedElement);
                  }
                }}
                disabled={!selectedElement}
                className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg text-white text-sm font-medium transition-colors disabled:cursor-not-allowed"
              >
                Generar Sillas
              </button>
            </div>

            {!selectedElement && (
              <div className="mt-4 p-3 bg-yellow-600/20 border border-yellow-600/50 rounded-lg">
                <div className="text-yellow-400 text-sm">
                  💡 Selecciona primero una zona para agregar sillas
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};