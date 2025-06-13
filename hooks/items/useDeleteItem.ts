"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { _deleteItem } from "@/actions/items";
import { BaseResponse } from "@/types/api";

interface UseDeleteItemOptions {
  onSuccess?: (itemId: string) => void;
  onError?: (error: Error) => void;
}

// Hook to delete an item
export function useDeleteItem(options?: UseDeleteItemOptions) {
  const queryClient = useQueryClient();

  const mutation = useMutation<BaseResponse, Error, string>({
    mutationFn: async (itemId: string) => {
      const response = await _deleteItem(itemId);

      if (!response.success) {
        throw new Error(response.message || "Failed to delete item");
      }

      return response;
    },

    onSuccess: (data, itemId) => {
      // Invalidate and refetch items list
      queryClient.invalidateQueries({ queryKey: ["items"] });
      // Remove the specific item from cache
      queryClient.removeQueries({ queryKey: ["items", itemId] });

      // Call the optional onSuccess callback if provided
      if (options?.onSuccess) {
        options.onSuccess(itemId);
      }
    },

    onError: (error) => {
      console.error("Error deleting item:", error);

      // Call the optional onError callback if provided
      if (options?.onError) {
        options.onError(error);
      }
    },
  });

  return {
    deleteItem: mutation.mutate,
    deleteItemAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error?.message || null,
    reset: mutation.reset,
    isSuccess: mutation.isSuccess,
  };
}
