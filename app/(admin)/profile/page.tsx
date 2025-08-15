"use client";

import { useUser } from "@/lib/UserContext";
import { useEffect, useState } from "react";
import { ArrowLeft, Edit3, Settings, Calendar, MapPin, Mail, Phone, Globe, Camera, Save, User, Music, Search, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProducers } from "@/hook/useProducers";
import { getLatestProducers } from "@/supabase/producersService";
import { getProfiles } from "@/supabase/profilesService";
import { Producer } from "@/types/site";
import ProducersListNew from "@/components/site/ProducersListNew";
import FilteredProducersList from "@/components/site/FilteredProducersList";

export default function ProfilePage() {
  const { user, loading: userLoading } = useUser();
  const [profile, setProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [latestProducers, setLatestProducers] = useState<Producer[]>([]);
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
  const router = useRouter();

  const { producers, loading: producersLoading, setSearchTerm, setSortOrder, searchTerm } = useProducers();

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Mock profile data - replace with actual data fetching
  const [profileData, setProfileData] = useState({
    name: "Usuario Demo",
    email: user?.email || "usuario@hunt.com",
    phone: "+57 300 123 4567",
    location: "Medellín, Colombia",
    bio: "Amante de la música electrónica y los eventos exclusivos. Siempre en busca de nuevas experiencias.",
    website: "https://hunt.com",
    joinDate: "Febrero 2024",
    avatar: "",
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      eventReminders: true,
      promotionalEmails: true,
    },
    stats: {
      eventsAttended: 24,
      ticketsPurchased: 38,
      favoriteVenues: 12,
      reviews: 8,
    }
  });

  const tabs = [
    { id: "profile", name: "Perfil", icon: User },
    { id: "events", name: "Mis Eventos", icon: Calendar },
    { id: "producers", name: "Productores", icon: Music },
    { id: "transactions", name: "Transacciones", icon: CreditCard },
    { id: "settings", name: "Configuración", icon: Settings },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      setLoadingProfile(true);
      const profiles = await getProfiles();
      const userProfile = profiles.find((p: any) => p.id === user.id);
      setProfile(userProfile || {});
      setLoadingProfile(false);
    };
    fetchProfile();
  }, [user]);

  useEffect(() => {
    const fetchLatestProducers = async () => {
      const { data, error } = await getLatestProducers();
      if (error) {
        console.log("Error fetching latest producers:", error);
        setLatestProducers([]);
      } else {
        setLatestProducers(data || []);
      }
    };

    fetchLatestProducers();
  }, []);

  const handleSave = () => {
    // Save profile data
    setIsEditing(false);
    // Here you would typically call an API to save the data
  };

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

  if (userLoading || loadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <div className="text-white text-lg">Cargando perfil...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-lg transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 text-white" />
              </button>
              <h1 className="text-2xl font-semibold text-white">Mi Perfil</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 border border-white/[0.08] sticky top-8">
              <div className="text-center">
                {/* Avatar */}
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold mx-auto">
                    {profileData.avatar ? (
                      <img src={profileData.avatar} alt="Avatar" className="w-full h-full rounded-2xl object-cover" />
                    ) : (
                      profileData.name.charAt(0)
                    )}
                  </div>
                  {isEditing && (
                    <button className="absolute -bottom-1 -right-1 p-2 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors">
                      <Camera className="w-3 h-3 text-white" />
                    </button>
                  )}
                </div>

                <h2 className="text-xl font-semibold text-white mb-2">{profileData.name}</h2>
                <p className="text-white/60 text-sm mb-4">{profileData.email}</p>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/[0.02] rounded-xl p-3 text-center">
                    <div className="text-lg font-bold text-blue-400">{profileData.stats.eventsAttended}</div>
                    <div className="text-xs text-white/60">Eventos</div>
                  </div>
                  <div className="bg-white/[0.02] rounded-xl p-3 text-center">
                    <div className="text-lg font-bold text-green-400">{profileData.stats.ticketsPurchased}</div>
                    <div className="text-xs text-white/60">Tickets</div>
                  </div>
                  <div className="bg-white/[0.02] rounded-xl p-3 text-center">
                    <div className="text-lg font-bold text-purple-400">{profileData.stats.favoriteVenues}</div>
                    <div className="text-xs text-white/60">Lugares</div>
                  </div>
                  <div className="bg-white/[0.02] rounded-xl p-3 text-center">
                    <div className="text-lg font-bold text-yellow-400">{profileData.stats.reviews}</div>
                    <div className="text-xs text-white/60">Reseñas</div>
                  </div>
                </div>

                <div className="text-white/60 text-xs flex items-center justify-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Miembro desde {profileData.joinDate}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="flex space-x-1 mb-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-white/10 text-white border border-white/20'
                        : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.name}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                {/* Profile Info */}
                <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 border border-white/[0.08]">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">Información Personal</h3>
                    <button
                      onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#d9d9d9] hover:bg-white hover:scale-[1.02] rounded-xl transition-all duration-300 text-black font-medium"
                    >
                      {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                      {isEditing ? 'Guardar' : 'Editar'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Nombre completo</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-white/40 focus:outline-none"
                        />
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-lg border border-white/10">
                          <User className="w-4 h-4 text-white/60" />
                          <span className="text-white">{profileData.name}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
                      <div className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-lg border border-white/10">
                        <Mail className="w-4 h-4 text-white/60" />
                        <span className="text-white">{profileData.email}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Teléfono</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-white/40 focus:outline-none"
                        />
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-lg border border-white/10">
                          <Phone className="w-4 h-4 text-white/60" />
                          <span className="text-white">{profileData.phone}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Ubicación</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.location}
                          onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-white/40 focus:outline-none"
                        />
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-lg border border-white/10">
                          <MapPin className="w-4 h-4 text-white/60" />
                          <span className="text-white">{profileData.location}</span>
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-white/80 mb-2">Biografía</label>
                      {isEditing ? (
                        <textarea
                          value={profileData.bio}
                          onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                          rows={4}
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-white/40 focus:outline-none resize-none"
                          placeholder="Cuéntanos sobre ti..."
                        />
                      ) : (
                        <div className="p-3 bg-white/[0.02] rounded-lg border border-white/10">
                          <span className="text-white">{profileData.bio}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Sitio web</label>
                      {isEditing ? (
                        <input
                          type="url"
                          value={profileData.website}
                          onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-white/40 focus:outline-none"
                        />
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-lg border border-white/10">
                          <Globe className="w-4 h-4 text-white/60" />
                          <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                            {profileData.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "events" && (
              <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 border border-white/[0.08]">
                <h3 className="text-xl font-semibold text-white mb-6">Mis Eventos</h3>
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-white mb-2">No tienes eventos próximos</h4>
                  <p className="text-white/60 mb-6">Explora nuestros eventos disponibles y reserva tu lugar.</p>
                  <button
                    onClick={() => router.push('/home')}
                    className="px-6 py-3 bg-[#d9d9d9] hover:bg-white hover:scale-[1.02] rounded-xl transition-all duration-300 text-black font-medium"
                  >
                    Explorar Eventos
                  </button>
                </div>
              </div>
            )}

            {activeTab === "producers" && (
              <div className="space-y-6">
                <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 border border-white/[0.08]">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">Productores</h3>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Buscar productores..."
                          value={searchTerm}
                          onChange={(e) => handleSearch(e.target.value)}
                          className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-white/40 focus:outline-none w-64"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {searchTerm === "" ? (
                      <ProducersListNew producers={latestProducers} loading={producersLoading} />
                    ) : (
                      <FilteredProducersList
                        producers={producers}
                        searchTerm={searchTerm}
                        sortOrder={undefined}
                        loading={producersLoading}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "transactions" && (
              <div className="space-y-6">
                <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 border border-white/[0.08]">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">Transacciones</h3>
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
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 border border-white/[0.08]">
                  <h3 className="text-xl font-semibold text-white mb-6">Notificaciones</h3>
                  <div className="space-y-4">
                    {Object.entries(profileData.preferences).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                        <div>
                          <h4 className="font-medium text-white">
                            {key === 'emailNotifications' && 'Notificaciones por email'}
                            {key === 'smsNotifications' && 'Notificaciones SMS'}
                            {key === 'eventReminders' && 'Recordatorios de eventos'}
                            {key === 'promotionalEmails' && 'Emails promocionales'}
                          </h4>
                          <p className="text-sm text-white/60">
                            {key === 'emailNotifications' && 'Recibe actualizaciones importantes por email'}
                            {key === 'smsNotifications' && 'Recibe notificaciones por mensaje de texto'}
                            {key === 'eventReminders' && 'Te recordaremos sobre tus eventos próximos'}
                            {key === 'promotionalEmails' && 'Recibe ofertas especiales y descuentos'}
                          </p>
                        </div>
                        <button
                          onClick={() => setProfileData({
                            ...profileData,
                            preferences: {
                              ...profileData.preferences,
                              [key]: !value
                            }
                          })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            value ? 'bg-blue-500' : 'bg-white/20'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              value ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 border border-white/[0.08]">
                  <h3 className="text-xl font-semibold text-white mb-6">Zona de Peligro</h3>
                  <div className="space-y-4">
                    <button className="w-full px-4 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 rounded-xl transition-all duration-300 text-red-400 font-medium">
                      Desactivar Cuenta
                    </button>
                    <button className="w-full px-4 py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-600/30 hover:border-red-600/50 rounded-xl transition-all duration-300 text-red-400 font-medium">
                      Eliminar Cuenta Permanentemente
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
