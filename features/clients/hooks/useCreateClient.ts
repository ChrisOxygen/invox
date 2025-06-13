"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { _createClient } from "../actions";
import { CreateClientRequest } from "@/types/api/client";
import { Client } from "@prisma/client";

interface UseCreateClientOptions {
  onSuccess?: (data: Client) => void;
  onError?: (error: Error) => void;
}

export function useCreateClient(options?: UseCreateClientOptions) {
  const queryClient = useQueryClient();

  const mutation = useMutation<Client, Error, CreateClientRequest>({
    mutationFn: async (input: CreateClientRequest) => {
      // Call the server action (validation now happens server-side)
      const response = await _createClient(input);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to create client");
      }

      return response.data;
    },

    onSuccess: (data) => {
      // Invalidate and refetch clients list
      queryClient.invalidateQueries({ queryKey: ["clients"] });

      // Call the optional onSuccess callback if provided
      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error) => {
      console.error("Error creating client:", error);

      // Call the optional onError callback if provided
      if (options?.onError) {
        options.onError(error);
      }
    },
  });

  return {
    createClient: mutation.mutate,
    createClientAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error?.message || null,
    createdClient: mutation.data,
    reset: mutation.reset,
    isSuccess: mutation.isSuccess,
  };
}
