"use client";

import { useQuery } from "@tanstack/react-query";
import { _getClientById } from "../actions";
import { Client } from "@prisma/client";

export function useGetClientById(clientId: string, enabled = false) {
  const query = useQuery<Client, Error>({
    queryKey: ["client", clientId],

    queryFn: async () => {
      // Call the server action (validation now happens server-side)
      const response = await _getClientById(clientId);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Client not found");
      }

      return response.data;
    },

    enabled: enabled && !!clientId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    client: query.data || null,
    isLoading: query.isLoading,
    isPending: query.isPending,
    error: query.error?.message || null,
    isError: query.isError,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
    isSuccess: query.isSuccess,
  };
}
