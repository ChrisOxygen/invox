"use client";

import { useQuery } from "@tanstack/react-query";
import { InvoiceStatsResponse } from "@/types/api/invoice";
import { _getInvoiceStats } from "../actions";

interface UseGetInvoiceStatsParams {
  enabled?: boolean;
}

// Hook to fetch invoice statistics
export function useGetInvoiceStats(params?: UseGetInvoiceStatsParams) {
  const { enabled = true } = params || {};

  const query = useQuery<InvoiceStatsResponse, Error>({
    queryKey: ["invoice-stats"],
    queryFn: async () => {
      const result = await _getInvoiceStats();

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    stats: query.data?.data || null,
    totalInvoices: query.data?.data?.totalInvoices || 0,
    totalRevenue: query.data?.data?.totalRevenue || 0,
    paidInvoices: query.data?.data?.paidInvoices || 0,
    pendingInvoices: query.data?.data?.pendingInvoices || 0,
    overdueInvoices: query.data?.data?.overdueInvoices || 0,
    draftInvoices: query.data?.data?.draftInvoices || 0,
    isLoading: query.isLoading,
    isPending: query.isPending,
    isError: query.isError,
    error: query.error?.message || null,
    isSuccess: query.isSuccess && !!query.data?.data,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
  };
}

// Export types for convenience
export type { UseGetInvoiceStatsParams };
