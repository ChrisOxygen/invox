"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { _setPaymentAccountAsDefault } from "@/actions/payments";

export const useSetPaymentAccountAsDefault = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentAccountId: string) =>
      _setPaymentAccountAsDefault(paymentAccountId),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message); // Invalidate and refetch payment accounts to update the UI
        queryClient.invalidateQueries({ queryKey: ["payment-accounts"] });
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Error setting payment account as default:", error);
      toast.error(
        "An unexpected error occurred while setting the default account"
      );
    },
  });
};
