"use client";

import { useState, useEffect } from "react";

interface EventMapTabProps {
  eventId: string | string[];
  activeTab: string;
}

export default function EventMapTab({ eventId, activeTab }: EventMapTabProps) {
  // Map editor states
  const [selectedTool, setSelectedTool] = useState('select');
  const [mapElements, setMapElements] = useState([
    { id: 'stage', type: 'stage', x: 300, y: 50, width: 400, height: 60, name: 'ESCENARIO' },
    { id: 'general', type: 'zone', x: 100, y: 200, width: 300, height: 150, name: 'General', color: '#3b82f6', seats: 96 },
    { id: 'vip', type: 'zone', x: 500, y: 150, width: 200, height: 100, name: 'VIP', color: '#fbbf24', seats: 80 },
    { id: 'platinum', type: 'zone', x: 500, y: 300, width: 150, height: 80, name: 'Platinum', color: '#8b5cf6', seats: 40 }
  ]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [elementStartPos, setElementStartPos] = useState({ x: 0, y: 0 });

  // Categories and pricing system
  const [categories] = useState([
    { id: 'general', name: 'General', color: '#3b82f6', price: 0 },
    { id: 'silver', name: 'Silver', color: '#9ca3af', price: 0 },
    { id: 'gold', name: 'Gold', color: '#fbbf24', price: 0 },
    { id: 'platinum', name: 'Platinum', color: '#8b5cf6', price: 0 },
    { id: 'vip', name: 'VIP', color: '#ef4444', price: 0 },
    { id: 'accessibility', name: 'Accesibilidad', color: '#06b6d4', price: 0 }
  ]);

  // Seat states
  const seatStates = {
    available: { name: 'Disponible', color: '#10b981' },
    reserved: { name: 'Reservado', color: '#f59e0b' },
    sold: { name: 'Vendido', color: '#ef4444' },
    blocked: { name: 'Bloqueado', color: '#6b7280' },
    wheelchair: { name: 'Silla de Ruedas', color: '#06b6d4' }
  };

  // Utility function for category colors
  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : '#3b82f6';
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'General';
  };

  // Auto-numbering utility functions
  const generateRowLabel = (rowIndex: number) => {
    if (rowIndex < 26) {
      return String.fromCharCode(65 + rowIndex); // A-Z
    } else {
      const firstLetter = String.fromCharCode(65 + Math.floor(rowIndex / 26) - 1);
      const secondLetter = String.fromCharCode(65 + (rowIndex % 26));
      return firstLetter + secondLetter; // AA, AB, AC...
    }
  };

  const generateSeatNumber = (seatIndex: number, isEvenOdd = false, direction = 'left-to-right') => {
    if (isEvenOdd) {
      // Odd numbers on left, even on right (common in theaters)
      return seatIndex % 2 === 0 ? seatIndex + 1 : seatIndex + 2;
    } else {
      // Sequential numbering
      return direction === 'left-to-right' ? seatIndex + 1 : seatIndex + 1;
    }
  };

  // Auto-update row names when creating multiple rows
  const updateRowNaming = () => {
    const rowElements = mapElements.filter(el => el.type === 'row');
    const updatedElements = mapElements.map(element => {
      if (element.type === 'row') {
        const rowIndex = rowElements.findIndex(row => row.id === element.id);
        const newName = `Fila ${generateRowLabel(rowIndex)}`;
        return { ...element, name: newName };
      }
      return element;
    });
    setMapElements(updatedElements);
  };

  // Funciones del editor de mapas
  const handleCanvasClick = (event: any) => {
    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 1000;
    const y = ((event.clientY - rect.top) / rect.height) * 600;

    if (selectedTool === 'select') {
      // Deselect current element when clicking on empty space
      setSelectedElement(null);
      return;
    }

    let newElement: any = null;

    switch (selectedTool) {
      case 'rectangle':
        newElement = {
          id: `zone-${Date.now()}`,
          type: 'zone',
          x: Math.round(x - 50),
          y: Math.round(y - 25),
          width: 100,
          height: 50,
          name: 'Nueva Zona',
          color: '#3b82f6',
          seats: 0
        };
        break;

      case 'circle':
        newElement = {
          id: `zone-circle-${Date.now()}`,
          type: 'zone',
          x: Math.round(x - 50),
          y: Math.round(y - 50),
          width: 100,
          height: 100,
          name: 'Zona Circular',
          color: '#8b5cf6',
          seats: 0,
          shape: 'circle'
        };
        break;

      case 'stage':
        newElement = {
          id: `stage-${Date.now()}`,
          type: 'stage',
          x: Math.round(x - 100),
          y: Math.round(y - 30),
          width: 200,
          height: 60,
          name: 'Escenario'
        };
        break;

      case 'seat':
        newElement = {
          id: `seat-${Date.now()}`,
          type: 'seat',
          x: Math.round(x),
          y: Math.round(y),
          width: 14,
          height: 12,
          name: 'Asiento'
        };
        break;

      case 'row':
        const existingRows = mapElements.filter(el => el.type === 'row');
        const rowIndex = existingRows.length;
        const rowLabel = generateRowLabel(rowIndex);
        
        newElement = {
          id: `row-${Date.now()}`,
          type: 'row',
          x: Math.round(x - 80),
          y: Math.round(y - 6),
          width: 160,
          height: 12,
          name: `Fila ${rowLabel}`,
          seats: 10,
          rowCount: 1,
          seatsPerRow: 10,
          seatSpacing: 16,
          rowSpacing: 18,
          rowLetter: rowLabel,
          numberingDirection: 'left-to-right',
          isEvenOdd: false
        };
        break;

      case 'block':
        newElement = {
          id: `block-${Date.now()}`,
          type: 'block',
          x: Math.round(x - 55),
          y: Math.round(y - 25),
          width: 110,
          height: 50,
          name: 'Bloque VIP',
          seats: 40
        };
        break;

      case 'entrance':
        newElement = {
          id: `entrance-${Date.now()}`,
          type: 'entrance',
          x: Math.round(x),
          y: Math.round(y),
          width: 30,
          height: 30,
          name: 'Entrada'
        };
        break;

      case 'bathroom':
        newElement = {
          id: `bathroom-${Date.now()}`,
          type: 'bathroom',
          x: Math.round(x),
          y: Math.round(y),
          width: 40,
          height: 30,
          name: 'Baño'
        };
        break;

      case 'table':
        newElement = {
          id: `table-${Date.now()}`,
          type: 'table',
          x: Math.round(x),
          y: Math.round(y),
          radius: 40,
          name: 'Mesa 1',
          seats: 8,
          tableNumber: 1,
          seatsAroundTable: [
            { angle: 0, occupied: false },
            { angle: 45, occupied: false },
            { angle: 90, occupied: false },
            { angle: 135, occupied: false },
            { angle: 180, occupied: false },
            { angle: 225, occupied: false },
            { angle: 270, occupied: false },
            { angle: 315, occupied: false }
          ]
        };
        break;

      case 'section':
        newElement = {
          id: `section-${Date.now()}`,
          type: 'section',
          x: Math.round(x - 100),
          y: Math.round(y - 50),
          width: 200,
          height: 100,
          name: 'Sección A',
          category: 'general',
          totalSeats: 0,
          isGeneralAdmission: true,
          capacity: 100,
          elements: [] // Will contain child elements (rows, seats, etc.)
        };
        break;

      default:
        break;
    }

    if (newElement) {
      setMapElements([...mapElements, newElement]);
      setSelectedElement(newElement.id);
      setSelectedTool('select'); // Auto-switch to select tool after creating element
    }
  };

  const handleMouseMove = (event: any) => {
    if (!isDragging || !selectedElement) return;

    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const currentX = ((event.clientX - rect.left) / rect.width) * 1000;
    const currentY = ((event.clientY - rect.top) / rect.height) * 600;

    const deltaX = currentX - dragStart.x;
    const deltaY = currentY - dragStart.y;

    setMapElements(prevElements => 
      prevElements.map(element => {
        if (element.id === selectedElement) {
          let newX = elementStartPos.x + deltaX;
          let newY = elementStartPos.y + deltaY;
          
          // Apply boundaries based on element type
          if (element.type === 'entrance') {
            // For circles, keep center within bounds with radius
            newX = Math.max(15, Math.min(985, newX));
            newY = Math.max(15, Math.min(585, newY));
          } else if (element.type === 'bathroom') {
            // For centered rectangles, account for half width/height
            const halfWidth = (element.width || 40) / 2;
            const halfHeight = (element.height || 30) / 2;
            newX = Math.max(halfWidth, Math.min(1000 - halfWidth, newX));
            newY = Math.max(halfHeight, Math.min(600 - halfHeight, newY));
          } else if (element.type === 'seat') {
            // For seats, account for their offset
            newX = Math.max(7, Math.min(993, newX));
            newY = Math.max(6, Math.min(594, newY));
          } else if (element.type === 'table') {
            // For tables, account for radius
            newX = Math.max(element.radius, Math.min(1000 - element.radius, newX));
            newY = Math.max(element.radius, Math.min(600 - element.radius, newY));
          } else {
            // For normal rectangles (zones, stages, rows, blocks, sections)
            newX = Math.max(0, Math.min(1000 - (element.width || 0), newX));
            newY = Math.max(0, Math.min(600 - (element.height || 0), newY));
          }
          
          return { ...element, x: newX, y: newY };
        }
        return element;
      })
    );
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart({ x: 0, y: 0 });
    setElementStartPos({ x: 0, y: 0 });
  };

  const handleElementMouseDown = (elementId: string, event: any) => {
    event.stopPropagation();
    
    if (selectedTool !== 'select') return;
    
    setSelectedElement(elementId);
    setIsDragging(true);

    const svg = event.currentTarget.closest('svg');
    const rect = svg.getBoundingClientRect();
    const startX = ((event.clientX - rect.left) / rect.width) * 1000;
    const startY = ((event.clientY - rect.top) / rect.height) * 600;
    
    setDragStart({ x: startX, y: startY });

    const element = mapElements.find(el => el.id === elementId);
    if (element) {
      setElementStartPos({ x: element.x, y: element.y });
    }
  };

  const deleteElement = (elementId: string) => {
    setMapElements(mapElements.filter(el => el.id !== elementId));
    setSelectedElement(null);
  };

  // Delete selected element
  const deleteSelectedElement = () => {
    if (selectedElement) {
      setMapElements(mapElements.filter(el => el.id !== selectedElement));
      setSelectedElement(null);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        if (selectedElement) {
          deleteSelectedElement();
        }
      } else if (event.key === 'Escape') {
        setSelectedElement(null);
        setSelectedTool('select');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement]);

  // Auto-update row naming when rows are added/removed
  useEffect(() => {
    updateRowNaming();
  }, [mapElements.filter(el => el.type === 'row').length]);

  return (
    <div className="h-[calc(100vh-160px)] bg-white/[0.03] backdrop-blur-xl rounded-xl border border-white/[0.08] relative overflow-hidden p-4">
      
      {/* Vista Controls Badge - Top Right */}
      <div className="absolute top-6 right-6 z-10">
        <div className="bg-white/[0.1] backdrop-blur-xl rounded-full border border-white/[0.15] p-2 shadow-lg">
          <div className="flex items-center gap-2">
            {/* Grid Toggle */}
            <button 
              className="w-7 h-7 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all"
              title="Toggle Grid"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
            </button>
            
            {/* Separator */}
            <div className="w-px h-4 bg-white/20"></div>
            
            {/* Zoom Out */}
            <button 
              className="w-7 h-7 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all"
              title="Zoom Out"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            
            {/* Separator */}
            <div className="w-px h-4 bg-white/20"></div>
            
            {/* Zoom In */}
            <button 
              className="w-7 h-7 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all"
              title="Zoom In"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Área de construcción con SVG */}
      <div className="bg-white/[0.02] rounded-xl overflow-hidden h-full relative">
        <svg 
          className={`w-full h-full ${isDragging ? 'cursor-grabbing' : 'cursor-crosshair'}`} 
          viewBox="0 0 1000 600"
          style={{ minHeight: '500px' }}
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <defs>
            {/* Grid pattern */}
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#ffffff10" strokeWidth="1"/>
            </pattern>
            
            {/* Gradients for stage */}
            {mapElements.filter(el => el.type === 'stage' && el.stageGradient).map(element => (
              <linearGradient key={`stageGradient-${element.id}`} id={`stageGradient-${element.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={element.stageBackgroundColor || '#ef4444'} stopOpacity="1" />
                <stop offset="100%" stopColor={element.stageBackgroundColor || '#ef4444'} stopOpacity="0.3" />
              </linearGradient>
            ))}
          </defs>

          {/* Grid background */}
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Map elements */}
          {mapElements.map(element => {
            const isSelected = selectedElement === element.id;
            
            // Render zone types (rectangle and circle)
            if (element.type === 'zone') {
              if (element.shape === 'circle') {
                return (
                  <g key={element.id}>
                    <circle
                      cx={element.x + element.width / 2}
                      cy={element.y + element.height / 2}
                      r={Math.min(element.width, element.height) / 2}
                      fill={element.color || '#8b5cf6'}
                      fillOpacity="0.3"
                      stroke={isSelected ? "#ffffff" : element.color || '#8b5cf6'}
                      strokeWidth={isSelected ? 3 : 2}
                      className="cursor-pointer hover:opacity-80"
                      onMouseDown={(e) => handleElementMouseDown(element.id, e)}
                    />
                    <text
                      x={element.x + element.width / 2}
                      y={element.y + element.height / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="12"
                      fontWeight="bold"
                      className="pointer-events-none select-none"
                    >
                      {element.name}
                    </text>
                  </g>
                );
              } else {
                return (
                  <g key={element.id}>
                    <rect
                      x={element.x}
                      y={element.y}
                      width={element.width}
                      height={element.height}
                      fill={element.color || '#3b82f6'}
                      fillOpacity="0.3"
                      stroke={isSelected ? "#ffffff" : element.color || '#3b82f6'}
                      strokeWidth={isSelected ? 3 : 2}
                      rx="8"
                      className="cursor-pointer hover:opacity-80"
                      onMouseDown={(e) => handleElementMouseDown(element.id, e)}
                    />
                    <text
                      x={element.x + element.width / 2}
                      y={element.y + element.height / 2 - 8}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="12"
                      fontWeight="bold"
                      className="pointer-events-none select-none"
                    >
                      {element.name}
                    </text>
                    {element.seats && (
                      <text
                        x={element.x + element.width / 2}
                        y={element.y + element.height / 2 + 8}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="white"
                        fontSize="10"
                        className="pointer-events-none select-none"
                      >
                        {element.seats} asientos
                      </text>
                    )}
                  </g>
                );
              }
            }

            if (element.type === 'stage') {
              return (
                <g key={element.id}>
                  <rect
                    x={element.x}
                    y={element.y}
                    width={element.width}
                    height={element.height}
                    fill="#8b5cf6"
                    stroke={isSelected ? "#ffffff" : "#a855f7"}
                    strokeWidth={isSelected ? 3 : 1}
                    rx="8"
                    className="cursor-pointer hover:opacity-80"
                    onMouseDown={(e) => handleElementMouseDown(element.id, e)}
                  />
                  <text
                    x={element.x + element.width / 2}
                    y={element.y + element.height / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="14"
                    fontWeight="bold"
                    className="pointer-events-none select-none"
                  >
                    {element.name}
                  </text>
                </g>
              );
            }

            if (element.type === 'seat') {
              return (
                <g key={element.id}>
                  <rect
                    x={element.x - element.width / 2}
                    y={element.y - element.height / 2}
                    width={element.width}
                    height={element.height}
                    fill={seatStates.available.color}
                    stroke={isSelected ? "#ffffff" : "#065f46"}
                    strokeWidth={isSelected ? 2 : 1}
                    rx="2"
                    className="cursor-pointer hover:opacity-80"
                    onMouseDown={(e) => handleElementMouseDown(element.id, e)}
                  />
                </g>
              );
            }

            if (element.type === 'row') {
              const seats = [];
              for (let i = 0; i < element.seatsPerRow; i++) {
                const seatX = element.x + (i * element.seatSpacing);
                const seatY = element.y;
                seats.push(
                  <rect
                    key={`seat-${i}`}
                    x={seatX}
                    y={seatY}
                    width={12}
                    height={element.height}
                    fill={seatStates.available.color}
                    stroke="#065f46"
                    strokeWidth="1"
                    rx="2"
                    className="cursor-pointer hover:opacity-80"
                  />
                );
              }

              return (
                <g key={element.id} onMouseDown={(e) => handleElementMouseDown(element.id, e)}>
                  {/* Row background */}
                  <rect
                    x={element.x - 5}
                    y={element.y - 2}
                    width={element.width}
                    height={element.height + 4}
                    fill="transparent"
                    stroke={isSelected ? "#ffffff" : "#374151"}
                    strokeWidth={isSelected ? 2 : 1}
                    strokeDasharray="2,2"
                    className="cursor-pointer"
                  />
                  {/* Row label */}
                  <text
                    x={element.x - 15}
                    y={element.y + element.height / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="10"
                    fontWeight="bold"
                    className="pointer-events-none select-none"
                  >
                    {element.rowLetter}
                  </text>
                  {/* Individual seats */}
                  {seats}
                  {/* Seat numbers */}
                  {Array.from({ length: element.seatsPerRow }, (_, i) => (
                    <text
                      key={`number-${i}`}
                      x={element.x + (i * element.seatSpacing) + 6}
                      y={element.y + element.height + 12}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="8"
                      className="pointer-events-none select-none"
                    >
                      {generateSeatNumber(i, element.isEvenOdd, element.numberingDirection)}
                    </text>
                  ))}
                </g>
              );
            }

            if (element.type === 'table') {
              const seats = element.seatsAroundTable.map((seat, index) => {
                const angleRad = (seat.angle * Math.PI) / 180;
                const seatX = element.x + Math.cos(angleRad) * element.radius;
                const seatY = element.y + Math.sin(angleRad) * element.radius;
                
                return (
                  <circle
                    key={`table-seat-${index}`}
                    cx={seatX}
                    cy={seatY}
                    r="6"
                    fill={seat.occupied ? seatStates.sold.color : seatStates.available.color}
                    stroke="#374151"
                    strokeWidth="1"
                    className="cursor-pointer hover:opacity-80"
                  />
                );
              });

              return (
                <g key={element.id} onMouseDown={(e) => handleElementMouseDown(element.id, e)}>
                  {/* Table surface */}
                  <circle
                    cx={element.x}
                    cy={element.y}
                    r={element.radius * 0.6}
                    fill="#92400e"
                    stroke={isSelected ? "#ffffff" : "#451a03"}
                    strokeWidth={isSelected ? 3 : 2}
                    className="cursor-pointer hover:opacity-80"
                  />
                  {/* Table seats */}
                  {seats}
                  {/* Table number */}
                  <text
                    x={element.x}
                    y={element.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="12"
                    fontWeight="bold"
                    className="pointer-events-none select-none"
                  >
                    {element.tableNumber}
                  </text>
                </g>
              );
            }

            if (element.type === 'block') {
              return (
                <g key={element.id}>
                  <rect
                    x={element.x}
                    y={element.y}
                    width={element.width}
                    height={element.height}
                    fill="#fbbf24"
                    fillOpacity="0.4"
                    stroke={isSelected ? "#ffffff" : "#f59e0b"}
                    strokeWidth={isSelected ? 3 : 2}
                    rx="8"
                    className="cursor-pointer hover:opacity-80"
                    onMouseDown={(e) => handleElementMouseDown(element.id, e)}
                  />
                  <text
                    x={element.x + element.width / 2}
                    y={element.y + element.height / 2 - 6}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="12"
                    fontWeight="bold"
                    className="pointer-events-none select-none"
                  >
                    {element.name}
                  </text>
                  <text
                    x={element.x + element.width / 2}
                    y={element.y + element.height / 2 + 8}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="10"
                    className="pointer-events-none select-none"
                  >
                    {element.seats} asientos
                  </text>
                </g>
              );
            }

            if (element.type === 'section') {
              return (
                <g key={element.id}>
                  <rect
                    x={element.x}
                    y={element.y}
                    width={element.width}
                    height={element.height}
                    fill={getCategoryColor(element.category || 'general')}
                    fillOpacity="0.2"
                    stroke={isSelected ? "#ffffff" : getCategoryColor(element.category || 'general')}
                    strokeWidth={isSelected ? 3 : 2}
                    strokeDasharray="5,5"
                    rx="12"
                    className="cursor-pointer hover:opacity-80"
                    onMouseDown={(e) => handleElementMouseDown(element.id, e)}
                  />
                  <text
                    x={element.x + element.width / 2}
                    y={element.y + element.height / 2 - 8}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="14"
                    fontWeight="bold"
                    className="pointer-events-none select-none"
                  >
                    {element.name}
                  </text>
                  <text
                    x={element.x + element.width / 2}
                    y={element.y + element.height / 2 + 8}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="10"
                    className="pointer-events-none select-none"
                  >
                    {element.isGeneralAdmission ? `Capacidad: ${element.capacity}` : `${element.totalSeats} asientos`}
                  </text>
                </g>
              );
            }

            if (element.type === 'entrance') {
              return (
                <g key={element.id}>
                  <rect
                    x={element.x}
                    y={element.y}
                    width={element.width}
                    height={element.height}
                    fill="#10b981"
                    stroke={isSelected ? "#ffffff" : "#059669"}
                    strokeWidth={isSelected ? 3 : 2}
                    rx="4"
                    className="cursor-pointer hover:opacity-80"
                    onMouseDown={(e) => handleElementMouseDown(element.id, e)}
                  />
                  <text
                    x={element.x + element.width / 2}
                    y={element.y + element.height / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="8"
                    fontWeight="bold"
                    className="pointer-events-none select-none"
                  >
                    🚪
                  </text>
                </g>
              );
            }

            if (element.type === 'bathroom') {
              return (
                <g key={element.id}>
                  <rect
                    x={element.x}
                    y={element.y}
                    width={element.width}
                    height={element.height}
                    fill="#06b6d4"
                    stroke={isSelected ? "#ffffff" : "#0891b2"}
                    strokeWidth={isSelected ? 3 : 2}
                    rx="4"
                    className="cursor-pointer hover:opacity-80"
                    onMouseDown={(e) => handleElementMouseDown(element.id, e)}
                  />
                  <text
                    x={element.x + element.width / 2}
                    y={element.y + element.height / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="8"
                    fontWeight="bold"
                    className="pointer-events-none select-none"
                  >
                    🚻
                  </text>
                </g>
              );
            }
            
            return null;
          })}
        </svg>
        
        {/* Floating Sidebar Panel - Left Side */}
        <div className="absolute top-6 left-6 z-20 w-64 max-h-[calc(100vh-320px)] overflow-y-auto">
          <div className="bg-white/[0.08] backdrop-blur-xl rounded-xl border border-white/[0.12] p-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Elementos</h3>
              <span className="text-white/60 text-xs">{mapElements.length}</span>
            </div>
            
            {mapElements.length === 0 ? (
              <div className="text-center py-6 text-white/60">
                <div className="text-2xl mb-2">📍</div>
                <p className="text-sm">No hay elementos</p>
                <p className="text-xs text-white/40">Usa las herramientas para crear elementos</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {mapElements.map((element) => (
                  <div
                    key={element.id}
                    onClick={() => setSelectedElement(element.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedElement === element.id
                        ? 'bg-blue-600/30 border border-blue-500/50 shadow-lg'
                        : 'bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                        <span className="text-sm">
                          {element.type === 'stage' ? '🎭' :
                           element.type === 'seat' ? '💺' :
                           element.type === 'row' ? '📏' :
                           element.type === 'table' ? '🪑' :
                           element.type === 'block' ? '💎' :
                           element.type === 'section' ? '📦' :
                           element.type === 'entrance' ? '🚪' :
                           element.type === 'bathroom' ? '🚻' :
                           element.type === 'zone' && element.shape === 'circle' ? '⭕' :
                           '⬛'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium truncate">{element.name}</div>
                        <div className="text-white/60 text-xs">
                          {element.type === 'zone' && element.shape === 'circle' ? 'zona circular' :
                           element.type === 'zone' ? 'zona rectangular' :
                           element.type === 'row' ? `${element.seatsPerRow} asientos` :
                           element.type === 'table' ? `${element.seats} puestos` :
                           element.type === 'block' ? `${element.seats} asientos` :
                           element.type === 'section' ? (element.isGeneralAdmission ? `cap. ${element.capacity}` : `${element.totalSeats} asientos`) :
                           element.type}
                        </div>
                      </div>
                      {selectedElement === element.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteElement(element.id);
                          }}
                          className="flex-shrink-0 p-1 text-white/60 hover:text-red-400 hover:bg-red-500/20 rounded transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tool Selector */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <h4 className="text-white/80 text-sm font-medium mb-3">Herramientas</h4>
              <div className="space-y-3">
                
                {/* Basic Tools */}
                <div>
                  <h5 className="text-white/60 text-xs font-medium mb-2">Básico</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'select', name: 'Seleccionar', icon: '🔍' },
                      { id: 'stage', name: 'Escenario', icon: '🎭' },
                    ].map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => setSelectedTool(tool.id)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs transition-all duration-200 ${
                          selectedTool === tool.id
                            ? 'bg-white/20 text-white border border-white/30'
                            : 'text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <span className="text-sm">{tool.icon}</span>
                        <span>{tool.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Zones */}
                <div>
                  <h5 className="text-white/60 text-xs font-medium mb-2">Zonas</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'rectangle', name: 'Rectangular', icon: '⬛' },
                      { id: 'circle', name: 'Circular', icon: '⭕' },
                      { id: 'section', name: 'Sección', icon: '📦' },
                      { id: 'block', name: 'Bloque VIP', icon: '💎' },
                    ].map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => setSelectedTool(tool.id)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs transition-all duration-200 ${
                          selectedTool === tool.id
                            ? 'bg-white/20 text-white border border-white/30'
                            : 'text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <span className="text-sm">{tool.icon}</span>
                        <span>{tool.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Seating */}
                <div>
                  <h5 className="text-white/60 text-xs font-medium mb-2">Asientos</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'seat', name: 'Asiento', icon: '💺' },
                      { id: 'row', name: 'Fila', icon: '📏' },
                      { id: 'table', name: 'Mesa', icon: '🪑' },
                    ].map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => setSelectedTool(tool.id)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs transition-all duration-200 ${
                          selectedTool === tool.id
                            ? 'bg-white/20 text-white border border-white/30'
                            : 'text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <span className="text-sm">{tool.icon}</span>
                        <span>{tool.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Infrastructure */}
                <div>
                  <h5 className="text-white/60 text-xs font-medium mb-2">Infraestructura</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'entrance', name: 'Entrada', icon: '🚪' },
                      { id: 'bathroom', name: 'Baño', icon: '🚻' },
                    ].map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => setSelectedTool(tool.id)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs transition-all duration-200 ${
                          selectedTool === tool.id
                            ? 'bg-white/20 text-white border border-white/30'
                            : 'text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <span className="text-sm">{tool.icon}</span>
                        <span>{tool.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}