"use client";

import { useState, useEffect } from "react";

interface FigmaStyleMapEditorProps {
  eventId: string | string[];
  activeTab: string;
}

export default function FigmaStyleMapEditor({ eventId, activeTab }: FigmaStyleMapEditorProps) {
  // Core states
  const [selectedTool, setSelectedTool] = useState('select');
  const [mapElements, setMapElements] = useState([
    { id: 'stage', type: 'stage', x: 300, y: 50, width: 400, height: 60, name: 'ESCENARIO' },
    { id: 'general', type: 'zone', x: 100, y: 200, width: 300, height: 150, name: 'General', color: '#3b82f6', seats: 96 },
    { id: 'vip', type: 'zone', x: 500, y: 150, width: 200, height: 100, name: 'VIP', color: '#fbbf24', seats: 80 },
    { id: 'row-demo', type: 'row', x: 100, y: 380, width: 160, height: 12, name: 'Fila A', seats: 10, seatsPerRow: 10, seatSpacing: 16 },
  ]);
  
  // UI states
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [elementStartPos, setElementStartPos] = useState({ x: 0, y: 0 });

  // Initialize row letters for existing rows without rowLetter property
  useEffect(() => {
    setMapElements(prevElements => {
      let letterIndex = 0;
      return prevElements.map(el => {
        if (el.type === 'row') {
          if (!el.rowLetter) {
            const letter = String.fromCharCode(65 + letterIndex);
            letterIndex++;
            return {
              ...el,
              rowLetter: letter,
              name: `Fila ${letter}`,
              // Ensure all row properties exist
              seatsPerRow: el.seatsPerRow || 10,
              rowLines: el.rowLines || 1,
              startNumber: el.startNumber || 1,
              numberingPattern: el.numberingPattern || 'sequential',
              seatSpacing: el.seatSpacing || 16,
              seatWidth: el.seatWidth || 14,
              seatHeight: el.seatHeight || 12,
              numbering: el.numbering || { show: true, position: 'center', fontSize: 8, color: '#ffffff' },
              configuration: el.configuration || { curved: false, curvature: 0, gap: 0, groupSize: 0 }
            };
          } else {
            letterIndex++;
          }
        }
        return el;
      });
    });
  }, []);

  // Figma-style tools
  const figmaTools = [
    { 
      id: 'select', 
      name: 'Select', 
      icon: '↖️', 
      shortcut: 'V',
      category: 'basic' 
    },
    { 
      id: 'rectangle', 
      name: 'Rectangle Zone', 
      icon: '⬛', 
      shortcut: 'R',
      category: 'shapes' 
    },
    { 
      id: 'circle', 
      name: 'Circle Zone', 
      icon: '⭕', 
      shortcut: 'O',
      category: 'shapes' 
    },
    { 
      id: 'row', 
      name: 'Seat Row', 
      icon: '📏', 
      shortcut: 'L',
      category: 'seating' 
    },
    { 
      id: 'table', 
      name: 'Table', 
      icon: '🪑', 
      shortcut: 'T',
      category: 'seating' 
    },
    { 
      id: 'stage', 
      name: 'Stage', 
      icon: '🎭', 
      shortcut: 'S',
      category: 'special' 
    },
  ];

  // Keyboard shortcuts (Figma-style)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = event.key.toLowerCase();
      
      // Tool shortcuts
      switch (key) {
        case 'v':
          setSelectedTool('select');
          break;
        case 'r':
          setSelectedTool('rectangle');
          break;
        case 'o':
          setSelectedTool('circle');
          break;
        case 'l':
          setSelectedTool('row');
          break;
        case 't':
          setSelectedTool('table');
          break;
        case 's':
          setSelectedTool('stage');
          break;
        case 'delete':
        case 'backspace':
          if (selectedElement) {
            deleteSelectedElement();
          }
          break;
        case 'escape':
          setSelectedElement(null);
          setSelectedTool('select');
          break;
      }

      // Cmd/Ctrl shortcuts
      if (event.metaKey || event.ctrlKey) {
        switch (key) {
          case 'd':
            event.preventDefault();
            if (selectedElement) {
              duplicateElement();
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement]);

  const deleteSelectedElement = () => {
    if (selectedElement) {
      setMapElements(mapElements.filter(el => el.id !== selectedElement));
      setSelectedElement(null);
    }
  };

  const duplicateElement = () => {
    if (!selectedElement) return;
    
    const element = mapElements.find(el => el.id === selectedElement);
    if (!element) return;

    const newElement = {
      ...element,
      id: `${element.type}-${Date.now()}`,
      x: element.x + 20,
      y: element.y + 20,
    };

    setMapElements([...mapElements, newElement]);
    setSelectedElement(newElement.id);
  };

  const applyTemplate = (templateType: string) => {
    let templateElements: any[] = [];

    switch (templateType) {
      case 'theater':
        templateElements = [
          { id: 'theater-stage', type: 'stage', x: 300, y: 50, width: 400, height: 60, name: 'ESCENARIO' },
          { id: 'theater-row1', type: 'row', x: 100, y: 150, width: 160, height: 12, name: 'Fila A', rowLetter: 'A', seats: 10, seatsPerRow: 10, seatSpacing: 16, seatWidth: 14, seatHeight: 12, rowLines: 1, startNumber: 1, numberingPattern: 'sequential', numbering: { show: true, position: 'center', fontSize: 8, color: '#ffffff' }, configuration: { curved: false, curvature: 0, gap: 0, groupSize: 0 } },
          { id: 'theater-row2', type: 'row', x: 100, y: 180, width: 160, height: 12, name: 'Fila B', rowLetter: 'B', seats: 10, seatsPerRow: 10, seatSpacing: 16, seatWidth: 14, seatHeight: 12, rowLines: 1, startNumber: 1, numberingPattern: 'sequential', numbering: { show: true, position: 'center', fontSize: 8, color: '#ffffff' }, configuration: { curved: false, curvature: 0, gap: 0, groupSize: 0 } },
          { id: 'theater-row3', type: 'row', x: 100, y: 210, width: 160, height: 12, name: 'Fila C', rowLetter: 'C', seats: 10, seatsPerRow: 10, seatSpacing: 16, seatWidth: 14, seatHeight: 12, rowLines: 1, startNumber: 1, numberingPattern: 'sequential', numbering: { show: true, position: 'center', fontSize: 8, color: '#ffffff' }, configuration: { curved: false, curvature: 0, gap: 0, groupSize: 0 } },
          { id: 'theater-row4', type: 'row', x: 100, y: 240, width: 160, height: 12, name: 'Fila D', rowLetter: 'D', seats: 10, seatsPerRow: 10, seatSpacing: 16, seatWidth: 14, seatHeight: 12, rowLines: 1, startNumber: 1, numberingPattern: 'sequential', numbering: { show: true, position: 'center', fontSize: 8, color: '#ffffff' }, configuration: { curved: false, curvature: 0, gap: 0, groupSize: 0 } },
          { id: 'theater-row5', type: 'row', x: 100, y: 270, width: 160, height: 12, name: 'Fila E', rowLetter: 'E', seats: 10, seatsPerRow: 10, seatSpacing: 16, seatWidth: 14, seatHeight: 12, rowLines: 1, startNumber: 1, numberingPattern: 'sequential', numbering: { show: true, position: 'center', fontSize: 8, color: '#ffffff' }, configuration: { curved: false, curvature: 0, gap: 0, groupSize: 0 } },
          { id: 'theater-row6', type: 'row', x: 600, y: 150, width: 160, height: 12, name: 'Fila F', rowLetter: 'F', seats: 10, seatsPerRow: 10, seatSpacing: 16, seatWidth: 14, seatHeight: 12, rowLines: 1, startNumber: 1, numberingPattern: 'sequential', numbering: { show: true, position: 'center', fontSize: 8, color: '#ffffff' }, configuration: { curved: false, curvature: 0, gap: 0, groupSize: 0 } },
          { id: 'theater-row7', type: 'row', x: 600, y: 180, width: 160, height: 12, name: 'Fila G', rowLetter: 'G', seats: 10, seatsPerRow: 10, seatSpacing: 16, seatWidth: 14, seatHeight: 12, rowLines: 1, startNumber: 1, numberingPattern: 'sequential', numbering: { show: true, position: 'center', fontSize: 8, color: '#ffffff' }, configuration: { curved: false, curvature: 0, gap: 0, groupSize: 0 } },
          { id: 'theater-row8', type: 'row', x: 600, y: 210, width: 160, height: 12, name: 'Fila H', rowLetter: 'H', seats: 10, seatsPerRow: 10, seatSpacing: 16, seatWidth: 14, seatHeight: 12, rowLines: 1, startNumber: 1, numberingPattern: 'sequential', numbering: { show: true, position: 'center', fontSize: 8, color: '#ffffff' }, configuration: { curved: false, curvature: 0, gap: 0, groupSize: 0 } },
          { id: 'theater-vip', type: 'zone', x: 350, y: 350, width: 300, height: 100, name: 'VIP Section', color: '#fbbf24', seats: 50 },
        ];
        break;
      
      case 'restaurant':
        templateElements = [
          { id: 'restaurant-bar', type: 'zone', x: 50, y: 50, width: 200, height: 80, name: 'Bar Area', color: '#92400e' },
          { id: 'restaurant-table1', type: 'table', x: 150, y: 200, radius: 40, name: 'Mesa 1', seats: 4 },
          { id: 'restaurant-table2', type: 'table', x: 300, y: 200, radius: 40, name: 'Mesa 2', seats: 4 },
          { id: 'restaurant-table3', type: 'table', x: 450, y: 200, radius: 40, name: 'Mesa 3', seats: 4 },
          { id: 'restaurant-table4', type: 'table', x: 600, y: 200, radius: 40, name: 'Mesa 4', seats: 4 },
          { id: 'restaurant-table5', type: 'table', x: 150, y: 350, radius: 40, name: 'Mesa 5', seats: 6 },
          { id: 'restaurant-table6', type: 'table', x: 300, y: 350, radius: 40, name: 'Mesa 6', seats: 6 },
          { id: 'restaurant-table7', type: 'table', x: 450, y: 350, radius: 40, name: 'Mesa 7', seats: 6 },
          { id: 'restaurant-table8', type: 'table', x: 600, y: 350, radius: 40, name: 'Mesa 8', seats: 6 },
          { id: 'restaurant-private', type: 'zone', x: 750, y: 150, width: 200, height: 250, name: 'Private Dining', color: '#8b5cf6' },
        ];
        break;
      
      case 'stadium':
        templateElements = [
          { id: 'stadium-field', type: 'zone', x: 200, y: 200, width: 600, height: 200, name: 'Field', color: '#10b981', shape: 'rectangle' },
          { id: 'stadium-section1', type: 'zone', x: 50, y: 100, width: 150, height: 80, name: 'Section A', color: '#3b82f6' },
          { id: 'stadium-section2', type: 'zone', x: 50, y: 200, width: 150, height: 80, name: 'Section B', color: '#3b82f6' },
          { id: 'stadium-section3', type: 'zone', x: 50, y: 300, width: 150, height: 80, name: 'Section C', color: '#3b82f6' },
          { id: 'stadium-section4', type: 'zone', x: 50, y: 400, width: 150, height: 80, name: 'Section D', color: '#3b82f6' },
          { id: 'stadium-section5', type: 'zone', x: 800, y: 100, width: 150, height: 80, name: 'Section E', color: '#3b82f6' },
          { id: 'stadium-section6', type: 'zone', x: 800, y: 200, width: 150, height: 80, name: 'Section F', color: '#3b82f6' },
          { id: 'stadium-section7', type: 'zone', x: 800, y: 300, width: 150, height: 80, name: 'Section G', color: '#3b82f6' },
          { id: 'stadium-section8', type: 'zone', x: 800, y: 400, width: 150, height: 80, name: 'Section H', color: '#3b82f6' },
          { id: 'stadium-vip', type: 'zone', x: 300, y: 50, width: 400, height: 60, name: 'VIP Boxes', color: '#fbbf24' },
        ];
        break;
    }

    if (templateElements.length > 0) {
      setMapElements(templateElements);
      setSelectedElement(null);
      setSelectedTool('select');
    }
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
          
          // Apply boundaries
          if (element.type === 'table') {
            newX = Math.max(element.radius || 40, Math.min(1000 - (element.radius || 40), newX));
            newY = Math.max(element.radius || 40, Math.min(600 - (element.radius || 40), newY));
          } else {
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

  const handleCanvasClick = (event: any) => {
    if (selectedTool === 'select') {
      setSelectedElement(null);
      return;
    }

    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 1000;
    const y = ((event.clientY - rect.top) / rect.height) * 600;

    // Create new element based on selected tool
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
      case 'row':
        // Get next letter for the row
        const existingRows = mapElements.filter(el => el.type === 'row').length;
        const rowLetter = String.fromCharCode(65 + existingRows); // A, B, C, etc.
        
        newElement = {
          id: `row-${Date.now()}`,
          type: 'row',
          x: Math.round(x - 80),
          y: Math.round(y - 6),
          width: 160,
          height: 12,
          name: `Fila ${rowLetter}`,
          rowLetter: rowLetter,
          seats: 10,
          seatsPerRow: 10,
          rowLines: 1,
          startNumber: 1,
          numberingPattern: 'sequential', // sequential, odd-even, custom
          seatSpacing: 16,
          seatWidth: 14,
          seatHeight: 12,
          numbering: {
            show: true,
            position: 'center', // center, bottom, top
            fontSize: 8,
            color: '#ffffff'
          },
          configuration: {
            curved: false,
            curvature: 0,
            gap: 0, // gap between seat groups
            groupSize: 0 // 0 means no grouping
          }
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
        };
        break;
    }

    if (newElement) {
      setMapElements([...mapElements, newElement]);
      setSelectedElement(newElement.id);
      setSelectedTool('select'); // Auto-switch back to select
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] bg-[#0a0a0a] relative overflow-hidden">
      {/* Figma-style Floating Toolbar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white/[0.08] backdrop-blur-xl rounded-xl border border-white/[0.12] p-2 shadow-2xl">
          <div className="flex items-center gap-1">
            {figmaTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 group ${
                  selectedTool === tool.id
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                title={`${tool.name} (${tool.shortcut})`}
              >
                <span className="text-lg">{tool.icon}</span>
                
                {/* Shortcut indicator */}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-black/60 rounded text-[8px] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {tool.shortcut}
                </div>
              </button>
            ))}
            
            {/* Separator */}
            <div className="w-px h-6 bg-white/20 mx-1"></div>
            
            {/* Zoom controls */}
            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all">
              <span className="text-sm">−</span>
            </button>
            <span className="text-white/60 text-xs px-2">100%</span>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all">
              <span className="text-sm">+</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex h-full">
        {/* Left Sidebar (Figma-style) */}
        <div className={`bg-white/[0.03] backdrop-blur-xl border-r border-white/[0.08] transition-all duration-300 ${
          sidebarCollapsed ? 'w-12' : 'w-80'
        }`}>
          {!sidebarCollapsed && (
            <div className="p-4 space-y-4">
              {/* Layers Panel */}
              <div>
                <h3 className="text-white/80 text-sm font-medium mb-3 flex items-center gap-2">
                  <span>Layers</span>
                  <span className="text-white/40 text-xs">{mapElements.length}</span>
                </h3>
                <div className="space-y-1">
                  {mapElements.map((element) => (
                    <div
                      key={element.id}
                      onClick={() => setSelectedElement(element.id)}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${
                        selectedElement === element.id
                          ? 'bg-blue-600/30 border border-blue-500/50'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="w-4 h-4 flex items-center justify-center">
                        <span className="text-xs">
                          {element.type === 'stage' ? '🎭' :
                           element.type === 'row' ? '📏' :
                           element.type === 'table' ? '🪑' :
                           element.type === 'zone' && element.shape === 'circle' ? '⭕' :
                           '⬛'}
                        </span>
                      </div>
                      <span className="text-white text-sm truncate">{element.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Templates */}
              <div>
                <h3 className="text-white/80 text-sm font-medium mb-3">Quick Start</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => applyTemplate('theater')}
                    className="w-full p-3 bg-white/[0.05] hover:bg-white/[0.08] rounded-lg text-left transition-all"
                  >
                    <div className="text-white text-sm font-medium">Theater Layout</div>
                    <div className="text-white/60 text-xs">200 seats, curved rows</div>
                  </button>
                  <button 
                    onClick={() => applyTemplate('restaurant')}
                    className="w-full p-3 bg-white/[0.05] hover:bg-white/[0.08] rounded-lg text-left transition-all"
                  >
                    <div className="text-white text-sm font-medium">Restaurant Setup</div>
                    <div className="text-white/60 text-xs">25 tables + bar area</div>
                  </button>
                  <button 
                    onClick={() => applyTemplate('stadium')}
                    className="w-full p-3 bg-white/[0.05] hover:bg-white/[0.08] rounded-lg text-left transition-all"
                  >
                    <div className="text-white text-sm font-medium">Stadium Section</div>
                    <div className="text-white/60 text-xs">1000+ seats, multi-tier</div>
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Collapse Toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute top-4 right-2 w-6 h-6 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white/60 hover:text-white transition-all"
          >
            <span className="text-xs">{sidebarCollapsed ? '→' : '←'}</span>
          </button>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative">
          <svg
            className={`w-full h-full ${selectedTool === 'select' ? 'cursor-default' : 'cursor-crosshair'}`}
            viewBox="0 0 1000 600"
            onClick={handleCanvasClick}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Grid pattern */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#ffffff05" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Map elements */}
            {mapElements.map(element => {
              const isSelected = selectedElement === element.id;
              
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
                        onClick={() => setSelectedElement(element.id)}
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
                        onClick={() => setSelectedElement(element.id)}
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
                      onClick={() => setSelectedElement(element.id)}
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

              if (element.type === 'row') {
                const renderSeats = () => {
                  const allSeats = [];
                  const seatsPerRow = element.seatsPerRow || 10;
                  const rowLines = element.rowLines || 1;
                  const seatSpacing = element.seatSpacing || 16;
                  const seatWidth = element.seatWidth || 14;
                  const seatHeight = element.seatHeight || 12;
                  const startNumber = element.startNumber || 1;
                  const gap = element.configuration?.gap || 0;
                  const groupSize = element.configuration?.groupSize || 0;
                  
                  for (let line = 0; line < rowLines; line++) {
                    const lineY = element.y + (line * (seatHeight + 4));
                    
                    for (let i = 0; i < seatsPerRow; i++) {
                      let seatX = element.x + (i * seatSpacing);
                      
                      // Apply grouping gaps
                      if (groupSize > 0 && i > 0) {
                        const groupIndex = Math.floor(i / groupSize);
                        seatX += groupIndex * gap;
                      }
                      
                      // Apply curvature if enabled
                      let adjustedY = lineY;
                      if (element.configuration?.curved && element.configuration?.curvature) {
                        const curvature = element.configuration.curvature;
                        const centerPoint = seatsPerRow / 2;
                        const distanceFromCenter = Math.abs(i - centerPoint);
                        adjustedY += (distanceFromCenter * curvature);
                      }
                      
                      // Calculate seat number based on pattern
                      let seatNumber = startNumber + i + (line * seatsPerRow);
                      if (element.numberingPattern === 'odd-even') {
                        seatNumber = line % 2 === 0 ? 
                          (startNumber + i * 2) : 
                          (startNumber + 1 + i * 2);
                      }
                      
                      allSeats.push(
                        <g key={`seat-${line}-${i}`}>
                          <rect
                            x={seatX}
                            y={adjustedY}
                            width={seatWidth}
                            height={seatHeight}
                            fill="#10b981"
                            stroke="#065f46"
                            strokeWidth="1"
                            rx="2"
                            className="cursor-pointer hover:opacity-80"
                          />
                          {element.numbering?.show && (
                            <text
                              x={seatX + seatWidth / 2}
                              y={adjustedY + (element.numbering.position === 'center' ? seatHeight / 2 : 
                                   element.numbering.position === 'bottom' ? seatHeight + 8 : -2)}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              fill={element.numbering.color || '#ffffff'}
                              fontSize={element.numbering.fontSize || 8}
                              className="pointer-events-none select-none"
                            >
                              {seatNumber}
                            </text>
                          )}
                        </g>
                      );
                    }
                  }
                  return allSeats;
                };

                const totalWidth = (element.seatsPerRow * element.seatSpacing) + 
                  (element.configuration?.groupSize > 0 ? 
                    Math.floor(element.seatsPerRow / element.configuration.groupSize) * element.configuration.gap : 0);
                const totalHeight = (element.rowLines * (element.seatHeight + 4));

                return (
                  <g key={element.id} onClick={() => setSelectedElement(element.id)} onMouseDown={(e) => handleElementMouseDown(element.id, e)}>
                    <rect
                      x={element.x - 5}
                      y={element.y - 2}
                      width={totalWidth + 10}
                      height={totalHeight + 4}
                      fill="transparent"
                      stroke={isSelected ? "#ffffff" : "#374151"}
                      strokeWidth={isSelected ? 2 : 1}
                      strokeDasharray="2,2"
                      className="cursor-pointer"
                    />
                    {/* Row Letter Background Circle */}
                    <circle
                      cx={element.x - 15}
                      cy={element.y + totalHeight / 2}
                      r="12"
                      fill="#374151"
                      stroke="#10b981"
                      strokeWidth="2"
                      className="pointer-events-none"
                    />
                    <text
                      x={element.x - 15}
                      y={element.y + totalHeight / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="12"
                      fontWeight="bold"
                      className="pointer-events-none select-none"
                    >
                      {element.rowLetter || element.name?.charAt(element.name.length - 1) || 'A'}
                    </text>
                    {renderSeats()}
                  </g>
                );
              }

              if (element.type === 'table') {
                return (
                  <g key={element.id} onClick={() => setSelectedElement(element.id)} onMouseDown={(e) => handleElementMouseDown(element.id, e)}>
                    <circle
                      cx={element.x}
                      cy={element.y}
                      r={element.radius * 0.6}
                      fill="#92400e"
                      stroke={isSelected ? "#ffffff" : "#451a03"}
                      strokeWidth={isSelected ? 3 : 2}
                      className="cursor-pointer hover:opacity-80"
                    />
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
                      1
                    </text>
                  </g>
                );
              }

              return null;
            })}
          </svg>

          {/* Canvas Instructions (when empty) */}
          {mapElements.length <= 3 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center text-white/40">
                <div className="text-lg mb-2">✨ Create your venue</div>
                <div className="text-sm mb-4">Use the tools above or try these shortcuts:</div>
                <div className="text-xs space-y-1">
                  <div><span className="bg-white/10 px-2 py-1 rounded">R</span> Rectangle Zone</div>
                  <div><span className="bg-white/10 px-2 py-1 rounded">O</span> Circle Zone</div>
                  <div><span className="bg-white/10 px-2 py-1 rounded">L</span> Seat Row</div>
                  <div><span className="bg-white/10 px-2 py-1 rounded">T</span> Table</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Properties Panel (appears when element selected) */}
        {selectedElement && (
          <div className="w-80 bg-white/[0.03] backdrop-blur-xl border-l border-white/[0.08] flex flex-col h-full">
            <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
              <h3 className="text-white font-medium">Properties</h3>
              <button
                onClick={() => setSelectedElement(null)}
                className="w-6 h-6 text-white/40 hover:text-white/80 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {(() => {
              const element = mapElements.find(el => el.id === selectedElement);
              if (!element) return null;

              return (
                <>

                  {/* Element Type */}
                  <div className="flex items-center gap-3 p-3 bg-white/[0.05] rounded-lg">
                    <span className="text-lg">
                      {element.type === 'stage' ? '🎭' :
                       element.type === 'row' ? '📏' :
                       element.type === 'table' ? '🪑' :
                       element.type === 'zone' && element.shape === 'circle' ? '⭕' :
                       '⬛'}
                    </span>
                    <div>
                      <div className="text-white font-medium">{element.name}</div>
                      <div className="text-white/60 text-sm capitalize">
                        {element.type === 'zone' && element.shape === 'circle' ? 'Circle Zone' :
                         element.type === 'zone' ? 'Rectangle Zone' :
                         element.type === 'row' ? 'Seat Row' :
                         element.type === 'table' ? 'Table' :
                         element.type === 'stage' ? 'Stage' :
                         element.type}
                      </div>
                    </div>
                  </div>

                  {/* Basic Properties */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/60 text-sm mb-2">Name</label>
                      <input 
                        type="text" 
                        className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                        value={element.name}
                        onChange={(e) => {
                          setMapElements(mapElements.map(el => 
                            el.id === selectedElement 
                              ? { ...el, name: e.target.value }
                              : el
                          ));
                        }}
                      />
                    </div>

                    {/* Position */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-white/60 text-sm mb-2">X</label>
                        <input 
                          type="number" 
                          className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50"
                          value={Math.round(element.x)}
                          onChange={(e) => {
                            setMapElements(mapElements.map(el => 
                              el.id === selectedElement 
                                ? { ...el, x: parseInt(e.target.value) || 0 }
                                : el
                            ));
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-white/60 text-sm mb-2">Y</label>
                        <input 
                          type="number" 
                          className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50"
                          value={Math.round(element.y)}
                          onChange={(e) => {
                            setMapElements(mapElements.map(el => 
                              el.id === selectedElement 
                                ? { ...el, y: parseInt(e.target.value) || 0 }
                                : el
                            ));
                          }}
                        />
                      </div>
                    </div>

                    {/* Size (for rectangular elements) */}
                    {(element.width && element.height) && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-white/60 text-sm mb-2">Width</label>
                          <input 
                            type="number" 
                            className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50"
                            value={element.width}
                            onChange={(e) => {
                              setMapElements(mapElements.map(el => 
                                el.id === selectedElement 
                                  ? { ...el, width: parseInt(e.target.value) || 0 }
                                  : el
                              ));
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-white/60 text-sm mb-2">Height</label>
                          <input 
                            type="number" 
                            className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50"
                            value={element.height}
                            onChange={(e) => {
                              setMapElements(mapElements.map(el => 
                                el.id === selectedElement 
                                  ? { ...el, height: parseInt(e.target.value) || 0 }
                                  : el
                              ));
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Color (for zones) */}
                    {element.type === 'zone' && (
                      <div>
                        <label className="block text-white/60 text-sm mb-2">Color</label>
                        <div className="flex gap-2">
                          {['#3b82f6', '#8b5cf6', '#ef4444', '#10b981', '#f59e0b', '#06b6d4'].map(color => (
                            <button
                              key={color}
                              onClick={() => {
                                setMapElements(mapElements.map(el => 
                                  el.id === selectedElement 
                                    ? { ...el, color }
                                    : el
                                ));
                              }}
                              className={`w-8 h-8 rounded-lg border-2 transition-all ${
                                element.color === color ? 'border-white' : 'border-white/20'
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Row Configuration */}
                    {element.type === 'row' && (
                      <div className="space-y-4 border-t border-white/10 pt-4">
                        <h4 className="text-white font-medium text-sm">Row Configuration</h4>
                        
                        {/* Row Letter */}
                        <div>
                          <label className="block text-white/60 text-sm mb-2">Row Letter</label>
                          <input 
                            type="text" 
                            maxLength="2"
                            className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50"
                            value={element.rowLetter || 'A'}
                            onChange={(e) => {
                              const letter = e.target.value.toUpperCase();
                              setMapElements(mapElements.map(el => 
                                el.id === selectedElement 
                                  ? { ...el, rowLetter: letter, name: `Fila ${letter}` }
                                  : el
                              ));
                            }}
                          />
                        </div>
                        
                        {/* Seats per Row and Row Lines */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-white/60 text-sm mb-2">Seats per Row</label>
                            <input 
                              type="number" 
                              className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50"
                              value={element.seatsPerRow || 10}
                              onChange={(e) => {
                                setMapElements(mapElements.map(el => 
                                  el.id === selectedElement 
                                    ? { ...el, seatsPerRow: parseInt(e.target.value) || 1 }
                                    : el
                                ));
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-white/60 text-sm mb-2">Row Lines</label>
                            <input 
                              type="number" 
                              className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50"
                              value={element.rowLines || 1}
                              onChange={(e) => {
                                setMapElements(mapElements.map(el => 
                                  el.id === selectedElement 
                                    ? { ...el, rowLines: parseInt(e.target.value) || 1 }
                                    : el
                                ));
                              }}
                            />
                          </div>
                        </div>

                        {/* Seat Dimensions */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-white/60 text-sm mb-2">Seat Width</label>
                            <input 
                              type="number" 
                              className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50"
                              value={element.seatWidth || 14}
                              onChange={(e) => {
                                setMapElements(mapElements.map(el => 
                                  el.id === selectedElement 
                                    ? { ...el, seatWidth: parseInt(e.target.value) || 14 }
                                    : el
                                ));
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-white/60 text-sm mb-2">Seat Height</label>
                            <input 
                              type="number" 
                              className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50"
                              value={element.seatHeight || 12}
                              onChange={(e) => {
                                setMapElements(mapElements.map(el => 
                                  el.id === selectedElement 
                                    ? { ...el, seatHeight: parseInt(e.target.value) || 12 }
                                    : el
                                ));
                              }}
                            />
                          </div>
                        </div>

                        {/* Spacing and Start Number */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-white/60 text-sm mb-2">Seat Spacing</label>
                            <input 
                              type="number" 
                              className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50"
                              value={element.seatSpacing || 16}
                              onChange={(e) => {
                                setMapElements(mapElements.map(el => 
                                  el.id === selectedElement 
                                    ? { ...el, seatSpacing: parseInt(e.target.value) || 16 }
                                    : el
                                ));
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-white/60 text-sm mb-2">Start Number</label>
                            <input 
                              type="number" 
                              className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50"
                              value={element.startNumber || 1}
                              onChange={(e) => {
                                setMapElements(mapElements.map(el => 
                                  el.id === selectedElement 
                                    ? { ...el, startNumber: parseInt(e.target.value) || 1 }
                                    : el
                                ));
                              }}
                            />
                          </div>
                        </div>

                        {/* Numbering Pattern */}
                        <div>
                          <label className="block text-white/60 text-sm mb-2">Numbering Pattern</label>
                          <select 
                            className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50"
                            value={element.numberingPattern || 'sequential'}
                            onChange={(e) => {
                              setMapElements(mapElements.map(el => 
                                el.id === selectedElement 
                                  ? { ...el, numberingPattern: e.target.value }
                                  : el
                              ));
                            }}
                          >
                            <option value="sequential">Sequential (1,2,3...)</option>
                            <option value="odd-even">Odd-Even (1,3,5... / 2,4,6...)</option>
                          </select>
                        </div>

                        {/* Grouping */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-white/60 text-sm mb-2">Group Size</label>
                            <input 
                              type="number" 
                              className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50"
                              value={element.configuration?.groupSize || 0}
                              onChange={(e) => {
                                setMapElements(mapElements.map(el => 
                                  el.id === selectedElement 
                                    ? { ...el, configuration: { ...el.configuration, groupSize: parseInt(e.target.value) || 0 } }
                                    : el
                                ));
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-white/60 text-sm mb-2">Gap Size</label>
                            <input 
                              type="number" 
                              className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50"
                              value={element.configuration?.gap || 0}
                              onChange={(e) => {
                                setMapElements(mapElements.map(el => 
                                  el.id === selectedElement 
                                    ? { ...el, configuration: { ...el.configuration, gap: parseInt(e.target.value) || 0 } }
                                    : el
                                ));
                              }}
                            />
                          </div>
                        </div>

                        {/* Curvature */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-white/60 text-sm">Curved Row</label>
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 text-blue-600 bg-white/5 border-white/10 rounded focus:ring-blue-500"
                              checked={element.configuration?.curved || false}
                              onChange={(e) => {
                                setMapElements(mapElements.map(el => 
                                  el.id === selectedElement 
                                    ? { ...el, configuration: { ...el.configuration, curved: e.target.checked } }
                                    : el
                                ));
                              }}
                            />
                          </div>
                          {element.configuration?.curved && (
                            <div>
                              <label className="block text-white/60 text-sm mb-2">Curvature</label>
                              <input 
                                type="range" 
                                min="0" 
                                max="10" 
                                step="0.5"
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                                value={element.configuration?.curvature || 0}
                                onChange={(e) => {
                                  setMapElements(mapElements.map(el => 
                                    el.id === selectedElement 
                                      ? { ...el, configuration: { ...el.configuration, curvature: parseFloat(e.target.value) } }
                                      : el
                                  ));
                                }}
                              />
                              <div className="text-white/40 text-xs mt-1">
                                Curvature: {element.configuration?.curvature || 0}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Numbering Display */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-white/60 text-sm">Show Numbers</label>
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 text-blue-600 bg-white/5 border-white/10 rounded focus:ring-blue-500"
                              checked={element.numbering?.show !== false}
                              onChange={(e) => {
                                setMapElements(mapElements.map(el => 
                                  el.id === selectedElement 
                                    ? { ...el, numbering: { ...el.numbering, show: e.target.checked } }
                                    : el
                                ));
                              }}
                            />
                          </div>
                          
                          {element.numbering?.show !== false && (
                            <>
                              <div>
                                <label className="block text-white/60 text-sm mb-2">Number Position</label>
                                <select 
                                  className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50"
                                  value={element.numbering?.position || 'center'}
                                  onChange={(e) => {
                                    setMapElements(mapElements.map(el => 
                                      el.id === selectedElement 
                                        ? { ...el, numbering: { ...el.numbering, position: e.target.value } }
                                        : el
                                    ));
                                  }}
                                >
                                  <option value="center">Center</option>
                                  <option value="bottom">Bottom</option>
                                  <option value="top">Top</option>
                                </select>
                              </div>
                              
                              <div>
                                <label className="block text-white/60 text-sm mb-2">Font Size</label>
                                <input 
                                  type="number" 
                                  min="6" 
                                  max="16"
                                  className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50"
                                  value={element.numbering?.fontSize || 8}
                                  onChange={(e) => {
                                    setMapElements(mapElements.map(el => 
                                      el.id === selectedElement 
                                        ? { ...el, numbering: { ...el.numbering, fontSize: parseInt(e.target.value) || 8 } }
                                        : el
                                    ));
                                  }}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Regular Seats (for non-row elements) */}
                    {(element.seats !== undefined && element.type !== 'row') && (
                      <div>
                        <label className="block text-white/60 text-sm mb-2">Seats</label>
                        <input 
                          type="number" 
                          className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50"
                          value={element.seats || 0}
                          onChange={(e) => {
                            setMapElements(mapElements.map(el => 
                              el.id === selectedElement 
                                ? { ...el, seats: parseInt(e.target.value) || 0 }
                                : el
                            ));
                          }}
                        />
                      </div>
                    )}

                    {/* Radius (for tables) */}
                    {element.radius && (
                      <div>
                        <label className="block text-white/60 text-sm mb-2">Radius</label>
                        <input 
                          type="number" 
                          className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50"
                          value={element.radius}
                          onChange={(e) => {
                            setMapElements(mapElements.map(el => 
                              el.id === selectedElement 
                                ? { ...el, radius: parseInt(e.target.value) || 0 }
                                : el
                            ));
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <button
                      onClick={duplicateElement}
                      className="w-full h-9 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm font-medium transition-all flex items-center justify-center gap-2"
                    >
                      <span>⌘</span>
                      <span>D</span>
                      <span>Duplicate</span>
                    </button>
                    
                    <button
                      onClick={deleteSelectedElement}
                      className="w-full h-9 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 text-sm font-medium transition-all"
                    >
                      Delete Element
                    </button>
                  </div>
                </>
              );
            })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}