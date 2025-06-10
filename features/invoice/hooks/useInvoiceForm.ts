"use client";

import { useQuery } from "@tanstack/react-query";
import { _getUserAndBusinessForInvoice } from "../actions";

export function useUserAndBusinessForInvoice() {
  return useQuery({
    queryKey: ["user-business-invoice"],
    queryFn: async () => {
      const result = await _getUserAndBusinessForInvoice();

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
