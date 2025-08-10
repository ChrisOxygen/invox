import { ApiResponse } from "@/types/api";

export class InvoiceError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = "InvoiceError";
  }
}

export class ValidationError extends InvoiceError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

export class BusinessError extends InvoiceError {
  constructor(message: string = "Business profile not found") {
    super(message, "BUSINESS_ERROR");
    this.name = "BusinessError";
  }
}

export class CalculationError extends InvoiceError {
  constructor(message: string) {
    super(message, "CALCULATION_ERROR");
    this.name = "CalculationError";
  }
}

/**
 * Converts errors to API response format
 */
export function handleInvoiceError(error: unknown): ApiResponse<never> {
  console.error("Invoice operation error:", error);

  if (error instanceof InvoiceError) {
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
    message: "An unexpected error occurred",
  };
}

/**
 * Creates success response
 */
export function createSuccessResponse<T>(
  data: T,
  message: string = "Operation completed successfully"
): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
  };
}
