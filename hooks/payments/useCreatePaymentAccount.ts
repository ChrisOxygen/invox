"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { _createPaymentAccount } from "@/actions/payments";
import { CreatePaymentAccountInput } from "@/types/schemas/payments";

export const useCreatePaymentAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePaymentAccountInput) =>
      _createPaymentAccount(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message); // Invalidate and refetch payment accounts
        queryClient.invalidateQueries({ queryKey: ["payment-accounts"] });
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Error creating payment account:", error);
      toast.error(
        "An unexpected error occurred while creating the payment account"
      );
    },
  });
};
