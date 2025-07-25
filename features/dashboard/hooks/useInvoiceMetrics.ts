/**
 * Custom hook for fetching invoice metrics using TanStack Query
 */

import { useQuery } from "@tanstack/react-query";
import { _getInvoiceMetrics } from "../actions";
import type { InvoiceMetricsResponse } from "../types";

export function useInvoiceMetrics() {
  return useQuery<InvoiceMetricsResponse>({
    queryKey: ["dashboard", "invoice-metrics"],
    queryFn: _getInvoiceMetrics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
}
