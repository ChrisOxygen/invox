"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { _updateInvoice } from "../actions";
import { ApiResponse } from "@/types/api";
import { ZUpdateInvoiceInput } from "../validation/invoiceSchemas";

interface UseUpdateInvoiceOptions {
  onSuccess?: (response: ApiResponse<string>) => void;
  onError?: (error: string) => void;
}

// Hook to update an existing invoice
export function useUpdateInvoice(options?: UseUpdateInvoiceOptions) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (
      data: ZUpdateInvoiceInput
    ): Promise<ApiResponse<string>> => {
      const result = await _updateInvoice(data);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    },
    onSuccess: (result) => {
      // Invalidate and refetch invoice-related queries
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice-stats"] });

      // Invalidate the specific invoice query to refetch updated data
      if (result.data) {
        queryClient.invalidateQueries({ queryKey: ["invoice", result.data] });
      }

      // Call the success callback with the invoice ID
      if (result) {
        options?.onSuccess?.(result);
      }
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
    data: mutation.data?.data || null, // Extract the invoice ID from the response
    reset: mutation.reset,
  };
}
