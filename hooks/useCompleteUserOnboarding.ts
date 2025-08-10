import { useMutation } from "@tanstack/react-query";
import { _completeOnboardingWithData } from "@/features/onboarding/actions";
import { CompleteOnboardingRequest } from "@/types/business/onboarding";

// Use the CompleteOnboardingRequest type from the new type structure
type CompleteOnboardingData = CompleteOnboardingRequest;

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
