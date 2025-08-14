import { Badge } from '@/components/ui/badge-2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/advanced-card';
import { ArrowDown, ArrowUp } from 'lucide-react';

const stats = [
  {
    title: 'Eventos Activos',
    value: 24,
    delta: 15.2,
    lastMonth: 21,
    positive: true,
    prefix: '',
    suffix: '',
  },
  {
    title: 'Usuarios Registrados',
    value: 1247,
    delta: 8.1,
    lastMonth: 1154,
    positive: true,
    prefix: '',
    suffix: '',
  },
  {
    title: 'Reviews Totales',
    value: 3891,
    delta: 12.3,
    lastMonth: 3465,
    positive: true,
    prefix: '',
    suffix: '',
  },
];

function formatNumber(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return n.toLocaleString();
  return n.toString();
}

export default function StatisticsCard2() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className="relative overflow-hidden bg-black/20 backdrop-blur-xl border border-white/10 text-white h-full flex flex-col"
          style={{
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <CardHeader className="border-0 pb-2">
            <CardTitle className="text-white/70 text-sm font-medium tracking-wide uppercase">
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-6">
            <div className="space-y-4">
              {/* Main Value */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-white leading-none">
                  {stat.format ? stat.format(stat.value) : stat.prefix + formatNumber(stat.value) + stat.suffix}
                </span>
                <Badge className="bg-white/15 hover:bg-white/25 font-medium text-xs text-white border-0 px-2 py-1">
                  {stat.delta > 0 ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                  {stat.delta}%
                </Badge>
              </div>
              
              {/* Comparison */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <span className="text-xs text-white/60 font-medium">Mes anterior</span>
                <span className="text-sm text-white/90 font-semibold">
                  {stat.lastFormat
                    ? stat.lastFormat(stat.lastMonth)
                    : stat.prefix + formatNumber(stat.lastMonth) + stat.suffix}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}