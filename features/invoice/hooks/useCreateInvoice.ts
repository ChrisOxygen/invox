"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ZCreateInvoiceInput } from "@/dataSchemas/invoice";

import { _createInvoice } from "../actions";
import { ApiResponse } from "@/types";

interface UseCreateInvoiceOptions {
  onSuccess?: (response: ApiResponse<string>) => void;
  onError?: (error: string) => void;
}

// Hook to create a new invoice
export function useCreateInvoice(options?: UseCreateInvoiceOptions) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (
      data: ZCreateInvoiceInput
    ): Promise<ApiResponse<string>> => {
      const result = await _createInvoice(data);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    },
    onSuccess: (result) => {
      // Invalidate and refetch invoice-related queries
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice-stats"] });

      // Call the success callback with the API response
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
