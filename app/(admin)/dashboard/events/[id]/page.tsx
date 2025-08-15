"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseBrowser";
import blurImage from "@/assets/other.png";
import StatisticsCard5 from "@/components/ui/statistics-card-5";
import StatisticsCard2 from "@/components/ui/statistics-card-2";
import AppleWalletCustomizer from "@/components/ui/apple-wallet-customizer";
import ModernBreadcrumbs from "@/components/ui/modern-breadcrumbs";
import { CreditCard } from "lucide-react";
import {
  Cell,
  Column,
  Row,
  Table,
  TableBody,
  TableHeader,
} from "@/components/ui/table";

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
  const [transactions, setTransactions] = useState([
    {
      id: "TXN-001",
      event: "Festival Electrónico 2024",
      ticket_type: "VIP",
      quantity: 2,
      unit_price: 85000,
      total: 170000,
      commission: 17000,
      net_amount: 153000,
      status: "completed",
      date: "2024-11-15",
      customer: "María González",
      payment_method: "Tarjeta de Crédito"
    },
    {
      id: "TXN-002", 
      event: "Concierto Rock Alternativo",
      ticket_type: "General",
      quantity: 1,
      unit_price: 45000,
      total: 45000,
      commission: 4500,
      net_amount: 40500,
      status: "completed",
      date: "2024-11-14",
      customer: "Carlos Pérez",
      payment_method: "PSE"
    },
    {
      id: "TXN-003",
      event: "Festival Electrónico 2024", 
      ticket_type: "General",
      quantity: 4,
      unit_price: 65000,
      total: 260000,
      commission: 26000,
      net_amount: 234000,
      status: "pending",
      date: "2024-11-13",
      customer: "Ana López",
      payment_method: "Transferencia"
    },
    {
      id: "TXN-004",
      event: "Jazz Night Experience",
      ticket_type: "Premium",
      quantity: 2,
      unit_price: 120000,
      total: 240000,
      commission: 24000,
      net_amount: 216000,
      status: "completed",
      date: "2024-11-12",
      customer: "Roberto Silva",
      payment_method: "Tarjeta de Débito"
    },
    {
      id: "TXN-005",
      event: "Reggaeton Party",
      ticket_type: "VIP",
      quantity: 1,
      unit_price: 95000,
      total: 95000,
      commission: 9500,
      net_amount: 85500,
      status: "failed",
      date: "2024-11-11",
      customer: "Sofía Martín",
      payment_method: "Tarjeta de Crédito"
    }
  ]);

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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', label: 'Completada' },
      pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', label: 'Pendiente' },
      failed: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', label: 'Fallida' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
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
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-8 border border-white/[0.08]">
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
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white mb-4">Configuración del Evento</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Nombre del Evento
                    </label>
                    <input
                      type="text"
                      defaultValue={event.name}
                      className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm text-white text-sm placeholder-white/60 focus:bg-white/10 focus:border-white/20 focus:outline-none transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Fecha del Evento
                    </label>
                    <input
                      type="text"
                      defaultValue={event.date}
                      className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm text-white text-sm placeholder-white/60 focus:bg-white/10 focus:border-white/20 focus:outline-none transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Hora del Evento
                    </label>
                    <input
                      type="text"
                      defaultValue={event.hour}
                      className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm text-white text-sm placeholder-white/60 focus:bg-white/10 focus:border-white/20 focus:outline-none transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      URL del Evento
                    </label>
                    <input
                      type="url"
                      defaultValue={event.url}
                      className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm text-white text-sm placeholder-white/60 focus:bg-white/10 focus:border-white/20 focus:outline-none transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Descripción del Evento
                  </label>
                  <textarea
                    rows={4}
                    defaultValue={event.description_plain}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm text-white text-sm placeholder-white/60 focus:bg-white/10 focus:border-white/20 focus:outline-none transition-all duration-200 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        defaultChecked={eventData.has_tickets}
                        className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-white/80 text-sm font-medium">Tiene Entradas</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        defaultChecked={eventData.guest_list_enabled}
                        className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-white/80 text-sm font-medium">Lista de Invitados</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        defaultChecked={eventData.guest_list_sold_out}
                        className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-white/80 text-sm font-medium">Lista Agotada</span>
                    </label>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/[0.08]">
                  <h3 className="text-lg font-medium text-white mb-4">Enlaces Rápidos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/60 text-sm mb-1">Archivo ICS:</label>
                      <a 
                        href={event.ics} 
                        download
                        className="text-blue-400 hover:text-blue-300 underline text-sm"
                      >
                        Descargar Calendar
                      </a>
                    </div>
                    <div>
                      <label className="block text-white/60 text-sm mb-1">Página Pública:</label>
                      <a 
                        href={event.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline text-sm"
                      >
                        Ver Evento
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button className="px-6 py-3 bg-[#d9d9d9] hover:bg-white hover:scale-[1.02] rounded-xl transition-all duration-300 text-black font-medium">
                    Guardar Cambios
                  </button>
                  <button className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-xl transition-all duration-300 text-white font-medium">
                    Cancelar
                  </button>
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
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white">Transacciones del Evento</h2>
                <div className="flex items-center gap-4">
                  <div className="bg-white/[0.05] rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-6 text-sm">
                      <div>
                        <span className="text-white/60">Total Ventas</span>
                        <div className="font-semibold text-white">{formatCurrency(transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.total, 0))}</div>
                      </div>
                      <div>
                        <span className="text-white/60">Comisiones</span>
                        <div className="font-semibold text-white">{formatCurrency(transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.commission, 0))}</div>
                      </div>
                      <div>
                        <span className="text-white/60">Neto</span>
                        <div className="font-semibold text-green-400">{formatCurrency(transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.net_amount, 0))}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">ID</th>
                      <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Evento</th>
                      <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Cliente</th>
                      <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Ticket</th>
                      <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Cant.</th>
                      <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Total</th>
                      <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Comisión</th>
                      <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Neto</th>
                      <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Estado</th>
                      <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-4">
                          <div className="text-white/80 font-mono text-sm">{transaction.id}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-white font-medium">{transaction.event}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-white/90">{transaction.customer}</div>
                          <div className="text-white/50 text-xs">{transaction.payment_method}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-white/90">{transaction.ticket_type}</div>
                          <div className="text-white/50 text-xs">{formatCurrency(transaction.unit_price)} c/u</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-white font-medium">{transaction.quantity}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-white font-medium">{formatCurrency(transaction.total)}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-orange-400">{formatCurrency(transaction.commission)}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-green-400 font-medium">{formatCurrency(transaction.net_amount)}</div>
                        </td>
                        <td className="py-4 px-4">
                          {getStatusBadge(transaction.status)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-white/80 text-sm">{formatDate(transaction.date)}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Apple Wallet Customizer - Outside tabs container when tickets tab is active */}
        {activeTab === "tickets" && (
          <div className="mt-8">
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
  );
}