import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editablePaymentAccountSchema } from "@/shared/validators";
import { PaymentMethodFormData } from "@/shared/types";

// Mock API functions - replace with actual implementations
const updatePaymentAccount = async (
  id: string,
  data: PaymentMethodFormData
) => {
  // Implementation would go here
  console.log("Updating payment account:", id, data);
  return { success: true };
};

interface UseSharedPaymentFormOptions {
  paymentAccountId?: string;
  defaultValues?: Partial<PaymentMethodFormData>;
  onSuccess?: () => void;
  onError?: () => void;
  autoClose?: boolean;
}

export function useSharedPaymentForm(
  options: UseSharedPaymentFormOptions = {}
) {
  const {
    paymentAccountId,
    defaultValues = {},
    onSuccess,
    onError,
    autoClose = true,
  } = options;

  const queryClient = useQueryClient();

  const form = useForm<PaymentMethodFormData>({
    resolver: zodResolver(editablePaymentAccountSchema),
    defaultValues: {
      accountName: "",
      accountData: {},
      ...defaultValues,
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: PaymentMethodFormData) => {
      if (!paymentAccountId) {
        throw new Error("Payment account ID is required");
      }
      return updatePaymentAccount(paymentAccountId, data);
    },
    onSuccess: () => {
      // Invalidate and refetch payment accounts
      queryClient.invalidateQueries({ queryKey: ["payment-accounts"] });
      toast.success("Payment account updated successfully");

      if (!autoClose && onSuccess) {
        onSuccess();
      }
    },
    onError: () => {
      toast.error("Failed to update payment account");
      if (autoClose && onError) {
        onError();
      }
    },
  });

  const handleSavePaymentAccount = async (data: PaymentMethodFormData) => {
    // Close modal immediately for better UX if autoClose is enabled
    if (autoClose && onSuccess) {
      onSuccess();
    }

    try {
      await updateMutation.mutateAsync(data);
    } catch (error) {
      // Error handling is done in the mutation onError callback
    }
  };

  const resetForm = () => {
    form.reset({
      accountName: "",
      accountData: {},
      ...defaultValues,
    });
  };

  return {
    form,
    isUpdating: updateMutation.isPending,
    handleSavePaymentAccount,
    resetForm,
    error: updateMutation.error?.message,
  };
}
