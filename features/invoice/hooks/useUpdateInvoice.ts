"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateInvoiceInput } from "@/dataSchemas/invoice";
import { InvoiceResponse } from "@/types/api/invoice";
import { _updateInvoice } from "../actions";

interface UseUpdateInvoiceOptions {
  onSuccess?: (data: InvoiceResponse) => void;
  onError?: (error: string) => void;
}

// Hook to update an existing invoice
export function useUpdateInvoice(options?: UseUpdateInvoiceOptions) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: UpdateInvoiceInput) => {
      const result = await _updateInvoice(data);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    },
    onSuccess: (data) => {
      // Invalidate and refetch invoice-related queries
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice-stats"] });

      // Update the specific invoice in cache if it exists
      if (data.data?.id) {
        queryClient.setQueryData(["invoice", data.data.id], data);
      }

      options?.onSuccess?.(data);
    },
    onError: (error: Error) => {
      options?.onError?.(error.message);
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error?.message || null,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    reset: mutation.reset,
  };
}

// Export the type for convenience
export type { UpdateInvoiceInput as UpdateInvoiceData };
