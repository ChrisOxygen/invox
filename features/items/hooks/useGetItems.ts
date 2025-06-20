"use client";

import { useQuery } from "@tanstack/react-query";
import { _getItem, _getItems } from "@/actions/items";
import { Item } from "@prisma/client";
import { ApiResponse } from "@/types";

interface UseGetItemsParams {
  page?: number;
  limit?: number;
  search?: string;
}

// Hook to fetch all items for the current user with pagination
export function useGetItems(params: UseGetItemsParams = {}) {
  const { page = 1, limit = 10, search } = params;

  const query = useQuery({
    queryKey: ["items", { page, limit, search }],
    queryFn: async () => {
      const result = await _getItems(page, limit, search);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    items: query.data?.data?.items || [],
    pagination: query.data?.data?.pagination || {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    },
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
    queryKey: ["items", itemId],
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

// Hook to fetch all items for the current user (for dropdowns, selections, etc.)
export function useGetAllItems() {
  const { items, ...rest } = useGetItems({ limit: 1000 });
  return {
    items,
    ...rest,
  };
}
