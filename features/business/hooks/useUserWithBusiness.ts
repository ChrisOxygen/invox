"use client";

import { useQuery } from "@tanstack/react-query";
import { _getUserAndBusiness } from "@/features/invoice/actions";
import { UserWithBusiness } from "@/types/database";

export function useUserWithBusiness() {
  const query = useQuery<UserWithBusiness, Error>({
    queryKey: ["user-with-business"],
    queryFn: async () => {
      const result = await _getUserAndBusiness();

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data!;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    data: query.data || null,
    isLoading: query.isLoading,
    isPending: query.isPending,
    error: query.error?.message || null,
    isError: query.isError,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
    isSuccess: query.isSuccess,
  };
}
