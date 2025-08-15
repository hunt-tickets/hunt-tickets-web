"use client";

import { useState, useCallback } from 'react';
import { FigmaDocument, FigmaElement, ZoneElement, ZONE_PRESETS } from '@/types/figma-editor';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Search,
  ChevronDown,
  ChevronRight,
  Trash2,
  Copy,
  Edit3
} from 'lucide-react';

interface FigmaLayersProps {
  document: FigmaDocument;
  onSelectionChange: (elementIds: string[]) => void;
  onUpdateElement: (elementId: string, updates: Partial<FigmaElement>) => void;
  onDeleteElement: (elementId: string) => void;
}

export const FigmaLayers: React.FC<FigmaLayersProps> = ({
  document,
  onSelectionChange,
  onUpdateElement,
  onDeleteElement
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingName, setEditingName] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const filteredElements = document.elementOrder
    .map(id => document.elements[id])
    .filter(element => element && (!searchTerm || 
      element.name.toLowerCase().includes(searchTerm.toLowerCase())))
    .reverse(); // Show in reverse order (top elements first)

  const handleElementClick = useCallback((elementId: string, event: React.MouseEvent) => {
    if (event.shiftKey) {
      // Multi-select with shift
      const currentSelection = [...document.selection];
      if (currentSelection.includes(elementId)) {
        onSelectionChange(currentSelection.filter(id => id !== elementId));
      } else {
        onSelectionChange([...currentSelection, elementId]);
      }
    } else if (event.ctrlKey || event.metaKey) {
      // Toggle selection with ctrl/cmd
      if (document.selection.includes(elementId)) {
        onSelectionChange(document.selection.filter(id => id !== elementId));
      } else {
        onSelectionChange([...document.selection, elementId]);
      }
    } else {
      // Single selection
      onSelectionChange([elementId]);
    }
  }, [document.selection, onSelectionChange]);

  const handleNameEdit = useCallback((elementId: string, newName: string) => {
    onUpdateElement(elementId, { name: newName });
    setEditingName(null);
  }, [onUpdateElement]);

  const handleVisibilityToggle = useCallback((elementId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const element = document.elements[elementId];
    if (element) {
      onUpdateElement(elementId, { isVisible: !element.isVisible });
    }
  }, [document.elements, onUpdateElement]);

  const handleLockToggle = useCallback((elementId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const element = document.elements[elementId];
    if (element) {
      onUpdateElement(elementId, { isLocked: !element.isLocked });
    }
  }, [document.elements, onUpdateElement]);

  const getElementIcon = useCallback((element: FigmaElement) => {
    if (element.type === 'zone') {
      const zoneElement = element as ZoneElement;
      const preset = ZONE_PRESETS[zoneElement.zoneType];
      return preset?.icon || '📦';
    }
    
    switch (element.type) {
      case 'text': return '📝';
      case 'seat': return '💺';
      case 'stage': return '🎭';
      default: return '📦';
    }
  }, []);

  const LayerItem = ({ element }: { element: FigmaElement }) => {
    const isSelected = document.selection.includes(element.id);
    const isEditing = editingName === element.id;

    return (
      <div
        className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
          isSelected
            ? 'bg-blue-600/30 border border-blue-600/50'
            : 'hover:bg-white/5'
        }`}
        onClick={(e) => handleElementClick(element.id, e)}
      >
        {/* Element icon */}
        <span className="text-sm">{getElementIcon(element)}</span>

        {/* Element name */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={element.name}
              onChange={(e) => onUpdateElement(element.id, { name: e.target.value })}
              onBlur={() => setEditingName(null)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setEditingName(null);
                } else if (e.key === 'Escape') {
                  setEditingName(null);
                }
              }}
              className="w-full bg-transparent text-white text-sm outline-none border-b border-white/30"
              autoFocus
            />
          ) : (
            <span className="text-white text-sm truncate block">
              {element.name}
            </span>
          )}
        </div>

        {/* Element type badge */}
        <span className="text-xs text-white/50 bg-white/10 px-2 py-0.5 rounded">
          {element.type}
        </span>

        {/* Quick actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditingName(element.id);
            }}
            className="p-1 hover:bg-white/20 rounded"
            title="Editar nombre"
          >
            <Edit3 size={12} className="text-white/60" />
          </button>

          <button
            onClick={(e) => handleVisibilityToggle(element.id, e)}
            className="p-1 hover:bg-white/20 rounded"
            title={element.isVisible ? 'Ocultar' : 'Mostrar'}
          >
            {element.isVisible ? (
              <Eye size={12} className="text-white/60" />
            ) : (
              <EyeOff size={12} className="text-white/40" />
            )}
          </button>

          <button
            onClick={(e) => handleLockToggle(element.id, e)}
            className="p-1 hover:bg-white/20 rounded"
            title={element.isLocked ? 'Desbloquear' : 'Bloquear'}
          >
            {element.isLocked ? (
              <Lock size={12} className="text-white/60" />
            ) : (
              <Unlock size={12} className="text-white/60" />
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-80 bg-[#2c2c2c] border-r border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-medium">Capas</h3>
          <span className="text-white/50 text-sm">
            {document.elementOrder.length} elementos
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
          <input
            type="text"
            placeholder="Buscar capas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-3 py-2 text-white text-sm placeholder-white/60 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Quick actions */}
      <div className="p-3 border-b border-white/10">
        <div className="flex gap-2">
          <button
            onClick={() => {
              // Select all visible elements
              const visibleElements = document.elementOrder.filter(id => 
                document.elements[id]?.isVisible
              );
              onSelectionChange(visibleElements);
            }}
            className="flex-1 py-2 px-3 bg-white/10 hover:bg-white/20 rounded-lg text-white/80 text-xs transition-colors"
          >
            Seleccionar todo
          </button>
          
          <button
            onClick={() => {
              // Hide selected elements
              document.selection.forEach(id => {
                onUpdateElement(id, { isVisible: false });
              });
            }}
            className="flex-1 py-2 px-3 bg-white/10 hover:bg-white/20 rounded-lg text-white/80 text-xs transition-colors"
            disabled={document.selection.length === 0}
          >
            Ocultar selecc.
          </button>
        </div>
      </div>

      {/* Layers list */}
      <div className="flex-1 overflow-y-auto p-3">
        {filteredElements.length === 0 ? (
          <div className="text-center py-8 text-white/60">
            {searchTerm ? (
              <>
                <div className="text-2xl mb-3">🔍</div>
                <p className="text-sm">No se encontraron elementos</p>
              </>
            ) : (
              <>
                <div className="text-4xl mb-4">📄</div>
                <p className="text-sm">No hay capas</p>
                <p className="text-xs mt-2 text-white/40">
                  Crea tu primer elemento usando las herramientas
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredElements.map((element) => (
              <LayerItem key={element.id} element={element} />
            ))}
          </div>
        )}
      </div>

      {/* Layer stats */}
      {document.elementOrder.length > 0 && (
        <div className="border-t border-white/10 p-3">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-white font-medium text-sm">
                {document.elementOrder.filter(id => document.elements[id]?.isVisible).length}
              </div>
              <div className="text-white/60 text-xs">Visibles</div>
            </div>
            <div>
              <div className="text-white font-medium text-sm">
                {document.selection.length}
              </div>
              <div className="text-white/60 text-xs">Seleccionadas</div>
            </div>
            <div>
              <div className="text-white font-medium text-sm">
                {document.elementOrder.filter(id => document.elements[id]?.isLocked).length}
              </div>
              <div className="text-white/60 text-xs">Bloqueadas</div>
            </div>
          </div>
        </div>
      )}

      {/* Context menu (would appear on right-click) */}
      {document.selection.length > 0 && (
        <div className="border-t border-white/10 p-3">
          <div className="space-y-2">
            <button
              onClick={() => {
                // Duplicate selected elements
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
                    // This would need to be connected to the main editor
                  }
                });
              }}
              className="w-full flex items-center gap-2 py-2 px-3 bg-white/10 hover:bg-white/20 rounded-lg text-white/80 text-sm transition-colors"
            >
              <Copy size={14} />
              Duplicar selección
            </button>
            
            <button
              onClick={() => {
                document.selection.forEach(id => onDeleteElement(id));
              }}
              className="w-full flex items-center gap-2 py-2 px-3 bg-red-600/20 hover:bg-red-600/30 rounded-lg text-red-400 text-sm transition-colors"
            >
              <Trash2 size={14} />
              Eliminar selección
            </button>
          </div>
        </div>
      )}
    </div>
  );
};