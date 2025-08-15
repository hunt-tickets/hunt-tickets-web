import { Card, CardContent, CardHeader, CardTitle, CardToolbar } from '@/components/ui/advanced-card';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface SalesData {
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
}

interface StatisticsCard5Props {
  salesData?: SalesData | null;
}

const defaultBalanceData = {
  balance: 10976.95,
  delta: 5.7,
  currencies: [
    { code: 'USD', percent: 30, color: 'bg-white' },
    { code: 'GBP', percent: 20, color: 'bg-blue-400' },
    { code: 'EUR', percent: 15, color: 'bg-purple-500' },
    { code: 'JPY', percent: 20, color: 'bg-green-500' },
    { code: 'CNY', percent: 15, color: 'bg-orange-500' },
  ],
};

export default function StatisticsCard5({ salesData }: StatisticsCard5Props) {
  const [activeTab, setActiveTab] = useState('7d');
  
  const tabs = [
    { id: '24h', label: '24h' },
    { id: '7d', label: '7d' },
    { id: '30d', label: '30d' },
    { id: '90d', label: '90d' },
  ];

  // Calculate balance data from sales data if available
  const balanceData = salesData ? {
    balance: salesData.ventas_totales,
    delta: 12.5, // This could be calculated based on historical data
    currencies: [
      { 
        code: 'APP', 
        percent: Math.round((salesData.ventas_en_app.total / salesData.ventas_totales) * 100), 
        color: 'bg-blue-400' 
      },
      { 
        code: 'WEB', 
        percent: Math.round((salesData.ventas_en_web.total / salesData.ventas_totales) * 100), 
        color: 'bg-green-500' 
      },
      { 
        code: 'CASH', 
        percent: Math.round((salesData.ventas_en_efectivo.total / salesData.ventas_totales) * 100), 
        color: 'bg-orange-500' 
      },
      { 
        code: 'NET', 
        percent: Math.round((salesData.ingreso_neto_productor_ajustado / salesData.ventas_totales) * 100), 
        color: 'bg-white' 
      },
      { 
        code: 'COMM', 
        percent: Math.round(((salesData.ventas_en_app.servicio + salesData.ventas_en_web.servicio + salesData.ventas_en_efectivo.servicio) / salesData.ventas_totales) * 100), 
        color: 'bg-purple-500' 
      },
    ].filter(curr => curr.percent > 0) // Only show channels with sales
  } : defaultBalanceData;

  return (
    <Card 
      className="w-full h-full rounded-xl border border-white/10 text-white bg-black/20 backdrop-blur-xl flex flex-col"
      style={{
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <CardHeader className="border-0 pb-2">
        <CardTitle className="text-white/70 text-sm font-medium tracking-wide uppercase">
          {salesData ? 'Ventas Totales' : 'Balance Total'}
        </CardTitle>
        <CardToolbar>
          <div className="flex bg-white/5 backdrop-blur-xl rounded-lg p-1 border border-white/10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-md transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-white/20 text-white"
                    : "text-white/60 hover:text-white/80 hover:bg-white/10"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </CardToolbar>
      </CardHeader>
      <CardContent className="pt-0 pb-6">
        <div className="space-y-6">
          {/* Main Balance */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-white leading-none">
              ${balanceData.balance.toLocaleString()}
            </span>
            <span className="text-base font-semibold text-green-400">
              +{balanceData.delta}%
            </span>
          </div>

          {/* Divider */}
          <div className="border-b border-white/10" />

          {/* Currency Distribution */}
          <div className="space-y-3">
            {/* Progress Bar */}
            <div className="flex items-center gap-1 w-full">
              {balanceData.currencies.map((cur) => (
                <div
                  key={cur.code}
                  className={cn(cur.color, 'h-2 rounded-sm transition-all opacity-80')}
                  style={{
                    width: `${cur.percent}%`,
                  }}
                />
              ))}
            </div>
            
            {/* Currency Labels */}
            <div className="grid grid-cols-5 gap-2">
              {balanceData.currencies.map((cur) => (
                <div key={cur.code} className="text-center">
                  <div className="text-xs text-white/60 font-medium">{cur.code}</div>
                  <div className="text-sm font-semibold text-white">{cur.percent}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}