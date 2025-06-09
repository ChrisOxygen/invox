// Common utility types used across the application
export type Status = "active" | "inactive" | "pending" | "suspended";

export type SortOrder = "asc" | "desc";

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
}

export interface FilterParams {
  search?: string;
  status?: Status;
  dateFrom?: string;
  dateTo?: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

export interface ActionMenuItem {
  label: string;
  icon?: string;
  action: () => void;
  variant?: "default" | "destructive";
}

// Generic loading states
export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

// Generic API call state
export interface ApiCallState<T = any> extends LoadingState {
  data?: T;
  isSuccess: boolean;
}
