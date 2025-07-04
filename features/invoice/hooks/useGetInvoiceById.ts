"use client";

import { useQuery } from "@tanstack/react-query";
import { InvoiceResponse } from "@/types/api/invoice";
import { _getInvoice } from "../actions";

// Hook to fetch a single invoice by ID
export function useGetInvoiceById(invoiceId: string) {
  const query = useQuery<InvoiceResponse, Error>({
    queryKey: ["invoice", invoiceId],
    queryFn: async () => {
      const result = await _getInvoice(invoiceId);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    },
    enabled: !!invoiceId,
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
