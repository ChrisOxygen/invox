"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { _updatePaymentAccount } from "@/features/payments/actions";
import { UpdatePaymentAccountInput } from "@/types/schemas/payments";

export const useUpdatePaymentAccount = () => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    Error,
    { paymentAccountId: string; data: UpdatePaymentAccountInput },
    { previousPaymentAccounts: unknown }
  >({
    mutationFn: async ({
      paymentAccountId,
      data,
    }: {
      paymentAccountId: string;
      data: UpdatePaymentAccountInput;
    }) => {
      const response = await _updatePaymentAccount(paymentAccountId, data);

      if (!response.success) {
        throw new Error(response.message);
      }

      return response;
    },

    // Optimistic update: Update cache immediately before API call
    onMutate: async ({ paymentAccountId, data }) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["payment-accounts"] });

      // Snapshot the previous value
      const previousPaymentAccounts = queryClient.getQueryData([
        "payment-accounts",
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(["payment-accounts"], (old: unknown) => {
        if (!Array.isArray(old)) return old;

        return old.map((account: { id: string }) => {
          if (account.id === paymentAccountId) {
            return {
              ...account,
              ...data,
            };
          }
          return account;
        });
      });

      // Return a context object with the snapshotted value
      return { previousPaymentAccounts };
    },

    // If the mutation fails, use the context returned from onMutate to rollback
    onError: (err, variables, context) => {
      if (context?.previousPaymentAccounts) {
        queryClient.setQueryData(
          ["payment-accounts"],
          context.previousPaymentAccounts
        );
      }
      console.error("Error updating payment account:", err);
      toast.error(
        err.message ||
          "An unexpected error occurred while updating the payment account"
      );
    },

    onSuccess: (response) => {
      // Type guard to check if response has message property
      if (response && typeof response === "object" && "message" in response) {
        toast.success((response as { message: string }).message);
      } else {
        toast.success("Payment account updated successfully");
      }
    },

    // Always refetch after error or success to ensure we have the latest data
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-accounts"] });
    },
  });
};
