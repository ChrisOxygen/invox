import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { SignupRequest } from "@/types/api/auth";
import { _createUserWithCredentials } from "@/actions";
import { BaseResponse } from "@/types/api";
import { SignupFormInput } from "@/types/schemas/auth";

export function useCredentialSignup() {
  const router = useRouter();
  const mutation = useMutation<BaseResponse, Error, SignupFormInput>({
    /**
     * Mutation function that calls the createUser server action
     */
    mutationFn: async (values: SignupFormInput) => {
      // Transform form data to SignupRequest (remove confirmPassword)
      const signupData: SignupRequest = {
        name: values.name,
        email: values.email,
        password: values.password,
      };

      const result = await _createUserWithCredentials(signupData);

      // If the server action returns success: false, throw an error
      // This will trigger the onError callback
      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    },

    /**
     * Success callback - navigates to login page
     */
    onSuccess: () => {
      // Navigate to login page after successful signup
      router.push("/login");
    },

    /**
     * Error callback - handles signup errors
     */
    onError: (error) => {
      console.error("Signup error:", error.message);

      // Error handling is done through the hook's return values
      // The component using this hook can access the error via mutation.error
    },
  });

  return {
    /**
     * Function to trigger the signup mutation
     */
    mutate: mutation.mutate,

    /**
     * Loading state indicator
     */
    isPending: mutation.isPending,

    /**
     * Error message (if any)
     */
    error: mutation.error?.message || null,

    /**
     * Signup result data
     */
    data: mutation.data,

    /**
     * Reset mutation state
     */
    reset: mutation.reset,
  };
}
