/**
 * Custom hook for fetching client metrics using TanStack Query
 */

import { useQuery } from "@tanstack/react-query";
import { _getClientMetrics } from "../actions";
import type { ClientMetricsResponse } from "../types";

export function useClientMetrics() {
  return useQuery<ClientMetricsResponse>({
    queryKey: ["dashboard", "client-metrics"],
    queryFn: _getClientMetrics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
}
