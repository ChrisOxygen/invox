"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserBusiness } from "../actions";
import { useSession } from "next-auth/react";

/**
 * Interface for the business query result
 */
interface GetBusinessResult {
  success: boolean;
  hasBusiness: boolean;
  message: string;
  business?: {
    id: string;
    businessName: string;
    address: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

export function useBusiness() {
  const session = useSession();

  const userId = session.data?.user.id || "";
  const query = useQuery<GetBusinessResult, Error>({
    /**
     * Query key for caching and invalidation
     */
    queryKey: ["business", userId],

    /**
     * Query function that calls the getUserBusiness server action
     */
    queryFn: async () => {
      const result = await getUserBusiness(userId);

      // If the server action returns success: false, throw an error
      // This will trigger the error state
      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    },

    /**
     * Only run the query if userId is provided and enabled is true
     */
    enabled: !!userId,

    /**
     * Stale time - how long data is considered fresh (5 minutes)
     */
    staleTime: 5 * 60 * 1000,

    /**
     * Cache time - how long data stays in cache when unused (10 minutes)
     */
    gcTime: 10 * 60 * 1000,
  });

  return {
    /**
     * Business query result data
     */
    data: query.data,

    /**
     * Loading state indicator
     */
    isLoading: query.isLoading,

    isPending: query.isPending,

    /**
     * Error state indicator
     */
    isError: query.isError,

    /**
     * Error object (if any)
     */
    error: query.error,

    /**
     * Convenience property for checking if user has a business
     */
    hasBusiness: query.data?.hasBusiness || false,

    /**
     * The business object (if exists)
     */
    business: query.data?.business || null,

    /**
     * Refetch function to manually trigger a new query
     */
    refetch: query.refetch,

    /**
     * Is the query currently refetching
     */
    isRefetching: query.isRefetching,
  };
}
