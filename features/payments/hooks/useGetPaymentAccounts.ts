"use client";

import { useQuery } from "@tanstack/react-query";
import { PaymentAccount } from "@prisma/client";
import { ApiResponse } from "@/types";
import { _getUserPaymentAccounts } from "@/features/payments/actions";

// Hook to fetch all payment accounts for the current user
export function useGetPaymentAccounts() {
  const query = useQuery<ApiResponse<PaymentAccount[]>, Error>({
    queryKey: ["payment-accounts"],
    queryFn: async () => {
      const result = await _getUserPaymentAccounts();

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    paymentAccounts: query.data?.data || [],
    isLoading: query.isLoading,
    isPending: query.isPending,
    isError: query.isError,
    error: query.error?.message || null,
    isSuccess: query.isSuccess && !!query.data?.data,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
  };
}
