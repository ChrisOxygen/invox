import { auth } from "@/auth";
import { AuthenticationError } from "@/utils/invoice-errors";

/**
 * Utility function to get authenticated session and validate user
 * @returns The authenticated session
 * @throws AuthenticationError if user is not authenticated
 */
export async function requireAuthentication() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new AuthenticationError();
  }
  return session;
}

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
