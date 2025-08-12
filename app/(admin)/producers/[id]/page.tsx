"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProducers } from "@/hook/useProducers";
import { useSellers } from "@/hook/useSellers";
import { useProducerUpcomingEvents } from "@/hook/useProducerUpcomingEvents";
import { useProducerPastEvents } from "@/hook/useProducerPastEvents";
import { getProducerById } from "@/supabase/producersService";
import { Producer } from "@/types/site";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  Calendar, 
  Users, 
  FileText, 
  BarChart3, 
  Settings,
  Edit3,
  Upload,
  Download,
  Plus,
  UserPlus,
  Crown,
  ShoppingCart,
  TrendingUp,
  Eye,
  DollarSign,
  Trash2
} from "lucide-react";

const ProducerPage = () => {
  const params = useParams<{ id: string }>();
  const { producers } = useProducers();
  const [producer, setProducer] = useState<Producer | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loadingPage, setLoadingPage] = useState(true);
  const [documents, setDocuments] = useState({
    rut_url: null,
    cerl_url: null,
    cb_url: null
  });
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [gradientColors, setGradientColors] = useState("from-purple-400 via-pink-500 to-red-500");
  
  const generateRandomGradient = () => {
    const colors = [
      'red-400', 'red-500', 'red-600',
      'orange-400', 'orange-500', 'orange-600',
      'amber-400', 'amber-500', 'amber-600',
      'yellow-400', 'yellow-500', 'yellow-600',
      'lime-400', 'lime-500', 'lime-600',
      'green-400', 'green-500', 'green-600',
      'emerald-400', 'emerald-500', 'emerald-600',
      'teal-400', 'teal-500', 'teal-600',
      'cyan-400', 'cyan-500', 'cyan-600',
      'sky-400', 'sky-500', 'sky-600',
      'blue-400', 'blue-500', 'blue-600',
      'indigo-400', 'indigo-500', 'indigo-600',
      'violet-400', 'violet-500', 'violet-600',
      'purple-400', 'purple-500', 'purple-600',
      'fuchsia-400', 'fuchsia-500', 'fuchsia-600',
      'pink-400', 'pink-500', 'pink-600',
      'rose-400', 'rose-500', 'rose-600'
    ];
    
    const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];
    const color1 = getRandomColor();
    const color2 = getRandomColor();
    const color3 = getRandomColor();
    
    return `from-${color1} via-${color2} to-${color3}`;
  };
  
  const producerUuid = producer?.id;
  const { upcomingEvents } = useProducerUpcomingEvents(producerUuid || "");
  const { pastEvents } = useProducerPastEvents(producerUuid || "");
  const { sellers } = useSellers(producerUuid || "");

  const fetchDocuments = async (producerId: string) => {
    try {
      setLoadingDocuments(true);
      console.log('Fetching documents for producer:', producerId);
      
      const edgeFunctionUrl = `https://jtfcfsnksywotlbsddqb.supabase.co/functions/v1/producer_files_pdf_v1`;
      
      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ producer_id: producerId })
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Documents data received:', data);
        
        setDocuments({
          rut_url: data.rut_url,
          cerl_url: data.cerl_url,
          cb_url: data.cb_url
        });
      } else {
        console.error('Error response:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error details:', errorText);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoadingDocuments(false);
    }
  };

  useEffect(() => {
    const fetchProducer = async () => {
      setLoadingPage(true);
      const producerData = await getProducerById(params.id);
      setProducer(producerData);
      if (producerData?.id) {
        await fetchDocuments(producerData.id);
      }
      setLoadingPage(false);
    };
    fetchProducer();
  }, [params.id]);

  useEffect(() => {
    // Cambiar gradiente cada 8 segundos
    const interval = setInterval(() => {
      setGradientColors(generateRandomGradient());
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  if (loadingPage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  if (!producer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-muted-foreground">Productor no encontrado</div>
      </div>
    );
  }

  const mockMetrics = {
    totalEvents: upcomingEvents.length + pastEvents.length,
    totalSales: 45678,
    totalRevenue: 123456,
    conversionRate: 12.5
  };

  // Debug: Log current documents state
  console.log('Current documents state:', documents);

  return (
    <div className="w-full h-full bg-default-background">
      {/* Header Section */}
      <div className="relative w-full">
        <div className="relative h-48 overflow-hidden w-full">
          <div className={`absolute inset-0 bg-gradient-to-r ${gradientColors} animate-gradient-x transition-all duration-1000 ease-in-out`}></div>
          <div className="absolute inset-0 bg-black/10" />
        </div>
        
        <div className="relative px-6 pb-6 w-full">
          <div className="flex items-end gap-6 -mt-16 w-full">
            <div className="h-32 w-32 bg-white rounded-2xl shadow-xl overflow-hidden">
              {producer.logo ? (
                <img 
                  src={producer.logo} 
                  alt={producer.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-neutral-600">
                    {producer.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0 pt-16">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-default-font">
                    {producer.name}
                  </h1>
                  <p className="text-subtext-color mt-1">
                    {producer.email}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Editar Perfil
                  </Button>
                  <Button size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Configuración
                  </Button>
                </div>
              </div>
              
              {producer.description && (
                <p className="text-subtext-color mt-3 text-sm">
                  {producer.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8 w-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="px-6 mb-12">
            <TabsList className="flex gap-8 bg-transparent h-auto w-full justify-start p-0">
              <TabsTrigger 
                value="dashboard" 
                className="bg-transparent p-0 pb-3 text-subtext-color hover:text-default-font data-[state=active]:text-default-font border-b-2 border-transparent data-[state=active]:border-default-font transition-colors duration-200"
              >
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="events" 
                className="bg-transparent p-0 pb-3 text-subtext-color hover:text-default-font data-[state=active]:text-default-font border-b-2 border-transparent data-[state=active]:border-default-font transition-colors duration-200"
              >
                Eventos
              </TabsTrigger>
              <TabsTrigger 
                value="roles" 
                className="bg-transparent p-0 pb-3 text-subtext-color hover:text-default-font data-[state=active]:text-default-font border-b-2 border-transparent data-[state=active]:border-default-font transition-colors duration-200"
              >
                Roles
              </TabsTrigger>
              <TabsTrigger 
                value="documents" 
                className="bg-transparent p-0 pb-3 text-subtext-color hover:text-default-font data-[state=active]:text-default-font border-b-2 border-transparent data-[state=active]:border-default-font transition-colors duration-200"
              >
                Documentos
              </TabsTrigger>
              <TabsTrigger 
                value="metrics" 
                className="bg-transparent p-0 pb-3 text-subtext-color hover:text-default-font data-[state=active]:text-default-font border-b-2 border-transparent data-[state=active]:border-default-font transition-colors duration-200"
              >
                Métricas
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="space-y-6 px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-default-background shadow-sm border border-neutral-border rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-subtext-color">Eventos Totales</p>
                      <p className="text-2xl font-bold text-default-font">{mockMetrics.totalEvents}</p>
                    </div>
                    <div className="p-3 bg-brand-primary/10 rounded-xl">
                      <Calendar className="h-6 w-6 text-brand-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-default-background shadow-sm border border-neutral-border rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-subtext-color">Ventas Totales</p>
                      <p className="text-2xl font-bold text-default-font">{mockMetrics.totalSales.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-success-600/10 rounded-xl">
                      <ShoppingCart className="h-6 w-6 text-success-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-default-background shadow-sm border border-neutral-border rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-subtext-color">Ingresos</p>
                      <p className="text-2xl font-bold text-default-font">${mockMetrics.totalRevenue.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-warning-600/10 rounded-xl">
                      <DollarSign className="h-6 w-6 text-warning-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-default-background shadow-sm border border-neutral-border rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-subtext-color">Conversión</p>
                      <p className="text-2xl font-bold text-default-font">{mockMetrics.conversionRate}%</p>
                    </div>
                    <div className="p-3 bg-brand-primary/10 rounded-xl">
                      <TrendingUp className="h-6 w-6 text-brand-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-default-background shadow-sm border border-neutral-border rounded-xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-primary/10 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-brand-primary" />
                  </div>
                  <CardTitle className="text-default-font text-lg">Resumen Rápido</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-brand-50/50 rounded-xl border border-neutral-border/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-brand-primary/10 rounded-lg">
                        <Calendar className="h-4 w-4 text-brand-primary" />
                      </div>
                      <span className="text-default-font font-medium">Eventos próximos</span>
                    </div>
                    <Badge variant="secondary" className="bg-brand-primary/10 text-brand-primary border-brand-primary/20">
                      {upcomingEvents.length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-brand-50/50 rounded-xl border border-neutral-border/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-success-600/10 rounded-lg">
                        <Users className="h-4 w-4 text-success-600" />
                      </div>
                      <span className="text-default-font font-medium">Vendedores activos</span>
                    </div>
                    <Badge variant="secondary" className="bg-success-600/10 text-success-600 border-success-600/20">
                      {sellers.length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6 px-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-default-font">Gestión de Eventos</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Crear Evento
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-brand-100 shadow-sm border border-neutral-border">
                <CardHeader>
                  <CardTitle className="text-default-font">Eventos Próximos</CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingEvents.length > 0 ? (
                    <div className="space-y-3">
                      {upcomingEvents.slice(0, 5).map((event) => (
                        <div key={event.id} className="flex items-center gap-3 p-3 bg-brand-50 rounded-lg">
                          <img src={event.flyer} alt={event.name} className="w-12 h-12 rounded-lg object-cover" />
                          <div className="flex-1">
                            <h4 className="font-medium text-default-font">{event.name}</h4>
                            <p className="text-sm text-subtext-color">{event.venue_name}</p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-subtext-color text-center py-8">No hay eventos próximos</p>
                  )}
                </CardContent>
              </Card>
              
              <Card className="bg-brand-100 shadow-sm border border-neutral-border">
                <CardHeader>
                  <CardTitle className="text-default-font">Eventos Pasados</CardTitle>
                </CardHeader>
                <CardContent>
                  {pastEvents.length > 0 ? (
                    <div className="space-y-3">
                      {pastEvents.slice(0, 5).map((event) => (
                        <div key={event.id} className="flex items-center gap-3 p-3 bg-brand-50 rounded-lg">
                          <img src={event.flyer} alt={event.name} className="w-12 h-12 rounded-lg object-cover" />
                          <div className="flex-1">
                            <h4 className="font-medium text-default-font">{event.name}</h4>
                            <p className="text-sm text-subtext-color">{event.venue_name}</p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-subtext-color text-center py-8">No hay eventos pasados</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="roles" className="space-y-6 px-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-default-font">Gestión de Roles</h2>
            </div>
            
            <div className="space-y-6">
              {/* Administradores Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-subtext-color/20 rounded-lg">
                      <Crown className="h-4 w-4 text-subtext-color" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-default-font">Administradores</h3>
                      <p className="text-xs text-subtext-color">Control total del productor</p>
                    </div>
                  </div>
                  <Button size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Agregar Admin
                  </Button>
                </div>
                
                <Card className="bg-default-background shadow-sm border border-neutral-border">
                  <CardContent className="p-0">
                    <div className="divide-y divide-neutral-border">
                      <div className="flex items-center gap-4 p-4 hover:bg-brand-50 transition-colors">
                        <div className="flex items-center justify-center h-12 w-12 bg-neutral-300 rounded-lg">
                          <span className="text-white font-semibold">AD</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-default-font">Admin Principal</h4>
                          <p className="text-sm text-subtext-color">admin@ejemplo.com</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-subtext-color hover:text-error-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Vendedores Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-brand-primary/20 rounded-lg">
                      <Users className="h-4 w-4 text-brand-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-default-font">Vendedores</h3>
                      <p className="text-xs text-subtext-color">Pueden vender tickets de eventos</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Invitar Vendedor
                  </Button>
                </div>
                
                <Card className="bg-default-background shadow-sm border border-neutral-border">
                  <CardContent className="p-0">
                    {sellers.length > 0 ? (
                      <div className="divide-y divide-neutral-border">
                        {sellers.map((seller, index) => (
                          <div key={seller.id} className="flex items-center gap-4 p-4 hover:bg-brand-50 transition-colors">
                            <div className="h-12 w-12 bg-brand-primary text-white font-semibold rounded-full flex items-center justify-center">
                              {seller.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-default-font">{seller.name}</h4>
                                {index === 0 && (
                                  <Badge variant="outline" className="text-xs">
                                    Mejor vendedor
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-subtext-color">{seller.email}</p>
                              <div className="flex items-center gap-4 mt-1">
                                <span className="text-xs text-subtext-color">Ventas: 45</span>
                                <span className="text-xs text-subtext-color">Último acceso: Hace 1 día</span>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-subtext-color hover:text-error-500">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 bg-neutral-200 rounded-full flex items-center justify-center">
                            <Users className="h-6 w-6 text-subtext-color" />
                          </div>
                          <div>
                            <p className="text-default-font font-medium">No hay vendedores registrados</p>
                            <p className="text-sm text-subtext-color">Invita vendedores para que puedan vender tickets</p>
                          </div>
                          <Button variant="outline" size="sm" className="mt-2">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Invitar primer vendedor
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6 px-6">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* NIT Card */}
              <Card className="bg-default-background shadow-sm border border-neutral-border rounded-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-subtext-color" />
                      <CardTitle className="text-default-font text-base">NIT</CardTitle>
                    </div>
                    {documents.rut_url && (
                      <Button variant="ghost" size="sm" className="text-subtext-color hover:text-error-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {documents.rut_url ? (
                    <div className="relative aspect-[3/4] bg-neutral-100 rounded-lg overflow-hidden">
                      <iframe
                        src={`https://docs.google.com/gview?url=${encodeURIComponent(documents.rut_url!)}&embedded=true`}
                        className="w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-subtext-color" />
                      <p className="text-subtext-color mb-4">
                        {loadingDocuments ? 'Verificando...' : 'No subido'}
                      </p>
                      <Button variant="outline" size="sm" disabled={loadingDocuments}>
                        <Upload className="h-4 w-4 mr-2" />
                        Subir NIT
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* CERL Card */}
              <Card className="bg-default-background shadow-sm border border-neutral-border rounded-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-subtext-color" />
                      <CardTitle className="text-default-font text-base">CERL</CardTitle>
                    </div>
                    {documents.cerl_url && (
                      <Button variant="ghost" size="sm" className="text-subtext-color hover:text-error-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {documents.cerl_url ? (
                    <div className="relative aspect-[3/4] bg-neutral-100 rounded-lg overflow-hidden">
                      <iframe
                        src={`https://docs.google.com/gview?url=${encodeURIComponent(documents.cerl_url!)}&embedded=true`}
                        className="w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-subtext-color" />
                      <p className="text-subtext-color mb-4">
                        {loadingDocuments ? 'Verificando...' : 'No subido'}
                      </p>
                      <Button variant="outline" size="sm" disabled={loadingDocuments}>
                        <Upload className="h-4 w-4 mr-2" />
                        Subir CERL
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Certificación Bancaria Card */}
              <Card className="bg-default-background shadow-sm border border-neutral-border rounded-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-subtext-color" />
                      <CardTitle className="text-default-font text-base">Certificación Bancaria</CardTitle>
                    </div>
                    {documents.cb_url && (
                      <Button variant="ghost" size="sm" className="text-subtext-color hover:text-error-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {documents.cb_url ? (
                    <div className="relative aspect-[3/4] bg-neutral-100 rounded-lg overflow-hidden">
                      <iframe
                        src={`https://docs.google.com/gview?url=${encodeURIComponent(documents.cb_url!)}&embedded=true`}
                        className="w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-subtext-color" />
                      <p className="text-subtext-color mb-4">
                        {loadingDocuments ? 'Verificando...' : 'No subido'}
                      </p>
                      <Button variant="outline" size="sm" disabled={loadingDocuments}>
                        <Upload className="h-4 w-4 mr-2" />
                        Subir Certificación
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6 px-6">
            <h2 className="text-2xl font-bold text-default-font">Métricas Detalladas</h2>
            
            <Card className="bg-brand-100 shadow-sm border border-neutral-border">
              <CardHeader>
                <CardTitle className="text-default-font">Próximamente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-subtext-color text-center py-12">
                  Las métricas detalladas estarán disponibles próximamente.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProducerPage;