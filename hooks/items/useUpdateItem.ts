"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { _updateItem } from "@/actions/items";
import { UpdateItemInput } from "@/dataSchemas/item";
import { ApiResponse } from "@/types";
import { Item } from "@prisma/client";

// Query keys for items updates
const ITEMS_QUERY_KEYS = {
  all: ["items"] as const,
  lists: () => [...ITEMS_QUERY_KEYS.all, "list"] as const,
  details: () => [...ITEMS_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...ITEMS_QUERY_KEYS.details(), id] as const,
};

interface UseUpdateItemOptions {
  onSuccess?: (data: NonNullable<ApiResponse<Item>>) => void;
  onError?: (error: Error) => void;
}

interface UpdateItemMutationInput {
  itemId: string;
  data: UpdateItemInput;
}

// Hook to update an existing item
export function useUpdateItem(options?: UseUpdateItemOptions) {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    NonNullable<ApiResponse<Item>>,
    Error,
    UpdateItemMutationInput
  >({
    mutationFn: async ({ itemId, data }: UpdateItemMutationInput) => {
      const response = await _updateItem(itemId, data);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to update item");
      }

      return response;
    },

    onSuccess: (response, variables) => {
      // Invalidate and refetch items list
      queryClient.invalidateQueries({ queryKey: ITEMS_QUERY_KEYS.lists() });
      // Invalidate the specific item detail
      queryClient.invalidateQueries({
        queryKey: ITEMS_QUERY_KEYS.detail(variables.itemId),
      });

      // Call the optional onSuccess callback if provided
      if (options?.onSuccess) {
        options.onSuccess(response);
      }
    },

    onError: (error) => {
      console.error("Error updating item:", error);

      // Call the optional onError callback if provided
      if (options?.onError) {
        options.onError(error);
      }
    },
  });

  return {
    updateItem: mutation.mutate,
    updateItemAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error?.message || null,
    updatedItem: mutation.data?.data,
    reset: mutation.reset,
    isSuccess: mutation.isSuccess,
  };
}
