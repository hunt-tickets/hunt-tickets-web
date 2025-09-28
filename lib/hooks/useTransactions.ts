import { useState, useEffect, useCallback, useRef } from 'react';
import { getEventTransactions, type Transaction, type TransactionsResponse } from '@/lib/api/transactions';
import type { TransactionFilters, SortDirection } from '@/lib/types/event-types';

export function useTransactions(eventId: string | string[], activeTab: string) {
  const [transactionsData, setTransactionsData] = useState<TransactionsResponse | null>(null);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [activeChartIndex, setActiveChartIndex] = useState<number | null>(null);
  const [isChartVisible, setIsChartVisible] = useState(true);
  
  // Filter states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([
    "PAID WITH QR", "PAID", "PROCESSING", "PENDING", "EXPIRADO", "REJECTED_BY_PAYMENT_GATEWAY", "FAILED"
  ]);
  const [sourceFilter, setSourceFilter] = useState("all");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showArchived, setShowArchived] = useState(false);

  const isTransactionExpired = (createdAt: string, status: string): boolean => {
    if (status !== "PENDING") return false;
    
    try {
      const [datePart, timePart] = createdAt.split(' ');
      const [day, month, year] = datePart.split('/');
      const [hour, minute] = timePart.split(':');
      
      const transactionDate = new Date(
        parseInt(year, 10), 
        parseInt(month, 10) - 1, 
        parseInt(day, 10), 
        parseInt(hour, 10), 
        parseInt(minute, 10)
      );
      
      const now = new Date();
      const diffInMinutes = (now.getTime() - transactionDate.getTime()) / (1000 * 60);
      
      return diffInMinutes > 20;
    } catch (error) {
      console.error('Error checking if transaction is expired:', error);
      return false;
    }
  };

  const shouldHideExpiredTransaction = (createdAt: string, status: string): boolean => {
    if (status !== "PENDING") return false;
    
    try {
      const [datePart, timePart] = createdAt.split(' ');
      const [day, month, year] = datePart.split('/');
      const [hour, minute] = timePart.split(':');
      
      const transactionDate = new Date(
        parseInt(year, 10), 
        parseInt(month, 10) - 1, 
        parseInt(day, 10), 
        parseInt(hour, 10), 
        parseInt(minute, 10)
      );
      
      const now = new Date();
      const diffInHours = (now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60);
      
      // Hide expired transactions after 24 hours
      return diffInHours > 24;
    } catch (error) {
      console.error('Error checking if expired transaction should be hidden:', error);
      return false;
    }
  };

  // Fetch all transactions and handle smart pagination
  const fetchAllTransactionsAndPaginate = useCallback(async (showLoading = true) => {
    if (!eventId) return;
    
    if (showLoading) {
      setLoadingTransactions(true);
    }
    try {
      // Fetch all transactions from the API (up to a reasonable limit)
      const allTransactionsResponse = await getEventTransactions(eventId as string, 1, 1000);
      const allTransactions = allTransactionsResponse.data;
      
      // Apply the same filtering logic as getFilteredTransactions but to all data
      const filtered = allTransactions.filter(transaction => {
        // Hide archived transactions if ARCHIVADO filter is not selected
        if (shouldHideExpiredTransaction(transaction.created_at, transaction.status) && !statusFilter.includes("ARCHIVADO")) {
          return false;
        }

        // Search filter
        const matchesSearch = searchTerm === "" || 
          transaction.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          `${transaction.user_name} ${transaction.user_lastname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.ticket_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (transaction.has_promoter && transaction.promoter_name && 
           `${transaction.promoter_name} ${transaction.promoter_lastname}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (transaction.has_promoter && transaction.promoter_email && 
           transaction.promoter_email.toLowerCase().includes(searchTerm.toLowerCase()));

        // Status filter with archived logic
        const matchesStatus = statusFilter.some(filter => {
          if (filter === "EXPIRADO") {
            return isTransactionExpired(transaction.created_at, transaction.status) && !shouldHideExpiredTransaction(transaction.created_at, transaction.status);
          }
          if (filter === "ARCHIVADO") {
            return shouldHideExpiredTransaction(transaction.created_at, transaction.status);
          }
          return transaction.status === filter;
        });

        // Source filter
        const matchesSource = sourceFilter === "all" || (() => {
          const normalizedSource = transaction.source.toLowerCase();
          switch (sourceFilter) {
            case "mobile":
              return normalizedSource === "mobile" || normalizedSource === "app";
            case "web":
              return normalizedSource === "web" || normalizedSource === "website";
            case "cash":
              return normalizedSource === "cash" || normalizedSource === "efectivo";
            default:
              return normalizedSource === sourceFilter.toLowerCase();
          }
        })();

        return matchesSearch && matchesStatus && matchesSource;
      });
      
      // Calculate pagination for filtered results
      const totalFilteredItems = filtered.length;
      const totalPages = Math.ceil(totalFilteredItems / pageSize);
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const pageData = filtered.slice(startIndex, endIndex);
      
      // Create proper pagination response
      const paginatedResponse = {
        data: pageData,
        pagination: {
          page: currentPage,
          page_size: pageSize,
          total_items: totalFilteredItems,
          total_pages: totalPages,
          has_previous: currentPage > 1,
          has_next: currentPage < totalPages
        }
      };
      
      setTransactionsData(paginatedResponse);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    } finally {
      if (showLoading) {
        setLoadingTransactions(false);
      }
    }
  }, [eventId, currentPage, pageSize, searchTerm, statusFilter, sourceFilter, isTransactionExpired, shouldHideExpiredTransaction]);

  const fetchTransactions = useCallback(async (page: number = currentPage) => {
    setCurrentPage(page);
  }, [currentPage]);


  const handleFilterChange = useCallback(() => {
    setCurrentPage(1);
    // Data will be re-fetched automatically by useEffect when currentPage changes
  }, []);

  const toggleStatusFilter = useCallback((status: string) => {
    setStatusFilter(prev => {
      if (prev.includes(status)) {
        // Si está seleccionado, lo quitamos (pero no permitimos array vacío)
        const newFilter = prev.filter(s => s !== status);
        return newFilter.length > 0 ? newFilter : prev;
      } else {
        // Si no está seleccionado, lo agregamos
        return [...prev, status];
      }
    });
    handleFilterChange();
  }, [handleFilterChange]);

  const getChannelDisplayName = useCallback((source: string): string => {
    const channelMap: { [key: string]: string } = {
      'mobile': 'Aplicación Móvil',
      'web': 'Página Web',
      'cash': 'Efectivo',
      'app': 'Aplicación Móvil',
      'website': 'Página Web',
      'efectivo': 'Efectivo',
    };
    return channelMap[source.toLowerCase()] || source;
  }, []);

  const getFilteredTransactions = useCallback(() => {
    if (!transactionsData?.data) return [];

    // Data is already filtered by fetchAllTransactionsAndPaginate, just apply sorting
    let sorted = [...transactionsData.data];
    if (sortField) {
      sorted.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortField) {
          case 'order_id':
            aValue = a.order_id;
            bValue = b.order_id;
            break;
          case 'created_at':
            const parseDate = (dateString: string) => {
              try {
                const [datePart, timePart] = dateString.split(' ');
                const [day, month, year] = datePart.split('/');
                const [hour, minute] = timePart.split(':');
                return new Date(
                  parseInt(year, 10), 
                  parseInt(month, 10) - 1,
                  parseInt(day, 10), 
                  parseInt(hour, 10), 
                  parseInt(minute, 10)
                );
              } catch {
                return new Date(0);
              }
            };
            aValue = parseDate(a.created_at);
            bValue = parseDate(b.created_at);
            break;
          case 'user_name':
            aValue = `${a.user_name} ${a.user_lastname}`.toLowerCase();
            bValue = `${b.user_name} ${b.user_lastname}`.toLowerCase();
            break;
          case 'seller_name':
            aValue = a.has_promoter && a.promoter_name ? `${a.promoter_name} ${a.promoter_lastname}`.toLowerCase() : "sin promotor";
            bValue = b.has_promoter && b.promoter_name ? `${b.promoter_name} ${b.promoter_lastname}`.toLowerCase() : "sin promotor";
            break;
          case 'ticket_name':
            aValue = a.ticket_name.toLowerCase();
            bValue = b.ticket_name.toLowerCase();
            break;
          case 'price':
            aValue = a.price;
            bValue = b.price;
            break;
          case 'variable_fee':
            aValue = a.variable_fee;
            bValue = b.variable_fee;
            break;
          case 'tax':
            aValue = a.tax;
            bValue = b.tax;
            break;
          case 'total':
            aValue = a.total;
            bValue = b.total;
            break;
          case 'source':
            aValue = a.source.toLowerCase();
            bValue = b.source.toLowerCase();
            break;
          case 'status':
            aValue = shouldHideExpiredTransaction(a.created_at, a.status) ? "ARCHIVADO" : 
                     isTransactionExpired(a.created_at, a.status) ? "EXPIRADO" : a.status;
            bValue = shouldHideExpiredTransaction(b.created_at, b.status) ? "ARCHIVADO" : 
                     isTransactionExpired(b.created_at, b.status) ? "EXPIRADO" : b.status;
            break;
          default:
            return 0;
        }

        if (aValue < bValue) {
          return sortDirection === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return sorted;
  }, [transactionsData, sortField, sortDirection, shouldHideExpiredTransaction, isTransactionExpired]);

  // Simple useEffect for initial load and filter changes
  useEffect(() => {
    if (activeTab === "transactions" && eventId) {
      const timeoutId = setTimeout(() => {
        fetchAllTransactionsAndPaginate(!transactionsData); // Show loading only on initial load
      }, searchTerm ? 300 : 0); // Debounce search only

      return () => clearTimeout(timeoutId);
    }
  }, [activeTab, eventId, currentPage, searchTerm, statusFilter, sourceFilter]);

  return {
    // Data
    transactionsData,
    loadingTransactions,
    
    // Chart state
    activeChartIndex,
    setActiveChartIndex,
    isChartVisible,
    setIsChartVisible,
    
    // Filter states
    currentPage,
    setCurrentPage,
    pageSize,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sourceFilter,
    setSourceFilter,
    showArchived,
    setShowArchived,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    
    // Functions
    fetchTransactions,
    fetchAllTransactionsAndPaginate,
    getFilteredTransactions,
    isTransactionExpired,
    shouldHideExpiredTransaction,
    handleFilterChange,
    toggleStatusFilter,
    getChannelDisplayName,
  };
}