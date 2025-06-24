"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { _deletePaymentAccount } from "@/actions/payments";

export const useDeletePaymentAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentAccountId: string) =>
      _deletePaymentAccount(paymentAccountId),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message); // Invalidate and refetch payment accounts
        queryClient.invalidateQueries({ queryKey: ["payment-accounts"] });
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Error deleting payment account:", error);
      toast.error(
        "An unexpected error occurred while deleting the payment account"
      );
    },
  });
};
