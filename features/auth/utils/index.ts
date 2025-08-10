import { auth } from "@/auth";

// Re-export authentication errors
export * from "./errors";

/**
 * Utility function to check if user is authenticated without throwing
 * @returns Object with authentication status and session
 */
export async function checkAuthentication() {
  const session = await auth();
  return {
    isAuthenticated: !!session?.user?.id,
    session,
  };
}
