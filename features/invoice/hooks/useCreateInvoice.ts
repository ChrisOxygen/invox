"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateInvoiceInput } from "@/dataSchemas/invoice";
import { InvoiceResponse } from "@/types/api/invoice";
import { _createInvoice } from "../actions";

interface UseCreateInvoiceOptions {
  onSuccess?: (data: InvoiceResponse) => void;
  onError?: (error: string) => void;
}

// Hook to create a new invoice
export function useCreateInvoice(options?: UseCreateInvoiceOptions) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: CreateInvoiceInput) => {
      const result = await _createInvoice(data);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    },
    onSuccess: (data) => {
      // Invalidate and refetch invoice-related queries
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice-stats"] });

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
export type { CreateInvoiceInput as CreateInvoiceData };
