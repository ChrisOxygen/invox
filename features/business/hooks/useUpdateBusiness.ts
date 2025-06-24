"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { _updateBusiness } from "../actions";
import { UpdateBusinessApiInput } from "@/types";
import { Business } from "@prisma/client";

export function useUpdateBusiness() {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    Business,
    Error,
    { businessId: string; data: UpdateBusinessApiInput }
  >({
    mutationFn: async ({ businessId, data }) => {
      const result = await _updateBusiness(businessId, data);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data!;
    },

    onSuccess: () => {
      // Invalidate and refetch user with business data
      queryClient.invalidateQueries({ queryKey: ["user-with-business"] });
      queryClient.invalidateQueries({ queryKey: ["user-business-invoice"] });
    },
  });

  return {
    updateBusiness: mutation.mutate,
    updateBusinessAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error?.message || null,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
}
