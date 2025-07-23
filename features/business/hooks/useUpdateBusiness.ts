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
    { businessId: string; data: UpdateBusinessApiInput },
    { previousUserWithBusiness: unknown }
  >({
    mutationFn: async ({ businessId, data }) => {
      const result = await _updateBusiness(businessId, data);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data!;
    },

    // Optimistic update: Update cache immediately before API call
    onMutate: async ({ data }) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["user-with-business"] });

      // Snapshot the previous value
      const previousUserWithBusiness = queryClient.getQueryData([
        "user-with-business",
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(["user-with-business"], (old: unknown) => {
        if (!old || typeof old !== "object" || !("business" in old)) return old;

        const oldData = old as { business?: Business };
        if (!oldData.business) return old;

        return {
          ...oldData,
          business: {
            ...oldData.business,
            ...data,
          },
        };
      });

      // Return a context object with the snapshotted value
      return { previousUserWithBusiness };
    },

    // If the mutation fails, use the context returned from onMutate to rollback
    onError: (err, variables, context) => {
      if (context?.previousUserWithBusiness) {
        queryClient.setQueryData(
          ["user-with-business"],
          context.previousUserWithBusiness
        );
      }
    },

    // Always refetch after error or success to ensure we have the latest data
    onSettled: () => {
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
