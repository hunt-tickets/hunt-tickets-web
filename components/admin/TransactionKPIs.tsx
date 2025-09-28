"use client";

import { useMemo } from "react";
import type { Transaction } from "@/lib/api/transactions";

interface TransactionKPIsProps {
  allTransactions: Transaction[];
  isTransactionExpired: (createdAt: string, status: string) => boolean;
}

export default function TransactionKPIs({ allTransactions, isTransactionExpired }: TransactionKPIsProps) {
  
  // Calculate KPIs only when allTransactions changes
  const kpis = useMemo(() => {
    if (!allTransactions?.length) {
      return {
        totalRevenue: 0,
        conversionRate: 0,
        averageDailyRevenue: 0,
        totalTransactions: 0,
        successfulTransactions: 0,
        daysWithSales: 0
      };
    }

    // Calculate successful transactions and revenue
    let totalRevenue = 0;
    let successfulCount = 0;
    const dailyRevenue: Record<string, number> = {};

    allTransactions.forEach(transaction => {
      const displayStatus = isTransactionExpired(transaction.created_at, transaction.status) 
        ? "EXPIRADO" 
        : transaction.status;
      
      const isSuccessful = displayStatus === "PAID WITH QR" || displayStatus === "PAID";
      
      if (isSuccessful) {
        successfulCount++;
        totalRevenue += transaction.total;
        
        // Group by date for daily average
        const [datePart] = transaction.created_at.split(' ');
        if (!dailyRevenue[datePart]) {
          dailyRevenue[datePart] = 0;
        }
        dailyRevenue[datePart] += transaction.total;
      }
    });

    const totalTransactions = allTransactions.length;
    const conversionRate = totalTransactions > 0 ? Math.round((successfulCount / totalTransactions) * 100) : 0;
    const daysWithSales = Object.keys(dailyRevenue).length;
    const averageDailyRevenue = daysWithSales > 0 ? Math.round(totalRevenue / daysWithSales) : 0;

    return {
      totalRevenue,
      conversionRate,
      averageDailyRevenue,
      totalTransactions,
      successfulTransactions: successfulCount,
      daysWithSales
    };
  }, [allTransactions, isTransactionExpired]);

  return (
    <div className="flex items-center gap-3">
      {/* Total Revenue KPI */}
      <div className="group relative inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/5 to-violet-500/5 backdrop-blur-xl rounded-xl border border-purple-500/15 hover:scale-105 hover:border-purple-400/40 transition-all duration-200 cursor-pointer">
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          <div className="font-medium mb-1">Cálculo: Suma de ingresos exitosos</div>
          <div className="text-gray-300">Σ(transacciones PAID + PAID WITH QR)</div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>

        {/* Icon */}
        <div className="relative flex items-center justify-center w-5 h-5 bg-purple-500/20 rounded-md group-hover:bg-purple-500/30 transition-colors duration-200">
          <svg className="w-3 h-3 text-purple-400 group-hover:text-purple-300 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        </div>
        
        {/* Content */}
        <div className="relative flex items-center gap-2">
          <span className="text-white/70 text-xs font-medium group-hover:text-white/90 transition-colors duration-200">Total recaudado</span>
          <div className="w-1 h-1 bg-white/30 rounded-full group-hover:bg-white/50 transition-colors duration-200"></div>
          <span className="text-purple-300 font-semibold text-sm tracking-wide group-hover:text-purple-200 transition-colors duration-200">
            ${kpis.totalRevenue.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Conversion Rate KPI */}
      <div className="group relative inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 backdrop-blur-xl rounded-xl border border-blue-500/15 hover:scale-105 hover:border-blue-400/40 transition-all duration-200 cursor-pointer">
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          <div className="font-medium mb-1">Cálculo: Éxito vs Total</div>
          <div className="text-gray-300">({kpis.successfulTransactions} ÷ {kpis.totalTransactions}) × 100</div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>

        {/* Icon */}
        <div className="relative flex items-center justify-center w-5 h-5 bg-blue-500/20 rounded-md group-hover:bg-blue-500/30 transition-colors duration-200">
          <svg className="w-3 h-3 text-blue-400 group-hover:text-blue-300 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        
        {/* Content */}
        <div className="relative flex items-center gap-2">
          <span className="text-white/70 text-xs font-medium group-hover:text-white/90 transition-colors duration-200">Tasa conversión</span>
          <div className="w-1 h-1 bg-white/30 rounded-full group-hover:bg-white/50 transition-colors duration-200"></div>
          <span className="text-blue-300 font-semibold text-sm tracking-wide group-hover:text-blue-200 transition-colors duration-200">
            {kpis.conversionRate}%
          </span>
        </div>
      </div>

      {/* Average Daily Revenue KPI */}
      <div className="group relative inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/5 to-emerald-500/5 backdrop-blur-xl rounded-xl border border-green-500/15 hover:scale-105 hover:border-green-400/40 transition-all duration-200 cursor-pointer">
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          <div className="font-medium mb-1">Cálculo: Ingresos por día activo</div>
          <div className="text-gray-300">${kpis.totalRevenue.toLocaleString()} ÷ {kpis.daysWithSales} días</div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>

        {/* Icon */}
        <div className="relative flex items-center justify-center w-5 h-5 bg-green-500/20 rounded-md group-hover:bg-green-500/30 transition-colors duration-200">
          <svg className="w-3 h-3 text-green-400 group-hover:text-green-300 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        
        {/* Content */}
        <div className="relative flex items-center gap-2">
          <span className="text-white/70 text-xs font-medium group-hover:text-white/90 transition-colors duration-200">Promedio diario</span>
          <div className="w-1 h-1 bg-white/30 rounded-full group-hover:bg-white/50 transition-colors duration-200"></div>
          <span className="text-green-300 font-semibold text-sm tracking-wide group-hover:text-green-200 transition-colors duration-200">
            ${kpis.averageDailyRevenue.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}