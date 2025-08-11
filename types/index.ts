// Re-export commonly used types for backward compatibility
export type { BusinessFormInput as BusinessFormValues } from "./schemas/business";
export type { UpdateUserInput as UpdateUserData } from "./schemas/user";

// Re-export new organized types
export * from "./schemas";
export * from "./api";

// Explicitly re-export business types to resolve naming conflicts
export type { BusinessSettings, BusinessProfile } from "./business";
export type { BusinessUpdateValues } from "./schemas/business";

export * from "./shared";
export * from "./database";

export type CurrencyType =
  | "USD"
  | "EUR"
  | "GBP"
  | "NGN"
  | "JPY"
  | "CAD"
  | "AUD";
