"use client";

import { useTransactions } from "@/lib/hooks/useTransactions";
import type { Transaction } from "@/lib/api/transactions";

interface EventTransactionsTabProps {
  eventId: string | string[];
  activeTab: string;
}

export default function EventTransactionsTab({ eventId, activeTab }: EventTransactionsTabProps) {
  const {
    transactionsData,
    loadingTransactions,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sourceFilter,
    setSourceFilter,
    currentPage,
    fetchTransactions,
    getFilteredTransactions,
    isTransactionExpired,
  } = useTransactions(eventId, activeTab);

  const getStatusConfig = (status: string) => {
    const configs = {
      'PAID WITH QR': { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', label: 'Pagado con QR' },
      'PAID': { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', label: 'Pagado' },
      'PROCESSING': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', label: 'Procesando' },
      'PENDING': { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20', label: 'Pendiente' },
      'EXPIRADO': { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', label: 'Expirado' },
      'REJECTED_BY_PAYMENT_GATEWAY': { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', label: 'Rechazado' },
      'FAILED': { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', label: 'Fallido' },
    };
    return configs[status as keyof typeof configs] || configs['PENDING'];
  };

  const renderTransactionStatus = (createdAt: string, status: string) => {
    const displayStatus = isTransactionExpired(createdAt, status) ? "EXPIRADO" : status;
    const config = getStatusConfig(displayStatus);
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
        {config.label}
      </span>
    );
  };

  const filteredTransactions = getFilteredTransactions();

  if (loadingTransactions) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-lg">Cargando transacciones...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Transacciones</h2>
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar transacciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>
          
          {/* Status Filter */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <option value="all">Todas las fuentes</option>
            <option value="mobile">Móvil</option>
            <option value="web">Web</option>
            <option value="cash">Efectivo</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl border border-white/[0.08] overflow-hidden">
        {filteredTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/[0.05] border-b border-white/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                    ID Orden
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                    Ticket
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredTransactions.map((transaction: Transaction) => (
                  <tr key={transaction.order_id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-white">
                      {transaction.order_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      <div>
                        <div className="font-medium">{transaction.user_name} {transaction.user_lastname}</div>
                        <div className="text-white/60 text-xs">{transaction.user_email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {transaction.ticket_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      ${transaction.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderTransactionStatus(transaction.created_at, transaction.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">
                      {transaction.created_at}
                    </td>
                  </tr>
                ))}
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
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => fetchTransactions(currentPage - 1)}
            disabled={!transactionsData.pagination.has_previous}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-xl transition-all duration-300 text-white font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
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
                  className={`w-10 h-10 rounded-xl transition-all duration-300 text-sm font-medium ${
                    page === transactionsData.pagination.page
                      ? 'bg-white/20 text-white border border-white/30'
                      : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white border border-white/10 hover:border-white/20'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => fetchTransactions(currentPage + 1)}
            disabled={!transactionsData.pagination.has_next}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-xl transition-all duration-300 text-white font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}