"use client";

import { useState } from 'react';
import { EDITOR_TOOLS } from '@/types/venue-map';
import { 
  Save, 
  Grid3X3, 
  Magnet, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';

interface MapEditorToolbarProps {
  selectedTool: string;
  onToolChange: (tool: string) => void;
  onSave: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  snapToGrid: boolean;
  onToggleSnap: () => void;
}

export const MapEditorToolbar: React.FC<MapEditorToolbarProps> = ({
  selectedTool,
  onToolChange,
  onSave,
  showGrid,
  onToggleGrid,
  snapToGrid,
  onToggleSnap
}) => {
  const [showLayerPanel, setShowLayerPanel] = useState(false);

  const ToolButton = ({ 
    toolId, 
    icon, 
    label, 
    description 
  }: { 
    toolId: string; 
    icon: string; 
    label: string; 
    description: string; 
  }) => (
    <button
      onClick={() => onToolChange(toolId)}
      className={`relative group flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-200 ${
        selectedTool === toolId
          ? 'bg-blue-600 shadow-lg shadow-blue-600/25'
          : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20'
      }`}
      title={description}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-xs text-white/80 mt-1 truncate w-full text-center">
        {label}
      </span>
      
      {/* Tooltip */}
      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
        {description}
      </div>
    </button>
  );

  return (
    <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 p-4">
      <div className="flex items-center justify-between">
        {/* Left side - Drawing tools */}
        <div className="flex items-center gap-2">
          {Object.entries(EDITOR_TOOLS).map(([toolId, tool]) => (
            <ToolButton
              key={toolId}
              toolId={toolId}
              icon={tool.icon}
              label={tool.name}
              description={tool.description}
            />
          ))}
          
          {/* Separator */}
          <div className="w-px h-8 bg-white/20 mx-2" />
          
          {/* View controls */}
          <button
            onClick={onToggleGrid}
            className={`flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 ${
              showGrid
                ? 'bg-green-600 shadow-lg shadow-green-600/25'
                : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20'
            }`}
            title="Mostrar/Ocultar grilla"
          >
            <Grid3X3 size={20} className="text-white" />
          </button>
          
          <button
            onClick={onToggleSnap}
            className={`flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 ${
              snapToGrid
                ? 'bg-green-600 shadow-lg shadow-green-600/25'
                : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20'
            }`}
            title="Ajustar a grilla"
          >
            <Magnet size={20} className="text-white" />
          </button>
        </div>

        {/* Center - Map title */}
        <div className="flex-1 text-center">
          <h2 className="text-xl font-semibold text-white">
            Editor de Mapa del Venue
          </h2>
          <p className="text-white/60 text-sm">
            Haz clic para crear zonas • Doble clic para completar
          </p>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center bg-white/5 rounded-lg border border-white/10">
            <button className="flex items-center justify-center w-10 h-10 hover:bg-white/10 transition-colors rounded-l-lg">
              <ZoomOut size={18} className="text-white" />
            </button>
            <div className="px-3 py-2 text-white text-sm border-x border-white/10">
              100%
            </div>
            <button className="flex items-center justify-center w-10 h-10 hover:bg-white/10 transition-colors rounded-r-lg">
              <ZoomIn size={18} className="text-white" />
            </button>
          </div>

          {/* Separator */}
          <div className="w-px h-8 bg-white/20 mx-2" />

          {/* Layer toggle */}
          <button
            onClick={() => setShowLayerPanel(!showLayerPanel)}
            className="flex items-center justify-center w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200"
            title="Panel de capas"
          >
            {showLayerPanel ? <EyeOff size={20} className="text-white" /> : <Eye size={20} className="text-white" />}
          </button>

          {/* Import/Export */}
          <button className="flex items-center justify-center w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200">
            <Upload size={20} className="text-white" />
          </button>
          
          <button className="flex items-center justify-center w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200">
            <Download size={20} className="text-white" />
          </button>

          {/* Reset */}
          <button className="flex items-center justify-center w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200">
            <RotateCcw size={20} className="text-white" />
          </button>

          {/* Save button */}
          <button
            onClick={onSave}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] rounded-xl transition-all duration-300 text-white font-medium shadow-lg shadow-blue-600/25"
          >
            <Save size={18} />
            Guardar Mapa
          </button>
        </div>
      </div>

      {/* Layer panel (conditional) */}
      {showLayerPanel && (
        <div className="mt-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-4">
          <h3 className="text-white font-medium mb-3">Capas del Mapa</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <Eye size={16} className="text-white/60" />
                <span className="text-white/80 text-sm">Grilla</span>
              </div>
              <input 
                type="checkbox" 
                checked={showGrid}
                onChange={onToggleGrid}
                className="w-4 h-4"
              />
            </div>
            <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <Eye size={16} className="text-white/60" />
                <span className="text-white/80 text-sm">Zonas</span>
              </div>
              <input 
                type="checkbox" 
                defaultChecked
                className="w-4 h-4"
              />
            </div>
            <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <Eye size={16} className="text-white/60" />
                <span className="text-white/80 text-sm">Asientos</span>
              </div>
              <input 
                type="checkbox" 
                defaultChecked
                className="w-4 h-4"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};