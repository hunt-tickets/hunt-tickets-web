"use client";

import { useUser } from "@/lib/UserContext";
import { getProfiles, updateProfile } from "@/supabase/profilesService";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseBrowser";
import { useRouter } from "next/navigation";
import { Calendar, Users, BarChart3, Star } from "lucide-react";
import CombinedStatistics from "@/components/ui/combined-statistics";

export default function Dashboard() {
  const { user, loading: userLoading } = useUser();
  const [profile, setProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const router = useRouter();

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

  if (userLoading || loadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="text-white text-lg">Cargando...</div>
      </div>
    );
  }

  return <DashboardContent />;
}

// Dashboard content component
const DashboardContent = () => {
  return (
    <div className="p-4 md:p-8 bg-gray-950 flex flex-col gap-4 w-full h-full overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-white/60">Bienvenido al panel de administración de Hunt</p>
        </div>

        {/* Stats Cards */}
        <CombinedStatistics />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
          {/* Recent Events */}
          <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Eventos Recientes</h3>
            <div className="space-y-4">
              {[
                { name: "Concierto de Rock", date: "15 Dic 2024", status: "Activo" },
                { name: "Festival de Jazz", date: "20 Dic 2024", status: "Próximo" },
                { name: "Fiesta de Año Nuevo", date: "31 Dic 2024", status: "Agotado" },
              ].map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{event.name}</p>
                    <p className="text-white/60 text-sm">{event.date}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    event.status === 'Activo' ? 'bg-green-500/20 text-green-400' :
                    event.status === 'Próximo' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {event.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Analytics Overview */}
          <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Resumen de Actividad</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/60">Ventas hoy</span>
                <span className="text-white font-medium">$2,450</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Nuevos usuarios</span>
                <span className="text-white font-medium">+24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Reviews promedio</span>
                <span className="text-white font-medium">4.8 ⭐</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Eventos publicados</span>
                <span className="text-white font-medium">8</span>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};
