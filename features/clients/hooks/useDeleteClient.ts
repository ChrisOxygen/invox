"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { _deleteClient } from "../actions";

export function useDeleteClient() {
  const queryClient = useQueryClient();

  const mutation = useMutation<boolean, Error, string>({
    mutationFn: async (clientId: string) => {
      // Call the server action (validation now happens server-side)
      const response = await _deleteClient(clientId);

      if (!response.success) {
        throw new Error(response.message || "Failed to delete client");
      }

      return true;
    },

    onSuccess: () => {
      // Invalidate and refetch clients list
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  return {
    deleteClient: mutation.mutate,
    deleteClientAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error?.message || null,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
}
