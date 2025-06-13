"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { _createItem } from "@/actions/items";
import { ApiResponse } from "@/types";
import { Item } from "@prisma/client";
import { CreateItemInput } from "@/types/schemas/item";

interface UseCreateItemOptions {
  onSuccess?: (data: ApiResponse<Item>) => void;
  onError?: (error: Error) => void;
}

// Hook to create a new item
export function useCreateItem(options?: UseCreateItemOptions) {
  const queryClient = useQueryClient();

  const mutation = useMutation<ApiResponse<Item>, Error, CreateItemInput>({
    mutationFn: async (input: CreateItemInput) => {
      const response = await _createItem(input);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to create item");
      }

      return response;
    },

    onSuccess: (data) => {
      // Invalidate and refetch items list
      queryClient.invalidateQueries({ queryKey: ["items"] });

      // Call the optional onSuccess callback if provided
      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },

    onError: (error) => {
      console.error("Error creating item:", error);

      // Call the optional onError callback if provided
      if (options?.onError) {
        options.onError(error);
      }
    },
  });

  return {
    createItem: mutation.mutate,
    createItemAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error?.message || null,
    createdItem: mutation.data,
    reset: mutation.reset,
    isSuccess: mutation.isSuccess,
  };
}
