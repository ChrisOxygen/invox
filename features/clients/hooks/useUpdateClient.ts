"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { _updateClient } from "../actions";
import { UpdateClientRequest } from "@/types/api/client";
import { Client } from "@prisma/client";

interface UseUpdateClientOptions {
  onSuccess?: (data: Client) => void;
  onError?: (error: Error) => void;
}

export function useUpdateClient(options?: UseUpdateClientOptions) {
  const queryClient = useQueryClient();

  const mutation = useMutation<Client, Error, UpdateClientRequest>({
    mutationFn: async (input: UpdateClientRequest) => {
      // Call the server action (validation now happens server-side)
      const response = await _updateClient(input);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to update client");
      }

      return response.data;
    },

    onSuccess: (data, variables) => {
      // Invalidate and refetch affected queries
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({
        queryKey: ["client", variables.clientId],
      });

      // Call the optional onSuccess callback if provided
      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error) => {
      console.error("Error updating client:", error);

      // Call the optional onError callback if provided
      if (options?.onError) {
        options.onError(error);
      }
    },
  });

  return {
    updateClient: mutation.mutate,
    updateClientAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error?.message || null,
    data: mutation.data,
    reset: mutation.reset,
    isSuccess: mutation.isSuccess,
  };
}
