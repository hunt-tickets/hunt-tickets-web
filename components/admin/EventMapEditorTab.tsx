"use client";

import { useMapEditor } from "@/lib/hooks/useMapEditor";

export default function EventMapEditorTab() {
  const {
    selectedTool,
    setSelectedTool,
    mapElements,
    selectedElement,
    handleCanvasClick,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    deleteSelectedElement,
    categories,
    seatStates,
  } = useMapEditor();

  const tools = [
    { id: 'select', name: 'Seleccionar', icon: '🔍' },
    { id: 'rectangle', name: 'Zona', icon: '⬛' },
    { id: 'stage', name: 'Escenario', icon: '🎭' },
    { id: 'entrance', name: 'Entrada', icon: '🚪' },
    { id: 'bathroom', name: 'Baño', icon: '🚻' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Editor de Mapa del Venue</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={deleteSelectedElement}
            disabled={!selectedElement}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors"
          >
            🗑️ Eliminar
          </button>
          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors">
            💾 Guardar Mapa
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Toolbar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-4 border border-white/[0.08]">
            <h3 className="text-lg font-medium text-white mb-4">Herramientas</h3>
            <div className="space-y-2">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                    selectedTool === tool.id
                      ? 'bg-white/20 text-white border border-white/30'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="text-lg">{tool.icon}</span>
                  <span className="text-sm">{tool.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-4 border border-white/[0.08]">
            <h3 className="text-lg font-medium text-white mb-4">Categorías</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02]">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-white text-sm">{category.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Seat States */}
          <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-4 border border-white/[0.08]">
            <h3 className="text-lg font-medium text-white mb-4">Estados de Asientos</h3>
            <div className="space-y-2">
              {Object.entries(seatStates).map(([key, state]) => (
                <div key={key} className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02]">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: state.color }}
                  />
                  <span className="text-white text-sm">{state.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="lg:col-span-3">
          <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/[0.08]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">Vista del Venue</h3>
              <div className="text-sm text-white/60">
                Herramienta activa: <span className="text-white">{tools.find(t => t.id === selectedTool)?.name}</span>
              </div>
            </div>
            
            <div className="relative w-full bg-gray-900 rounded-lg overflow-hidden" style={{ aspectRatio: '5/3' }}>
              <svg
                viewBox="0 0 1000 600"
                className="w-full h-full cursor-crosshair"
                onClick={handleCanvasClick}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* Grid pattern */}
                <defs>
                  <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#374151" strokeWidth="1" opacity="0.3"/>
                  </pattern>
                </defs>
                <rect width="1000" height="600" fill="url(#grid)" />
                
                {/* Map Elements */}
                {mapElements.map((element) => {
                  const isSelected = selectedElement === element.id;
                  
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
                          onMouseDown={(e) => handleMouseDown(element.id, e)}
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
                  
                  if (element.type === 'zone') {
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
                          onMouseDown={(e) => handleMouseDown(element.id, e)}
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
                  
                  return null;
                })}
              </svg>
            </div>
            
            <div className="mt-4 text-sm text-white/60">
              <p>• Usa las herramientas de la izquierda para agregar elementos al mapa</p>
              <p>• Selecciona elementos para moverlos o eliminarlos</p>
              <p>• Presiona Delete o Backspace para eliminar el elemento seleccionado</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}