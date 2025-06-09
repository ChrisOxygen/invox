// hooks/useLogin.ts
import { loginFormSchema } from "@/dataSchemas";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

// Type for the login form values
type LoginFormValues = z.infer<typeof loginFormSchema>;

// Hook for login functionality
export function useLogin() {
  const router = useRouter();
  const [signInPending, setSignInPending] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const isLoading = signInPending;

  // Submit handler to use with react-hook-form
  const signInWithCredentials = async (values: LoginFormValues) => {
    setSignInPending(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.error) {
        setError("Invalid email or password");
        return;
      }
      if (result?.ok) {
        router.push("/app/dashboard");
      }

      // Login successful - the useEffect will handle redirect
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login failed:", err);
    } finally {
      setSignInPending(false);
    }
  };

  return {
    signInWithCredentials,
    isLoading,
    error,
  };
}
