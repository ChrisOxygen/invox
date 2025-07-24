"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

type SignInProvider = "google" | "github";

/**
 * Custom hook for handling social sign-in with Google or GitHub
 * Uses TanStack Query's useMutation for managing the authentication state
 */
export function useSocialSignIn() {
  const searchParams = useSearchParams();

  return useMutation({
    mutationFn: async (provider: SignInProvider) => {
      console.log("Signing in with provider:", provider);
      try {
        // Check if there's a callback URL in the current URL parameters
        const callbackUrl = searchParams?.get("callbackUrl") || "/app";

        // Use NextAuth's signIn function to initiate the authentication flow
        // The redirect is handled automatically by NextAuth
        return await signIn(provider, {
          callbackUrl,
          redirect: true,
        });
      } catch (error) {
        console.error(`Error signing in with ${provider}:`, error);
        throw error;
      }
    },
  });
}

export default useSocialSignIn;
