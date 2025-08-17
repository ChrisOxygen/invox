"use client";

import { useQuery } from "@tanstack/react-query";
import { _getPaymentAccountById } from "../actions";
import { ApiResponse } from "@/types";
import { PaymentAccount } from "@prisma/client";

// Hook to fetch a single payment account by ID
export function useGetPaymentAccount(paymentAccountId: string) {
  const query = useQuery<ApiResponse<PaymentAccount>>({
    queryKey: ["payment-account", paymentAccountId],
    queryFn: async () => {
      const result = await _getPaymentAccountById(paymentAccountId);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    },
    enabled: !!paymentAccountId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    paymentAccount: query.data?.data || null,
    isLoading: query.isLoading,
    isPending: query.isPending,
    isError: query.isError,
    error: query.error?.message || null,
    isSuccess: query.isSuccess && !!query.data?.data,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
  };
}
