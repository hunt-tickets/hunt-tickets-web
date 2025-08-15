export interface Point {
  x: number;
  y: number;
}

export interface VenueZone {
  id: string;
  name: string;
  type: 'general' | 'vip' | 'platinum' | 'stage' | 'bar' | 'entrance' | 'exit' | 'bathroom';
  color: string;
  capacity?: number;
  price?: number;
  points: Point[];
  seats?: Seat[];
  isVisible: boolean;
}

export interface Seat {
  id: string;
  position: Point;
  seatNumber: string;
  row: string;
  isReserved: boolean;
  isBlocked: boolean;
  zoneId: string;
}

export interface VenueMapData {
  id: string;
  eventId: string;
  name: string;
  dimensions: {
    width: number;
    height: number;
  };
  zones: VenueZone[];
  backgroundImage?: string;
  scale: number;
  lastModified: string;
}

export interface MapEditorTool {
  id: string;
  name: string;
  icon: string;
  cursor: string;
  description: string;
}

export interface MapEditorState {
  selectedTool: string;
  selectedZone: string | null;
  isDrawing: boolean;
  currentPoints: Point[];
  zoom: number;
  pan: Point;
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
}

export const ZONE_TYPES = {
  general: { name: 'General', color: '#3b82f6', icon: '👥' },
  vip: { name: 'VIP', color: '#fbbf24', icon: '⭐' },
  platinum: { name: 'Platinum', color: '#8b5cf6', icon: '💎' },
  stage: { name: 'Escenario', color: '#ef4444', icon: '🎭' },
  bar: { name: 'Bar', color: '#10b981', icon: '🍺' },
  entrance: { name: 'Entrada', color: '#6b7280', icon: '🚪' },
  exit: { name: 'Salida', color: '#6b7280', icon: '🚪' },
  bathroom: { name: 'Baño', color: '#6b7280', icon: '🚻' },
} as const;

export const EDITOR_TOOLS = {
  select: { name: 'Seleccionar', icon: '↖️', cursor: 'default', description: 'Seleccionar y mover elementos' },
  zone: { name: 'Crear Zona', icon: '⬜', cursor: 'crosshair', description: 'Dibujar nueva zona' },
  seat: { name: 'Agregar Asientos', icon: '💺', cursor: 'crosshair', description: 'Colocar asientos individuales' },
  seatGrid: { name: 'Grilla de Asientos', icon: '⊞', cursor: 'crosshair', description: 'Crear grilla de asientos' },
  erase: { name: 'Borrar', icon: '🗑️', cursor: 'crosshair', description: 'Eliminar elementos' },
  pan: { name: 'Mover Vista', icon: '✋', cursor: 'grab', description: 'Navegar por el mapa' },
} as const;