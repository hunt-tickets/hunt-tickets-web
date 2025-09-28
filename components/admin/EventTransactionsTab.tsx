"use client";

import { useMemo } from "react";
import { useTransactions } from "@/lib/hooks/useTransactions";
import { useChartData } from "@/lib/hooks/useChartData";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { ChevronUp, ChevronDown } from "lucide-react";
import TransactionsChart from "./TransactionsChart";
import TransactionKPIs from "./TransactionKPIs";
import type { Transaction } from "@/lib/api/transactions";

interface EventTransactionsTabProps {
  eventId: string | string[];
  activeTab: string;
}

export default function EventTransactionsTab({ eventId, activeTab }: EventTransactionsTabProps) {
  // Table data hook
  const {
    transactionsData,
    loadingTransactions,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sourceFilter,
    setSourceFilter,
    showArchived,
    setShowArchived,
    currentPage,
    fetchTransactions,
    fetchAllTransactionsAndPaginate,
    getFilteredTransactions,
    isTransactionExpired,
    shouldHideExpiredTransaction,
    activeChartIndex,
    setActiveChartIndex,
    isChartVisible,
    setIsChartVisible,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    handleFilterChange,
    toggleStatusFilter,
    getChannelDisplayName,
  } = useTransactions(eventId, activeTab);

  // Chart data hook (completely independent)
  const {
    allTransactions: allTransactionsForChart,
    isLoaded: chartDataLoaded,
    isLoading: chartDataLoading
  } = useChartData(eventId, activeTab);


  const getStatusConfig = (status: string) => {
    const configs = {
      'PAID WITH QR': { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', label: 'Pagado con QR', color: '#10b981' },
      'PAID': { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', label: 'Pagado', color: '#059669' },
      'PROCESSING': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', label: 'Procesando', color: '#3b82f6' },
      'PENDING': { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20', label: 'Pendiente', color: '#f59e0b' },
      'EXPIRADO': { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', label: 'Expirado', color: '#f97316' },
      'ARCHIVADO': { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/20', label: 'Archivado', color: '#6b7280' },
      'REJECTED_BY_PAYMENT_GATEWAY': { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', label: 'Rechazado', color: '#dc2626' },
      'FAILED': { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', label: 'Fallido', color: '#991b1b' },
    };
    return configs[status as keyof typeof configs] || configs['PENDING'];
  };

  const renderTransactionStatus = (createdAt: string, status: string) => {
    let displayStatus = status;
    
    if (isTransactionExpired(createdAt, status)) {
      // Check if it's archived (expired for more than 24h) AND archived filter is selected
      if (shouldHideExpiredTransaction(createdAt, status) && statusFilter.includes("ARCHIVADO")) {
        displayStatus = "ARCHIVADO";
      } else {
        displayStatus = "EXPIRADO";
      }
    }
    
    const config = getStatusConfig(displayStatus);
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
        {config.label}
      </span>
    );
  };



  // Calculate state counts for current filtered transactions
  const stateCounts = useMemo(() => {
    if (!transactionsData?.data) return {};
    
    const counts = {
      "PAID WITH QR": 0,
      "PAID": 0,
      "PROCESSING": 0,
      "PENDING": 0,
      "EXPIRADO": 0,
      "REJECTED_BY_PAYMENT_GATEWAY": 0,
      "FAILED": 0,
    };

    transactionsData.data.forEach((transaction) => {
      const displayStatus = isTransactionExpired(transaction.created_at, transaction.status) ? "EXPIRADO" : transaction.status;
      
      // Solo contar transacciones que están en el filtro actual
      const shouldInclude = statusFilter.some(filter => {
        if (filter === "EXPIRADO") {
          return isTransactionExpired(transaction.created_at, transaction.status);
        }
        return transaction.status === filter;
      });
      
      if (counts.hasOwnProperty(displayStatus) && shouldInclude) {
        counts[displayStatus as keyof typeof counts]++;
      }
    });

    return counts;
  }, [transactionsData, statusFilter, isTransactionExpired]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  const filteredTransactions = getFilteredTransactions();


  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/[0.08]">
        <h2 className="text-2xl font-semibold text-white mb-6">Transacciones</h2>
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-64">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar transacciones..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleFilterChange();
                }}
                className="w-full h-9 pl-9 pr-4 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/50 focus:bg-white/10 focus:border-white/20 focus:outline-none transition-all duration-200"
              />
              <svg className="w-4 h-4 text-white/40 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Status Filter */}
          <DropdownMenu
            minWidth="min-w-48"
            stayOpen={true}
            options={[
              {
                label: "Pagado con QR",
                onClick: () => toggleStatusFilter("PAID WITH QR"),
                Icon: <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusConfig("PAID WITH QR").color }}></div>,
                isSelected: statusFilter.includes("PAID WITH QR")
              },
              {
                label: "Pagado",
                onClick: () => toggleStatusFilter("PAID"),
                Icon: <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusConfig("PAID").color }}></div>,
                isSelected: statusFilter.includes("PAID")
              },
              {
                label: "Procesando",
                onClick: () => toggleStatusFilter("PROCESSING"),
                Icon: <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusConfig("PROCESSING").color }}></div>,
                isSelected: statusFilter.includes("PROCESSING")
              },
              {
                label: "Pendiente",
                onClick: () => toggleStatusFilter("PENDING"),
                Icon: <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusConfig("PENDING").color }}></div>,
                isSelected: statusFilter.includes("PENDING")
              },
              {
                label: "Expirado",
                onClick: () => toggleStatusFilter("EXPIRADO"),
                Icon: <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusConfig("EXPIRADO").color }}></div>,
                isSelected: statusFilter.includes("EXPIRADO")
              },
              {
                label: "Archivado",
                onClick: () => toggleStatusFilter("ARCHIVADO"),
                Icon: <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusConfig("ARCHIVADO").color }}></div>,
                isSelected: statusFilter.includes("ARCHIVADO")
              },
              {
                label: "Rechazado",
                onClick: () => toggleStatusFilter("REJECTED_BY_PAYMENT_GATEWAY"),
                Icon: <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusConfig("REJECTED_BY_PAYMENT_GATEWAY").color }}></div>,
                isSelected: statusFilter.includes("REJECTED_BY_PAYMENT_GATEWAY")
              },
              {
                label: "Fallido",
                onClick: () => toggleStatusFilter("FAILED"),
                Icon: <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusConfig("FAILED").color }}></div>,
                isSelected: statusFilter.includes("FAILED")
              }
            ]}
          >
            <div className="flex items-center gap-2">
              {statusFilter.length === 1 ? (
                <>
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: getStatusConfig(statusFilter[0]).color }}
                  ></div>
                  <span>
                    {statusFilter[0] === "PAID WITH QR" ? "Pagado QR" :
                     statusFilter[0] === "PAID" ? "Pagado" :
                     statusFilter[0] === "PROCESSING" ? "Procesando" :
                     statusFilter[0] === "PENDING" ? "Pendiente" :
                     statusFilter[0] === "EXPIRADO" ? "Expirado" :
                     statusFilter[0] === "ARCHIVADO" ? "Archivado" :
                     statusFilter[0] === "REJECTED_BY_PAYMENT_GATEWAY" ? "Rechazado" :
                     statusFilter[0] === "FAILED" ? "Fallido" : "Estado"}
                  </span>
                </>
              ) : (
                <div className="flex items-center gap-1">
                  <div className="flex -space-x-1">
                    {statusFilter.slice(0, 3).map((status, index) => (
                      <div 
                        key={status}
                        className="w-2 h-2 rounded-full border border-white/20" 
                        style={{ backgroundColor: getStatusConfig(status).color }}
                      ></div>
                    ))}
                    {statusFilter.length > 3 && (
                      <div className="w-2 h-2 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="text-[6px] text-white">+</span>
                      </div>
                    )}
                  </div>
                  <span>{statusFilter.length} estados</span>
                </div>
              )}
            </div>
          </DropdownMenu>


          {/* Chart Toggle Button */}
          <button
            onClick={() => setIsChartVisible(!isChartVisible)}
            className="h-9 w-9 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-lg text-white transition-all duration-200 flex items-center justify-center"
            title={isChartVisible ? 'Ocultar gráfico' : 'Mostrar gráfico'}
          >
            {isChartVisible ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            )}
          </button>

        </div>

        {/* Chart Section */}
        {isChartVisible && (
          <div className="mt-6">
            {chartDataLoaded ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white">Actividad de Ventas (Últimos 30 días)</h3>
                  <TransactionKPIs 
                    allTransactions={allTransactionsForChart}
                    isTransactionExpired={isTransactionExpired}
                  />
                </div>
                <TransactionsChart
                  allTransactions={allTransactionsForChart}
                  statusFilter={statusFilter}
                  isTransactionExpired={isTransactionExpired}
                  shouldHideExpiredTransaction={shouldHideExpiredTransaction}
                  onToggleStatusFilter={toggleStatusFilter}
                />
              </div>
            ) : (
              /* Chart Skeleton Loader */
              <div className="space-y-4">
                {/* Header Skeleton */}
                <div className="flex items-center justify-between mb-4">
                  <div className="h-6 w-64 bg-white/10 rounded-lg animate-pulse"></div>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-40 bg-white/10 rounded-xl animate-pulse"></div>
                    <div className="h-9 w-32 bg-white/10 rounded-xl animate-pulse"></div>
                    <div className="h-9 w-36 bg-white/10 rounded-xl animate-pulse"></div>
                  </div>
                </div>
                
                {/* Chart Skeleton */}
                <div className="h-64 bg-white/[0.03] backdrop-blur-xl rounded-xl border border-white/[0.08] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
                  {/* Skeleton bars */}
                  <div className="flex items-end justify-center gap-2 h-full p-6">
                    {Array.from({ length: 15 }, (_, i) => (
                      <div 
                        key={i}
                        className="bg-white/10 rounded-t-sm animate-pulse"
                        style={{ 
                          height: `${Math.random() * 60 + 20}%`,
                          width: '12px'
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
                
                {/* Legend Skeleton */}
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
                  {Array.from({ length: 8 }, (_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-white/10 rounded-sm animate-pulse"></div>
                      <div className="h-3 w-16 bg-white/10 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Transactions Table */}
        <div className="mt-6 overflow-hidden">
          {filteredTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-white/10">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('order_id')}
                  >
                    <div className="flex items-center gap-1">
                      ID Orden
                      {getSortIcon('order_id')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('user_name')}
                  >
                    <div className="flex items-center gap-1">
                      Usuario
                      {getSortIcon('user_name')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('seller_name')}
                  >
                    <div className="flex items-center gap-1">
                      Promotor
                      {getSortIcon('seller_name')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('ticket_name')}
                  >
                    <div className="flex items-center gap-1">
                      Ticket
                      {getSortIcon('ticket_name')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center gap-1">
                      Base
                      {getSortIcon('price')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('variable_fee')}
                  >
                    <div className="flex items-center gap-1">
                      Fee
                      {getSortIcon('variable_fee')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('tax')}
                  >
                    <div className="flex items-center gap-1">
                      Tax
                      {getSortIcon('tax')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('total')}
                  >
                    <div className="flex items-center gap-1">
                      Total
                      {getSortIcon('total')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('source')}
                  >
                    <div className="flex items-center gap-1">
                      Fuente
                      {getSortIcon('source')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-1">
                      Estado
                      {getSortIcon('status')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {loadingTransactions ? (
                  /* Table Skeleton Loader */
                  Array.from({ length: 20 }, (_, i) => (
                    <tr key={`skeleton-${i}`} className="animate-pulse">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="h-4 w-24 bg-white/10 rounded"></div>
                          <div className="h-3 w-32 bg-white/5 rounded"></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="h-4 w-36 bg-white/10 rounded"></div>
                          <div className="h-3 w-48 bg-white/5 rounded"></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-28 bg-white/10 rounded"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="h-4 w-32 bg-white/10 rounded"></div>
                          <div className="h-3 w-20 bg-white/5 rounded"></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-16 bg-white/10 rounded"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-14 bg-white/10 rounded"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-12 bg-white/10 rounded"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-20 bg-white/10 rounded"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-16 bg-white/10 rounded"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-6 w-20 bg-white/10 rounded-full"></div>
                      </td>
                    </tr>
                  ))
                ) : (
                  filteredTransactions.map((transaction: Transaction) => (
                    <tr key={transaction.order_id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-white">
                        <div>
                          <div className="font-medium">{transaction.order_id}</div>
                          <div className="text-white/60 text-xs">{transaction.created_at}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        <div>
                          <div className="font-medium">{transaction.user_name} {transaction.user_lastname}</div>
                          <div className="text-white/60 text-xs">{transaction.user_email} • {transaction.user_phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {transaction.has_promoter && transaction.promoter_name ? (
                          <div>
                            <div className="font-medium">{transaction.promoter_name} {transaction.promoter_lastname}</div>
                            <div className="text-white/60 text-xs">{transaction.promoter_email} • {transaction.promoter_phone}</div>
                          </div>
                        ) : (
                          <span className="text-white/60">Sin promotor</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        <div>
                          <div className="font-medium">{transaction.ticket_name}</div>
                          <div className="text-white/60 text-xs">Cantidad: {transaction.quantity}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        ${transaction.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        ${transaction.variable_fee.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        ${transaction.tax.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        ${transaction.total.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        <span className="capitalize">{transaction.source}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderTransactionStatus(transaction.created_at, transaction.status)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-white/60">
              {transactionsData?.data.length === 0 ? "Sin transacciones" : "No hay resultados"}
            </div>
          </div>
        )}
        </div>

        {/* Pagination */}
        {transactionsData?.pagination && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-white/60 text-sm">
              Mostrando {filteredTransactions.length} de {transactionsData.pagination.total_items} transacciones
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => fetchTransactions(currentPage - 1)}
                disabled={!transactionsData.pagination.has_previous || loadingTransactions}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-xl transition-all duration-300 text-white font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingTransactions ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white/70 rounded-full animate-spin"></div>
                    <span>Anterior</span>
                  </div>
                ) : (
                  "Anterior"
                )}
              </button>
              
              <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, transactionsData.pagination.total_pages) }, (_, i) => {
                    const page = Math.max(1, Math.min(
                      transactionsData.pagination.total_pages - 4,
                      transactionsData.pagination.page - 2
                    )) + i;
                    
                    return (
                      <button
                        key={page}
                        onClick={() => fetchTransactions(page)}
                        disabled={loadingTransactions}
                        className={`w-10 h-10 rounded-xl transition-all duration-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                          page === transactionsData.pagination.page
                            ? 'bg-white/20 text-white border border-white/30'
                            : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white border border-white/10 hover:border-white/20'
                        }`}
                      >
                        {loadingTransactions && page === transactionsData.pagination.page ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white/70 rounded-full animate-spin"></div>
                        ) : (
                          page
                        )}
                      </button>
                    );
                  })}
              </div>
              
              <button
                onClick={() => fetchTransactions(currentPage + 1)}
                disabled={!transactionsData.pagination.has_next || loadingTransactions}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-xl transition-all duration-300 text-white font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingTransactions ? (
                  <div className="flex items-center gap-2">
                    <span>Siguiente</span>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white/70 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  "Siguiente"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}