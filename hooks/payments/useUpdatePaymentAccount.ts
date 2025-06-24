"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { _updatePaymentAccount } from "@/actions/payments";
import { UpdatePaymentAccountInput } from "@/types/schemas/payments";

export const useUpdatePaymentAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      paymentAccountId,
      data,
    }: {
      paymentAccountId: string;
      data: UpdatePaymentAccountInput;
    }) => _updatePaymentAccount(paymentAccountId, data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message);
        // Invalidate and refetch payment accounts
        queryClient.invalidateQueries({ queryKey: ["payment-accounts"] });
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Error updating payment account:", error);
      toast.error(
        "An unexpected error occurred while updating the payment account"
      );
    },
  });
};
