import { ApiResponse } from "@/types/api";

export class AuthError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = "AuthError";
  }
}

export class AuthenticationError extends AuthError {
  constructor(message: string = "User not authenticated") {
    super(message, "AUTH_ERROR");
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends AuthError {
  constructor(message: string = "User not authorized") {
    super(message, "AUTHORIZATION_ERROR");
    this.name = "AuthorizationError";
  }
}

export class SessionError extends AuthError {
  constructor(message: string = "Invalid session") {
    super(message, "SESSION_ERROR");
    this.name = "SessionError";
  }
}

/**
 * Converts auth errors to API response format
 */
export function handleAuthError(error: unknown): ApiResponse<never> {
  console.error("Authentication error:", error);

  if (error instanceof AuthError) {
    return {
      success: false,
      message: error.message,
    };
  }

  if (error instanceof Error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: false,
    message: "An unexpected authentication error occurred",
  };
}

/**
 * Creates auth success response
 */
export function createAuthSuccessResponse<T>(
  data: T,
  message: string = "Authentication successful"
): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
  };
}
