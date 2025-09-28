import { useState, useEffect, useCallback } from 'react';
import type { MapElement, Category, SeatStates } from '@/lib/types/event-types';

export function useMapEditor() {
  // Map editor states
  const [selectedTool, setSelectedTool] = useState('select');
  const [mapElements, setMapElements] = useState<MapElement[]>([
    { id: 'stage', type: 'stage', x: 300, y: 50, width: 400, height: 60, name: 'ESCENARIO' },
    { id: 'general', type: 'zone', x: 100, y: 200, width: 300, height: 150, name: 'General', color: '#3b82f6', seats: 96 },
    { id: 'vip', type: 'zone', x: 500, y: 150, width: 200, height: 100, name: 'VIP', color: '#fbbf24', seats: 80 },
    { id: 'platinum', type: 'zone', x: 500, y: 300, width: 150, height: 80, name: 'Platinum', color: '#8b5cf6', seats: 40 }
  ]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [elementStartPos, setElementStartPos] = useState({ x: 0, y: 0 });

  // Categories and pricing system
  const [categories] = useState<Category[]>([
    { id: 'general', name: 'General', color: '#3b82f6', price: 0 },
    { id: 'silver', name: 'Silver', color: '#9ca3af', price: 0 },
    { id: 'gold', name: 'Gold', color: '#fbbf24', price: 0 },
    { id: 'platinum', name: 'Platinum', color: '#8b5cf6', price: 0 },
    { id: 'vip', name: 'VIP', color: '#ef4444', price: 0 },
    { id: 'accessibility', name: 'Accesibilidad', color: '#06b6d4', price: 0 }
  ]);

  // Seat states
  const seatStates: SeatStates = {
    available: { name: 'Disponible', color: '#10b981' },
    reserved: { name: 'Reservado', color: '#f59e0b' },
    sold: { name: 'Vendido', color: '#ef4444' },
    blocked: { name: 'Bloqueado', color: '#6b7280' },
    wheelchair: { name: 'Silla de Ruedas', color: '#06b6d4' }
  };

  const handleCanvasClick = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 1000;
    const y = ((event.clientY - rect.top) / rect.height) * 600;

    if (selectedTool === 'select') {
      setSelectedElement(null);
      return;
    }

    let newElement: MapElement | null = null;

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
      // Add more cases for other tools...
    }

    if (newElement) {
      setMapElements([...mapElements, newElement]);
    }
  }, [selectedTool, mapElements]);

  const handleElementClick = useCallback((elementId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (selectedTool === 'select') {
      setSelectedElement(elementId);
    }
  }, [selectedTool]);

  const handleMouseDown = useCallback((elementId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (selectedTool === 'select' && elementId) {
      setSelectedElement(elementId);
      setIsDragging(true);
      
      const svg = event.currentTarget.closest('svg');
      if (!svg) return;
      
      const rect = svg.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 1000;
      const y = ((event.clientY - rect.top) / rect.height) * 600;
      
      setDragStart({ x, y });
      
      const element = mapElements.find(el => el.id === elementId);
      if (element) {
        setElementStartPos({ x: element.x, y: element.y });
      }
    }
  }, [selectedTool, mapElements]);

  const handleMouseMove = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    if (isDragging && selectedElement) {
      const svg = event.currentTarget;
      const rect = svg.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 1000;
      const y = ((event.clientY - rect.top) / rect.height) * 600;
      
      const deltaX = x - dragStart.x;
      const deltaY = y - dragStart.y;
      
      setMapElements(prevElements => 
        prevElements.map(element => {
          if (element.id === selectedElement) {
            let newX = elementStartPos.x + deltaX;
            let newY = elementStartPos.y + deltaY;
            
            // Apply boundaries based on element type
            if (element.type === 'entrance') {
              newX = Math.max(15, Math.min(985, newX));
              newY = Math.max(15, Math.min(585, newY));
            } else if (element.type === 'bathroom') {
              const halfWidth = (element.width || 40) / 2;
              const halfHeight = (element.height || 30) / 2;
              newX = Math.max(halfWidth, Math.min(1000 - halfWidth, newX));
              newY = Math.max(halfHeight, Math.min(600 - halfHeight, newY));
            } else {
              newX = Math.max(0, Math.min(1000 - (element.width || 0), newX));
              newY = Math.max(0, Math.min(600 - (element.height || 0), newY));
            }
            
            return { ...element, x: newX, y: newY };
          }
          return element;
        })
      );
    }
  }, [isDragging, selectedElement, dragStart, elementStartPos]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const deleteSelectedElement = useCallback(() => {
    if (selectedElement) {
      setMapElements(mapElements.filter(el => el.id !== selectedElement));
      setSelectedElement(null);
    }
  }, [selectedElement, mapElements]);

  // Category utility functions
  const getCategoryColor = useCallback((categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : '#3b82f6';
  }, [categories]);

  const getCategoryName = useCallback((categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'General';
  }, [categories]);

  // Auto-numbering utility functions
  const generateRowLabel = useCallback((rowIndex: number) => {
    if (rowIndex < 26) {
      return String.fromCharCode(65 + rowIndex); // A-Z
    } else {
      const firstLetter = String.fromCharCode(65 + Math.floor(rowIndex / 26) - 1);
      const secondLetter = String.fromCharCode(65 + (rowIndex % 26));
      return firstLetter + secondLetter; // AA, AB, AC...
    }
  }, []);

  const generateSeatNumber = useCallback((seatIndex: number, isEvenOdd = false, direction = 'left-to-right') => {
    if (isEvenOdd) {
      return seatIndex % 2 === 0 ? seatIndex + 1 : seatIndex + 2;
    } else {
      return seatIndex + 1;
    }
  }, []);

  const updateRowNaming = useCallback(() => {
    const rowElements = mapElements.filter(el => el.type === 'zone'); // Assuming rows are zones
    const updatedElements = mapElements.map(element => {
      if (element.type === 'zone') {
        const rowIndex = rowElements.findIndex(row => row.id === element.id);
        const newName = `Fila ${generateRowLabel(rowIndex)}`;
        return { ...element, name: newName };
      }
      return element;
    });
    setMapElements(updatedElements);
  }, [mapElements, generateRowLabel]);

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
  }, [selectedElement, deleteSelectedElement]);

  return {
    // States
    selectedTool,
    setSelectedTool,
    mapElements,
    setMapElements,
    isDrawing,
    setIsDrawing,
    selectedElement,
    setSelectedElement,
    isDragging,
    setIsDragging,
    dragStart,
    setDragStart,
    elementStartPos,
    setElementStartPos,
    categories,
    seatStates,
    
    // Event handlers
    handleCanvasClick,
    handleElementClick,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    deleteSelectedElement,
    
    // Utility functions
    getCategoryColor,
    getCategoryName,
    generateRowLabel,
    generateSeatNumber,
    updateRowNaming,
  };
}