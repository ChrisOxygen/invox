export const STORAGE_KEY = "invox_onboarding_progress";
export const EXPIRY_DAYS = 4;
export const TOTAL_STEPS = 8;

// Query keys for cache invalidation
export const QUERY_KEYS = {
  USER: ["user"],
  CURRENT_USER: ["currentUser"],
  BUSINESS: ["business"],
  PAYMENT_ACCOUNTS: ["paymentAccounts"],
} as const;
