"use client";

import { useQuery } from "@tanstack/react-query";
import { InvoiceResponse } from "@/types/api/invoice";
import { _getInvoice } from "../actions";

interface UseGetInvoiceParams {
  invoiceId: string;
  enabled?: boolean;
}

// Hook to fetch a single invoice by ID
export function useGetInvoice(params: UseGetInvoiceParams) {
  const { invoiceId, enabled = true } = params;

  const query = useQuery<InvoiceResponse, Error>({
    queryKey: ["invoice", invoiceId],
    queryFn: async () => {
      const result = await _getInvoice(invoiceId);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    },
    enabled: enabled && !!invoiceId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    invoice: query.data?.data || null,
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
export type { UseGetInvoiceParams };
