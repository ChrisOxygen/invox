import { auth } from "@/auth";
import { AuthenticationError } from "../utils/errors";

/**
 * Server action to get authenticated session and validate user
 * @returns The authenticated session
 * @throws AuthenticationError if user is not authenticated
 */
export async function _requireAuthentication() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new AuthenticationError();
  }
  return session;
}
