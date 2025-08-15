"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/lib/UserContext";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  MousePointer, 
  Globe, 
  Smartphone,
  Monitor,
  Clock,
  ArrowUp,
  ArrowDown,
  Calendar
} from "lucide-react";

// Mock data similar to Vercel Analytics
const mockData = {
  overview: {
    visitors: { current: 12847, previous: 10234, change: 25.5 },
    pageViews: { current: 34521, previous: 28765, change: 20.0 },
    bounceRate: { current: 32.4, previous: 38.2, change: -15.2 },
    avgSession: { current: 4.2, previous: 3.8, change: 10.5 }
  },
  devices: [
    { name: 'Desktop', value: 8456, percentage: 65.8, icon: Monitor },
    { name: 'Mobile', value: 3621, percentage: 28.2, icon: Smartphone },
    { name: 'Tablet', value: 770, percentage: 6.0, icon: Globe }
  ],
  topPages: [
    { path: '/', views: 8234, change: 12.3 },
    { path: '/events', views: 5467, change: 8.1 },
    { path: '/events/concert-rock', views: 3421, change: -2.4 },
    { path: '/login', views: 2876, change: 15.7 },
    { path: '/register', views: 2143, change: 5.2 }
  ],
  referrers: [
    { source: 'Direct', visits: 4521, percentage: 35.2 },
    { source: 'Google', visits: 3876, percentage: 30.2 },
    { source: 'Facebook', visits: 2134, percentage: 16.6 },
    { source: 'Instagram', visits: 1542, percentage: 12.0 },
    { source: 'Twitter', visits: 774, percentage: 6.0 }
  ],
  realTimeVisitors: 47,
  chartData: [
    { date: '2024-12-05', visitors: 456, pageViews: 1234 },
    { date: '2024-12-06', visitors: 523, pageViews: 1456 },
    { date: '2024-12-07', visitors: 612, pageViews: 1678 },
    { date: '2024-12-08', visitors: 489, pageViews: 1345 },
    { date: '2024-12-09', visitors: 678, pageViews: 1876 },
    { date: '2024-12-10', visitors: 734, pageViews: 2012 },
    { date: '2024-12-11', visitors: 645, pageViews: 1789 }
  ]
};

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ComponentType<any>;
  suffix?: string;
  isPercentage?: boolean;
}

function MetricCard({ title, value, change, icon: Icon, suffix = '', isPercentage = false }: MetricCardProps) {
  const isPositive = change > 0;
  const changeColor = isPositive ? 'text-green-400' : 'text-red-400';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/8 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-white/80" />
        </div>
        <div className={`flex items-center gap-1 text-sm ${changeColor}`}>
          <TrendIcon className="w-4 h-4" />
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <div>
        <p className="text-white/60 text-sm mb-1">{title}</p>
        <p className="text-2xl font-bold text-white">
          {typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </p>
      </div>
    </div>
  );
}

interface ChartBarProps {
  value: number;
  maxValue: number;
  label: string;
  subLabel: string;
}

