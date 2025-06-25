"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteInvoiceInput } from "@/dataSchemas/invoice";
import { InvoiceDeleteResponse } from "@/types/api/invoice";
import { _deleteInvoice } from "../actions";

interface UseDeleteInvoiceOptions {
  onSuccess?: (data: InvoiceDeleteResponse) => void;
  onError?: (error: string) => void;
}

// Hook to delete an invoice
export function useDeleteInvoice(options?: UseDeleteInvoiceOptions) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: DeleteInvoiceInput) => {
      const result = await _deleteInvoice(data);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    },
    onSuccess: (data) => {
      // Invalidate and refetch invoice-related queries
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice-stats"] });

      // Remove the specific invoice from cache if it exists
      if (data.data?.deletedId) {
        queryClient.removeQueries({
          queryKey: ["invoice", data.data.deletedId],
        });
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
export type { DeleteInvoiceInput as DeleteInvoiceData };
