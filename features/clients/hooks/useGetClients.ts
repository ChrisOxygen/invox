"use client";

import { useQuery } from "@tanstack/react-query";
import { _getClients } from "../actions";
import { Client } from "@prisma/client";

export function useGetClients() {
  const query = useQuery<Client[], Error>({
    queryKey: ["clients"],

    queryFn: async () => {
      const response = await _getClients();

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch clients");
      }

      return response.data || [];
    },

    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    clients: query.data || [],
    isLoading: query.isLoading,
    isPending: query.isPending,
    error: query.error?.message || null,
    isError: query.isError,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
    isSuccess: query.isSuccess,
  };
}
