// Common API response patterns
interface BaseResponse {
  success: boolean;
  message: string;
}

export interface ApiResponse<T = unknown> extends BaseResponse {
  data?: T;
}

export interface PaginatedResponse<T> extends BaseResponse {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type { BaseResponse };

// Re-export all API types
export * from "./auth";
export * from "./business";
export * from "./payments";
export * from "./onboarding";
export * from "./invoice";
