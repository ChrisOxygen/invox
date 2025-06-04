import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { signUpFormSchema } from "@/formSchemas";
import { createUser } from "@/actions";

/**
 * Interface for the signup mutation result
 */
interface SignUpResult {
  success: boolean;
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

/**
 * Custom hook for handling user signup using TanStack Query
 *
 * @returns {Object} Mutation object with signup functionality
 * @returns {Function} returns.mutate - Function to trigger signup
 * @returns {boolean} returns.isPending - Loading state
 * @returns {string|null} returns.error - Error message if signup fails
 * @returns {SignUpResult|undefined} returns.data - Signup result data
 *
 * @example
 * ```typescript
 * const { mutate: signUp, isPending, error } = useSignup();
 *
 * const handleSubmit = (formData) => {
 *   signUp(formData);
 * };
 * ```
 */
export function useCredentialSignup() {
  const router = useRouter();

  const mutation = useMutation<
    SignUpResult,
    Error,
    z.infer<typeof signUpFormSchema>
  >({
    /**
     * Mutation function that calls the createUser server action
     */
    mutationFn: async (values: z.infer<typeof signUpFormSchema>) => {
      const result = await createUser(values);

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
    onSuccess: (data) => {
      console.log("User created successfully:", data.user);

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
