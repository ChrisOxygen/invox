"use client";

import { useQuery } from "@tanstack/react-query";
import { _getUserAndBusiness } from "../actions";

export function useUserAndBusiness() {
  return useQuery({
    queryKey: ["user-business-invoice"],
    queryFn: async () => {
      const result = await _getUserAndBusiness();

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
