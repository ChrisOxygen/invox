"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PaymentAccount } from "@prisma/client";

import { _setPaymentAccountAsDefault } from "../actions";
import { ApiResponse } from "@/types";

interface UseSetPaymentAccountAsDefaultOptions {
  onSuccess?: (response: ApiResponse<PaymentAccount>) => void;
  onError?: (error: string) => void;
}

// Hook to set a payment account as default
export function useSetPaymentAccountAsDefault(
  options?: UseSetPaymentAccountAsDefaultOptions
) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (
      paymentAccountId: string
    ): Promise<ApiResponse<PaymentAccount>> => {
      const result = await _setPaymentAccountAsDefault(paymentAccountId);

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
    data: mutation.data?.data || null, // Extract the payment account from the response
    reset: mutation.reset,
  };
}
