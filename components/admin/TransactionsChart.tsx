"use client";

import { useMemo } from "react";
import { Bar, BarChart, XAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/bar-chart";
import type { Transaction } from "@/lib/api/transactions";

interface TransactionsChartProps {
  allTransactions: Transaction[];
  statusFilter: string[];
  isTransactionExpired: (createdAt: string, status: string) => boolean;
  shouldHideExpiredTransaction: (createdAt: string, status: string) => boolean;
  onToggleStatusFilter: (status: string) => void;
}

export default function TransactionsChart({ 
  allTransactions, 
  statusFilter, 
  isTransactionExpired, 
  shouldHideExpiredTransaction,
  onToggleStatusFilter
}: TransactionsChartProps) {
  
  // Static chart configuration
  const chartConfig: ChartConfig = {
    paidWithQR: { label: "Pagado QR", color: "#10b981" },
    paid: { label: "Pagado", color: "#059669" },
    processing: { label: "Procesando", color: "#3b82f6" },
    pending: { label: "Pendiente", color: "#f59e0b" },
    expired: { label: "Expirado", color: "#f97316" },
    archived: { label: "Archivado", color: "#6b7280" },
    rejected: { label: "Rechazado", color: "#dc2626" },
    failed: { label: "Fallido", color: "#991b1b" },
  };

  // Create base date structure only once when allTransactions loads
  const baseDateStructure = useMemo(() => {
    if (!allTransactions?.length) return [];

    // Create last 30 days
    const today = new Date();
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() - i);
      return date;
    }).reverse();

    // Group transactions by date
    const dateGroups: Record<string, Transaction[]> = {};
    
    allTransactions.forEach(transaction => {
      const [datePart] = transaction.created_at.split(' ');
      const [day, month, year] = datePart.split('/');
      const transactionDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const dateKey = transactionDate.toDateString();
      
      if (!dateGroups[dateKey]) {
        dateGroups[dateKey] = [];
      }
      dateGroups[dateKey].push(transaction);
    });

    const monthNames = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 
                       'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

    return last30Days.map(date => {
      const dateKey = date.toDateString();
      const dayTransactions = dateGroups[dateKey] || [];
      const day = date.getDate();
      const month = monthNames[date.getMonth()];
      const displayDate = `${day} ${month}`;

      return {
        displayDate,
        transactions: dayTransactions,
      };
    });
  }, [allTransactions]);

  // Apply filtering only when statusFilter changes
  const chartData = useMemo(() => {
    return baseDateStructure.map(day => {
      // Count transactions by status
      const counts = {
        paidWithQR: 0,
        paid: 0,
        processing: 0,
        pending: 0,
        expired: 0,
        archived: 0,
        rejected: 0,
        failed: 0,
      };

      day.transactions.forEach(transaction => {
        // Hide archived transactions if ARCHIVADO filter is not selected
        if (shouldHideExpiredTransaction(transaction.created_at, transaction.status) && !statusFilter.includes("ARCHIVADO")) {
          return;
        }

        let displayStatus = transaction.status;
        
        // Handle expired/archived logic
        if (isTransactionExpired(transaction.created_at, transaction.status)) {
          // Check if it's archived (expired for more than 24h) AND archived filter is selected
          if (shouldHideExpiredTransaction(transaction.created_at, transaction.status) && statusFilter.includes("ARCHIVADO")) {
            displayStatus = "ARCHIVADO";
          } else {
            displayStatus = "EXPIRADO";
          }
        }

        // Apply status filter
        const matchesFilter = statusFilter.some(filter => {
          if (filter === "EXPIRADO") return displayStatus === "EXPIRADO";
          if (filter === "ARCHIVADO") return displayStatus === "ARCHIVADO";
          return transaction.status === filter;
        });

        if (!matchesFilter) return;

        // Count by display status
        switch (displayStatus) {
          case "PAID WITH QR":
            counts.paidWithQR++;
            break;
          case "PAID":
            counts.paid++;
            break;
          case "PROCESSING":
            counts.processing++;
            break;
          case "PENDING":
            counts.pending++;
            break;
          case "EXPIRADO":
            counts.expired++;
            break;
          case "ARCHIVADO":
            counts.archived++;
            break;
          case "REJECTED_BY_PAYMENT_GATEWAY":
            counts.rejected++;
            break;
          case "FAILED":
            counts.failed++;
            break;
        }
      });

      const total = Object.values(counts).reduce((sum, count) => sum + count, 0);

      return {
        displayDate: day.displayDate,
        ...counts,
        total,
      };
    });
  }, [baseDateStructure, statusFilter, isTransactionExpired, shouldHideExpiredTransaction]);

  if (!chartData.length) {
    return (
      <div className="h-64 flex items-center justify-center text-white/60">
        No hay datos para mostrar
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="h-64">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart data={chartData}>
            {/* Define gradients for badge-style bars */}
            <defs>
              <linearGradient id="gradient-paidWithQR" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.4} />
              </linearGradient>
              <linearGradient id="gradient-paid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#059669" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#059669" stopOpacity={0.4} />
              </linearGradient>
              <linearGradient id="gradient-processing" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.4} />
              </linearGradient>
              <linearGradient id="gradient-pending" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.4} />
              </linearGradient>
              <linearGradient id="gradient-expired" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#f97316" stopOpacity={0.4} />
              </linearGradient>
              <linearGradient id="gradient-archived" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6b7280" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#6b7280" stopOpacity={0.4} />
              </linearGradient>
              <linearGradient id="gradient-rejected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#dc2626" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#dc2626" stopOpacity={0.4} />
              </linearGradient>
              <linearGradient id="gradient-failed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#991b1b" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#991b1b" stopOpacity={0.4} />
              </linearGradient>
            </defs>
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
                  <div className="bg-black/90 border border-white/20 rounded-lg px-3 py-2 text-xs text-white shadow-xl">
                    <div className="font-medium mb-2 capitalize text-center">{data?.displayDate}</div>
                    <div className="space-y-1">
                      {data?.paidWithQR > 0 && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                            <span>Pagado QR</span>
                          </div>
                          <span className="text-white/80">{data.paidWithQR}</span>
                        </div>
                      )}
                      {data?.paid > 0 && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                            <span>Pagado</span>
                          </div>
                          <span className="text-white/80">{data.paid}</span>
                        </div>
                      )}
                      {data?.processing > 0 && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                            <span>Procesando</span>
                          </div>
                          <span className="text-white/80">{data.processing}</span>
                        </div>
                      )}
                      {data?.pending > 0 && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                            <span>Pendiente</span>
                          </div>
                          <span className="text-white/80">{data.pending}</span>
                        </div>
                      )}
                      {data?.expired > 0 && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                            <span>Expirado</span>
                          </div>
                          <span className="text-white/80">{data.expired}</span>
                        </div>
                      )}
                      {data?.archived > 0 && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>
                            <span>Archivado</span>
                          </div>
                          <span className="text-white/80">{data.archived}</span>
                        </div>
                      )}
                      {data?.rejected > 0 && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
                            <span>Rechazado</span>
                          </div>
                          <span className="text-white/80">{data.rejected}</span>
                        </div>
                      )}
                      {data?.failed > 0 && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-800"></div>
                            <span>Fallido</span>
                          </div>
                          <span className="text-white/80">{data.failed}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }}
            />
            {/* Render bars with badge-style appearance */}
            {Object.keys(chartConfig).map((status) => {
              const strokeColors = {
                paidWithQR: "#10b981",
                paid: "#059669", 
                processing: "#3b82f6",
                pending: "#f59e0b",
                expired: "#f97316",
                archived: "#6b7280",
                rejected: "#dc2626",
                failed: "#991b1b",
              };
              
              return (
                <Bar
                  key={status}
                  dataKey={status}
                  stackId="transactions"
                  fill={`url(#gradient-${status})`}
                  stroke={strokeColors[status as keyof typeof strokeColors]}
                  strokeWidth={1}
                  strokeOpacity={0.6}
                  radius={[2, 2, 0, 0]}
                />
              );
            })}
          </BarChart>
        </ChartContainer>
      </div>
      
      {/* Legend with clickeable badge-style labels */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
        {Object.entries(chartConfig).map(([key, config]) => {
          const statusFilterMap = {
            paidWithQR: "PAID WITH QR",
            paid: "PAID", 
            processing: "PROCESSING",
            pending: "PENDING",
            expired: "EXPIRADO",
            archived: "ARCHIVADO",
            rejected: "REJECTED_BY_PAYMENT_GATEWAY",
            failed: "FAILED",
          };
          
          const filterStatus = statusFilterMap[key as keyof typeof statusFilterMap];
          const isActive = statusFilter.includes(filterStatus);
          
          const badgeStyles = {
            paidWithQR: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
            paid: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
            processing: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
            pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20' },
            expired: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
            archived: { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/20' },
            rejected: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
            failed: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
          };
          
          const style = badgeStyles[key as keyof typeof badgeStyles] || badgeStyles.pending;
          
          return (
            <button
              key={key}
              onClick={() => onToggleStatusFilter(filterStatus)}
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all duration-200 hover:scale-105 cursor-pointer ${
                isActive 
                  ? `${style.bg} ${style.text} ${style.border}` 
                  : 'bg-white/5 text-white/30 border-white/10 opacity-40'
              }`}
            >
              {config.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}