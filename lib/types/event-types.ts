// Event-related types and interfaces for the admin dashboard

export interface EventDetails {
  id: string;
  name: string;
  description: string;
  description_plain: string;
  flyer: string;
  flyer_apple?: string;
  ics: string;
  date: string;
  hour: string;
  url: string;
  venue: {
    id: string;
    name: string;
    logo?: string;
    latitude: string;
    longitude: string;
    address: string;
    city: string;
    google_maps_link: string;
  };
  producers: Array<{
    name: string;
    logo?: string;
  }>;
}

export interface EventResponse {
  event: EventDetails;
  tickets: any[];
  has_tickets: boolean;
  has_producers: boolean;
  guest_list_enabled: boolean;
  guest_list_sold_out: boolean;
  guest_list_redeemed: boolean;
  styled_labels: {
    select_tickets: string;
    venue: string;
    producers: string;
  };
}

export interface SalesStats {
  event_id: string;
  ventas_totales: number;
  ingreso_neto_productor_ajustado: number;
  ventas_en_app: {
    total: number;
    productor: number;
    servicio: number;
    impuestos: number;
  };
  ventas_en_web: {
    total: number;
    productor: number;
    servicio: number;
    impuestos: number;
  };
  ventas_en_efectivo: {
    total: number;
    productor: number;
    servicio: number;
    impuestos: number;
  };
  promoters: Array<{
    promoter_id: string | null;
    promoter_name: string | null;
    total_sales: number;
  }>;
  timestamp: string;
}

// Map Editor Types
export interface MapElement {
  id: string;
  type: 'stage' | 'zone' | 'table' | 'bar' | 'entrance' | 'bathroom';
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  color?: string;
  seats?: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  price: number;
}

export interface SeatState {
  name: string;
  color: string;
}

export type SeatStates = {
  available: SeatState;
  reserved: SeatState;
  sold: SeatState;
  blocked: SeatState;
  wheelchair: SeatState;
};

// Tab Types
export type TabType = "overview" | "transactions" | "guest-list" | "tickets" | "settings" | "cortesias" | "map" | "analytics";
export type TicketsSubTab = "tickets" | "categories" | "pricing";
export type SettingsSubTab = "basic" | "map" | "apple-wallet";
export type CortesiasSubTab = "dashboard" | "create" | "settings";
export type SortDirection = 'asc' | 'desc';

// Filter Types
export interface TransactionFilters {
  searchTerm: string;
  statusFilter: string[];
  sourceFilter: string;
  currentPage: number;
  pageSize: number;
  sortField: string | null;
  sortDirection: SortDirection;
}

export interface GuestListFilters {
  search: string;
  statusFilter: string;
  page: number;
}