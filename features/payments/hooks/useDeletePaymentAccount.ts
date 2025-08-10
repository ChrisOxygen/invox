"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { _deletePaymentAccount } from "../actions";
import { BaseResponse } from "@/types/api";

interface UseDeletePaymentAccountOptions {
  onSuccess?: (response: BaseResponse) => void;
  onError?: (error: string) => void;
}

// Hook to delete a payment account
export function useDeletePaymentAccount(
  options?: UseDeletePaymentAccountOptions
) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (paymentAccountId: string): Promise<BaseResponse> => {
      const result = await _deletePaymentAccount(paymentAccountId);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    },
    onSuccess: (result) => {
      // Invalidate and refetch payment account-related queries
      queryClient.invalidateQueries({ queryKey: ["payment-accounts"] });

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
    data: mutation.data || null, // BaseResponse doesn't have nested data
    reset: mutation.reset,
  };
}
