// hooks/useVerifyEmail.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyEmailCode, generateVerificationCode } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useVerifyEmail() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Mutation for verifying the code
  const verifyMutation = useMutation({
    mutationFn: async (code: string) => {
      return verifyEmailCode(code);
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Email verified successfully!");

        // Invalidate user query to refresh data
        queryClient.invalidateQueries({ queryKey: ["user"] });

        // Redirect to profile creation if needed
        router.push("/profile/create");
      } else {
        toast.error(data.message || "Verification failed");
      }
    },
    onError: (error) => {
      console.error("Verification error:", error);
      toast.error("Something went wrong during verification");
    },
  });

  // Mutation for resending the verification code
  const resendMutation = useMutation({
    mutationFn: async (userId: string) => {
      return generateVerificationCode(userId);
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Verification code sent to your email");
      } else {
        toast.error(data.message || "Failed to send verification code");
      }
    },
    onError: (error) => {
      console.error("Resend error:", error);
      toast.error("Failed to resend verification code");
    },
  });

  return {
    // Verify email mutation
    verifyEmail: verifyMutation.mutate,
    isVerifying: verifyMutation.isPending,
    verifyError: verifyMutation.error,
    verifySuccess: verifyMutation.isSuccess && verifyMutation.data?.success,

    // Resend code mutation
    resendCode: resendMutation.mutate,
    isResending: resendMutation.isPending,
    resendError: resendMutation.error,
    resendSuccess: resendMutation.isSuccess && resendMutation.data?.success,

    // Reset both mutations
    reset: () => {
      verifyMutation.reset();
      resendMutation.reset();
    },
  };
}
