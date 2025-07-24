import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  useGetPaymentAccounts,
  useUpdatePaymentAccount,
} from "@/hooks/payments";
import { editablePaymentAccountSchema } from "@/shared/validators";
import type { PaymentMethodFormData } from "@/shared/types";

export function usePaymentForm() {
  const { paymentAccounts } = useGetPaymentAccounts();
  const {
    mutateAsync: updatePaymentAccount,
    isPending: isUpdatingPaymentAccount,
  } = useUpdatePaymentAccount();

  // Get default payment account
  const defaultPaymentAccount = paymentAccounts.find(
    (account) => account.isDefault
  );

  const form = useForm<PaymentMethodFormData>({
    resolver: zodResolver(editablePaymentAccountSchema),
    defaultValues: {
      accountName: "",
      accountData: {},
    },
  });

  // Reset form when data loads
  useEffect(() => {
    if (defaultPaymentAccount) {
      form.reset({
        accountName: defaultPaymentAccount.accountName,
        accountData:
          (defaultPaymentAccount.accountData as Record<string, string>) || {},
      });
    }
  }, [defaultPaymentAccount, form]);

  const resetToOriginalValues = () => {
    if (defaultPaymentAccount) {
      form.reset({
        accountName: defaultPaymentAccount.accountName,
        accountData:
          (defaultPaymentAccount.accountData as Record<string, string>) || {},
      });
    }
  };

  const handleSavePaymentAccount = async (
    data: PaymentMethodFormData,
    onSuccess: () => void,
    onError: () => void
  ) => {
    if (!defaultPaymentAccount?.id) {
      toast.error("Payment account not found");
      return;
    }

    // Close modal immediately for better UX
    onSuccess();

    try {
      await updatePaymentAccount({
        paymentAccountId: defaultPaymentAccount.id,
        data: {
          accountName: data.accountName,
          accountData: data.accountData,
        },
      });
      // Success toast is handled by the hook
    } catch (error) {
      // Error toast is handled by the hook
      console.error("Payment account update error:", error);
      // Reopen modal on error so user can try again
      onError();
    }
  };

  return {
    form,
    defaultPaymentAccount,
    isUpdatingPaymentAccount,
    resetToOriginalValues,
    handleSavePaymentAccount,
  };
}
