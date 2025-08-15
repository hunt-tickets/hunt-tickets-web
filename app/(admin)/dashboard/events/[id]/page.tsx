"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseBrowser";
import blurImage from "@/assets/other.png";
import StatisticsCard5 from "@/components/ui/statistics-card-5";
import StatisticsCard2 from "@/components/ui/statistics-card-2";
import AppleWalletCustomizer from "@/components/ui/apple-wallet-customizer";
import ModernBreadcrumbs from "@/components/ui/modern-breadcrumbs";
import { VenueMapEditor } from "@/components/ui/venue-map-editor";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { CreditCard, ChevronUp, ChevronDown } from "lucide-react";
import {
  Cell,
  Column,
  Row,
  Table,
  TableBody,
  TableHeader,
} from "@/components/ui/table";
import { getEventTransactions, type Transaction, type TransactionsResponse } from "@/lib/api/transactions";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Bar, BarChart, XAxis, Cell as RechartsCell } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/bar-chart";

interface EventDetails {
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

interface EventResponse {
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

interface SalesStats {
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

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [eventData, setEventData] = useState<EventResponse | null>(null);
  const [salesStats, setSalesStats] = useState<SalesStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingSales, setLoadingSales] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [transactionsData, setTransactionsData] = useState<TransactionsResponse | null>(null);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20); // Registros por página
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>(["PAID WITH QR", "PAID", "PROCESSING", "PENDING", "EXPIRADO", "REJECTED_BY_PAYMENT_GATEWAY", "FAILED"]);
  const [sourceFilter, setSourceFilter] = useState("all");
  const [activeChartIndex, setActiveChartIndex] = useState<number | null>(null);
  const [allTransactionsForChart, setAllTransactionsForChart] = useState<Transaction[]>([]);
  const [isChartVisible, setIsChartVisible] = useState(true);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [ticketsSubTab, setTicketsSubTab] = useState("tickets");
  const [settingsSubTab, setSettingsSubTab] = useState("basic");

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.access_token) {
          router.push('/login');
          return;
        }

        // Debug: Log the event ID we're trying to fetch
        console.log("Fetching event with ID:", params.id);
        
        // Fetch event details using the new endpoint
        const response = await fetch(
          `https://jtfcfsnksywotlbsddqb.functions.supabase.co/event_complete_details`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              event_id: params.id
            }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`HTTP error! status: ${response.status}, body: ${errorText}`);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const eventResponse = await response.json();
        console.log("API Response:", eventResponse);
        console.log("Event hex field:", {
          hex: eventResponse?.event?.hex,
          formatted: eventResponse?.event?.hex ? (eventResponse.event.hex.startsWith('#') ? eventResponse.event.hex : `#${eventResponse.event.hex}`) : 'not found'
        });
        
        if (eventResponse.event) {
          setEventData(eventResponse);
        } else if (eventResponse.code) {
          console.error("API Error:", eventResponse.msg || "Unknown error");
          setError(`Error ${eventResponse.code}: ${eventResponse.msg || "Error desconocido"}`);
        } else {
          // Event not found
          setError("Evento no encontrado");
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
        setError(error instanceof Error ? error.message : "Error desconocido");
        setEventData(null);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchEventDetails();
    }
  }, [params.id, router]);

  // Auto-load sales stats when event data is loaded
  useEffect(() => {
    if (eventData && !salesStats) {
      fetchSalesStats();
    }
  }, [eventData]);

  // Fetch transactions when transactions tab is active
  useEffect(() => {
    if (activeTab === "transactions" && eventData && !transactionsData) {
      fetchTransactions();
      fetchAllTransactionsForChart();
    }
  }, [activeTab, eventData]);

  const fetchTransactions = async (page: number = currentPage) => {
    if (!params.id) return;
    
    setLoadingTransactions(true);
    try {
      const response = await getEventTransactions(params.id as string, page, pageSize);
      
      
      setTransactionsData(response);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError(error instanceof Error ? error.message : "Error desconocido al cargar transacciones");
    } finally {
      setLoadingTransactions(false);
    }
  };

  // Fetch all transactions for chart (no pagination)
  const fetchAllTransactionsForChart = async () => {
    if (!params.id) return;
    
    try {
      // Obtener todas las transacciones con un límite alto
      const response = await getEventTransactions(params.id as string, 1, 1000);
      setAllTransactionsForChart(response.data);
    } catch (error) {
      console.error("Error fetching all transactions for chart:", error);
    }
  };

  // Filter transactions based on search term and filters
  const getFilteredTransactions = () => {
    if (!transactionsData?.data) return [];

    const filtered = transactionsData.data.filter(transaction => {
      // Search filter
      const matchesSearch = searchTerm === "" || 
        transaction.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${transaction.user_name} ${transaction.user_lastname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.ticket_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (transaction.has_promoter && transaction.promoter_name && 
         `${transaction.promoter_name} ${transaction.promoter_lastname}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (transaction.has_promoter && transaction.promoter_email && 
         transaction.promoter_email.toLowerCase().includes(searchTerm.toLowerCase()));

      // Status filter - manejar caso especial de EXPIRADO y múltiple selección
      const matchesStatus = statusFilter.some(filter => {
        if (filter === "EXPIRADO") {
          return isTransactionExpired(transaction.created_at, transaction.status);
        }
        return transaction.status === filter;
      });

      // Source filter - handle mapping
      const matchesSource = sourceFilter === "all" || (() => {
        const normalizedSource = transaction.source.toLowerCase();
        switch (sourceFilter) {
          case "mobile":
            return normalizedSource === "mobile" || normalizedSource === "app";
          case "web":
            return normalizedSource === "web" || normalizedSource === "website";
          case "cash":
            return normalizedSource === "cash" || normalizedSource === "efectivo";
          default:
            return normalizedSource === sourceFilter.toLowerCase();
        }
      })();

      return matchesSearch && matchesStatus && matchesSource;
    });

    // Aplicar sorting
    let sorted = [...filtered];
    if (sortField) {
      sorted.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortField) {
          case 'order_id':
            aValue = a.order_id;
            bValue = b.order_id;
            break;
          case 'created_at':
            // Parsear fecha formato "26/04/2025 19:14"
            const parseDate = (dateString: string) => {
              try {
                const [datePart, timePart] = dateString.split(' ');
                const [day, month, year] = datePart.split('/');
                const [hour, minute] = timePart.split(':');
                return new Date(
                  parseInt(year, 10), 
                  parseInt(month, 10) - 1,
                  parseInt(day, 10), 
                  parseInt(hour, 10), 
                  parseInt(minute, 10)
                );
              } catch {
                return new Date(0);
              }
            };
            aValue = parseDate(a.created_at);
            bValue = parseDate(b.created_at);
            break;
          case 'user_name':
            aValue = `${a.user_name} ${a.user_lastname}`.toLowerCase();
            bValue = `${b.user_name} ${b.user_lastname}`.toLowerCase();
            break;
          case 'seller_name':
            aValue = a.has_promoter && a.promoter_name ? `${a.promoter_name} ${a.promoter_lastname}`.toLowerCase() : "sin promotor";
            bValue = b.has_promoter && b.promoter_name ? `${b.promoter_name} ${b.promoter_lastname}`.toLowerCase() : "sin promotor";
            break;
          case 'ticket_name':
            aValue = a.ticket_name.toLowerCase();
            bValue = b.ticket_name.toLowerCase();
            break;
          case 'price':
            aValue = a.price;
            bValue = b.price;
            break;
          case 'variable_fee':
            aValue = a.variable_fee;
            bValue = b.variable_fee;
            break;
          case 'tax':
            aValue = a.tax;
            bValue = b.tax;
            break;
          case 'total':
            aValue = a.total;
            bValue = b.total;
            break;
          case 'source':
            aValue = a.source.toLowerCase();
            bValue = b.source.toLowerCase();
            break;
          case 'status':
            aValue = isTransactionExpired(a.created_at, a.status) ? "EXPIRADO" : a.status;
            bValue = isTransactionExpired(b.created_at, b.status) ? "EXPIRADO" : b.status;
            break;
          default:
            return 0;
        }

        if (aValue < bValue) {
          return sortDirection === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
      });
    } else {
      // Ordenamiento por defecto: por fecha descendente (más recientes primero)
      sorted.sort((a, b) => {
        const parseDate = (dateString: string) => {
          try {
            const [datePart, timePart] = dateString.split(' ');
            const [day, month, year] = datePart.split('/');
            const [hour, minute] = timePart.split(':');
            return new Date(
              parseInt(year, 10), 
              parseInt(month, 10) - 1,
              parseInt(day, 10), 
              parseInt(hour, 10), 
              parseInt(minute, 10)
            );
          } catch {
            return new Date(0);
          }
        };
        const dateA = parseDate(a.created_at);
        const dateB = parseDate(b.created_at);
        return dateB.getTime() - dateA.getTime();
      });
    }
    
    return sorted;
  };

  // Reset to first page when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Handle column sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sortable header component
  const SortableHeader = ({ field, children }: { field: string, children: React.ReactNode }) => (
    <th 
      className="text-left py-3 px-4 text-white/80 font-medium text-sm cursor-pointer hover:text-white transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        <div className="flex flex-col">
          <ChevronUp 
            className={`h-3 w-3 ${sortField === field && sortDirection === 'asc' ? 'text-white' : 'text-white/30'}`} 
          />
          <ChevronDown 
            className={`h-3 w-3 -mt-1 ${sortField === field && sortDirection === 'desc' ? 'text-white' : 'text-white/30'}`} 
          />
        </div>
      </div>
    </th>
  );

  // Handle multiple status filter toggle
  const toggleStatusFilter = (status: string) => {
    setStatusFilter(prev => {
      if (prev.includes(status)) {
        // Si está seleccionado, lo quitamos (pero no permitimos array vacío)
        const newFilter = prev.filter(s => s !== status);
        return newFilter.length > 0 ? newFilter : prev;
      } else {
        // Si no está seleccionado, lo agregamos
        return [...prev, status];
      }
    });
    handleFilterChange();
  };

  // Function to map source values to display names
  const getChannelDisplayName = (source: string): string => {
    const channelMap: { [key: string]: string } = {
      'mobile': 'Aplicación Móvil',
      'web': 'Página Web',
      'cash': 'Efectivo',
      'app': 'Aplicación Móvil',
      'website': 'Página Web',
      'efectivo': 'Efectivo',
      // Fallbacks for any other values
    };
    
    return channelMap[source.toLowerCase()] || source;
  };

  // Chart configuration for stacked chart
  const chartConfig = {
    paidWithQR: {
      label: "Pagado con QR",
      color: "#10b981", // green-500
    },
    paid: {
      label: "Pagado",
      color: "#059669", // emerald-600
    },
    processing: {
      label: "Procesando",
      color: "#3b82f6", // blue-500
    },
    pending: {
      label: "Pendiente",
      color: "#eab308", // yellow-500
    },
    expired: {
      label: "Expirado",
      color: "#f97316", // orange-500
    },
    rejected: {
      label: "Rechazado",
      color: "#ef4444", // red-500
    },
    failed: {
      label: "Fallido",
      color: "#dc2626", // red-600
    },
  } satisfies ChartConfig;

  // Generate stacked chart data for the last 30 days with all states
  const getSalesDataByDay = () => {
    if (!allTransactionsForChart || allTransactionsForChart.length === 0) return [];
    
    // Create last 30 days array
    const today = new Date();
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() - i);
      return date;
    }).reverse();
    
    // Group transactions by date
    const dateGroups = allTransactionsForChart.reduce((acc, transaction) => {
      // Parse date format "26/04/2025 19:14"
      const [datePart] = transaction.created_at.split(' ');
      const [day, month, year] = datePart.split('/');
      const transactionDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const dateKey = transactionDate.toDateString();
      
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(transaction);
      return acc;
    }, {} as Record<string, Transaction[]>);
    
    return last30Days.map(date => {
      const dateKey = date.toDateString();
      const dayTransactions = dateGroups[dateKey] || [];
      
      // Contar transacciones por estado (incluyendo expiradas)
      const statesCounts = {
        'PAID WITH QR': 0,
        'PAID': 0,
        'PROCESSING': 0,
        'PENDING': 0,
        'EXPIRADO': 0,
        'REJECTED_BY_PAYMENT_GATEWAY': 0,
        'FAILED': 0
      };
      
      dayTransactions.forEach(transaction => {
        const displayStatus = isTransactionExpired(transaction.created_at, transaction.status) ? "EXPIRADO" : transaction.status;
        
        // Solo contar transacciones que están en el filtro actual
        const shouldInclude = statusFilter.some(filter => {
          if (filter === "EXPIRADO") {
            return isTransactionExpired(transaction.created_at, transaction.status);
          }
          return transaction.status === filter;
        });
        
        if (statesCounts.hasOwnProperty(displayStatus) && shouldInclude) {
          statesCounts[displayStatus as keyof typeof statesCounts]++;
        }
      });
      
      const monthNames = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 
                         'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
      const day = date.getDate();
      const month = monthNames[date.getMonth()];
      const shortDisplayDate = `${day} ${month}`;
      
      return {
        date: date.toISOString().split('T')[0],
        day: date.getDate().toString(),
        displayDate: shortDisplayDate,
        fullDate: date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
        dayOfWeek: date.toLocaleDateString('es-ES', { weekday: 'long' }),
        fullDateWithDay: `${shortDisplayDate} (${date.toLocaleDateString('es-ES', { weekday: 'long' })})`,
        paidWithQR: statesCounts['PAID WITH QR'],
        paid: statesCounts['PAID'],
        processing: statesCounts['PROCESSING'],
        pending: statesCounts['PENDING'],
        expired: statesCounts['EXPIRADO'],
        rejected: statesCounts['REJECTED_BY_PAYMENT_GATEWAY'],
        failed: statesCounts['FAILED'],
        total: dayTransactions.length
      };
    });
  };

  // Prepare chart data for Recharts
  const getChartData = () => {
    const salesData = getSalesDataByDay(); // All 30 days
    return salesData.map((day) => ({
      day: parseInt(day.day),
      displayDate: day.displayDate,
      fullDate: day.fullDate,
      dayOfWeek: day.dayOfWeek,
      fullDateWithDay: day.fullDateWithDay,
      paidWithQR: day.paidWithQR,
      paid: day.paid,
      processing: day.processing,
      pending: day.pending,
      expired: day.expired,
      rejected: day.rejected,
      failed: day.failed,
      total: day.total,
    }));
  };

  const fetchSalesStats = async () => {
    if (!params.id) return;
    
    setLoadingSales(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        console.error("No authenticated user found for sales stats");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/get_event_sales_stats`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            p_event_id: params.id
          }),
        }
      );

      if (!response.ok) {
        console.error(`Sales API error! status: ${response.status}`);
        return;
      }

      const salesData = await response.json();
      console.log("Sales Stats Response:", salesData);
      setSalesStats(salesData);
    } catch (error) {
      console.error("Error fetching sales stats:", error);
    } finally {
      setLoadingSales(false);
    }
  };

  const tabs = [
    { id: "overview", name: "Resumen", icon: "📊" },
    { id: "settings", name: "Configuración", icon: "⚙️" },
    { id: "analytics", name: "Analytics", icon: "📈" },
    { id: "tickets", name: "Entradas", icon: "🎫" },
    { id: "transactions", name: "Transacciones", icon: "💳" },
    { id: "map", name: "Mapa", icon: "🗺️" },
  ];

  const ticketsSubTabs = [
    { id: "tickets", name: "Tickets", icon: "🎫" },
    { id: "create", name: "Crear Tickets", icon: "➕" },
    { id: "analytics", name: "Analytics", icon: "📊" },
    { id: "lists", name: "Listas", icon: "📋" },
    { id: "guestlist", name: "Guest List", icon: "👥" },
    { id: "wallet", name: "Apple Wallet", icon: "📱" },
  ];

  const settingsSubTabs = [
    { id: "basic", name: "Información Básica", icon: "ℹ️" },
    { id: "tickets", name: "Configuración de Entradas", icon: "🎫" },
    { id: "venue", name: "Información del Lugar", icon: "📍" },
    { id: "resources", name: "Enlaces y Recursos", icon: "🔗" },
    { id: "advanced", name: "Configuración Avanzada", icon: "⚙️" },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatRelativeDate = (dateString: string) => {
    // Parse date format "26/04/2025 19:14"
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('/');
    const [hour, minute] = timePart.split(':');
    
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);

    if (diffInMs < 0) {
      return "En el futuro"; // Handle future dates
    } else if (diffInMinutes < 1) {
      return "Ahora";
    } else if (diffInMinutes < 60) {
      return `Hace ${diffInMinutes} min`;
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours}h`;
    } else if (diffInDays === 1) {
      return "Ayer";
    } else if (diffInDays < 7) {
      return `Hace ${diffInDays} días`;
    } else if (diffInWeeks < 4) {
      return `Hace ${diffInWeeks} semanas`;
    } else if (diffInMonths < 12) {
      return `Hace ${diffInMonths} meses`;
    } else {
      return dateString; // Show original format for very old dates
    }
  };

  // Función para determinar si una transacción PENDING está expirada
  const isTransactionExpired = (createdAt: string, status: string): boolean => {
    if (status !== "PENDING") return false;
    
    try {
      const [datePart, timePart] = createdAt.split(' ');
      const [day, month, year] = datePart.split('/');
      const [hour, minute] = timePart.split(':');
      
      const transactionDate = new Date(
        parseInt(year, 10), 
        parseInt(month, 10) - 1, 
        parseInt(day, 10), 
        parseInt(hour, 10), 
        parseInt(minute, 10)
      );
      
      const now = new Date();
      const diffInMinutes = (now.getTime() - transactionDate.getTime()) / (1000 * 60);
      
      return diffInMinutes > 20;
    } catch (error) {
      console.error('Error checking if transaction is expired:', error);
      return false;
    }
  };

  // Función helper para obtener configuración de colores de estados
  const getStatusConfig = (status: string) => {
    const statusConfig = {
      // Estados de éxito
      "PAID WITH QR": { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', label: 'Pagado con QR', color: '#10b981' },
      "PAID": { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'Pagado', color: '#059669' },
      "PROCESSING": { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', label: 'Procesando', color: '#3b82f6' },
      
      // Estados pendientes
      "PENDING": { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', label: 'Pendiente', color: '#eab308' },
      "EXPIRADO": { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30', label: 'Expirado', color: '#f97316' },
      
      // Estados de error
      "REJECTED_BY_PAYMENT_GATEWAY": { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', label: 'Rechazado', color: '#ef4444' },
      "FAILED": { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', label: 'Fallido', color: '#ef4444' },
      
      // Fallbacks para compatibilidad
      completed: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', label: 'Completada', color: '#10b981' },
      pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', label: 'Pendiente', color: '#eab308' },
      failed: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', label: 'Fallida', color: '#ef4444' },
    };
    
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
  };

  const getStatusBadge = (status: string, createdAt: string) => {
    // Determinar el estado real a mostrar
    const displayStatus = isTransactionExpired(createdAt, status) ? "EXPIRADO" : status;
    
    const config = getStatusConfig(displayStatus);
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <div className="text-white text-lg">Cargando evento...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] px-6">
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-8 border border-white/[0.08] text-center max-w-md">
          <h2 className="text-2xl font-semibold text-white mb-4">Error al cargar el evento</h2>
          <p className="text-white/60 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => router.push('/dashboard/events')}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-xl transition-all duration-300 text-white font-medium"
            >
              Volver a Eventos
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[#d9d9d9] hover:bg-white hover:scale-[1.02] rounded-xl transition-all duration-300 text-black font-medium"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <div className="text-white text-lg">Evento no encontrado</div>
      </div>
    );
  }

  const event = eventData.event;

  return (
    <div className="w-full h-full overflow-y-auto bg-[#0a0a0a] p-12">
      {/* Breadcrumbs */}
      <div className="w-full mb-6">
        <ModernBreadcrumbs 
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Eventos", href: "/dashboard/events" },
            { label: event.name, isActive: true }
          ]}
        />
      </div>

      {/* Event Flyer Strip */}
      {event.flyer && (
        <div className="w-full mb-8">
          <div className="relative w-full h-24 md:h-32 rounded-2xl overflow-hidden border border-white/10">
            <img
              src={event.flyer}
              alt={`${event.name} - Flyer`}
              className="w-full h-full object-cover blur-md"
              onError={(e) => {
                // Fallback to blur image if flyer fails to load
                const target = e.target as HTMLImageElement;
                target.src = blurImage.src;
              }}
            />
            <div className="absolute inset-0 backdrop-blur-sm" />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold text-lg">{event.name}</h3>
                  <p className="text-white/80 text-sm">{event.date} • {event.hour}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                  <span className="text-white text-xs font-medium">Evento Destacado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full">
        
        {/* Header with back button */}
        <div className="flex items-center mb-8">
          <button 
            onClick={() => router.push('/dashboard/events')}
            className="w-10 h-10 bg-white/10 border border-white/20 rounded-full backdrop-blur-xl hover:bg-white/20 transition-all duration-200 flex items-center justify-center shadow-lg mr-4"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white" style={{ letterSpacing: '-3px', lineHeight: '130%' }}>
              {event.name}
            </h1>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex space-x-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 backdrop-blur-sm border flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-white/10 text-white border-white/20 shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="relative z-10">{tab.name}</span>
              {activeTab === tab.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-xl"></div>
              )}
            </button>
          ))}
        </div>

        {/* Balance Total KPI Box with Flyer - Outside tabs when analytics is active */}
        {activeTab === "analytics" && (
          <div className="mb-8 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Event Flyer */}
              <div className="lg:col-span-1">
                <div 
                  className="relative w-2/5 rounded-2xl overflow-hidden bg-white/5 border border-white/10"
                  style={{ aspectRatio: '1080/1350', maxHeight: '320px' }}
                >
                  <img
                    src={event.flyer || blurImage.src}
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Balance Total KPI Box */}
              <div className="lg:col-span-2">
                <StatisticsCard5 salesData={salesStats} />
              </div>
            </div>

            {/* Individual KPI Cards */}
            <StatisticsCard2 />

            {/* Promoter Analysis Table and Extra Space */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Promoter Analysis Table */}
              <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-white/10 text-white flex flex-col h-full"
                   style={{
                     backdropFilter: 'blur(20px)',
                     WebkitBackdropFilter: 'blur(20px)',
                   }}>
                <div className="border-0 pb-2 px-5 pt-5">
                  <h3 className="text-white/70 text-sm font-medium tracking-wide uppercase">Análisis de Promotores</h3>
                </div>
                <div className="pt-0 pb-6 px-5 flex-1">
                {salesStats && salesStats.promoters.length > 0 ? (
                  <>
                    <div className="relative overflow-auto rounded-md border border-white/10">
                      <Table aria-label="Promoter analysis table" className="text-white">
                        <TableHeader>
                          <Column id="rank" className="text-white/70">
                            #
                          </Column>
                          <Column id="name" isRowHeader allowsSorting className="text-white/70">
                            Promotor
                          </Column>
                          <Column id="sales" allowsSorting className="text-white/70">
                            Ventas
                          </Column>
                          <Column id="percentage" allowsSorting className="text-white/70">
                            %
                          </Column>
                        </TableHeader>
                        <TableBody
                          items={salesStats.promoters
                            .filter(p => p.promoter_name)
                            .sort((a, b) => b.total_sales - a.total_sales)
                            .map((promoter, index) => ({
                              id: promoter.promoter_id || index.toString(),
                              rank: index + 1,
                              name: promoter.promoter_name || 'Sin nombre',
                              sales: promoter.total_sales,
                              percentage: ((promoter.total_sales / salesStats.ventas_totales) * 100).toFixed(1)
                            }))
                          }
                          renderEmptyState={() => (
                            <div className="text-center py-8 text-white/60">
                              No hay promotores para mostrar
                            </div>
                          )}
                        >
                          {(item) => (
                            <Row id={item.id} className="border-white/10">
                              <Cell className="text-white/60 font-mono">
                                {item.rank <= 3 ? (
                                  <span className="text-lg">
                                    {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : '🥉'}
                                  </span>
                                ) : (
                                  item.rank
                                )}
                              </Cell>
                              <Cell className="text-white font-medium">{item.name}</Cell>
                              <Cell className="text-green-400 font-semibold">
                                ${(item.sales / 1000000).toFixed(2)}M
                              </Cell>
                              <Cell className="text-blue-400 font-medium">{item.percentage}%</Cell>
                            </Row>
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Promoter KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="bg-white/[0.02] rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-white mb-1">
                          {salesStats.promoters.filter(p => p.promoter_name).length}
                        </div>
                        <div className="text-white/60 text-sm">Promotores Activos</div>
                      </div>
                      <div className="bg-white/[0.02] rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-green-400 mb-1">
                          ${(salesStats.promoters
                            .filter(p => p.promoter_name)
                            .reduce((sum, p) => sum + p.total_sales, 0) / 1000000).toFixed(2)}M
                        </div>
                        <div className="text-white/60 text-sm">Total por Promotores</div>
                      </div>
                      <div className="bg-white/[0.02] rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-blue-400 mb-1">
                          ${salesStats.promoters.filter(p => p.promoter_name).length > 0 
                            ? (salesStats.promoters
                                .filter(p => p.promoter_name)
                                .reduce((sum, p) => sum + p.total_sales, 0) / 
                                salesStats.promoters.filter(p => p.promoter_name).length / 1000000).toFixed(2)
                            : '0.00'}M
                        </div>
                        <div className="text-white/60 text-sm">Promedio por Promotor</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-white/60">
                    {salesStats ? 'No hay promotores para mostrar' : 'Cargando datos de promotores...'}
                  </div>
                )}
                </div>
              </div>

              {/* Sales Channel Analysis */}
              <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-white/10 text-white flex flex-col h-full"
                   style={{
                     backdropFilter: 'blur(20px)',
                     WebkitBackdropFilter: 'blur(20px)',
                   }}>
                <div className="border-0 pb-2 px-5 pt-5">
                  <h3 className="text-white/70 text-sm font-medium tracking-wide uppercase">Análisis por Canal de Ventas</h3>
                </div>
                <div className="pt-0 pb-6 px-5 flex-1">
                  {salesStats ? (
                    <div className="space-y-4">
                      {/* Main Content: Pie Chart + Channel Details */}
                      <div className="flex gap-4">
                        {/* Pie Chart - Left Side */}
                        <div className="flex-shrink-0">
                          <div className="relative w-40 h-40">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                              {(() => {
                                const total = salesStats.ventas_totales;
                                const appPercent = (salesStats.ventas_en_app.total / total) * 100;
                                const webPercent = (salesStats.ventas_en_web.total / total) * 100;
                                const cashPercent = (salesStats.ventas_en_efectivo.total / total) * 100;
                                
                                const circumference = 2 * Math.PI * 30; // radius = 30
                                let currentOffset = 0;
                                
                                const createSlice = (percent: number, color: string, offset: number) => {
                                  const strokeDasharray = `${(percent / 100) * circumference} ${circumference}`;
                                  const strokeDashoffset = -offset;
                                  return { strokeDasharray, strokeDashoffset, color };
                                };
                                
                                const appSlice = createSlice(appPercent, '#60a5fa', currentOffset);
                                currentOffset += (appPercent / 100) * circumference;
                                
                                const webSlice = createSlice(webPercent, '#34d399', currentOffset);
                                currentOffset += (webPercent / 100) * circumference;
                                
                                const cashSlice = createSlice(cashPercent, '#fbbf24', currentOffset);
                                
                                return (
                                  <>
                                    <circle cx="50" cy="50" r="30" fill="none" stroke="#374151" strokeWidth="8" />
                                    <circle 
                                      cx="50" cy="50" r="30" fill="none" 
                                      stroke={appSlice.color} strokeWidth="8"
                                      strokeDasharray={appSlice.strokeDasharray}
                                      strokeDashoffset={appSlice.strokeDashoffset}
                                      className="transition-all duration-500"
                                    />
                                    <circle 
                                      cx="50" cy="50" r="30" fill="none" 
                                      stroke={webSlice.color} strokeWidth="8"
                                      strokeDasharray={webSlice.strokeDasharray}
                                      strokeDashoffset={webSlice.strokeDashoffset}
                                      className="transition-all duration-500"
                                    />
                                    <circle 
                                      cx="50" cy="50" r="30" fill="none" 
                                      stroke={cashSlice.color} strokeWidth="8"
                                      strokeDasharray={cashSlice.strokeDasharray}
                                      strokeDashoffset={cashSlice.strokeDashoffset}
                                      className="transition-all duration-500"
                                    />
                                  </>
                                );
                              })()}
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-base font-bold text-white">
                                  ${(salesStats.ventas_totales / 1000000).toFixed(1)}M
                                </div>
                                <div className="text-xs text-white/60">Total</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Channel Details - Right Side */}
                        <div className="flex-1 space-y-2">
                          {/* App Channel */}
                          <div className="flex items-center justify-between p-2 bg-white/[0.02] rounded-lg">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                              <div>
                                <div className="text-white font-medium text-xs">📱 App</div>
                                <div className="text-white/60 text-xs">
                                  {((salesStats.ventas_en_app.total / salesStats.ventas_totales) * 100).toFixed(1)}%
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-semibold text-xs">
                                ${(salesStats.ventas_en_app.total / 1000000).toFixed(2)}M
                              </div>
                              <div className="text-green-400 text-xs">
                                ${(salesStats.ventas_en_app.productor / 1000000).toFixed(2)}M neto
                              </div>
                            </div>
                          </div>

                          {/* Web Channel */}
                          <div className="flex items-center justify-between p-2 bg-white/[0.02] rounded-lg">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-green-400"></div>
                              <div>
                                <div className="text-white font-medium text-xs">🌐 Web</div>
                                <div className="text-white/60 text-xs">
                                  {((salesStats.ventas_en_web.total / salesStats.ventas_totales) * 100).toFixed(1)}%
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-semibold text-xs">
                                ${(salesStats.ventas_en_web.total / 1000000).toFixed(2)}M
                              </div>
                              <div className="text-green-400 text-xs">
                                ${(salesStats.ventas_en_web.productor / 1000000).toFixed(2)}M neto
                              </div>
                            </div>
                          </div>

                          {/* Cash Channel */}
                          <div className="flex items-center justify-between p-2 bg-white/[0.02] rounded-lg">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                              <div>
                                <div className="text-white font-medium text-xs">💵 Efectivo</div>
                                <div className="text-white/60 text-xs">
                                  {((salesStats.ventas_en_efectivo.total / salesStats.ventas_totales) * 100).toFixed(1)}%
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-semibold text-xs">
                                ${(salesStats.ventas_en_efectivo.total / 1000000).toFixed(2)}M
                              </div>
                              <div className="text-green-400 text-xs">
                                ${(salesStats.ventas_en_efectivo.productor / 1000000).toFixed(2)}M neto
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Summary Stats */}
                      <div className="border-t border-white/10 pt-3">
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <div className="text-base font-bold text-blue-400">
                              {((salesStats.ventas_en_app.servicio + salesStats.ventas_en_web.servicio + salesStats.ventas_en_efectivo.servicio) / salesStats.ventas_totales * 100).toFixed(1)}%
                            </div>
                            <div className="text-white/60 text-xs">Comisiones</div>
                          </div>
                          <div>
                            <div className="text-base font-bold text-green-400">
                              {(salesStats.ingreso_neto_productor_ajustado / salesStats.ventas_totales * 100).toFixed(1)}%
                            </div>
                            <div className="text-white/60 text-xs">Neto Productor</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-white/40">
                      <div className="text-center">
                        <div className="text-4xl mb-4">📊</div>
                        <p className="text-sm">Cargando análisis de canales...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === "overview" && (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Resumen del Evento</h2>
              
              {/* Event Description */}
              <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/[0.08]">
                <h3 className="text-lg font-medium text-white mb-3">Descripción</h3>
                <p className="text-white/80 leading-relaxed">{event.description_plain}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* General Information */}
                <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/[0.08]">
                  <h3 className="text-lg font-medium text-white mb-4">Información General</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/60">ID del Evento:</span>
                      <span className="text-white font-mono text-sm">{event.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Fecha y Hora:</span>
                      <span className="text-white">{event.date} - {event.hour}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Tiene Entradas:</span>
                      <span className={`${eventData.has_tickets ? 'text-green-400' : 'text-gray-400'}`}>
                        {eventData.has_tickets ? 'Sí' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Lista de Invitados:</span>
                      <span className={`${eventData.guest_list_enabled ? 'text-green-400' : 'text-gray-400'}`}>
                        {eventData.guest_list_enabled ? 'Habilitada' : 'Deshabilitada'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">URL del Evento:</span>
                      <a 
                        href={event.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline text-sm"
                      >
                        Ver Página
                      </a>
                    </div>
                  </div>
                </div>

                {/* Venue Information */}
                <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/[0.08]">
                  <h3 className="text-lg font-medium text-white mb-4">Información del Lugar</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/60">Nombre:</span>
                      <span className="text-white">{event.venue.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Ciudad:</span>
                      <span className="text-white">{event.venue.city}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-white/60">Dirección:</span>
                      <span className="text-white text-sm">{event.venue.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Google Maps:</span>
                      <a 
                        href={event.venue.google_maps_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline text-sm"
                      >
                        Ver en Maps
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Producers */}
              {eventData.has_producers && (
                <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/[0.08]">
                  <h3 className="text-lg font-medium text-white mb-4">Organizadores</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {event.producers.map((producer, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-lg">
                        {producer.logo && (
                          <img 
                            src={producer.logo} 
                            alt={producer.name}
                            className="w-12 h-12 object-contain rounded-lg bg-white/5"
                          />
                        )}
                        <span className="text-white font-medium">{producer.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="mt-8">
              <div className="flex gap-8">
                {/* Vertical Sub-tabs Navigation */}
                <div className="w-64 flex-shrink-0">
                  <div className="space-y-2">
                    {settingsSubTabs.map((subTab) => (
                      <button
                        key={subTab.id}
                        onClick={() => setSettingsSubTab(subTab.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                          settingsSubTab === subTab.id
                            ? "bg-white/10 text-white border border-white/20 shadow-lg"
                            : "text-white/60 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <span className="text-lg">{subTab.icon}</span>
                        <span>{subTab.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sub-tabs Content */}
                <div className="flex-1 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-white">Configuración del Evento</h2>
                    <div className="flex gap-3">
                      <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors">
                        💾 Guardar
                      </button>
                      <button className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-medium transition-colors">
                        ↺ Deshacer
                      </button>
                    </div>
                  </div>

                  {settingsSubTab === "basic" && (
                    <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-8 border border-white/[0.08]">
                      <h3 className="text-lg font-medium text-white mb-6">Información Básica</h3>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-6">
                          <div>
                            <label className="block text-white/80 text-sm font-medium mb-3">
                              Nombre del Evento
                            </label>
                            <input
                              type="text"
                              defaultValue={event.name}
                              className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/50 focus:bg-white/10 focus:border-blue-500/50 focus:outline-none transition-all duration-200"
                              placeholder="Ej: Festival de Música 2025"
                            />
                          </div>

                          <div>
                            <label className="block text-white/80 text-sm font-medium mb-3">
                              Descripción
                            </label>
                            <div className="relative">
                              <textarea
                                id="event-description"
                                defaultValue={event.description}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/50 focus:bg-white/10 focus:border-blue-500/50 focus:outline-none transition-all duration-200 resize-none min-h-[100px] max-h-[400px]"
                                style={{ height: '120px', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}
                                placeholder="Describe tu evento...&#10;&#10;Puedes usar saltos de línea para organizar tu descripción."
                              />
                              {/* Custom resize handle */}
                              <div 
                                className="absolute bottom-0 right-0 w-6 h-6 cursor-ns-resize group flex items-center justify-center"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  const textarea = document.getElementById('event-description') as HTMLTextAreaElement;
                                  const startY = e.clientY;
                                  const startHeight = parseInt(window.getComputedStyle(textarea).height, 10);

                                  const handleMouseMove = (e: MouseEvent) => {
                                    const newHeight = startHeight + (e.clientY - startY);
                                    if (newHeight >= 100 && newHeight <= 400) {
                                      textarea.style.height = newHeight + 'px';
                                    }
                                  };

                                  const handleMouseUp = () => {
                                    document.removeEventListener('mousemove', handleMouseMove);
                                    document.removeEventListener('mouseup', handleMouseUp);
                                  };

                                  document.addEventListener('mousemove', handleMouseMove);
                                  document.addEventListener('mouseup', handleMouseUp);
                                }}
                              >
                                <svg className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors rotate-45" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 6L6 10l4 4 4-4-4-4z"/>
                                </svg>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-white/80 text-sm font-medium mb-3">
                                Fecha y Hora de Inicio
                              </label>
                              <DateTimePicker
                                value={event.date && event.hour ? `${event.date}T${event.hour}` : undefined}
                                placeholder="Seleccionar fecha y hora de inicio"
                              />
                            </div>
                            <div>
                              <label className="block text-white/80 text-sm font-medium mb-3">
                                Fecha y Hora de Finalización
                              </label>
                              <DateTimePicker
                                placeholder="Seleccionar fecha y hora de finalización"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-white/80 text-sm font-medium mb-3">
                              Edad Mínima
                            </label>
                            <select
                              className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:bg-white/10 focus:border-blue-500/50 focus:outline-none transition-all duration-200"
                            >
                              <option value="">Seleccionar edad mínima</option>
                              <option value="0">Todas las edades</option>
                              <option value="12">12+ años</option>
                              <option value="15">15+ años</option>
                              <option value="18">18+ años</option>
                              <option value="21">21+ años</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-white/80 text-sm font-medium mb-3">
                              🌐 URL del Evento
                            </label>
                            <input
                              type="url"
                              defaultValue={event.url}
                              className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/50 focus:bg-white/10 focus:border-blue-500/50 focus:outline-none transition-all duration-200"
                              placeholder="https://mi-evento.com"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-3">
                            Flyer del Evento
                          </label>
                          <div className="border-2 border-dashed border-white/20 rounded-xl overflow-hidden hover:border-white/40 transition-colors duration-200">
                            <div className="aspect-[3/4] bg-white/5 flex flex-col items-center justify-center p-8 text-center relative">
                              <svg className="w-12 h-12 text-white/40 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              <p className="text-white/60 text-sm">
                                Subir imagen
                              </p>
                              <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                id="flyer-upload"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {settingsSubTab === "tickets" && (
                    <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-8 border border-white/[0.08]">
                      <h3 className="text-lg font-medium text-white mb-6">Configuración de Entradas</h3>

                      <div className="space-y-8">
                        {/* Main Settings */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="space-y-6">
                            {/* Ticket Sales Toggle */}
                            <div className="bg-white/[0.02] rounded-xl p-6 border border-white/5">
                              <div className="flex items-center justify-between mb-4">
                                <div>
                                  <h4 className="text-white font-medium mb-1">Venta de Entradas</h4>
                                  <p className="text-white/60 text-sm">Habilitar la venta de tickets para el evento</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" defaultChecked={eventData.has_tickets} className="sr-only peer" />
                                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                              </div>
                            </div>

                            {/* Guest List Settings */}
                            <div className="bg-white/[0.02] rounded-xl p-6 border border-white/5">
                              <div className="flex items-center justify-between mb-4">
                                <div>
                                  <h4 className="text-white font-medium mb-1">Lista de Invitados</h4>
                                  <p className="text-white/60 text-sm">Permitir invitados sin costo de entrada</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" defaultChecked={eventData.guest_list_enabled} className="sr-only peer" />
                                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                </label>
                              </div>
                            </div>

                            {/* Sales Configuration */}
                            <div className="bg-white/[0.02] rounded-xl p-6 border border-white/5">
                              <h4 className="text-white font-medium mb-4">Configuración de Ventas</h4>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">
                                      Fecha de Inicio de Ventas
                                    </label>
                                    <DateTimePicker placeholder="Seleccionar fecha" />
                                  </div>
                                  <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">
                                      Fecha de Fin de Ventas
                                    </label>
                                    <DateTimePicker placeholder="Seleccionar fecha" />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-white/80 text-sm font-medium mb-2">
                                    Capacidad Máxima
                                  </label>
                                  <input
                                    type="number"
                                    placeholder="Ej: 1000"
                                    className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/50 focus:bg-white/10 focus:border-blue-500/50 focus:outline-none transition-all duration-200"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-6">
                            {/* Ticket Types */}
                            <div className="bg-white/[0.02] rounded-xl p-6 border border-white/5">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-white font-medium">Tipos de Entrada</h4>
                                <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-colors">
                                  + Agregar Tipo
                                </button>
                              </div>
                              <div className="space-y-3">
                                <div className="bg-white/[0.02] rounded-lg p-4 border border-white/5">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-white font-medium">General</span>
                                    <div className="flex items-center gap-2">
                                      <span className="text-green-400 text-sm">$50,000</span>
                                      <button className="text-white/60 hover:text-white">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4 text-xs text-white/60">
                                    <span>Disponibles: 800</span>
                                    <span>Vendidas: 200</span>
                                  </div>
                                </div>
                                
                                <div className="bg-white/[0.02] rounded-lg p-4 border border-white/5">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-white font-medium">VIP</span>
                                    <div className="flex items-center gap-2">
                                      <span className="text-yellow-400 text-sm">$120,000</span>
                                      <button className="text-white/60 hover:text-white">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4 text-xs text-white/60">
                                    <span>Disponibles: 150</span>
                                    <span>Vendidas: 50</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="bg-white/[0.02] rounded-xl p-6 border border-white/5">
                              <h4 className="text-white font-medium mb-4">Resumen de Ventas</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-green-400 mb-1">250</div>
                                  <div className="text-xs text-white/60">Vendidas</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-blue-400 mb-1">950</div>
                                  <div className="text-xs text-white/60">Disponibles</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-yellow-400 mb-1">$18.5M</div>
                                  <div className="text-xs text-white/60">Ingresos</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-purple-400 mb-1">20.8%</div>
                                  <div className="text-xs text-white/60">Vendidas</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Advanced Settings */}
                        <div className="border-t border-white/10 pt-6">
                          <h4 className="text-white font-medium mb-4">Configuración Avanzada</h4>
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="bg-white/[0.02] rounded-lg p-4 border border-white/5">
                              <div className="flex items-center justify-between">
                                <span className="text-white/80 text-sm">Permitir transferencias</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" className="sr-only peer" />
                                  <div className="w-9 h-5 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                              </div>
                            </div>
                            
                            <div className="bg-white/[0.02] rounded-lg p-4 border border-white/5">
                              <div className="flex items-center justify-between">
                                <span className="text-white/80 text-sm">Validación por QR</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" defaultChecked className="sr-only peer" />
                                  <div className="w-9 h-5 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                              </div>
                            </div>
                            
                            <div className="bg-white/[0.02] rounded-lg p-4 border border-white/5">
                              <div className="flex items-center justify-between">
                                <span className="text-white/80 text-sm">Reembolsos</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" className="sr-only peer" />
                                  <div className="w-9 h-5 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {settingsSubTab === "venue" && (
                    <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-8 border border-white/[0.08]">
                      <h3 className="text-lg font-medium text-white mb-6">Información del Lugar</h3>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <div>
                            <label className="block text-white/80 text-sm font-medium mb-3">
                              🏢 Nombre del Lugar
                            </label>
                            <input
                              type="text"
                              defaultValue={event.venue.name}
                              className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:bg-white/10 focus:border-orange-500/50 focus:outline-none transition-all duration-200"
                            />
                          </div>

                          <div>
                            <label className="block text-white/80 text-sm font-medium mb-3">
                              🌍 Ciudad
                            </label>
                            <input
                              type="text"
                              defaultValue={event.venue.city}
                              className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:bg-white/10 focus:border-orange-500/50 focus:outline-none transition-all duration-200"
                            />
                          </div>

                          <div>
                            <label className="block text-white/80 text-sm font-medium mb-3">
                              📍 Dirección Completa
                            </label>
                            <textarea
                              rows={3}
                              defaultValue={event.venue.address}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:bg-white/10 focus:border-orange-500/50 focus:outline-none transition-all duration-200 resize-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-white/80 text-sm font-medium mb-3">
                                🌐 Latitud
                              </label>
                              <input
                                type="number"
                                step="any"
                                defaultValue={event.venue.latitude}
                                className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:bg-white/10 focus:border-orange-500/50 focus:outline-none transition-all duration-200"
                              />
                            </div>
                            <div>
                              <label className="block text-white/80 text-sm font-medium mb-3">
                                🌐 Longitud
                              </label>
                              <input
                                type="number"
                                step="any"
                                defaultValue={event.venue.longitude}
                                className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:bg-white/10 focus:border-orange-500/50 focus:outline-none transition-all duration-200"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-white/80 text-sm font-medium mb-3">
                              🗺️ Enlace de Google Maps
                            </label>
                            <input
                              type="url"
                              defaultValue={event.venue.google_maps_link}
                              className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:bg-white/10 focus:border-orange-500/50 focus:outline-none transition-all duration-200"
                            />
                          </div>

                          <div className="bg-white/[0.02] rounded-xl p-4 border border-white/5">
                            <h4 className="text-white font-medium mb-2">Vista Previa del Mapa</h4>
                            <div className="aspect-video bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
                              <span className="text-white/60 text-sm">🗺️ Mapa interactivo aquí</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {settingsSubTab === "resources" && (
                    <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-8 border border-white/[0.08]">
                      <h3 className="text-lg font-medium text-white mb-6">Enlaces y Recursos</h3>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-white/[0.02] rounded-xl p-6 border border-white/5">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="text-2xl">📅</span>
                            <div>
                              <h4 className="text-white font-medium">Archivo de Calendario</h4>
                              <p className="text-white/60 text-xs">Formato ICS</p>
                            </div>
                          </div>
                          <a 
                            href={event.ics} 
                            download
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-blue-400 hover:text-blue-300 text-sm font-medium transition-all duration-200"
                          >
                            ⬇️ Descargar ICS
                          </a>
                        </div>

                        <div className="bg-white/[0.02] rounded-xl p-6 border border-white/5">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="text-2xl">🌐</span>
                            <div>
                              <h4 className="text-white font-medium">Página Pública</h4>
                              <p className="text-white/60 text-xs">Vista de usuarios</p>
                            </div>
                          </div>
                          <a 
                            href={event.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-lg text-green-400 hover:text-green-300 text-sm font-medium transition-all duration-200"
                          >
                            🚀 Ver Evento
                          </a>
                        </div>

                        <div className="bg-white/[0.02] rounded-xl p-6 border border-white/5">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="text-2xl">🗺️</span>
                            <div>
                              <h4 className="text-white font-medium">Google Maps</h4>
                              <p className="text-white/60 text-xs">Ubicación</p>
                            </div>
                          </div>
                          <a 
                            href={event.venue.google_maps_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/30 rounded-lg text-orange-400 hover:text-orange-300 text-sm font-medium transition-all duration-200"
                          >
                            📍 Ver Mapa
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {settingsSubTab === "advanced" && (
                    <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-8 border border-white/[0.08]">
                      <h3 className="text-lg font-medium text-white mb-6">Configuración Avanzada</h3>

                      <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <h4 className="text-white font-medium mb-3">🔒 Configuración de Seguridad</h4>
                            <div className="space-y-3">
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 text-red-600 bg-white/10 border-white/20 rounded focus:ring-red-500 focus:ring-2"
                                />
                                <span className="text-white/80 text-sm">Requerir verificación de email</span>
                              </label>
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 text-red-600 bg-white/10 border-white/20 rounded focus:ring-red-500 focus:ring-2"
                                />
                                <span className="text-white/80 text-sm">Limitar compras por usuario</span>
                              </label>
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 text-red-600 bg-white/10 border-white/20 rounded focus:ring-red-500 focus:ring-2"
                                />
                                <span className="text-white/80 text-sm">Habilitar lista de espera</span>
                              </label>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h4 className="text-white font-medium mb-3">📊 Analytics y Tracking</h4>
                            <div className="space-y-3">
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  defaultChecked
                                  className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                                />
                                <span className="text-white/80 text-sm">Google Analytics</span>
                              </label>
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  defaultChecked
                                  className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                                />
                                <span className="text-white/80 text-sm">Facebook Pixel</span>
                              </label>
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                                />
                                <span className="text-white/80 text-sm">Tracking personalizado</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-white/10 pt-6">
                          <h4 className="text-red-400 font-medium mb-3">⚠️ Zona de Peligro</h4>
                          <div className="bg-red-600/10 border border-red-500/20 rounded-xl p-6">
                            <p className="text-white/80 text-sm mb-4">
                              Las siguientes acciones son irreversibles. Procede con precaución.
                            </p>
                            <div className="flex gap-4">
                              <button className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg text-red-400 hover:text-red-300 text-sm font-medium transition-all duration-200">
                                🗑️ Eliminar Evento
                              </button>
                              <button className="px-4 py-2 bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/30 rounded-lg text-orange-400 hover:text-orange-300 text-sm font-medium transition-all duration-200">
                                📄 Duplicar Evento
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Botones de Acción */}
                  <div className="flex items-center justify-between pt-4">
                    <div className="text-white/60 text-sm">
                      💡 Los cambios se guardan automáticamente cada 30 segundos
                    </div>
                    <div className="flex gap-4">
                      <button className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25">
                        💾 Guardar Todos los Cambios
                      </button>
                      <button className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-xl text-white font-medium transition-all duration-300">
                        ↺ Restaurar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-white">Analytics de Ventas</h2>
                {loadingSales && (
                  <div className="px-4 py-2 bg-white/10 rounded-xl">
                    <span className="text-white/60 text-sm">Cargando datos...</span>
                  </div>
                )}
              </div>

              {salesStats ? (
                <div className="space-y-8">
                  {/* Executive Summary */}
                  <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-8 border border-white/[0.08]">
                    <h3 className="text-2xl font-semibold text-white mb-6">Resumen Ejecutivo</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-white mb-2">
                          ${(salesStats.ventas_totales / 1000000).toFixed(2)}M
                        </div>
                        <div className="text-white/60 text-sm">Ventas Totales</div>
                        <div className="text-green-400 text-xs mt-1">🎯 Ingresos Brutos</div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-green-400 mb-2">
                          ${(salesStats.ingreso_neto_productor_ajustado / 1000000).toFixed(2)}M
                        </div>
                        <div className="text-white/60 text-sm">Ingreso Neto</div>
                        <div className="text-green-400 text-xs mt-1">
                          {((salesStats.ingreso_neto_productor_ajustado / salesStats.ventas_totales) * 100).toFixed(1)}% del total
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-blue-400 mb-2">
                          ${((salesStats.ventas_en_app.servicio + salesStats.ventas_en_web.servicio + salesStats.ventas_en_efectivo.servicio) / 1000000).toFixed(2)}M
                        </div>
                        <div className="text-white/60 text-sm">Comisiones</div>
                        <div className="text-blue-400 text-xs mt-1">
                          {(((salesStats.ventas_en_app.servicio + salesStats.ventas_en_web.servicio + salesStats.ventas_en_efectivo.servicio) / salesStats.ventas_totales) * 100).toFixed(1)}% del total
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-orange-400 mb-2">
                          ${((salesStats.ventas_en_app.impuestos + salesStats.ventas_en_web.impuestos + salesStats.ventas_en_efectivo.impuestos) / 1000000).toFixed(2)}M
                        </div>
                        <div className="text-white/60 text-sm">Impuestos</div>
                        <div className="text-orange-400 text-xs mt-1">
                          {(((salesStats.ventas_en_app.impuestos + salesStats.ventas_en_web.impuestos + salesStats.ventas_en_efectivo.impuestos) / salesStats.ventas_totales) * 100).toFixed(1)}% del total
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sales Channel Analysis */}
                  <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-8 border border-white/[0.08]">
                    <h3 className="text-2xl font-semibold text-white mb-6">Análisis por Canal de Ventas</h3>
                    <div className="space-y-6">
                      {/* App Sales */}
                      <div className="bg-white/[0.02] rounded-xl p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-xl font-medium text-white flex items-center gap-2">
                            📱 Ventas en App
                          </h4>
                          <div className="text-2xl font-bold text-blue-400">
                            ${(salesStats.ventas_en_app.total / 1000000).toFixed(2)}M
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-lg font-semibold text-white">
                              ${salesStats.ventas_en_app.total.toLocaleString()}
                            </div>
                            <div className="text-white/60 text-sm">Total Bruto</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-green-400">
                              ${salesStats.ventas_en_app.productor.toLocaleString()}
                            </div>
                            <div className="text-white/60 text-sm">Para Productor</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-blue-400">
                              ${salesStats.ventas_en_app.servicio.toLocaleString()}
                            </div>
                            <div className="text-white/60 text-sm">Comisión</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-orange-400">
                              ${salesStats.ventas_en_app.impuestos.toLocaleString()}
                            </div>
                            <div className="text-white/60 text-sm">Impuestos</div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="flex justify-between text-sm text-white/60 mb-2">
                            <span>Participación del canal</span>
                            <span>{((salesStats.ventas_en_app.total / salesStats.ventas_totales) * 100).toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div 
                              className="bg-blue-400 h-2 rounded-full"
                              style={{ width: `${(salesStats.ventas_en_app.total / salesStats.ventas_totales) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Web Sales */}
                      <div className="bg-white/[0.02] rounded-xl p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-xl font-medium text-white flex items-center gap-2">
                            🌐 Ventas en Web
                          </h4>
                          <div className="text-2xl font-bold text-green-400">
                            ${(salesStats.ventas_en_web.total / 1000000).toFixed(2)}M
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-lg font-semibold text-white">
                              ${salesStats.ventas_en_web.total.toLocaleString()}
                            </div>
                            <div className="text-white/60 text-sm">Total Bruto</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-green-400">
                              ${salesStats.ventas_en_web.productor.toLocaleString()}
                            </div>
                            <div className="text-white/60 text-sm">Para Productor</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-blue-400">
                              ${salesStats.ventas_en_web.servicio.toLocaleString()}
                            </div>
                            <div className="text-white/60 text-sm">Comisión</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-orange-400">
                              ${salesStats.ventas_en_web.impuestos.toLocaleString()}
                            </div>
                            <div className="text-white/60 text-sm">Impuestos</div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="flex justify-between text-sm text-white/60 mb-2">
                            <span>Participación del canal</span>
                            <span>{((salesStats.ventas_en_web.total / salesStats.ventas_totales) * 100).toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div 
                              className="bg-green-400 h-2 rounded-full"
                              style={{ width: `${(salesStats.ventas_en_web.total / salesStats.ventas_totales) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Cash Sales */}
                      <div className="bg-white/[0.02] rounded-xl p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-xl font-medium text-white flex items-center gap-2">
                            💵 Ventas en Efectivo
                          </h4>
                          <div className="text-2xl font-bold text-orange-400">
                            ${(salesStats.ventas_en_efectivo.total / 1000000).toFixed(2)}M
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-lg font-semibold text-white">
                              ${salesStats.ventas_en_efectivo.total.toLocaleString()}
                            </div>
                            <div className="text-white/60 text-sm">Total Bruto</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-green-400">
                              ${salesStats.ventas_en_efectivo.productor.toLocaleString()}
                            </div>
                            <div className="text-white/60 text-sm">Para Productor</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-blue-400">
                              ${salesStats.ventas_en_efectivo.servicio.toLocaleString()}
                            </div>
                            <div className="text-white/60 text-sm">Comisión</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-orange-400">
                              ${salesStats.ventas_en_efectivo.impuestos.toLocaleString()}
                            </div>
                            <div className="text-white/60 text-sm">Impuestos</div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="flex justify-between text-sm text-white/60 mb-2">
                            <span>Participación del canal</span>
                            <span>{((salesStats.ventas_en_efectivo.total / salesStats.ventas_totales) * 100).toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div 
                              className="bg-orange-400 h-2 rounded-full"
                              style={{ width: `${(salesStats.ventas_en_efectivo.total / salesStats.ventas_totales) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Promoters Performance */}
                  <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-8 border border-white/[0.08]">
                    <h3 className="text-2xl font-semibold text-white mb-6">Análisis de Promotores</h3>
                    <div className="space-y-6">
                      {/* Promoter Stats Overview */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white/[0.02] rounded-xl p-4 text-center">
                          <div className="text-2xl font-bold text-white">
                            {salesStats.promoters.filter(p => p.promoter_name).length}
                          </div>
                          <div className="text-white/60 text-sm">Promotores Activos</div>
                        </div>
                        <div className="bg-white/[0.02] rounded-xl p-4 text-center">
                          <div className="text-2xl font-bold text-green-400">
                            ${(salesStats.promoters
                              .filter(p => p.promoter_name)
                              .reduce((sum, p) => sum + p.total_sales, 0) / 1000000).toFixed(2)}M
                          </div>
                          <div className="text-white/60 text-sm">Total por Promotores</div>
                        </div>
                        <div className="bg-white/[0.02] rounded-xl p-4 text-center">
                          <div className="text-2xl font-bold text-blue-400">
                            ${(salesStats.promoters
                              .filter(p => p.promoter_name)
                              .reduce((sum, p) => sum + p.total_sales, 0) / 
                              salesStats.promoters.filter(p => p.promoter_name).length / 1000000).toFixed(2)}M
                          </div>
                          <div className="text-white/60 text-sm">Promedio por Promotor</div>
                        </div>
                      </div>

                      {/* Individual Promoter Performance */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium text-white">Ranking de Promotores</h4>
                        {salesStats.promoters
                          .filter(p => p.promoter_name)
                          .sort((a, b) => b.total_sales - a.total_sales)
                          .map((promoter, index) => {
                            const percentage = (promoter.total_sales / salesStats.ventas_totales) * 100;
                            const rankIcons = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣'];
                            return (
                              <div key={promoter.promoter_id || index} className="bg-white/[0.02] rounded-xl p-4">
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex items-center gap-3">
                                    <span className="text-2xl">{rankIcons[index] || '📍'}</span>
                                    <div>
                                      <div className="text-white font-medium text-lg">{promoter.promoter_name}</div>
                                      <div className="text-white/60 text-sm">Promotor #{index + 1}</div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-xl font-bold text-white">
                                      ${(promoter.total_sales / 1000000).toFixed(2)}M
                                    </div>
                                    <div className="text-white/60 text-sm">
                                      {percentage.toFixed(1)}% del total
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm text-white/60">
                                    <span>Participación</span>
                                    <span>{percentage.toFixed(2)}%</span>
                                  </div>
                                  <div className="w-full bg-white/10 rounded-full h-2">
                                    <div 
                                      className={`h-2 rounded-full ${
                                        index === 0 ? 'bg-yellow-400' : 
                                        index === 1 ? 'bg-gray-300' : 
                                        index === 2 ? 'bg-orange-400' : 'bg-blue-400'
                                      }`}
                                      style={{ width: `${Math.max(percentage, 5)}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>

                  {/* Financial Deep Dive */}
                  <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-8 border border-white/[0.08]">
                    <h3 className="text-2xl font-semibold text-white mb-6">Análisis Financiero Detallado</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Revenue Distribution */}
                      <div>
                        <h4 className="text-lg font-medium text-white mb-4">Distribución de Ingresos</h4>
                        <div className="space-y-4">
                          <div className="bg-white/[0.02] rounded-xl p-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-white/80">💰 Para Productor</span>
                              <span className="text-green-400 font-semibold">
                                ${salesStats.ingreso_neto_productor_ajustado.toLocaleString()}
                              </span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2">
                              <div 
                                className="bg-green-400 h-2 rounded-full"
                                style={{ width: `${(salesStats.ingreso_neto_productor_ajustado / salesStats.ventas_totales) * 100}%` }}
                              ></div>
                            </div>
                            <div className="text-white/60 text-sm mt-1">
                              {((salesStats.ingreso_neto_productor_ajustado / salesStats.ventas_totales) * 100).toFixed(1)}% del total
                            </div>
                          </div>

                          <div className="bg-white/[0.02] rounded-xl p-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-white/80">🏢 Comisiones Hunt</span>
                              <span className="text-blue-400 font-semibold">
                                ${(salesStats.ventas_en_app.servicio + salesStats.ventas_en_web.servicio + salesStats.ventas_en_efectivo.servicio).toLocaleString()}
                              </span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2">
                              <div 
                                className="bg-blue-400 h-2 rounded-full"
                                style={{ width: `${((salesStats.ventas_en_app.servicio + salesStats.ventas_en_web.servicio + salesStats.ventas_en_efectivo.servicio) / salesStats.ventas_totales) * 100}%` }}
                              ></div>
                            </div>
                            <div className="text-white/60 text-sm mt-1">
                              {(((salesStats.ventas_en_app.servicio + salesStats.ventas_en_web.servicio + salesStats.ventas_en_efectivo.servicio) / salesStats.ventas_totales) * 100).toFixed(1)}% del total
                            </div>
                          </div>

                          <div className="bg-white/[0.02] rounded-xl p-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-white/80">🏛️ Impuestos</span>
                              <span className="text-orange-400 font-semibold">
                                ${(salesStats.ventas_en_app.impuestos + salesStats.ventas_en_web.impuestos + salesStats.ventas_en_efectivo.impuestos).toLocaleString()}
                              </span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2">
                              <div 
                                className="bg-orange-400 h-2 rounded-full"
                                style={{ width: `${((salesStats.ventas_en_app.impuestos + salesStats.ventas_en_web.impuestos + salesStats.ventas_en_efectivo.impuestos) / salesStats.ventas_totales) * 100}%` }}
                              ></div>
                            </div>
                            <div className="text-white/60 text-sm mt-1">
                              {(((salesStats.ventas_en_app.impuestos + salesStats.ventas_en_web.impuestos + salesStats.ventas_en_efectivo.impuestos) / salesStats.ventas_totales) * 100).toFixed(1)}% del total
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Commission Analysis by Channel */}
                      <div>
                        <h4 className="text-lg font-medium text-white mb-4">Comisiones por Canal</h4>
                        <div className="space-y-4">
                          <div className="bg-white/[0.02] rounded-xl p-4">
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center gap-2">
                                <span>📱</span>
                                <span className="text-white/80">App</span>
                              </div>
                              <span className="text-blue-400 font-semibold">
                                ${salesStats.ventas_en_app.servicio.toLocaleString()}
                              </span>
                            </div>
                            <div className="text-white/60 text-sm">
                              Comisión: {((salesStats.ventas_en_app.servicio / salesStats.ventas_en_app.total) * 100).toFixed(1)}% del canal
                            </div>
                          </div>

                          <div className="bg-white/[0.02] rounded-xl p-4">
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center gap-2">
                                <span>🌐</span>
                                <span className="text-white/80">Web</span>
                              </div>
                              <span className="text-green-400 font-semibold">
                                ${salesStats.ventas_en_web.servicio.toLocaleString()}
                              </span>
                            </div>
                            <div className="text-white/60 text-sm">
                              Comisión: {((salesStats.ventas_en_web.servicio / salesStats.ventas_en_web.total) * 100).toFixed(1)}% del canal
                            </div>
                          </div>

                          <div className="bg-white/[0.02] rounded-xl p-4">
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center gap-2">
                                <span>💵</span>
                                <span className="text-white/80">Efectivo</span>
                              </div>
                              <span className="text-orange-400 font-semibold">
                                ${salesStats.ventas_en_efectivo.servicio.toLocaleString()}
                              </span>
                            </div>
                            <div className="text-white/60 text-sm">
                              Comisión: {((salesStats.ventas_en_efectivo.servicio / salesStats.ventas_en_efectivo.total) * 100).toFixed(1)}% del canal
                            </div>
                          </div>
                        </div>

                        {/* Key Metrics */}
                        <div className="mt-6 bg-white/[0.02] rounded-xl p-4">
                          <h5 className="text-white font-medium mb-3">📊 Métricas Clave</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-white/60">Margen Bruto Productor:</span>
                              <span className="text-green-400">
                                {((salesStats.ingreso_neto_productor_ajustado / salesStats.ventas_totales) * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-white/60">Tasa de Comisión:</span>
                              <span className="text-blue-400">
                                {(((salesStats.ventas_en_app.servicio + salesStats.ventas_en_web.servicio + salesStats.ventas_en_efectivo.servicio) / salesStats.ventas_totales) * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-white/60">Carga Tributaria:</span>
                              <span className="text-orange-400">
                                {(((salesStats.ventas_en_app.impuestos + salesStats.ventas_en_web.impuestos + salesStats.ventas_en_efectivo.impuestos) / salesStats.ventas_totales) * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Report Summary */}
                  <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-8 border border-white/[0.08]">
                    <h3 className="text-2xl font-semibold text-white mb-6">Información del Reporte</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-white/[0.02] rounded-xl p-4 text-center">
                        <div className="text-lg font-semibold text-white mb-1">
                          {new Date(salesStats.timestamp).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="text-white/60 text-sm">Fecha del Reporte</div>
                      </div>
                      <div className="bg-white/[0.02] rounded-xl p-4 text-center">
                        <div className="text-lg font-semibold text-white mb-1">
                          {new Date(salesStats.timestamp).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </div>
                        <div className="text-white/60 text-sm">Hora de Generación</div>
                      </div>
                      <div className="bg-white/[0.02] rounded-xl p-4 text-center">
                        <div className="text-lg font-semibold text-white mb-1">
                          {salesStats.event_id.split('-')[0].toUpperCase()}
                        </div>
                        <div className="text-white/60 text-sm">ID del Evento</div>
                      </div>
                      <div className="bg-white/[0.02] rounded-xl p-4 text-center">
                        <div className="text-lg font-semibold text-green-400 mb-1">
                          ✅ Completo
                        </div>
                        <div className="text-white/60 text-sm">Estado del Reporte</div>
                      </div>
                    </div>
                    
                    {/* Export Options */}
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <h4 className="text-lg font-medium text-white mb-4">Opciones de Exportación</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <button className="bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-all duration-300 text-white text-sm font-medium flex items-center justify-center gap-2">
                          📊 Exportar Excel
                        </button>
                        <button className="bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-all duration-300 text-white text-sm font-medium flex items-center justify-center gap-2">
                          📄 Generar PDF
                        </button>
                        <button className="bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-all duration-300 text-white text-sm font-medium flex items-center justify-center gap-2">
                          📧 Enviar por Email
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-8 border border-white/[0.08]">
                    <h3 className="text-xl font-medium text-white mb-4">
                      {loadingSales ? 'Cargando estadísticas...' : 'Sin datos de ventas'}
                    </h3>
                    <p className="text-white/60">
                      {loadingSales 
                        ? 'Por favor espera mientras cargamos las estadísticas de ventas.'
                        : 'No se pudieron cargar las estadísticas de ventas para este evento.'
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "transactions" && (
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-8 border border-white/[0.08] space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white">Transacciones del Evento</h2>
              </div>

              {/* Search and Filters */}
              <div className="flex items-center gap-4 mb-6">
                {/* Search Input */}
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar transacciones..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        handleFilterChange();
                      }}
                      className="w-full h-9 pl-9 pr-4 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/50 focus:bg-white/10 focus:border-white/20 focus:outline-none transition-all duration-200"
                    />
                    <svg className="w-4 h-4 text-white/40 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Status Filter */}
                <DropdownMenu
                  minWidth="min-w-48"
                  stayOpen={true}
                  options={[
                    {
                      label: "Pagado con QR",
                      onClick: () => toggleStatusFilter("PAID WITH QR"),
                      Icon: <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusConfig("PAID WITH QR").color }}></div>,
                      isSelected: statusFilter.includes("PAID WITH QR")
                    },
                    {
                      label: "Pagado",
                      onClick: () => toggleStatusFilter("PAID"),
                      Icon: <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusConfig("PAID").color }}></div>,
                      isSelected: statusFilter.includes("PAID")
                    },
                    {
                      label: "Procesando",
                      onClick: () => toggleStatusFilter("PROCESSING"),
                      Icon: <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusConfig("PROCESSING").color }}></div>,
                      isSelected: statusFilter.includes("PROCESSING")
                    },
                    {
                      label: "Pendiente",
                      onClick: () => toggleStatusFilter("PENDING"),
                      Icon: <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusConfig("PENDING").color }}></div>,
                      isSelected: statusFilter.includes("PENDING")
                    },
                    {
                      label: "Expirado",
                      onClick: () => toggleStatusFilter("EXPIRADO"),
                      Icon: <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusConfig("EXPIRADO").color }}></div>,
                      isSelected: statusFilter.includes("EXPIRADO")
                    },
                    {
                      label: "Rechazado",
                      onClick: () => toggleStatusFilter("REJECTED_BY_PAYMENT_GATEWAY"),
                      Icon: <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusConfig("REJECTED_BY_PAYMENT_GATEWAY").color }}></div>,
                      isSelected: statusFilter.includes("REJECTED_BY_PAYMENT_GATEWAY")
                    },
                    {
                      label: "Fallido",
                      onClick: () => toggleStatusFilter("FAILED"),
                      Icon: <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusConfig("FAILED").color }}></div>,
                      isSelected: statusFilter.includes("FAILED")
                    }
                  ]}
                >
                  <div className="flex items-center gap-2">
                    {statusFilter.length === 7 ? (
                      <span>Todos los estados</span>
                    ) : statusFilter.length === 1 ? (
                      <>
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: getStatusConfig(statusFilter[0]).color }}
                        ></div>
                        <span>
                          {statusFilter[0] === "PAID WITH QR" ? "Pagado QR" :
                           statusFilter[0] === "PAID" ? "Pagado" :
                           statusFilter[0] === "PROCESSING" ? "Procesando" :
                           statusFilter[0] === "PENDING" ? "Pendiente" :
                           statusFilter[0] === "EXPIRADO" ? "Expirado" :
                           statusFilter[0] === "REJECTED_BY_PAYMENT_GATEWAY" ? "Rechazado" :
                           statusFilter[0] === "FAILED" ? "Fallido" : "Estado"}
                        </span>
                      </>
                    ) : (
                      <div className="flex items-center gap-1">
                        <div className="flex -space-x-1">
                          {statusFilter.slice(0, 3).map((status, index) => (
                            <div 
                              key={status}
                              className="w-2 h-2 rounded-full border border-white/20" 
                              style={{ backgroundColor: getStatusConfig(status).color }}
                            ></div>
                          ))}
                          {statusFilter.length > 3 && (
                            <div className="w-2 h-2 rounded-full bg-white/20 flex items-center justify-center">
                              <span className="text-[6px] text-white">+</span>
                            </div>
                          )}
                        </div>
                        <span>{statusFilter.length} estados</span>
                      </div>
                    )}
                  </div>
                </DropdownMenu>

                {/* Canal Filter */}
                <DropdownMenu
                  options={[
                    {
                      label: "Todos los canales",
                      onClick: () => {
                        setSourceFilter("all");
                        handleFilterChange();
                      }
                    },
                    {
                      label: "Aplicación Móvil",
                      onClick: () => {
                        setSourceFilter("mobile");
                        handleFilterChange();
                      }
                    },
                    {
                      label: "Página Web",
                      onClick: () => {
                        setSourceFilter("web");
                        handleFilterChange();
                      }
                    },
                    {
                      label: "Efectivo",
                      onClick: () => {
                        setSourceFilter("cash");
                        handleFilterChange();
                      }
                    }
                  ]}
                >
                  {sourceFilter === "all" ? "Todos los canales" :
                   sourceFilter === "mobile" ? "Aplicación Móvil" :
                   sourceFilter === "web" ? "Página Web" :
                   sourceFilter === "cash" ? "Efectivo" : "Canal"}
                </DropdownMenu>

                {/* Download Button */}
                <button
                  onClick={() => {
                    if (!transactionsData?.data) return;
                    
                    // Prepare CSV data
                    const headers = ["ID Orden", "Fecha", "Cliente", "Email Cliente", "Teléfono Cliente", "Promotor", "Email Promotor", "Teléfono Promotor", "Ticket", "Cantidad", "Precio", "Comisión", "Impuestos", "Total", "Canal", "Estado"];
                    const csvData = [
                      headers,
                      ...getFilteredTransactions().map(t => [
                        `${t.order_id} (${formatRelativeDate(t.created_at)})`,
                        t.created_at,
                        `${t.user_name} ${t.user_lastname}`,
                        t.user_email,
                        t.user_phone,
                        t.has_promoter && t.promoter_name ? `${t.promoter_name} ${t.promoter_lastname}` : "Sin promotor",
                        t.has_promoter ? t.promoter_email || "" : "",
                        t.has_promoter ? t.promoter_phone || "" : "",
                        `${t.ticket_name} (Cantidad: ${t.quantity})`,
                        t.quantity,
                        t.price,
                        t.variable_fee,
                        t.tax,
                        t.total,
                        getChannelDisplayName(t.source),
                        t.status
                      ])
                    ];
                    
                    // Create CSV string
                    const csvString = csvData.map(row => 
                      row.map(cell => `"${cell}"`).join(',')
                    ).join('\n');
                    
                    // Download CSV
                    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = `transacciones-${event.name.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`;
                    link.click();
                  }}
                  className="h-9 px-4 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-lg text-white text-sm font-medium transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Descargar
                </button>

                {/* Toggle Chart Visibility */}
                <button
                  onClick={() => setIsChartVisible(!isChartVisible)}
                  className="h-9 w-9 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-lg text-white transition-all duration-200 flex items-center justify-center"
                  title={isChartVisible ? 'Ocultar gráfico' : 'Mostrar gráfico'}
                >
                  {isChartVisible ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  )}
                </button>

                {/* Clear Filters */}
                {(searchTerm || statusFilter.length !== 7 || sourceFilter !== "all") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter(["PAID WITH QR", "PAID", "PROCESSING", "PENDING", "EXPIRADO", "REJECTED_BY_PAYMENT_GATEWAY", "FAILED"]);
                      setSourceFilter("all");
                      handleFilterChange();
                    }}
                    className="h-9 px-3 text-white/60 hover:text-white text-sm"
                  >
                    Limpiar
                  </button>
                )}
              </div>

              {/* Sales Activity Chart */}
              {transactionsData && isChartVisible && (
                <div className="bg-transparent border border-white/[0.08] rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-medium text-white">Actividad de transacciones</h3>
                      <p className="text-xs text-white/60 mt-1 capitalize">
                        {activeChartIndex !== null ? `${getChartData()[activeChartIndex]?.fullDateWithDay}: ${getChartData()[activeChartIndex]?.total || 0} transacciones` : "Últimos 30 días"}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-white">
                        {getSalesDataByDay().reduce((sum, d) => sum + d.total, 0)}
                      </div>
                      <div className="text-xs text-white/60">
                        Total de transacciones
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-24">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                      <BarChart
                        accessibilityLayer
                        data={getChartData()}
                        onMouseLeave={() => setActiveChartIndex(null)}
                      >
                        <XAxis
                          dataKey="displayDate"
                          tickLine={false}
                          tickMargin={10}
                          axisLine={false}
                          interval="preserveStartEnd"
                          tick={{ fontSize: 9, fill: 'rgba(255, 255, 255, 0.7)' }}
                        />
                        <ChartTooltip
                          cursor={false}
                          content={({ active, payload }) => {
                            if (!active || !payload?.length) return null;
                            const data = payload[0]?.payload;
                            return (
                              <div className="bg-black/90 border border-white/20 rounded-lg px-2.5 py-1.5 text-xs text-white shadow-xl">
                                <div className="font-medium mb-1 capitalize">{data?.fullDateWithDay}</div>
                                <div className="space-y-1">
                                  {data?.paidWithQR > 0 && <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{backgroundColor: chartConfig.paidWithQR.color}}></div><span>{data.paidWithQR} Pagado QR</span></div>}
                                  {data?.paid > 0 && <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{backgroundColor: chartConfig.paid.color}}></div><span>{data.paid} Pagado</span></div>}
                                  {data?.processing > 0 && <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{backgroundColor: chartConfig.processing.color}}></div><span>{data.processing} Procesando</span></div>}
                                  {data?.pending > 0 && <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{backgroundColor: chartConfig.pending.color}}></div><span>{data.pending} Pendiente</span></div>}
                                  {data?.expired > 0 && <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{backgroundColor: chartConfig.expired.color}}></div><span>{data.expired} Expirado</span></div>}
                                  {data?.rejected > 0 && <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{backgroundColor: chartConfig.rejected.color}}></div><span>{data.rejected} Rechazado</span></div>}
                                  {data?.failed > 0 && <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{backgroundColor: chartConfig.failed.color}}></div><span>{data.failed} Fallido</span></div>}
                                </div>
                                <div className="text-white/50 mt-1 pt-1 border-t border-white/20">Total: {data?.total || 0}</div>
                              </div>
                            );
                          }}
                        />
                        {/* Stacked bars for each status */}
                        <Bar dataKey="paidWithQR" stackId="a" fill="var(--color-paidWithQR)" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="paid" stackId="a" fill="var(--color-paid)" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="processing" stackId="a" fill="var(--color-processing)" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="pending" stackId="a" fill="var(--color-pending)" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="expired" stackId="a" fill="var(--color-expired)" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="rejected" stackId="a" fill="var(--color-rejected)" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="failed" stackId="a" fill="var(--color-failed)" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ChartContainer>
                  </div>
                  
                  {/* Summary */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.06]">
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: chartConfig.paidWithQR.color }} />
                        <span className="text-white/60">Pagado QR</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: chartConfig.paid.color }} />
                        <span className="text-white/60">Pagado</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: chartConfig.processing.color }} />
                        <span className="text-white/60">Procesando</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: chartConfig.pending.color }} />
                        <span className="text-white/60">Pendiente</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: chartConfig.expired.color }} />
                        <span className="text-white/60">Expirado</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: chartConfig.rejected.color }} />
                        <span className="text-white/60">Rechazado</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: chartConfig.failed.color }} />
                        <span className="text-white/60">Fallido</span>
                      </div>
                    </div>
                    <div className="text-xs text-white/50">
                      Promedio: {Math.round(getSalesDataByDay().reduce((sum, d) => sum + d.total, 0) / 30)} transacciones/día
                    </div>
                  </div>
                </div>
              )}

              {loadingTransactions ? (
                <div className="text-center py-12">
                  <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-8 border border-white/[0.08]">
                    <h3 className="text-xl font-medium text-white mb-4">Cargando transacciones...</h3>
                    <p className="text-white/60">Por favor espera mientras cargamos los datos.</p>
                  </div>
                </div>
              ) : transactionsData && getFilteredTransactions().length > 0 ? (
                <>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <SortableHeader field="order_id">ID Orden</SortableHeader>
                          <SortableHeader field="user_name">Cliente</SortableHeader>
                          <SortableHeader field="seller_name">Promotor</SortableHeader>
                          <SortableHeader field="ticket_name">Ticket</SortableHeader>
                          <SortableHeader field="price">Precio</SortableHeader>
                          <SortableHeader field="variable_fee">Comisión</SortableHeader>
                          <SortableHeader field="tax">Impuestos</SortableHeader>
                          <SortableHeader field="total">Total</SortableHeader>
                          <SortableHeader field="source">Canal</SortableHeader>
                          <SortableHeader field="status">Estado</SortableHeader>
                        </tr>
                      </thead>
                      <tbody>
                        {getFilteredTransactions().map((transaction) => (
                          <tr key={transaction.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                            <td className="py-4 px-4">
                              <div className="text-white/80 font-mono text-sm">{transaction.order_id}</div>
                              <div className="text-white/60 text-xs mt-1" title={transaction.created_at}>
                                {formatRelativeDate(transaction.created_at)}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-white/90">{transaction.user_name} {transaction.user_lastname}</div>
                              <div className="text-white/60 text-xs mt-1">{transaction.user_email} • {transaction.user_phone}</div>
                            </td>
                            <td className="py-4 px-4">
                              {transaction.has_promoter ? (
                                <>
                                  <div className="text-white/90">{transaction.promoter_name} {transaction.promoter_lastname}</div>
                                  <div className="text-white/60 text-xs mt-1">{transaction.promoter_email} • {transaction.promoter_phone}</div>
                                </>
                              ) : (
                                <div className="text-white/60 text-sm">Sin promotor</div>
                              )}
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-white/90">{transaction.ticket_name}</div>
                              <div className="text-white/60 text-xs mt-1">Cantidad: {transaction.quantity}</div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-white font-medium">{formatCurrency(transaction.price)}</div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-white font-medium">{formatCurrency(transaction.variable_fee)}</div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-white font-medium">{formatCurrency(transaction.tax)}</div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-white font-medium">{formatCurrency(transaction.total)}</div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-white/70 text-sm">{getChannelDisplayName(transaction.source)}</div>
                            </td>
                            <td className="py-4 px-4">
                              {getStatusBadge(transaction.status, transaction.created_at)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Controls */}
                  {transactionsData.pagination.total_pages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <div className="text-white/60 text-sm">
                        Mostrando {((transactionsData.pagination.page - 1) * transactionsData.pagination.page_size) + 1} - {Math.min(transactionsData.pagination.page * transactionsData.pagination.page_size, transactionsData.pagination.total_records)} de {transactionsData.pagination.total_records} resultados
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => fetchTransactions(currentPage - 1)}
                          disabled={!transactionsData.pagination.has_previous}
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-xl transition-all duration-300 text-white font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Anterior
                        </button>
                        
                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(5, transactionsData.pagination.total_pages) }, (_, i) => {
                            const page = Math.max(1, Math.min(
                              transactionsData.pagination.total_pages - 4,
                              transactionsData.pagination.page - 2
                            )) + i;
                            
                            return (
                              <button
                                key={page}
                                onClick={() => fetchTransactions(page)}
                                className={`w-10 h-10 rounded-xl transition-all duration-300 text-sm font-medium ${
                                  page === transactionsData.pagination.page
                                    ? 'bg-white/20 text-white border border-white/30'
                                    : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white border border-white/10 hover:border-white/20'
                                }`}
                              >
                                {page}
                              </button>
                            );
                          })}
                        </div>
                        
                        <button
                          onClick={() => fetchTransactions(currentPage + 1)}
                          disabled={!transactionsData.pagination.has_next}
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-xl transition-all duration-300 text-white font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Siguiente
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : transactionsData ? (
                <div className="text-center py-12">
                  <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-8 border border-white/[0.08]">
                    <h3 className="text-xl font-medium text-white mb-4">
                      {transactionsData.data.length === 0 ? "Sin transacciones" : "No hay resultados"}
                    </h3>
                    <p className="text-white/60">
                      {transactionsData.data.length === 0 
                        ? "No se encontraron transacciones para este evento."
                        : "No se encontraron transacciones que coincidan con los filtros aplicados."
                      }
                    </p>
                    {(searchTerm || statusFilter !== "all" || sourceFilter !== "all") && (
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setStatusFilter("all");
                          setSourceFilter("all");
                          handleFilterChange();
                        }}
                        className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-xl transition-all duration-300 text-white font-medium text-sm"
                      >
                        Limpiar filtros
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-8 border border-white/[0.08]">
                    <h3 className="text-xl font-medium text-white mb-4">Datos no disponibles</h3>
                    <p className="text-white/60">Haz clic en el tab de Transacciones para cargar los datos.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "map" && (
            <div className="h-full -m-8">
              <VenueMapEditor
                eventId={event.id}
                onSave={(data) => {
                  localStorage.setItem(`venue-map-${event.id}`, JSON.stringify(data));
                  alert('Mapa guardado exitosamente!');
                }}
              />
            </div>
          )}

          {activeTab === "tickets" && (
          <div className="mt-8">
            <div className="flex gap-8">
              {/* Vertical Sub-tabs Navigation */}
              <div className="w-64 flex-shrink-0">
                <div className="space-y-2">
                  {ticketsSubTabs.map((subTab) => (
                    <button
                      key={subTab.id}
                      onClick={() => setTicketsSubTab(subTab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                        ticketsSubTab === subTab.id
                          ? "bg-white/10 text-white border border-white/20 shadow-lg"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span className="text-lg">{subTab.icon}</span>
                      <span>{subTab.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sub-tabs Content */}
              <div className="flex-1 space-y-6">
              {ticketsSubTab === "tickets" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-white">Gestión de Tickets</h2>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors">
                      + Nuevo Ticket
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/[0.08]">
                      <h3 className="text-lg font-medium text-white mb-2">General</h3>
                      <p className="text-white/60 text-sm mb-4">$50.000 • 100 disponibles</p>
                      <div className="flex gap-2">
                        <button className="text-blue-400 hover:text-blue-300 text-sm">Editar</button>
                        <button className="text-red-400 hover:text-red-300 text-sm">Eliminar</button>
                      </div>
                    </div>
                    
                    <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/[0.08]">
                      <h3 className="text-lg font-medium text-white mb-2">VIP</h3>
                      <p className="text-white/60 text-sm mb-4">$100.000 • 50 disponibles</p>
                      <div className="flex gap-2">
                        <button className="text-blue-400 hover:text-blue-300 text-sm">Editar</button>
                        <button className="text-red-400 hover:text-red-300 text-sm">Eliminar</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {ticketsSubTab === "create" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-white">Crear Nuevo Ticket</h2>
                  
                  <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-8 border border-white/[0.08]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Nombre del Ticket</label>
                        <input
                          type="text"
                          placeholder="Ej: Entrada General"
                          className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/50 focus:bg-white/10 focus:border-white/20 focus:outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Precio</label>
                        <input
                          type="number"
                          placeholder="50000"
                          className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/50 focus:bg-white/10 focus:border-white/20 focus:outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Cantidad</label>
                        <input
                          type="number"
                          placeholder="100"
                          className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/50 focus:bg-white/10 focus:border-white/20 focus:outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Descripción</label>
                        <textarea
                          placeholder="Descripción del ticket..."
                          className="w-full h-20 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/50 focus:bg-white/10 focus:border-white/20 focus:outline-none resize-none"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6 flex gap-3">
                      <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors">
                        Crear Ticket
                      </button>
                      <button className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-colors">
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {ticketsSubTab === "analytics" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-white">Analytics de Tickets</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/[0.08]">
                      <h3 className="text-lg font-medium text-white mb-2">Tickets Vendidos</h3>
                      <p className="text-3xl font-bold text-white">150</p>
                      <p className="text-white/60 text-sm">de 200 total</p>
                    </div>
                    
                    <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/[0.08]">
                      <h3 className="text-lg font-medium text-white mb-2">Ingresos</h3>
                      <p className="text-3xl font-bold text-green-400">$7.500.000</p>
                      <p className="text-white/60 text-sm">Total recaudado</p>
                    </div>
                    
                    <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/[0.08]">
                      <h3 className="text-lg font-medium text-white mb-2">Tasa de Conversión</h3>
                      <p className="text-3xl font-bold text-blue-400">75%</p>
                      <p className="text-white/60 text-sm">Visitantes que compraron</p>
                    </div>
                  </div>
                </div>
              )}

              {ticketsSubTab === "lists" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-white">Listas de Asistentes</h2>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors">
                      Exportar Lista
                    </button>
                  </div>
                  
                  <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/[0.08]">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Nombre</th>
                            <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Email</th>
                            <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Ticket</th>
                            <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-white/5">
                            <td className="py-3 px-4 text-white/90">Juan Pérez</td>
                            <td className="py-3 px-4 text-white/70">juan@ejemplo.com</td>
                            <td className="py-3 px-4 text-white/70">General</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-1 bg-green-600/20 text-green-400 rounded-full text-xs">Confirmado</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {ticketsSubTab === "guestlist" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-white">Guest List</h2>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors">
                      + Agregar Invitado
                    </button>
                  </div>
                  
                  <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/[0.08]">
                    <div className="mb-4">
                      <input
                        type="text"
                        placeholder="Buscar invitados..."
                        className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/50 focus:bg-white/10 focus:border-white/20 focus:outline-none"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div>
                          <p className="text-white font-medium">María García</p>
                          <p className="text-white/60 text-sm">maria@ejemplo.com</p>
                        </div>
                        <div className="flex gap-2">
                          <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs">VIP</span>
                          <button className="text-red-400 hover:text-red-300 text-sm">Remover</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {ticketsSubTab === "wallet" && (
                <div>
                  <AppleWalletCustomizer 
                    eventData={eventData.event}
                    onSave={(config) => {
                      // Save configuration to localStorage
                      const key = `wallet-pass-config-${eventData.event.id}`;
                      localStorage.setItem(key, JSON.stringify(config));
                      
                      // Show success message (you could use a toast notification here)
                      alert('Configuración de Apple Wallet guardada exitosamente!');
                      
                      // In the future, this could also save to your backend:
                      // await saveWalletPassConfig(eventData.event.id, config);
                    }}
                  />
                </div>
              )}
              </div>
            </div>
          </div>
        )}

        </div>

      </div>
    </div>
  );
}