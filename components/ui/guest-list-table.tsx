import React, { useState } from 'react';
import GuestListKPIs from './guest-list-kpis';

interface GuestListUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

interface GuestListAssets {
  qr_url?: string;
  pdf_url?: string;
  wallet_url?: string;
}

interface GuestListItem {
  id: string;
  user: GuestListUser;
  status: 'active' | 'scanned' | 'late_fee_pending' | 'late_fee_paid';
  created_at: string;
  email_sent: boolean;
  scan: boolean;
  scanner_id?: string;
  scanned_at?: string;
  late_fee_status?: string;
  late_fee_total?: number;
  assets: GuestListAssets;
}

interface GuestListTableProps {
  data: GuestListItem[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onSearch: (query: string) => void;
  onStatusFilter: (status: string) => void;
  guestListKPIs?: {
    invitations: number;
    redeemed: number;
    revenue: number;
  };
}

export default function GuestListTable({
  data,
  loading,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  onSearch,
  onStatusFilter,
  guestListKPIs,
}: GuestListTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setStatusFilter(value);
    onStatusFilter(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isLateFeeExpired = (late_fee_sent_at: string) => {
    if (!late_fee_sent_at) return false;
    
    const sentTime = new Date(late_fee_sent_at);
    const currentTime = new Date();
    const hoursElapsed = (currentTime.getTime() - sentTime.getTime()) / (1000 * 60 * 60);
    
    return hoursElapsed > 8;
  };

  const getStatusBadge = (status: string, scan: boolean, late_fee_sent_at?: string) => {
    if (scan) {
      return <span className="px-2 py-1 bg-green-600/20 text-green-400 rounded-full text-xs">Escaneado</span>;
    }
    
    // Check if late fee is expired
    if (status === 'late_fee_pending' && late_fee_sent_at && isLateFeeExpired(late_fee_sent_at)) {
      return <span className="px-2 py-1 bg-red-600/20 text-red-400 rounded-full text-xs">Expirado</span>;
    }
    
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs">Activo</span>;
      case 'late_fee_pending':
        return <span className="px-2 py-1 bg-yellow-600/20 text-yellow-400 rounded-full text-xs">Cargo Pendiente</span>;
      case 'late_fee_paid':
        return <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded-full text-xs">Cargo Pagado</span>;
      default:
        return <span className="px-2 py-1 bg-gray-600/20 text-gray-400 rounded-full text-xs">Desconocido</span>;
    }
  };

  return (
    <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-8 border border-white/[0.08] space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white">Lista de Invitados</h2>
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 bg-white hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-lg text-gray-800 hover:text-white transition-all duration-300 flex items-center justify-center group">
            <svg className="w-5 h-5 group-hover:scale-105 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </button>
          <button className="h-10 px-4 bg-white hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-lg text-gray-800 hover:text-white transition-all duration-300 flex items-center gap-2 group">
            <svg className="w-4 h-4 group-hover:scale-105 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm font-medium">Exportar</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/50 focus:bg-white/10 focus:border-white/20 focus:outline-none"
          />
        </div>
        <div className="w-48">
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:bg-white/10 focus:border-white/20 focus:outline-none"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="scanned">Escaneados</option>
            <option value="late_fee_pending">Cargo Pendiente</option>
            <option value="late_fee_paid">Cargo Pagado</option>
          </select>
        </div>
      </div>

      {/* Guest List KPIs */}
      <GuestListKPIs guestListData={guestListKPIs} />

      {/* Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-8 border border-white/[0.08]">
            <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white rounded-full mx-auto mb-4"></div>
            <p className="text-white/60">Cargando invitados...</p>
          </div>
        </div>
      ) : data.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Invitado</th>
                  <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Estado</th>
                  <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Email Enviado</th>
                  <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Fecha Creación</th>
                  <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Recargo</th>
                  <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Fecha de Ingreso</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-white font-medium">{item.user.name}</p>
                        <p className="text-white/60 text-sm">{item.user.email}</p>
                        {item.user.phone && (
                          <p className="text-white/60 text-xs">{item.user.phone}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(item.status, item.scan, item.late_fee_status)}
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        {item.email_sent ? (
                          <span className="text-green-400 text-sm">✓ Enviado</span>
                        ) : (
                          <span className="text-red-400 text-sm">✗ No enviado</span>
                        )}
                        {(item as any).confirmation_sent_at && (
                          <p className="text-white/50 text-xs">
                            Confirmado: {formatDate((item as any).confirmation_sent_at)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-white/80 text-sm">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="py-4 px-4">
                      {item.late_fee_total ? (
                        <p className="text-white font-medium text-sm">
                          ${item.late_fee_total.toLocaleString('es-CO')}
                        </p>
                      ) : (
                        <span className="text-white/50 text-sm">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-white/80 text-sm">
                      {item.scanned_at ? formatDate(item.scanned_at) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
            <div className="text-sm text-white/60">
              Mostrando {((currentPage - 1) * 50) + 1} - {Math.min(currentPage * 50, totalItems)} de {totalItems} invitados
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-3 py-1 bg-white/10 text-white text-sm rounded hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>
              <span className="px-3 py-1 text-white/80 text-sm">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-3 py-1 bg-white/10 text-white text-sm rounded hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-8 border border-white/[0.08]">
            <h3 className="text-xl font-medium text-white mb-4">No hay invitados</h3>
            <p className="text-white/60 mb-4">Aún no se han agregado invitados a este evento.</p>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors">
              Agregar primer invitado
            </button>
          </div>
        </div>
      )}
    </div>
  );
}