// hooks/useLogin.ts
import { loginFormSchema } from "@/formSchemas";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { z } from "zod";

// Type for the login form values
type LoginFormValues = z.infer<typeof loginFormSchema>;

// Hook for login functionality
export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirectPath, setRedirectPath] = useState("/dashboard");

  useEffect(() => {
    // Get and decode the callback URL from query parameters
    const callbackUrl = searchParams.get("callbackUrl");

    if (callbackUrl) {
      // Validate if it's a path we want to redirect to
      const decodedPath = decodeURIComponent(callbackUrl);

      // Check if it's a valid internal path (starting with /)
      if (decodedPath.startsWith("/")) {
        // Check if it's one of our allowed paths
        if (
          decodedPath === "/dashboard" ||
          decodedPath === "/invoices" ||
          decodedPath === "/clients" ||
          decodedPath === "/business" ||
          decodedPath.startsWith("/profile")
        ) {
          setRedirectPath(decodedPath);
        }
      }
    }
  }, [searchParams]);

  // Submit handler to use with react-hook-form
  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
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
        // Redirect to the callback URL or default after successful login
        router.push(redirectPath);
        router.refresh(); // Refresh to update auth state in the UI
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    onSubmit,
    isLoading,
    error,
    redirectPath,
  };
}
