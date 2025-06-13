"use client";

import { useQuery } from "@tanstack/react-query";
import { _getItem, _getItems } from "@/actions/items";
import { Item } from "@prisma/client";
import { ApiResponse } from "@/types";

// Query keys for items fetching
const ITEMS_QUERY_KEYS = {
  all: ["items"] as const,
  lists: () => [...ITEMS_QUERY_KEYS.all, "list"] as const,
  details: () => [...ITEMS_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...ITEMS_QUERY_KEYS.details(), id] as const,
};

// Hook to fetch all items for the current user
export function useGetItems() {
  const query = useQuery<ApiResponse<Item[]>, Error>({
    queryKey: ITEMS_QUERY_KEYS.lists(),
    queryFn: async () => {
      const result = await _getItems();

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    items: query.data?.data || [],
    isLoading: query.isLoading,
    isPending: query.isPending,
    isError: query.isError,
    error: query.error?.message || null,
    isSuccess: query.isSuccess && !!query.data?.data,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
  };
}

// Hook to fetch a single item by ID
export function useGetItem(itemId: string) {
  const query = useQuery<ApiResponse<Item>, Error>({
    queryKey: ITEMS_QUERY_KEYS.detail(itemId),
    queryFn: async () => {
      const result = await _getItem(itemId);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    },
    enabled: !!itemId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    item: query.data?.data || null,
    isLoading: query.isLoading,
    isPending: query.isPending,
    isError: query.isError,
    error: query.error?.message || null,
    isSuccess: query.isSuccess && !!query.data?.data,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
  };
}
