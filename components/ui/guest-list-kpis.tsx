import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/advanced-card';
import { Mail, CheckCircle, DollarSign } from 'lucide-react';

interface GuestListKPIsProps {
  guestListData?: {
    invitations: number;
    redeemed: number;
    revenue: number;
  };
}

function formatNumber(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return n.toLocaleString();
  return n.toString();
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function GuestListKPIs({ guestListData }: GuestListKPIsProps) {
  // Use real data with fallback to 0
  const stats = [
    {
      title: 'Invitaciones Enviadas',
      value: guestListData?.invitations || 0,
      prefix: '',
      suffix: '',
      icon: Mail,
    },
    {
      title: 'Redimidas',
      value: guestListData?.redeemed || 0,
      prefix: '',
      suffix: '',
      icon: CheckCircle,
    },
    {
      title: 'Ingresos Generados',
      value: guestListData?.revenue || 0,
      prefix: '$',
      suffix: '',
      format: (n: number) => formatCurrency(n),
      icon: DollarSign,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full mb-8">
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
            <div>
              {/* Main Value with Icon */}
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-white leading-none">
                  {stat.format ? stat.format(stat.value) : stat.prefix + formatNumber(stat.value) + stat.suffix}
                </span>
                <stat.icon className="w-6 h-6 text-white/60" strokeWidth={1.5} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}