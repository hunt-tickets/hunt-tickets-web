"use client";

import { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import { 
  FigmaDocument, 
  FigmaElement, 
  FigmaEditorState, 
  Point, 
  Rect,
  ZoneElement,
  Transform,
  FIGMA_TOOLS,
  ZONE_PRESETS
} from '@/types/figma-editor';
import { FigmaToolbar } from './figma-toolbar';
import { FigmaInspector } from './figma-inspector';
import { FigmaLayers } from './figma-layers';
import { FigmaCanvas } from './figma-canvas';
import { FigmaShortcuts } from './figma-shortcuts';

interface FigmaVenueEditorProps {
  eventId: string;
  initialData?: Partial<FigmaDocument>;
  onSave?: (document: FigmaDocument) => void;
}

const DEFAULT_CANVAS = {
  width: 1200,
  height: 800,
  backgroundColor: '#1a1a1a',
  showGrid: true,
  gridSize: 20,
  showRulers: true
};

export const FigmaVenueEditor: React.FC<FigmaVenueEditorProps> = ({
  eventId,
  initialData,
  onSave
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [document, setDocument] = useState<FigmaDocument>({
    id: `doc-${eventId}`,
    name: 'Venue Map',
    eventId,
    canvas: { ...DEFAULT_CANVAS, ...initialData?.canvas },
    elements: initialData?.elements || {},
    elementOrder: initialData?.elementOrder || [],
    selection: [],
    viewport: {
      zoom: 1,
      offsetX: 0,
      offsetY: 0,
      ...initialData?.viewport
    },
    history: [],
    historyIndex: -1,
    lastModified: new Date().toISOString()
  });

  const [editorState, setEditorState] = useState<FigmaEditorState>({
    activeTool: 'select',
    isDrawing: false,
    isDragging: false,
    isResizing: false,
    showInspector: true,
    showLayers: true,
    showRulers: true,
    snapToGrid: true,
    snapToObjects: true
  });

  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Handle container resize
  useLayoutEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Create new element
  const createElement = useCallback((
    type: FigmaElement['type'], 
    position: Point, 
    size?: { width: number; height: number }
  ): FigmaElement => {
    const id = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const elementSize = size || { width: 100, height: 100 };

    const baseElement: FigmaElement = {
      id,
      type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${Object.keys(document.elements).length + 1}`,
      transform: {
        x: position.x,
        y: position.y,
        width: elementSize.width,
        height: elementSize.height,
        rotation: 0,
        scaleX: 1,
        scaleY: 1
      },
      style: {
        fill: '#3b82f6',
        stroke: '#1d4ed8',
        strokeWidth: 2,
        opacity: 1,
        borderRadius: 4
      },
      isVisible: true,
      isLocked: false,
      zIndex: document.elementOrder.length
    };

    if (type === 'zone') {
      const zoneElement: ZoneElement = {
        ...baseElement,
        type: 'zone',
        zoneType: 'general',
        capacity: ZONE_PRESETS.general.defaultCapacity,
        style: {
          ...baseElement.style,
          fill: ZONE_PRESETS.general.fill,
          stroke: ZONE_PRESETS.general.stroke
        }
      };
      return zoneElement;
    }

    return baseElement;
  }, [document.elements, document.elementOrder]);

  // Add element to document
  const addElement = useCallback((element: FigmaElement) => {
    setDocument(prev => {
      const newDocument = {
        ...prev,
        elements: {
          ...prev.elements,
          [element.id]: element
        },
        elementOrder: [...prev.elementOrder, element.id],
        selection: [element.id],
        lastModified: new Date().toISOString()
      };

      // Add to history
      const historyEntry = {
        action: 'create',
        timestamp: Date.now(),
        elements: newDocument.elements,
        selection: newDocument.selection
      };

      newDocument.history = [...prev.history.slice(0, prev.historyIndex + 1), historyEntry];
      newDocument.historyIndex = newDocument.history.length - 1;

      return newDocument;
    });
  }, []);

  // Update element
  const updateElement = useCallback((elementId: string, updates: Partial<FigmaElement>) => {
    setDocument(prev => {
      const element = prev.elements[elementId];
      if (!element) return prev;

      const updatedElement = { ...element, ...updates };
      
      return {
        ...prev,
        elements: {
          ...prev.elements,
          [elementId]: updatedElement
        },
        lastModified: new Date().toISOString()
      };
    });
  }, []);

  // Delete selected elements
  const deleteSelectedElements = useCallback(() => {
    if (document.selection.length === 0) return;

    setDocument(prev => {
      const newElements = { ...prev.elements };
      const newElementOrder = [...prev.elementOrder];

      prev.selection.forEach(id => {
        delete newElements[id];
        const index = newElementOrder.indexOf(id);
        if (index > -1) {
          newElementOrder.splice(index, 1);
        }
      });

      const newDocument = {
        ...prev,
        elements: newElements,
        elementOrder: newElementOrder,
        selection: [],
        lastModified: new Date().toISOString()
      };

      // Add to history
      const historyEntry = {
        action: 'delete',
        timestamp: Date.now(),
        elements: newDocument.elements,
        selection: newDocument.selection
      };

      newDocument.history = [...prev.history.slice(0, prev.historyIndex + 1), historyEntry];
      newDocument.historyIndex = newDocument.history.length - 1;

      return newDocument;
    });
  }, [document.selection]);

  // Duplicate selected elements
  const duplicateSelectedElements = useCallback(() => {
    if (document.selection.length === 0) return;

    const newElements: FigmaElement[] = [];
    
    document.selection.forEach(id => {
      const element = document.elements[id];
      if (element) {
        const duplicated = {
          ...element,
          id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: `${element.name} Copy`,
          transform: {
            ...element.transform,
            x: element.transform.x + 20,
            y: element.transform.y + 20
          }
        };
        newElements.push(duplicated);
      }
    });

    if (newElements.length > 0) {
      setDocument(prev => {
        const newDocument = {
          ...prev,
          elements: {
            ...prev.elements,
            ...Object.fromEntries(newElements.map(el => [el.id, el]))
          },
          elementOrder: [...prev.elementOrder, ...newElements.map(el => el.id)],
          selection: newElements.map(el => el.id),
          lastModified: new Date().toISOString()
        };

        // Add to history
        const historyEntry = {
          action: 'duplicate',
          timestamp: Date.now(),
          elements: newDocument.elements,
          selection: newDocument.selection
        };

        newDocument.history = [...prev.history.slice(0, prev.historyIndex + 1), historyEntry];
        newDocument.historyIndex = newDocument.history.length - 1;

        return newDocument;
      });
    }
  }, [document.selection, document.elements]);

  // Undo/Redo functionality
  const undo = useCallback(() => {
    if (document.historyIndex > 0) {
      const newIndex = document.historyIndex - 1;
      const historyState = document.history[newIndex];
      
      setDocument(prev => ({
        ...prev,
        elements: historyState.elements,
        selection: historyState.selection,
        historyIndex: newIndex,
        lastModified: new Date().toISOString()
      }));
    }
  }, [document.historyIndex, document.history]);

  const redo = useCallback(() => {
    if (document.historyIndex < document.history.length - 1) {
      const newIndex = document.historyIndex + 1;
      const historyState = document.history[newIndex];
      
      setDocument(prev => ({
        ...prev,
        elements: historyState.elements,
        selection: historyState.selection,
        historyIndex: newIndex,
        lastModified: new Date().toISOString()
      }));
    }
  }, [document.historyIndex, document.history]);

  // Save document
  const saveDocument = useCallback(() => {
    onSave?.(document);
    localStorage.setItem(`figma-venue-${eventId}`, JSON.stringify(document));
  }, [document, eventId, onSave]);

  // Tool change handler
  const handleToolChange = useCallback((toolId: string) => {
    setEditorState(prev => ({
      ...prev,
      activeTool: toolId,
      isDrawing: false,
      isDragging: false,
      isResizing: false
    }));
  }, []);

  // Selection handler
  const handleSelectionChange = useCallback((elementIds: string[]) => {
    setDocument(prev => ({
      ...prev,
      selection: elementIds
    }));
  }, []);

  // Viewport change handler
  const handleViewportChange = useCallback((viewport: Partial<typeof document.viewport>) => {
    setDocument(prev => ({
      ...prev,
      viewport: {
        ...prev.viewport,
        ...viewport
      }
    }));
  }, []);

  return (
    <div 
      ref={containerRef}
      className="h-full w-full bg-[#2c2c2c] flex flex-col overflow-hidden"
    >
      {/* Shortcuts handler */}
      <FigmaShortcuts
        onToolChange={handleToolChange}
        onDelete={deleteSelectedElements}
        onDuplicate={duplicateSelectedElements}
        onUndo={undo}
        onRedo={redo}
        onSave={saveDocument}
      />

      {/* Toolbar */}
      <FigmaToolbar
        activeTool={editorState.activeTool}
        onToolChange={handleToolChange}
        zoom={document.viewport.zoom}
        onZoomChange={(zoom) => handleViewportChange({ zoom })}
        onSave={saveDocument}
        showInspector={editorState.showInspector}
        onToggleInspector={() => setEditorState(prev => ({ ...prev, showInspector: !prev.showInspector }))}
        showLayers={editorState.showLayers}
        onToggleLayers={() => setEditorState(prev => ({ ...prev, showLayers: !prev.showLayers }))}
      />

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Layers panel */}
        {editorState.showLayers && (
          <FigmaLayers
            document={document}
            onSelectionChange={handleSelectionChange}
            onUpdateElement={updateElement}
            onDeleteElement={(id) => {
              setDocument(prev => ({
                ...prev,
                selection: [id]
              }));
              deleteSelectedElements();
            }}
          />
        )}

        {/* Canvas */}
        <div className="flex-1 relative">
          <FigmaCanvas
            document={document}
            editorState={editorState}
            containerSize={containerSize}
            onCreate={addElement}
            onUpdate={updateElement}
            onSelectionChange={handleSelectionChange}
            onViewportChange={handleViewportChange}
            onStateChange={setEditorState}
          />
        </div>

        {/* Inspector panel */}
        {editorState.showInspector && (
          <FigmaInspector
            document={document}
            onUpdateElement={updateElement}
            onDeleteSelected={deleteSelectedElements}
          />
        )}
      </div>
    </div>
  );
};