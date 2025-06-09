import { useMutation } from "@tanstack/react-query";
import { _completeOnboardingWithData } from "@/actions";
import { BusinessFormValues, CurrencyType } from "@/types";
import { PaymentMethodDetails } from "@/features/onboarding/context/OnboardingProvider";

interface CompleteOnboardingData {
  currency: CurrencyType;
  businessInfo: BusinessFormValues;
  paymentMethods: string[];
  paymentMethodDetails: PaymentMethodDetails;
  paymentRules: {
    paymentTerms: string;
    lateFee: string;
    invoiceNotes: string;
  };
}

interface UseCompleteUserOnboardingOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useCompleteUserOnboarding(
  options?: UseCompleteUserOnboardingOptions
) {
  const mutation = useMutation({
    mutationFn: async (data: CompleteOnboardingData) => {
      const result = await _completeOnboardingWithData(data);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    },
    onSuccess: () => {
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error.message);
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}

// Export the type for convenience
export type { CompleteOnboardingData };
