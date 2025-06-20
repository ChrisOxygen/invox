"use client";

import { useQuery } from "@tanstack/react-query";
import { _getClients } from "../actions";
import { Client } from "@prisma/client";

interface UseGetClientsParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface GetClientsResponse {
  clients: Client[];
  pagination: PaginationInfo;
}

export function useGetClients(params: UseGetClientsParams = {}) {
  const { page = 1, limit = 10, search = "" } = params;

  const query = useQuery<GetClientsResponse, Error>({
    queryKey: ["clients", page, limit, search],

    queryFn: async () => {
      const response = await _getClients({
        page,
        limit,
        search: search.trim(),
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch clients");
      }

      return (
        response.data || {
          clients: [],
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            itemsPerPage: limit,
          },
        }
      );
    },

    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    clients: query.data?.clients || [],
    pagination: query.data?.pagination || {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: limit,
    },
    isLoading: query.isLoading,
    isPending: query.isPending,
    error: query.error?.message || null,
    isError: query.isError,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
    isSuccess: query.isSuccess,
  };
}
