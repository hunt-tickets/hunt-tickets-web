"use client";

import { useRef, useCallback, useEffect, useState, useMemo } from 'react';
import { 
  FigmaDocument, 
  FigmaElement, 
  FigmaEditorState, 
  Point, 
  Rect,
  ResizeHandle,
  Transform
} from '@/types/figma-editor';

interface FigmaCanvasProps {
  document: FigmaDocument;
  editorState: FigmaEditorState;
  containerSize: { width: number; height: number };
  onCreate: (element: FigmaElement) => void;
  onUpdate: (elementId: string, updates: Partial<FigmaElement>) => void;
  onSelectionChange: (elementIds: string[]) => void;
  onViewportChange: (viewport: Partial<{ zoom: number; offsetX: number; offsetY: number; }>) => void;
  onStateChange: (state: Partial<FigmaEditorState>) => void;
}

export const FigmaCanvas: React.FC<FigmaCanvasProps> = ({
  document,
  editorState,
  containerSize,
  onCreate,
  onUpdate,
  onSelectionChange,
  onViewportChange,
  onStateChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [dragStart, setDragStart] = useState<Point | null>(null);
  const [selectionBox, setSelectionBox] = useState<Rect | null>(null);
  const [dragOffset, setDragOffset] = useState<Point>({ x: 0, y: 0 });

  // Calculate canvas dimensions
  const canvasSize = useMemo(() => {
    const toolbarHeight = 64;
    const padding = 40;
    return {
      width: containerSize.width - padding,
      height: containerSize.height - toolbarHeight - padding
    };
  }, [containerSize]);

  // Transform screen coordinates to canvas coordinates
  const screenToCanvas = useCallback((screenPoint: Point): Point => {
    const { zoom, offsetX, offsetY } = document.viewport;
    return {
      x: (screenPoint.x - offsetX) / zoom,
      y: (screenPoint.y - offsetY) / zoom
    };
  }, [document.viewport]);

  // Transform canvas coordinates to screen coordinates
  const canvasToScreen = useCallback((canvasPoint: Point): Point => {
    const { zoom, offsetX, offsetY } = document.viewport;
    return {
      x: canvasPoint.x * zoom + offsetX,
      y: canvasPoint.y * zoom + offsetY
    };
  }, [document.viewport]);

  // Get element at point
  const getElementAtPoint = useCallback((point: Point): FigmaElement | null => {
    const canvasPoint = screenToCanvas(point);
    
    // Check elements in reverse order (top to bottom)
    for (let i = document.elementOrder.length - 1; i >= 0; i--) {
      const elementId = document.elementOrder[i];
      const element = document.elements[elementId];
      
      if (!element || !element.isVisible) continue;
      
      const { x, y, width, height } = element.transform;
      
      if (
        canvasPoint.x >= x &&
        canvasPoint.x <= x + width &&
        canvasPoint.y >= y &&
        canvasPoint.y <= y + height
      ) {
        return element;
      }
    }
    
    return null;
  }, [document.elements, document.elementOrder, screenToCanvas]);

  // Get resize handle at point
  const getResizeHandleAtPoint = useCallback((point: Point, element: FigmaElement): ResizeHandle | null => {
    const { x, y, width, height } = element.transform;
    const screenPos = canvasToScreen({ x, y });
    const screenSize = {
      width: width * document.viewport.zoom,
      height: height * document.viewport.zoom
    };
    
    const handleSize = 8;
    const tolerance = handleSize / 2;
    
    // Top-left
    if (
      Math.abs(point.x - screenPos.x) <= tolerance &&
      Math.abs(point.y - screenPos.y) <= tolerance
    ) {
      return 'top-left';
    }
    
    // Top-right
    if (
      Math.abs(point.x - (screenPos.x + screenSize.width)) <= tolerance &&
      Math.abs(point.y - screenPos.y) <= tolerance
    ) {
      return 'top-right';
    }
    
    // Bottom-left
    if (
      Math.abs(point.x - screenPos.x) <= tolerance &&
      Math.abs(point.y - (screenPos.y + screenSize.height)) <= tolerance
    ) {
      return 'bottom-left';
    }
    
    // Bottom-right
    if (
      Math.abs(point.x - (screenPos.x + screenSize.width)) <= tolerance &&
      Math.abs(point.y - (screenPos.y + screenSize.height)) <= tolerance
    ) {
      return 'bottom-right';
    }
    
    return null;
  }, [document.viewport.zoom, canvasToScreen]);

  // Draw canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    
    // Clear canvas
    ctx.fillStyle = document.canvas.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Save context
    ctx.save();
    
    // Apply zoom and pan
    ctx.scale(document.viewport.zoom, document.viewport.zoom);
    ctx.translate(document.viewport.offsetX / document.viewport.zoom, document.viewport.offsetY / document.viewport.zoom);
    
    // Draw grid if enabled
    if (document.canvas.showGrid) {
      drawGrid(ctx);
    }
    
    // Draw elements
    document.elementOrder.forEach(elementId => {
      const element = document.elements[elementId];
      if (element && element.isVisible) {
        drawElement(ctx, element);
      }
    });
    
    // Restore context
    ctx.restore();
    
    // Draw selection handles
    if (document.selection.length > 0) {
      drawSelectionHandles(ctx);
    }
    
    // Draw selection box if dragging
    if (selectionBox) {
      drawSelectionBox(ctx);
    }
  }, [document, canvasSize, selectionBox]);

  const drawGrid = useCallback((ctx: CanvasRenderingContext2D) => {
    const { gridSize } = document.canvas;
    const { zoom } = document.viewport;
    
    // Don't draw grid if too zoomed out
    if (zoom < 0.25) return;
    
    ctx.strokeStyle = '#ffffff15';
    ctx.lineWidth = 1 / zoom;
    
    const startX = Math.floor(-document.viewport.offsetX / (gridSize * zoom)) * gridSize;
    const startY = Math.floor(-document.viewport.offsetY / (gridSize * zoom)) * gridSize;
    const endX = startX + Math.ceil(canvasSize.width / zoom) + gridSize;
    const endY = startY + Math.ceil(canvasSize.height / zoom) + gridSize;
    
    // Vertical lines
    for (let x = startX; x <= endX; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = startY; y <= endY; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
      ctx.stroke();
    }
  }, [document.canvas.gridSize, document.viewport, canvasSize]);

  const drawElement = useCallback((ctx: CanvasRenderingContext2D, element: FigmaElement) => {
    const { x, y, width, height, rotation } = element.transform;
    const { fill, stroke, strokeWidth, opacity, borderRadius } = element.style;
    
    ctx.save();
    
    // Apply element transform
    ctx.translate(x + width / 2, y + height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-width / 2, -height / 2);
    
    // Set opacity
    ctx.globalAlpha = opacity;
    
    // Draw element based on type
    if (element.type === 'zone') {
      // Draw rounded rectangle
      ctx.fillStyle = fill;
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      
      // Rounded rectangle path
      ctx.beginPath();
      ctx.roundRect(0, 0, width, height, borderRadius);
      ctx.fill();
      ctx.stroke();
      
      // Draw zone label
      if (width > 50 && height > 30) {
        ctx.fillStyle = '#ffffff';
        ctx.font = `${Math.min(14, height / 4)}px Inter, system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(element.name, width / 2, height / 2);
      }
    }
    
    ctx.restore();
  }, []);

  const drawSelectionHandles = useCallback((ctx: CanvasRenderingContext2D) => {
    if (document.selection.length !== 1) return;
    
    const element = document.elements[document.selection[0]];
    if (!element) return;
    
    const { x, y, width, height } = element.transform;
    const screenPos = canvasToScreen({ x, y });
    const screenSize = {
      width: width * document.viewport.zoom,
      height: height * document.viewport.zoom
    };
    
    const handleSize = 8;
    const borderColor = '#007AFF';
    const handleColor = '#ffffff';
    
    // Draw selection border
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.strokeRect(screenPos.x, screenPos.y, screenSize.width, screenSize.height);
    
    // Draw resize handles
    const handles = [
      { x: screenPos.x, y: screenPos.y }, // top-left
      { x: screenPos.x + screenSize.width, y: screenPos.y }, // top-right
      { x: screenPos.x, y: screenPos.y + screenSize.height }, // bottom-left
      { x: screenPos.x + screenSize.width, y: screenPos.y + screenSize.height }, // bottom-right
    ];
    
    ctx.fillStyle = handleColor;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1;
    
    handles.forEach(handle => {
      ctx.fillRect(
        handle.x - handleSize / 2,
        handle.y - handleSize / 2,
        handleSize,
        handleSize
      );
      ctx.strokeRect(
        handle.x - handleSize / 2,
        handle.y - handleSize / 2,
        handleSize,
        handleSize
      );
    });
  }, [document.selection, document.elements, document.viewport.zoom, canvasToScreen]);

  const drawSelectionBox = useCallback((ctx: CanvasRenderingContext2D) => {
    if (!selectionBox) return;
    
    ctx.strokeStyle = '#007AFF';
    ctx.fillStyle = '#007AFF20';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    
    ctx.fillRect(selectionBox.x, selectionBox.y, selectionBox.width, selectionBox.height);
    ctx.strokeRect(selectionBox.x, selectionBox.y, selectionBox.width, selectionBox.height);
    
    ctx.setLineDash([]);
  }, [selectionBox]);

  // Handle mouse events
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const point = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    
    setIsMouseDown(true);
    setDragStart(point);
    
    if (editorState.activeTool === 'select') {
      const element = getElementAtPoint(point);
      
      if (element) {
        // Check if clicking on resize handle
        const handle = getResizeHandleAtPoint(point, element);
        if (handle) {
          onStateChange({ isResizing: true, resizeHandle: handle });
          return;
        }
        
        // Select element
        if (!document.selection.includes(element.id)) {
          onSelectionChange([element.id]);
        }
        
        // Start dragging
        onStateChange({ isDragging: true });
        const canvasPoint = screenToCanvas(point);
        setDragOffset({
          x: canvasPoint.x - element.transform.x,
          y: canvasPoint.y - element.transform.y
        });
      } else {
        // Start selection box
        onSelectionChange([]);
        setSelectionBox({ x: point.x, y: point.y, width: 0, height: 0 });
      }
    } else if (editorState.activeTool === 'rectangle') {
      // Start drawing rectangle
      onStateChange({ isDrawing: true });
    }
  }, [editorState.activeTool, getElementAtPoint, getResizeHandleAtPoint, document.selection, onSelectionChange, onStateChange, screenToCanvas]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const point = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    
    if (!isMouseDown || !dragStart) return;
    
    if (editorState.isDrawing && editorState.activeTool === 'rectangle') {
      // Update drawing rectangle
      const width = point.x - dragStart.x;
      const height = point.y - dragStart.y;
      // Draw preview would go here
    } else if (editorState.isDragging && document.selection.length > 0) {
      // Drag selected elements
      const canvasPoint = screenToCanvas(point);
      const element = document.elements[document.selection[0]];
      
      if (element) {
        const newX = canvasPoint.x - dragOffset.x;
        const newY = canvasPoint.y - dragOffset.y;
        
        onUpdate(element.id, {
          transform: {
            ...element.transform,
            x: newX,
            y: newY
          }
        });
      }
    } else if (editorState.isResizing && document.selection.length > 0) {
      // Resize selected element
      // Resize logic would go here
    } else if (selectionBox) {
      // Update selection box
      const width = point.x - dragStart.x;
      const height = point.y - dragStart.y;
      setSelectionBox({
        x: width > 0 ? dragStart.x : point.x,
        y: height > 0 ? dragStart.y : point.y,
        width: Math.abs(width),
        height: Math.abs(height)
      });
    }
  }, [isMouseDown, dragStart, editorState, document.selection, document.elements, onUpdate, screenToCanvas, dragOffset, selectionBox]);

  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const point = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    
    if (editorState.isDrawing && editorState.activeTool === 'rectangle' && dragStart) {
      // Create rectangle
      const canvasStart = screenToCanvas(dragStart);
      const canvasEnd = screenToCanvas(point);
      
      const width = Math.abs(canvasEnd.x - canvasStart.x);
      const height = Math.abs(canvasEnd.y - canvasStart.y);
      
      if (width > 10 && height > 10) {
        const element: FigmaElement = {
          id: `element-${Date.now()}`,
          type: 'zone',
          name: `Zone ${Object.keys(document.elements).length + 1}`,
          transform: {
            x: Math.min(canvasStart.x, canvasEnd.x),
            y: Math.min(canvasStart.y, canvasEnd.y),
            width,
            height,
            rotation: 0,
            scaleX: 1,
            scaleY: 1
          },
          style: {
            fill: '#3b82f6',
            stroke: '#1d4ed8',
            strokeWidth: 2,
            opacity: 1,
            borderRadius: 8
          },
          isVisible: true,
          isLocked: false,
          zIndex: document.elementOrder.length
        };
        
        onCreate(element);
      }
    }
    
    if (selectionBox) {
      // Select elements within selection box
      const selectedElements: string[] = [];
      
      document.elementOrder.forEach(elementId => {
        const element = document.elements[elementId];
        if (!element || !element.isVisible) return;
        
        const screenPos = canvasToScreen({ x: element.transform.x, y: element.transform.y });
        const screenSize = {
          width: element.transform.width * document.viewport.zoom,
          height: element.transform.height * document.viewport.zoom
        };
        
        // Check if element intersects with selection box
        if (
          screenPos.x < selectionBox.x + selectionBox.width &&
          screenPos.x + screenSize.width > selectionBox.x &&
          screenPos.y < selectionBox.y + selectionBox.height &&
          screenPos.y + screenSize.height > selectionBox.y
        ) {
          selectedElements.push(elementId);
        }
      });
      
      onSelectionChange(selectedElements);
      setSelectionBox(null);
    }
    
    // Reset states
    setIsMouseDown(false);
    setDragStart(null);
    onStateChange({
      isDrawing: false,
      isDragging: false,
      isResizing: false,
      resizeHandle: undefined
    });
  }, [editorState, dragStart, selectionBox, document, onCreate, onSelectionChange, onStateChange, screenToCanvas, canvasToScreen]);

  // Redraw canvas when document changes
  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#1a1a1a]">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="absolute inset-0 cursor-crosshair"
        style={{ cursor: editorState.activeTool === 'hand' ? 'grab' : 'crosshair' }}
      />
      
      {/* Overlay for UI elements */}
      <div ref={overlayRef} className="absolute inset-0 pointer-events-none">
        {/* Canvas info */}
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-white/80">
          {Math.round(document.viewport.zoom * 100)}% • {document.elementOrder.length} elementos
        </div>
        
        {/* Instructions */}
        {document.elementOrder.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/60 backdrop-blur-sm rounded-xl p-8 text-center text-white max-w-md">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-lg font-medium mb-2">¡Comienza a diseñar!</h3>
              <p className="text-white/80 text-sm mb-4">
                Selecciona una herramienta y haz clic para crear tu primer elemento
              </p>
              <div className="text-xs text-white/60">
                💡 Tip: Usa <kbd className="bg-white/20 px-1 rounded">R</kbd> para rectángulos
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};