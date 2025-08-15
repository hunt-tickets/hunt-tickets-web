export interface Point {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Transform {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
}

export interface FigmaElement {
  id: string;
  type: 'zone' | 'seat' | 'stage' | 'text' | 'shape';
  name: string;
  transform: Transform;
  style: ElementStyle;
  isVisible: boolean;
  isLocked: boolean;
  parentId?: string;
  children?: string[];
  zIndex: number;
  metadata?: any;
}

export interface ElementStyle {
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  borderRadius: number;
  shadow?: ShadowStyle;
  effects?: Effect[];
}

export interface ShadowStyle {
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
}

export interface Effect {
  type: 'drop-shadow' | 'inner-shadow' | 'blur' | 'gradient';
  visible: boolean;
  settings: any;
}

export interface ZoneElement extends FigmaElement {
  type: 'zone';
  zoneType: 'general' | 'vip' | 'platinum' | 'stage' | 'bar' | 'entrance' | 'exit' | 'bathroom';
  capacity?: number;
  price?: number;
  seats?: SeatElement[];
}

export interface SeatElement extends FigmaElement {
  type: 'seat';
  seatNumber: string;
  row: string;
  isReserved: boolean;
  isBlocked: boolean;
  zoneId?: string;
}

export interface TextElement extends FigmaElement {
  type: 'text';
  content: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  textAlign: 'left' | 'center' | 'right';
  lineHeight: number;
}

export interface FigmaDocument {
  id: string;
  name: string;
  eventId: string;
  canvas: {
    width: number;
    height: number;
    backgroundColor: string;
    showGrid: boolean;
    gridSize: number;
    showRulers: boolean;
  };
  elements: { [id: string]: FigmaElement };
  elementOrder: string[]; // z-index order
  selection: string[];
  viewport: {
    zoom: number;
    offsetX: number;
    offsetY: number;
  };
  history: HistoryState[];
  historyIndex: number;
  lastModified: string;
}

export interface HistoryState {
  action: string;
  timestamp: number;
  elements: { [id: string]: FigmaElement };
  selection: string[];
}

export interface FigmaTool {
  id: string;
  name: string;
  icon: string;
  shortcut: string;
  cursor: string;
  description: string;
}

export interface FigmaEditorState {
  activeTool: string;
  isDrawing: boolean;
  isDragging: boolean;
  isResizing: boolean;
  resizeHandle?: ResizeHandle;
  selectionBox?: Rect;
  dragStart?: Point;
  showInspector: boolean;
  showLayers: boolean;
  showRulers: boolean;
  snapToGrid: boolean;
  snapToObjects: boolean;
}

export type ResizeHandle = 
  | 'top-left' 
  | 'top-center' 
  | 'top-right'
  | 'middle-left' 
  | 'middle-right'
  | 'bottom-left' 
  | 'bottom-center' 
  | 'bottom-right'
  | 'rotation';

export interface GuideLines {
  vertical: number[];
  horizontal: number[];
}

export const FIGMA_TOOLS: { [key: string]: FigmaTool } = {
  select: {
    id: 'select',
    name: 'Select',
    icon: '↖️',
    shortcut: 'V',
    cursor: 'default',
    description: 'Seleccionar y mover elementos'
  },
  rectangle: {
    id: 'rectangle',
    name: 'Rectangle',
    icon: '⬜',
    shortcut: 'R',
    cursor: 'crosshair',
    description: 'Crear zona rectangular'
  },
  circle: {
    id: 'circle',
    name: 'Circle',
    icon: '⭕',
    shortcut: 'O',
    cursor: 'crosshair',
    description: 'Crear zona circular'
  },
  text: {
    id: 'text',
    name: 'Text',
    icon: 'T',
    shortcut: 'T',
    cursor: 'text',
    description: 'Agregar texto'
  },
  hand: {
    id: 'hand',
    name: 'Hand',
    icon: '✋',
    shortcut: 'H',
    cursor: 'grab',
    description: 'Navegar por el canvas'
  },
  seat: {
    id: 'seat',
    name: 'Seat',
    icon: '💺',
    shortcut: 'S',
    cursor: 'crosshair',
    description: 'Colocar asientos'
  }
};

export const ZONE_PRESETS = {
  general: {
    name: 'General',
    fill: '#3b82f6',
    stroke: '#1d4ed8',
    icon: '👥',
    defaultCapacity: 100
  },
  vip: {
    name: 'VIP',
    fill: '#fbbf24',
    stroke: '#f59e0b',
    icon: '⭐',
    defaultCapacity: 50
  },
  platinum: {
    name: 'Platinum',
    fill: '#8b5cf6',
    stroke: '#7c3aed',
    icon: '💎',
    defaultCapacity: 25
  },
  stage: {
    name: 'Escenario',
    fill: '#ef4444',
    stroke: '#dc2626',
    icon: '🎭',
    defaultCapacity: 0
  },
  bar: {
    name: 'Bar',
    fill: '#10b981',
    stroke: '#059669',
    icon: '🍺',
    defaultCapacity: 30
  },
  entrance: {
    name: 'Entrada',
    fill: '#6b7280',
    stroke: '#4b5563',
    icon: '🚪',
    defaultCapacity: 0
  },
  exit: {
    name: 'Salida',
    fill: '#6b7280',
    stroke: '#4b5563',
    icon: '🚪',
    defaultCapacity: 0
  },
  bathroom: {
    name: 'Baño',
    fill: '#6b7280',
    stroke: '#4b5563',
    icon: '🚻',
    defaultCapacity: 0
  }
};

export const VENUE_TEMPLATES = {
  theater: {
    name: 'Teatro',
    description: 'Teatro tradicional con escenario y filas de asientos',
    thumbnail: '🎭',
    elements: [
      // Stage
      {
        type: 'zone',
        zoneType: 'stage',
        transform: { x: 200, y: 50, width: 400, height: 100, rotation: 0, scaleX: 1, scaleY: 1 },
        name: 'Escenario'
      },
      // Orchestra section
      {
        type: 'zone',
        zoneType: 'general',
        transform: { x: 150, y: 200, width: 500, height: 300, rotation: 0, scaleX: 1, scaleY: 1 },
        name: 'Platea'
      },
      // Balcony
      {
        type: 'zone',
        zoneType: 'vip',
        transform: { x: 200, y: 550, width: 400, height: 150, rotation: 0, scaleX: 1, scaleY: 1 },
        name: 'Balcón'
      }
    ]
  },
  stadium: {
    name: 'Estadio',
    description: 'Estadio con gradas y campo central',
    thumbnail: '🏟️',
    elements: [
      // Field
      {
        type: 'zone',
        zoneType: 'stage',
        transform: { x: 300, y: 200, width: 400, height: 250, rotation: 0, scaleX: 1, scaleY: 1 },
        name: 'Campo'
      },
      // North stand
      {
        type: 'zone',
        zoneType: 'general',
        transform: { x: 350, y: 50, width: 300, height: 100, rotation: 0, scaleX: 1, scaleY: 1 },
        name: 'Tribuna Norte'
      },
      // South stand
      {
        type: 'zone',
        zoneType: 'general',
        transform: { x: 350, y: 500, width: 300, height: 100, rotation: 0, scaleX: 1, scaleY: 1 },
        name: 'Tribuna Sur'
      },
      // East stand
      {
        type: 'zone',
        zoneType: 'vip',
        transform: { x: 150, y: 250, width: 100, height: 150, rotation: 0, scaleX: 1, scaleY: 1 },
        name: 'Tribuna Este VIP'
      },
      // West stand
      {
        type: 'zone',
        zoneType: 'vip',
        transform: { x: 750, y: 250, width: 100, height: 150, rotation: 0, scaleX: 1, scaleY: 1 },
        name: 'Tribuna Oeste VIP'
      }
    ]
  },
  club: {
    name: 'Club Nocturno',
    description: 'Club con pista de baile, bar y zonas VIP',
    thumbnail: '🕺',
    elements: [
      // Dance floor
      {
        type: 'zone',
        zoneType: 'general',
        transform: { x: 300, y: 200, width: 300, height: 200, rotation: 0, scaleX: 1, scaleY: 1 },
        name: 'Pista de Baile'
      },
      // Stage/DJ booth
      {
        type: 'zone',
        zoneType: 'stage',
        transform: { x: 400, y: 150, width: 100, height: 50, rotation: 0, scaleX: 1, scaleY: 1 },
        name: 'DJ Booth'
      },
      // Bar
      {
        type: 'zone',
        zoneType: 'bar',
        transform: { x: 150, y: 300, width: 100, height: 200, rotation: 0, scaleX: 1, scaleY: 1 },
        name: 'Bar Principal'
      },
      // VIP area
      {
        type: 'zone',
        zoneType: 'vip',
        transform: { x: 650, y: 250, width: 150, height: 150, rotation: 0, scaleX: 1, scaleY: 1 },
        name: 'Zona VIP'
      },
      // Entrance
      {
        type: 'zone',
        zoneType: 'entrance',
        transform: { x: 450, y: 450, width: 100, height: 50, rotation: 0, scaleX: 1, scaleY: 1 },
        name: 'Entrada'
      }
    ]
  }
};