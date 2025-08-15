"use client";

import { useState } from 'react';
import { FIGMA_TOOLS } from '@/types/figma-editor';
import { 
  Save, 
  ZoomIn, 
  ZoomOut, 
  Minus,
  Plus,
  RotateCcw,
  RotateCw,
  Eye,
  EyeOff,
  Layers,
  Settings,
  Download,
  Upload,
  Grid3X3,
  Ruler
} from 'lucide-react';

interface FigmaToolbarProps {
  activeTool: string;
  onToolChange: (toolId: string) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onSave: () => void;
  showInspector: boolean;
  onToggleInspector: () => void;
  showLayers: boolean;
  onToggleLayers: () => void;
}

export const FigmaToolbar: React.FC<FigmaToolbarProps> = ({
  activeTool,
  onToolChange,
  zoom,
  onZoomChange,
  onSave,
  showInspector,
  onToggleInspector,
  showLayers,
  onToggleLayers
}) => {
  const [showMore, setShowMore] = useState(false);

  const formatZoom = (value: number) => `${Math.round(value * 100)}%`;

  const zoomToFit = () => {
    onZoomChange(1);
  };

  const zoomIn = () => {
    onZoomChange(Math.min(zoom * 1.2, 10));
  };

  const zoomOut = () => {
    onZoomChange(Math.max(zoom / 1.2, 0.1));
  };

  const ToolButton = ({ tool }: { tool: typeof FIGMA_TOOLS[keyof typeof FIGMA_TOOLS] }) => (
    <button
      onClick={() => onToolChange(tool.id)}
      className={`group relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 hover:bg-white/10 ${
        activeTool === tool.id
          ? 'bg-white/15 text-white shadow-sm'
          : 'text-white/70 hover:text-white'
      }`}
      title={`${tool.description} (${tool.shortcut})`}
    >
      <span className="text-lg">{tool.icon}</span>
      
      {/* Tooltip */}
      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
        {tool.description}
        <span className="ml-2 text-white/60">{tool.shortcut}</span>
      </div>
    </button>
  );

  const IconButton = ({ 
    icon, 
    onClick, 
    active = false, 
    title 
  }: { 
    icon: React.ReactNode; 
    onClick: () => void; 
    active?: boolean; 
    title: string; 
  }) => (
    <button
      onClick={onClick}
      className={`group relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 hover:bg-white/10 ${
        active
          ? 'bg-white/15 text-white shadow-sm'
          : 'text-white/70 hover:text-white'
      }`}
      title={title}
    >
      {icon}
      
      {/* Tooltip */}
      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
        {title}
      </div>
    </button>
  );

  return (
    <div className="bg-[#2c2c2c] border-b border-white/10 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Tools */}
        <div className="flex items-center gap-1">
          {/* Main tools */}
          <div className="flex items-center gap-1 mr-3">
            {Object.values(FIGMA_TOOLS).map((tool) => (
              <ToolButton key={tool.id} tool={tool} />
            ))}
          </div>

          {/* Separator */}
          <div className="w-px h-6 bg-white/20 mx-2" />

          {/* Quick actions */}
          <div className="flex items-center gap-1">
            <IconButton
              icon={<RotateCcw size={16} />}
              onClick={() => {}} // Will be connected to undo
              title="Deshacer (Ctrl+Z)"
            />
            <IconButton
              icon={<RotateCw size={16} />}
              onClick={() => {}} // Will be connected to redo
              title="Rehacer (Ctrl+Y)"
            />
          </div>
        </div>

        {/* Center - Project name and zoom */}
        <div className="flex items-center gap-4">
          <div className="text-white font-medium">
            Editor de Venue
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-2 bg-black/20 rounded-lg px-2 py-1">
            <IconButton
              icon={<Minus size={14} />}
              onClick={zoomOut}
              title="Zoom out"
            />
            
            <button
              onClick={zoomToFit}
              className="px-3 py-1 text-white/80 hover:text-white text-sm font-mono transition-colors min-w-[60px]"
              title="Zoom to fit"
            >
              {formatZoom(zoom)}
            </button>
            
            <IconButton
              icon={<Plus size={14} />}
              onClick={zoomIn}
              title="Zoom in"
            />
          </div>
        </div>

        {/* Right side - View controls and actions */}
        <div className="flex items-center gap-1">
          {/* View controls */}
          <div className="flex items-center gap-1 mr-3">
            <IconButton
              icon={<Grid3X3 size={16} />}
              onClick={() => {}} // Will be connected to grid toggle
              title="Mostrar grilla"
            />
            
            <IconButton
              icon={<Ruler size={16} />}
              onClick={() => {}} // Will be connected to rulers toggle
              title="Mostrar reglas"
            />
          </div>

          {/* Panel toggles */}
          <div className="flex items-center gap-1 mr-3">
            <IconButton
              icon={<Layers size={16} />}
              onClick={onToggleLayers}
              active={showLayers}
              title="Panel de capas"
            />
            
            <IconButton
              icon={<Settings size={16} />}
              onClick={onToggleInspector}
              active={showInspector}
              title="Panel de propiedades"
            />
          </div>

          {/* Separator */}
          <div className="w-px h-6 bg-white/20 mx-2" />

          {/* File actions */}
          <div className="flex items-center gap-1 mr-3">
            <IconButton
              icon={<Upload size={16} />}
              onClick={() => {}} // Will be connected to import
              title="Importar"
            />
            
            <IconButton
              icon={<Download size={16} />}
              onClick={() => {}} // Will be connected to export
              title="Exportar"
            />
          </div>

          {/* Save button */}
          <button
            onClick={onSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] rounded-lg transition-all duration-300 text-white font-medium text-sm shadow-lg shadow-blue-600/25"
          >
            <Save size={16} />
            Guardar
          </button>

          {/* More options */}
          <div className="relative">
            <IconButton
              icon={
                <div className="flex flex-col gap-0.5">
                  <div className="w-1 h-1 bg-current rounded-full"></div>
                  <div className="w-1 h-1 bg-current rounded-full"></div>
                  <div className="w-1 h-1 bg-current rounded-full"></div>
                </div>
              }
              onClick={() => setShowMore(!showMore)}
              active={showMore}
              title="Más opciones"
            />

            {/* Dropdown menu */}
            {showMore && (
              <div className="absolute top-12 right-0 bg-[#1e1e1e] border border-white/10 rounded-lg shadow-xl py-2 w-48 z-50">
                <button className="w-full px-4 py-2 text-left text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm">
                  🎭 Templates de Venue
                </button>
                <button className="w-full px-4 py-2 text-left text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm">
                  ⚙️ Configuración
                </button>
                <button className="w-full px-4 py-2 text-left text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm">
                  📋 Copiar enlace
                </button>
                <div className="border-t border-white/10 my-2"></div>
                <button className="w-full px-4 py-2 text-left text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm">
                  ❓ Ayuda
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};