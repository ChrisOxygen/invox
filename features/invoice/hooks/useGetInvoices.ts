"use client";

import { useQuery } from "@tanstack/react-query";
import { InvoiceListApiResponse } from "@/types/api/invoice";
import { InvoiceFiltersInput, PaginationInput } from "@/dataSchemas/invoice";
import { _getInvoices } from "../actions";

interface UseGetInvoicesParams {
  filters?: InvoiceFiltersInput;
  pagination?: PaginationInput;
  enabled?: boolean;
}

// Hook to fetch invoices with filters and pagination
export function useGetInvoices(params?: UseGetInvoicesParams) {
  const { filters, pagination, enabled = true } = params || {};

  const query = useQuery<InvoiceListApiResponse, Error>({
    queryKey: ["invoices", filters, pagination],
    queryFn: async () => {
      const result = await _getInvoices(filters, pagination);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    },
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    invoices: query.data?.data?.invoices || [],
    totalCount: query.data?.data?.totalCount || 0,
    totalPages: query.data?.data?.totalPages || 0,
    currentPage: query.data?.data?.currentPage || 1,
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
export type { UseGetInvoicesParams };