function ChartBar({ value, maxValue, label, subLabel }: ChartBarProps) {
  const percentage = (value / maxValue) * 100;
  
  return (
    <div className="flex items-center gap-4 py-2">
      <div className="w-20 text-right">
        <p className="text-white text-sm font-medium">{label}</p>
        <p className="text-white/60 text-xs">{subLabel}</p>
      </div>
      <div className="flex-1">
        <div className="w-full bg-white/10 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <div className="w-16 text-right">
        <p className="text-white text-sm font-medium">{value.toLocaleString()}</p>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { user, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setLoading(false);
    };

    loadData();
  }, [timeRange]);

  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <div className="text-white text-lg">Cargando analytics...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto bg-[#0a0a0a]">
      <div className="w-full px-6 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-5xl md:text-6xl font-bold text-white" style={{ letterSpacing: '-5px', lineHeight: '130%' }}>
              Web <span style={{ fontFamily: "'Amarante', 'Cinzel Decorative', serif", fontWeight: '400' }} className="italic">Analytics</span>
            </h1>
            
            {/* Real-time indicator */}
            <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">{mockData.realTimeVisitors} visitantes en línea</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <p className="text-white/60 text-lg">Estadísticas del sitio web Hunt</p>
            
            {/* Time range selector */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:bg-white/10 focus:border-white/20 focus:outline-none"
            >
              <option value="1d" className="bg-gray-900">Últimas 24h</option>
              <option value="7d" className="bg-gray-900">Últimos 7 días</option>
              <option value="30d" className="bg-gray-900">Últimos 30 días</option>
              <option value="90d" className="bg-gray-900">Últimos 90 días</option>
            </select>
          </div>
        </div>

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Visitantes únicos"
            value={mockData.overview.visitors.current}
            change={mockData.overview.visitors.change}
            icon={Users}
          />
          <MetricCard
            title="Vistas de página"
            value={mockData.overview.pageViews.current}
            change={mockData.overview.pageViews.change}
            icon={Eye}
          />
          <MetricCard
            title="Tasa de rebote"
            value={mockData.overview.bounceRate.current}
            change={mockData.overview.bounceRate.change}
            icon={MousePointer}
            suffix="%"
            isPercentage={true}
          />
          <MetricCard
            title="Sesión promedio"
            value={mockData.overview.avgSession.current}
            change={mockData.overview.avgSession.change}
            icon={Clock}
            suffix="min"
          />
        </div>

        {/* Charts and detailed data */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Top Pages */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Páginas más visitadas
            </h3>
            <div className="space-y-4">
              {mockData.topPages.map((page, index) => {
                const isPositive = page.change > 0;
                const changeColor = isPositive ? 'text-green-400' : 'text-red-400';
                const ChangeIcon = isPositive ? ArrowUp : ArrowDown;
                
                return (
                  <div key={page.path} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/8 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs font-medium text-white">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-white font-medium">{page.path}</p>
                        <p className="text-white/60 text-sm">{page.views.toLocaleString()} vistas</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 ${changeColor}`}>
                      <ChangeIcon className="w-3 h-3" />
                      <span className="text-xs font-medium">{Math.abs(page.change)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Devices */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              Dispositivos
            </h3>
            <div className="space-y-4">
              {mockData.devices.map((device) => {
                const Icon = device.icon;
                return (
                  <div key={device.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-4 h-4 text-white/80" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{device.name}</p>
                        <p className="text-white/60 text-xs">{device.percentage}%</p>
                      </div>
                    </div>
                    <p className="text-white font-medium text-sm">{device.value.toLocaleString()}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Referrers and Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          
          {/* Traffic Sources */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Fuentes de tráfico
            </h3>
            <div className="space-y-3">
              {mockData.referrers.map((referrer, index) => (
                <ChartBar
                  key={referrer.source}
                  value={referrer.visits}
                  maxValue={Math.max(...mockData.referrers.map(r => r.visits))}
                  label={referrer.source}
                  subLabel={`${referrer.percentage}%`}
                />
              ))}
            </div>
          </div>

          {/* Mini Chart Placeholder */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Tendencia de visitantes
            </h3>
            <div className="h-40 flex items-end justify-between gap-2">
              {mockData.chartData.map((data, index) => {
                const maxVisitors = Math.max(...mockData.chartData.map(d => d.visitors));
                const height = (data.visitors / maxVisitors) * 100;
                
                return (
                  <div key={data.date} className="flex-1 flex flex-col items-center group">
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-sm transition-all duration-300 group-hover:from-blue-400 group-hover:to-purple-400"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-white/60 text-xs mt-2 rotate-45 origin-left">
                      {new Date(data.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
          <div className="text-white/60 text-sm">
            Última actualización: {new Date().toLocaleString('es-ES')}
          </div>
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Calendar className="w-4 h-4" />
            <span>Datos en tiempo real</span>
          </div>
        </div>

      </div>
    </div>
  );
}