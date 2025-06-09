// hooks/useLogin.ts
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginRequest } from "@/types/api/auth";

// Use the centralized LoginRequest type
type LoginFormValues = LoginRequest;

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
